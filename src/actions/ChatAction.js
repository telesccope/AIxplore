import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';
import { v4 as uuidv4 } from 'uuid';
import api from '../constants/api';
import * as ChatTypes from '../types/ChatTypes';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentLocation } from './LocationAction';

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

export const addChat = (chat) => (
  console.log('addChat called', chat),
  {
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

export const saveChatsToStorage = async (chats) => {
  try {
    const jsonValue = JSON.stringify(chats);
    await AsyncStorage.setItem('@chat_records', jsonValue);
  } catch (e) {
    console.error('Failed to save chats to storage:', e);
  }
};

export const deleteChat = (chatId) => async (dispatch) => {
  /*
  try {
    // 调用后端 DELETE API
    const response = await api.delete(`/users/chats/${chatId}`);
    
    if (response.status === 200) {
      // 如果删除成功，派发删除聊天的 action
      dispatch({
        type: DELETE_CHAT,
        payload: chatId,
      });
      
      console.log('Chat deleted successfully');
    } else {
      console.error('Failed to delete chat:', response.data.error);
    }
  } catch (error) {
    console.error('Error deleting chat:', error);
  }*/
  dispatch({
    type: DELETE_CHAT,
    payload: chatId,
  });
};

export const processImage = async (photoUri) => {
  const resizedImage = await ImageResizer.createResizedImage(photoUri, 800, 600, 'JPEG', 80);
  const response = await fetch(resizedImage.uri);
  const blob = await response.blob();
  const reader = new FileReader();
  
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
};


export const getSystemReply = async (chatMessages, chatId) => {
  const location = await getCurrentLocation();
  // to do list
  // 在页面加载时就获取location，不然的话需要等很久才回回复
  try {
    // 直接构建请求数据
    const data = {
      model: 'chatgpt-4o-latest',
      messages: chatMessages,
      chat_id: chatId,
      location: location,
    };

    // 发送请求到后端
    const response = await api.post('/v1/chat/completions', data);

    // 返回响应数据
    return response.data;
  } catch (error) {
    console.error('Error in getSystemReply:', error);
    throw error;
  }
};


export const updateChat = (chatId, title) => ({
  type: ChatTypes.UPDATE_CHAT,
  payload: { chatId, title},
});

export const handleChatTitleAndCategory = (chatId, chatMessages) => async (dispatch) => {
  console.log('handleChatTitleAndCategory called', chatId, chatMessages);
  try {
    // 构建请求数据
    const data = {
      chat_id: chatId,
      messages: chatMessages,
      model: 'gpt-4o-latest', // 使用的模型名称
    };

    // 调用后端 API
    const response = await api.post('/v1/chat/classify_and_title', data);

    if (response.status === 200) {
      const { title, category } = response.data;

      // 确保有返回标题和分类
      if (title && category) {
        // 更新 Redux 中的聊天信息
        dispatch(updateChat(chatId, title));
        console.log(`Chat updated with title: ${title}, category: ${category}`);
      } else {
        console.warn('No title or category returned from API');
      }
    } else {
      console.error('Failed to classify and title chat:', response.data.error);
    }
  } catch (error) {
    console.error('Error in handleChatTitleAndCategory:', error);
  }
};

export const handleChatMessages = (chatId, userMessages, photoUri) => async (dispatch, getState) => {
  console.log('handleChatMessages called', chatId, userMessages, photoUri);

  try {
    const state = getState();
    const chatWindows = state.chatReducer.chatWindows;
    console.log('chatWindows in handlechatmessages:', chatWindows);
    const existingMessages = Object.values(chatWindows).find(chat => chat.id === chatId)?.messages || [];
    const chatMessages = [...existingMessages];
    console.log('existingMessages in handlechatmessages:', existingMessages);

    // Handle photoUri
    if (photoUri) {
      try {
        const imgB64Str = await processImage(photoUri);
        const photoMessage = {
          id: uuidv4(),
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imgB64Str}` } }
          ],
        };
        console.log('photoMessage:', photoMessage);
        dispatch(addMessage(chatId, photoMessage));
        chatMessages.push(photoMessage);
      } catch (error) {
        console.error('Error handling photo message:', error);
      }
    }

    // Handle userMessages
    if (userMessages) {
      try {
        const commonMessage = {
          id: uuidv4(),
          role: 'user',
          content: userMessages,
        };
        console.log('commonMessage:', commonMessage);
        dispatch(addMessage(chatId, commonMessage));
        chatMessages.push(commonMessage);
      } catch (error) {
        console.error('Error handling user messages:', error);
      }
    }

    // Ensure chatMessages is not empty
    if (chatMessages.length > 0) {
      try {
        const systemReply = await getSystemReply(chatMessages, chatId)
        const { title } = systemReply.choices[0];
        if (title) {
          dispatch(updateChat(chatId, title));
        }
        const messagePayload = {
          id: systemReply.choices[0].message_id,
          role: 'assistant',
          content: systemReply.choices[0]?.message?.content || "No response",
          timestamp: new Date().toISOString(),
        };
        dispatch(addMessage(chatId, messagePayload));
        const updatedMessages = [messagePayload];
        console.log('Updated messages:', updatedMessages);
        //dispatch(handleChatTitleAndCategory(chatId, updatedMessages));
      } catch (error) {
        console.error('Error getting system reply:', error);
      }
    }

  } catch (error) {
    console.error('Error in handleChatMessages:', error);
  }
};
