// reducers/RootReducer.js
import { combineReducers } from 'redux';
import chatReducer from './ChatReducer';
import loginReducer from './LoginReducer';
import registerReducer from './RegisterReducer';

// persist 相关引入
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // React Native 用这个

const chatPersistConfig = {
  key: 'chat',
  storage: AsyncStorage,
};

const appReducer = combineReducers({
  chatReducer: persistReducer(chatPersistConfig, chatReducer), // ✅ 持久化 chatReducer
  loginReducer,
  registerReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
