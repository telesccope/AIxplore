import USER_LOGOUT from '../types/UserTypes';
import * as ChatTypes from '../types/ChatTypes';
import { saveChatsToStorage } from '../actions/ChatAction';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  chatWindows: {},
  currentChatId: null,
  location: null,
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

      case ChatTypes.ADD_CHAT: {
        const newChatId = action.payload.id; 
        const newChat = {
          ...action.payload, 
          lastUsed: new Date().toISOString(),
        };

      return {
        ...state,
        chatWindows: {
          ...state.chatWindows,
          [newChatId]: newChat,
        },
      };
    }

    case ChatTypes.UPDATE_LAST_USED: {
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
    }

    case ChatTypes.SET_CURRENT_CHAT: {
      return {
        ...state,
        currentChatId: action.payload,
      };
    }

    case ChatTypes.UPDATE_CHAT: {
      const { chatId, title, category } = action.payload;
      const chatKeyToUpdate = Object.keys(state.chatWindows).find(
        key => state.chatWindows[key].id === chatId
      );

      if (chatKeyToUpdate) {
        return {
          ...state,
          chatWindows: {
            ...state.chatWindows,
            [chatKeyToUpdate]: {
              ...state.chatWindows[chatKeyToUpdate],
              title: title || state.chatWindows[chatKeyToUpdate].title,
              category: category || state.chatWindows[chatKeyToUpdate].category,
            },
          },
        };
      }
      return state;
    }

    case ChatTypes.ADD_MESSAGE: {
      console.log('Adding message to chat:', action.payload);

      const { chatId, message } = action.payload;

      const chatKey = Object.keys(state.chatWindows).find(
        key => state.chatWindows[key].id === chatId
      );

      if (chatKey) {
        return {
          ...state,
          chatWindows: {
            ...state.chatWindows,
            [chatKey]: {
              ...state.chatWindows[chatKey],
              messages: [
                ...state.chatWindows[chatKey].messages,
                message, // 直接添加 payload 中的 message
              ],
              lastUsed: new Date().toISOString(), // 更新最后使用时间
            },
          },
        };
      }
      
      return state;
    }

    case ChatTypes.DELETE_CHAT: {
      const chatIdToDelete = action.payload;
      const chatKeyToDelete = Object.keys(state.chatWindows).find(
        key => state.chatWindows[key].id === chatIdToDelete
      );

      if (chatKeyToDelete) {
        const { [chatKeyToDelete]: _, ...remainingChats } = state.chatWindows;
        const newState = {
          ...state,
          chatWindows: remainingChats,
        };
        saveChatsToStorage(newState.chatWindows); 
        return newState;
      }

      return state;
    }
    case ChatTypes.UPDATE_LOCATION: {
      return {
        ...state,
        location: action.payload, 
      };
    }
    
    default:
      return state;
  }
};

export default chatReducer;
