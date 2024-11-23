// reducers/loginReducer.js
import * as UserTypes from '../types/UserTypes'

const initialState = {
    loginloading: false,
    userinfo: null,
    loginerror: null, 
    isAuthenticated: false
  };
  
function loginReducer(state = initialState, action) {
  switch (action.type) {
    case UserTypes.USER_LOGOUT:
      return initialState; 
    case UserTypes.USER_LOGIN_REQUEST:
      return {
        ...state,
        loginloading: true,
        loginerror: null, 
      };
    case UserTypes.USER_LOGIN_SUCCESS:
      console.log('action.payload.userinfo', action.payload.userinfo);
      return {
        ...state,
        loginloading: false,
        userinfo: action.payload.userinfo,
        isAuthenticated: true
      };
    case UserTypes.USER_LOGIN_FAILURE:
      return {
        ...state,
        loginloading: false,
        loginerror: action.payload.loginerror, 
      };
    case UserTypes.USER_LOGOUT_RESET:
      return {
        ...state,
        userinfo: null,
        loading: false,
        error: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
}

export default loginReducer;
  
    