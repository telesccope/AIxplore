// reducers/loginReducer.js
import * as UserTypes from '../types/UserTypes'

const initialState = {
    loginloading: false,
    userinfo: null,
    loginerror: null, 
  };
  
function loginReducer(state = initialState, action) {
  switch (action.type) {
    case UserTypes.USER_LOGIN_REQUEST:
      return {
        ...state,
        loginloading: true,
        loginerror: null, 
      };
    case UserTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        loginloading: false,
        userinfo: action.payload.userinfo,
      };
    case UserTypes.USER_LOGIN_FAILURE:
      return {
        ...state,
        loginloading: false,
        loginerror: action.payload.loginerror, 
      };
    case UserTypes.USER_LOGOUT:
      return initialState;
    case UserTypes.USER_LOGOUT_RESET:
      return {
        ...state,
        userinfo: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
}

export default loginReducer;
  
    