const initialState = {
  chatWindows: {},
  currentChatId: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_HISTORY':
      return {
        ...state,
        chatWindows: action.payload,
      };
    case 'ADD_CHAT':
      return {
        ...state,
        chatWindows: {
          ...state.chatWindows,
          [action.payload.id]: action.payload,
        },
      };
    case 'UPDATE_LAST_USED':
      return {
        ...state,
        chatWindows: {
          ...state.chatWindows,
          [action.payload.id]: {
            ...state.chatWindows[action.payload.id],
            lastUsed: action.payload.lastUsed,
          },
        },
      };
    case 'SET_CURRENT_CHAT':
      return {
        ...state,
        currentChatId: action.payload,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        chatWindows: {
          ...state.chatWindows,
          [action.payload.chatId]: {
            ...state.chatWindows[action.payload.chatId],
            messages: [
              ...state.chatWindows[action.payload.chatId].messages,
              action.payload.message,
            ],
            lastUsed: action.payload.message?.timestamp || state.chatWindows[action.payload.chatId].lastUsed,
          },
        },
      };
    case 'DELETE_CHAT':
      const { [action.payload]: _, ...remainingChats } = state.chatWindows;
      return {
        ...state,
        chatWindows: remainingChats,
      };
    default:
      return state;
  }
};

export default chatReducer;
