// reducers/registerReducer.js
import * as UserTypes from '../types/UserTypes'

const initialState = {
  registerloading: false,
  registerpass: null,
  registererror: null,
};

function registerReducer(state = initialState, action) {
  switch (action.type) {
    case UserTypes.USER_REGISTER_REQUEST:
      return {
        ...state,
        registerloading: true,
        registererror: null
      };
    case UserTypes.USER_REGISTER_SUCCESS:
      return {
        ...state,
        registerloading: false,
        registerpass: true,
        registererror: null,
      };
    case UserTypes.USER_REGISTER_FAILURE:
      return {
        ...state,
        registerloading: false,
        registererror: action.payload
      };
    case UserTypes.USER_REGISTER_RESET:
      return {
        ...state,
        registerloading: false,
        registerpass: null,
        registererror: null,
      };
    default:
      return state;
  }
}

export default registerReducer;
