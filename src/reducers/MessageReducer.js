const initialMessagesState = {
  messages: {},
};

const messagesReducer = (state = initialMessagesState, action) => {
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
        messages: action.payload,
      };
    default:
      return state;
  }
};

export default messagesReducer;
