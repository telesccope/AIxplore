import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './src/reducers/RootReducer'; // 确保路径正确

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
