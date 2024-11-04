import React, { createContext, useReducer } from 'react';
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

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
