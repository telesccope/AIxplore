// reducers/RootReducer.js
import { combineReducers } from 'redux';
import chatReducer from './ChatReducer.js';
import loginReducer from './LoginReducer.js';
import registerReducer from './RegisterReducer.js';

// 创建一个组合所有 reducer 的根级别 reducer
const appReducer = combineReducers({
  chatReducer: chatReducer,
  loginReducer: loginReducer,
  registerReducer: registerReducer,
});

// 创建 rootReducer 以处理全局的 RESET_STATE 逻辑
const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    // 当收到 RESET_STATE action 时，将 state 重置为 undefined
    state = undefined;
  }
  // 继续调用 appReducer 处理其他 action
  return appReducer(state, action);
};

export default rootReducer;
