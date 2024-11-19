import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';
import { v4 as uuidv4 } from 'uuid';
import { readFile } from 'react-native-fs';
import api from '../constants/api';

// Action types
export const LOAD_HISTORY = 'LOAD_HISTORY';
export const ADD_CHAT = 'ADD_CHAT';
export const UPDATE_LAST_USED = 'UPDATE_LAST_USED';
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const REMOVE_CHAT = 'REMOVE_CHAT';
export const DELETE_CHAT = 'DELETE_CHAT';


// Action creators
export const loadChatHistory = () => async (dispatch) => {
  //////console.log('loadChatHistory called');
  try {
    const history = await AsyncStorage.getItem('chatHistory');
    const parsedHistory = history ? JSON.parse(history) : [];
    //////console.log('Loaded chat history:', parsedHistory);
    dispatch({ type: LOAD_HISTORY, payload: parsedHistory });
  } catch (error) {
    //////console.error('Failed to load chat history', error);
    dispatch({ type: LOAD_HISTORY, payload: [] });
  }
};

export const addChat = (chat) => ({
  type: ADD_CHAT,
  payload: chat,
});

export const updateLastUsed = (id, lastUsed) => ({
  type: UPDATE_LAST_USED,
  payload: { id, lastUsed },
});

export const setCurrentChat = (chatId) => ({
  type: SET_CURRENT_CHAT,
  payload: chatId,
});

export const addMessage = (chatId, message) => ({
  type: ADD_MESSAGE,
  payload: { chatId, message },
});

export const removeChat = (chatId) => ({
  type: REMOVE_CHAT,
  payload: chatId,
});

export const deleteChat = (chatId) => ({
  type: DELETE_CHAT,
  payload: chatId,
});

export const getSystemReply = async (chatMessages, chatId, messageId) => {
  try {
    const messages = await Promise.all(chatMessages.map(async (msg) => {
      if (msg.type === 'image') {
        const resizedImage = await ImageResizer.createResizedImage(
          msg.content,
          800,
          600,
          'JPEG',
          80
        );

        const response = await fetch(resizedImage.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        const imgB64Str = await new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result.split(',')[1]);
          };
        });

        return {
          role: msg.role,
          content: [
            {
              type: 'text',
              text: chatMessages.some(m => m.type === 'text') ? null : 'Describe the image',
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imgB64Str}` }
            }
          ].filter(item => item.text !== null)
        };
      } else {
        return {
          role: msg.role,
          content: msg.content
        };
      }
    }));

    const data = {
      model: 'chatgpt-4o-latest',
      messages: messages,
      chat_id: chatId,
      message_id: messageId,
    };

    console.log('Data sent to backend:', JSON.stringify(data, null, 2));

    const response = await api.post('/v1/chat/completions', data);

    const responseData = response.data;
    const message = {
      type: 'text',
      text: responseData.choices[0]?.message?.content || "No response"
    };

    return message;
  } catch (error) {
    console.error('Error in getSystemReply:', error);
    throw error;
  }
};

export const addNewChat = (initialMessage, dispatch, navigation) => {
  const newChatId = Date.now().toString();
  const userMessage = initialMessage ? { id: uuidv4(), text: initialMessage, sender: 'user', type: 'text' } : null;
  const newChat = {
    id: newChatId,
    name: 'New Chat',
    messages: [],
    lastUsed: new Date().toISOString(),
  };

  dispatch(setCurrentChat(newChatId));
  dispatch(addChat(newChat));
  navigation.navigate('Chat');

  if (userMessage) {
    dispatch(addMessage(newChatId, userMessage));
  }

  return { newChatId, userMessage };
};
export const handleChatMessages = async (newChatId, userMessage, photoUri, dispatch) => {
  let chatMessages = [];

  if (photoUri) {
    try {
      const base64Image = await readFile(photoUri, 'base64');
      const photoMessage = {
        id: uuidv4(),
        uri: `data:image/jpeg;base64,${base64Image}`,
        sender: 'user',
        type: 'image',
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage(newChatId, photoMessage));

      chatMessages.push({
        role: 'user',
        content: `data:image/jpeg;base64,${base64Image}`,
        type: 'image',
      });

    } catch (error) {
      console.error('Error handling photo message:', error);
    }
  }

  if (userMessage) {
    chatMessages.push({
      role: 'user',
      content: userMessage.text,
      type: 'text',
    });
  }

  if (chatMessages.length > 0) {
    try {
      const systemReply = await getSystemReply(chatMessages, newChatId, userMessage?.id);
      dispatch(addMessage(newChatId, {
        ...systemReply,
        id: uuidv4(),
        sender: 'system',
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error getting system reply:', error);
    }
  }
};

