import USER_LOGOUT  from '../types/UserTypes'
import * as ChatTypes from '../types/ChatTypes';

const initialState = {
  chatWindows: {},
  currentChatId: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGOUT:
      return initialState;
    case ChatTypes.SET_CHATS:
    case ChatTypes.FETCH_CHATS_SUCCESS:
    case ChatTypes.LOAD_HISTORY:
      console.log('Fetched chats reducer:', action.payload);
      return {
        ...state,
        chatWindows: typeof action.payload === 'object' ? action.payload : {},
      };
    case ChatTypes.ADD_CHAT:
      return {
        ...state,
        chatWindows: {
          ...state.chatWindows,
          [action.payload.id]: action.payload,
        },
      };
    case ChatTypes.UPDATE_LAST_USED:
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
    case ChatTypes.SET_CURRENT_CHAT:
      return {
        ...state,
        currentChatId: action.payload,
      };
      case ChatTypes.ADD_MESSAGE:
        console.log('Adding message to chat:', action.payload);
      
        const chatIdToAddMessage = action.payload.chatId;
        const chatKeyToAddMessage = Object.keys(state.chatWindows).find(
          key => state.chatWindows[key].id === chatIdToAddMessage
        );
      
        if (chatKeyToAddMessage) {
          return {
            ...state,
            chatWindows: {
              ...state.chatWindows,
              [chatKeyToAddMessage]: {
                ...state.chatWindows[chatKeyToAddMessage],
                messages: [
                  ...state.chatWindows[chatKeyToAddMessage].messages,
                  action.payload.message,
                ],
                lastUsed: action.payload.message?.timestamp || state.chatWindows[chatKeyToAddMessage].lastUsed,
              },
            },
          };
        }
      
        return state;
      
      case ChatTypes.DELETE_CHAT:
        const chatIdToDelete = action.payload;
        const chatKeyToDelete = Object.keys(state.chatWindows).find(
          key => state.chatWindows[key].id === chatIdToDelete
        );
      
        if (chatKeyToDelete) {
          const { [chatKeyToDelete]: _, ...remainingChats } = state.chatWindows;
          return {
            ...state,
            chatWindows: remainingChats,
          };
        }
      
        return state;
      
    default:
      return state;
  }
};

export default chatReducer;
