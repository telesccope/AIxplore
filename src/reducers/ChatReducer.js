const initialState = {
  chatWindows: [],
  currentChatId: null,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_HISTORY':
      return {
        ...state,
        chatWindows: action.payload,
      };
    case 'ADD_CHAT':
      return {
        ...state,
        chatWindows: [...state.chatWindows, action.payload],
      };
    case 'UPDATE_LAST_USED':
      return {
        ...state,
        chatWindows: state.chatWindows.map(chat =>
          chat.id === action.payload.id
            ? { ...chat, lastUsed: action.payload.lastUsed }
            : chat
        ),
      };
    case 'SET_CURRENT_CHAT':
      return {
        ...state,
        currentChatId: action.payload,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        chatWindows: state.chatWindows.map(chat => 
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload.message],
                lastUsed: action.payload.message.timestamp, 
              }
            : chat
        ),
      };
    case 'REMOVE_CHAT':
      return {
        ...state,
        chatWindows: state.chatWindows.filter(chat => chat.id !== action.payload),
      };
    case 'LOAD_HISTORY':
      return {
          ...state,
          chatWindows: action.payload,
        };
    case 'DELETE_CHAT':
      return {
        ...state,
        chatWindows: state.chatWindows.filter(chat => chat.id !== action.payload),
      };
    default:
      return state;
  }
};

export { chatReducer, initialState };
