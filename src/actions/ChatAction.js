import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';

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
  console.log('loadChatHistory called');
  try {
    const history = await AsyncStorage.getItem('chatHistory');
    const parsedHistory = history ? JSON.parse(history) : [];
    console.log('Loaded chat history:', parsedHistory);
    dispatch({ type: LOAD_HISTORY, payload: parsedHistory });
  } catch (error) {
    console.error('Failed to load chat history', error);
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

export const getSystemReply = (chatMessages) => async (dispatch) => {
  console.log('getSystemReply called');
  try {
    const url = 'https://travelassistant.uk/v1/chat/completions';
    const headers = { 'Content-Type': 'application/json' };

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
            { type: 'text', text: 'Describe the image' },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imgB64Str}` }
            }
          ]
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
      messages: messages
    };

    console.log('Data sent to backend:', JSON.stringify(data, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    const message = {
      type: 'text',
      text: responseData.choices[0]?.message?.content || "No response"
    };

    // Dispatch an action to add the message to the chat
    dispatch(addMessage(chatMessages[0].chatId, message));
  } catch (error) {
    console.error('Error in getSystemReply:', error);
  }
};
