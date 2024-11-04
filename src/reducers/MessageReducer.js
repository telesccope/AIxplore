const initialMessagesState = {
    messages: {},
  };
  
  const messagesReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_MESSAGE':
        const { chatId, message } = action.payload;
        return {
          ...state,
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), message],
          },
        };
      case 'LOAD_MESSAGES':
        return {
          ...state,
          messages: {
            ...state.messages,
            [action.payload.chatId]: action.payload.messages,
          },
        };
      default:
        return state;
    }
  };
  
  export { messagesReducer, initialMessagesState };
  