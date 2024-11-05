import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatReducer, initialState as chatInitialState } from '../reducers/ChatReducer';
import { messagesReducer, initialMessagesState } from '../reducers/MessageReducer';

export const ChatContext = createContext();

const combinedReducer = ({ chatState, messagesState }, action) => ({
  chatState: chatReducer(chatState, action),
  messagesState: messagesReducer(messagesState, action),
});

const initialState = {
  chatState: chatInitialState,
  messagesState: initialMessagesState,
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducer, initialState);

  // Load chat history from AsyncStorage
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const chatJson = await AsyncStorage.getItem('@chat_windows');
        const messageJson = await AsyncStorage.getItem('@messages_state');

        if (chatJson) {
          const chatWindows = JSON.parse(chatJson);
          dispatch({ type: 'LOAD_HISTORY', payload: chatWindows });
        }

        if (messageJson) {
          const messages = JSON.parse(messageJson);
          dispatch({ type: 'LOAD_MESSAGES', payload: messages });
        }
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    };

    loadChatHistory();
  }, []);

  // Save chat history to AsyncStorage
  useEffect(() => {
    const saveChatHistory = async () => {
      try {
        const chatJson = JSON.stringify(state.chatState.chatWindows);
        const messageJson = JSON.stringify(state.messagesState.messages);

        await AsyncStorage.setItem('@chat_windows', chatJson);
        await AsyncStorage.setItem('@messages_state', messageJson);
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    };

    saveChatHistory();
  }, [state.chatState.chatWindows, state.messagesState.messages]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
