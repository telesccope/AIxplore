import { Alert } from 'react-native';
import api from '../constants/api';  // 直接导入 api 实例
import { BASE_URL } from '../constants/api';
import * as UserTypes from '../types/UserTypes';

export const userLogoutReset = () => {
  return {
    type: 'USER_LOGOUT_RESET'
  };
};

export function userLogin(username, password) {
  return async (dispatch) => {
    dispatch({ type: UserTypes.USER_LOGIN_REQUEST });

    const postData = {
      username: username,
      password: password
    };

    try {
      const response = await api.post('/users/login', postData);
      dispatch({
        type: UserTypes.USER_LOGIN_SUCCESS,
        payload: {
          userinfo: response.data.userinfo,
        }
      });
    } catch (error) {
      let errorMessage = error.response ? error.response.data.message : error.message;
      Alert.alert('Login Failure', errorMessage);
      dispatch({
        type: UserTypes.USER_LOGIN_FAILURE,
        payload: {
          loginerror: errorMessage,
        }
      });
    }
  };
}

export const setUser = (userInfo) => (dispatch) => {
  dispatch({
    type: UserTypes.USER_LOGIN_SUCCESS,
    payload: {
      userinfo: userInfo,
    }
  });
};

export const userLogout = () => ({ type: 'USER_LOGOUT' });

export function userNextStep(email, code, Registerpassword, Confirmpassword) {
  return (dispatch) => {
    dispatch({
      type: UserTypes.USER_NEXTSTEP_SUCCESS,
      payload: {
        userinfo: {
          email,
          code,
          Registerpassword,
          Confirmpassword,
        },
      },
    });
  };
}

export function userRegister(
  Country, 
  AgeGroup, 
  Gender, 
  EthicalGroup, 
  Occupation, 
  Disability, 
  Postcode, 
  Organisation, 
  TypeOfVehicle
) {
  return async (dispatch, getState) => {
    dispatch({ type: UserTypes.USER_REGISTER_REQUEST });
    
    const { userinfo } = getState().nextstepReducer;

    // 构建注册数据
    const registerData = {
      email: userinfo.email,
      code: userinfo.code,
      Registerpassword: userinfo.Registerpassword,
      Confirmpassword: userinfo.Confirmpassword,
      Country: Country,
      AgeGroup: AgeGroup,
      Gender: Gender,
      EthicalGroup: EthicalGroup,
      Occupation: Occupation,
      Disability: Disability,
      Postcode: Postcode,
      Organisation: Organisation,
      TypeOfVehicle: TypeOfVehicle,
    };
    console.log(registerData,'*******')
    try {
      // 先调用注册接口
      const registerResponse = await api.post('/users/register', {
        email: registerData.email,
        code: registerData.code,
        Registerpassword: registerData.Registerpassword,
        Confirmpassword: registerData.Confirmpassword,
      });

      // 注册成功后，继续调用更新接口
      const updateResponse = await api.post('/users/update', registerData);
      Alert.alert('Success', registerResponse.data.message);
      // 更新成功后，派发成功动作
      dispatch({
        type: UserTypes.USER_REGISTER_SUCCESS,
        payload: {
          userinfo: updateResponse.data.userinfo,
        },
      });

    } catch (error) {
      // 处理错误
      Alert.alert('Failure', error.message);
      dispatch({
        type: UserTypes.USER_REGISTER_FAILURE,
        payload: error.response ? error.response.data : error.message,
      });
    }
  };
}

const resetPasswordRequest = () => ({
  type: UserTypes.RESET_PASSWORD_REQUEST
});

const resetPasswordSuccess = (message) => ({
  type: UserTypes.RESET_PASSWORD_SUCCESS,
  payload: message
});

const resetPasswordFailure = (error) => ({
  type: UserTypes.RESET_PASSWORD_FAILURE,
  error: error
});

export const resetUserPassword = (email, code, new_password) => {
  return async (dispatch) => {
    // 触发请求开始的 action
    dispatch(resetPasswordRequest());

    try {
      // 调用后端 API，传递 email, code 和 new_password
      const response = await api.post('/users/reset_password', {
        email,
        code,
        new_password
      });
      // 如果请求成功，触发成功的 action，并弹出成功提示
      dispatch(resetPasswordSuccess(response.data.message));
    } catch (error) {
      // 捕获错误并处理，显示错误信息
      let errorMessage = error.response ? error.response.data.message : error.message;
      dispatch(resetPasswordFailure(errorMessage));
      Alert.alert('Error', errorMessage);
    }
  };
};


export const updateResetEmail = (email) => ({
  type: UserTypes.UPDATE_RESET_EMAIL,
  payload: email
});

export const resetRegisterState = () => {
  return {
    type: UserTypes.USER_REGISTER_RESET
  };
};

export const resetNextStepState = () => {
  return {
    type: UserTypes.USER_NEXTSTEP_RESET
  };
};

export const sendNotificationRequest = () => {
  return {
    type: UserTypes.SEND_NOTIFICATION_REQUEST
  }
}

export const sendNotificationSuccess = (message) => {
  return { 
    type: UserTypes.SEND_NOTIFICATION_SUCCESS, 
    payload: message 
  }
};

export const sendNotificationFailure = (error) => {
  return { 
    type: UserTypes.SEND_NOTIFICATION_FAILURE, 
    payload: error 
  }
};

// 调用 /send_notification 的函数
export const sendNotification = (notificationData) => {
  return async (dispatch) => {
    dispatch(sendNotificationRequest());
    try {
      const response = await api.post('/send_code', notificationData);
      dispatch(sendNotificationSuccess(response.data.message));
      Alert.alert('Success', response.data.message);
      return Promise.resolve(response.data.message); // 成功时解析 Promise
    } catch (error) {
      let errorMessage;
      console.log(error, error.message, error.data, '****');
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      dispatch(sendNotificationFailure(errorMessage));
      Alert.alert('Error', errorMessage);
      return Promise.reject(errorMessage); // 失败时拒绝 Promise
    }
  };
};


const verifyCodeRequest = () => ({
  type: UserTypes.VERIFY_CODE_REQUEST,
});

const verifyCodeSuccess = (message) => ({
  type: UserTypes.VERIFY_CODE_SUCCESS,
  payload: message,
});

const verifyCodeFailure = (error) => ({
  type: UserTypes.VERIFY_CODE_FAILURE,
  payload: error,
});

export const verifyCode = (verificationData) => {
  return async (dispatch) => {
    dispatch(verifyCodeRequest());
    try {
      const response = await api.post('/verify_code', verificationData);
      dispatch(verifyCodeSuccess(response.data.message));
    } catch (error) {
      let errorMessage = 'An error occurred';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message || 'Failed to verify code';
      }
      dispatch(verifyCodeFailure(errorMessage));
      Alert.alert('Error', errorMessage);
    }
  };
};

export const fetchAllOptions = async () => {
  try {
    const response = await api.get('/options');
    return response.data; 
  } catch (error) {
    let errorMessage = error.response ? error.response.data.message : error.message;
    Alert.alert('Error', errorMessage);
  }
};