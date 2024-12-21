import { Alert } from 'react-native';
import api from '../constants/api';  // 直接导入 api 实例
import { BASE_URL } from '../constants/api';
import * as UserTypes from '../types/UserTypes';
import * as ChatTypes from '../types/ChatTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      console.log('Login Response first:', response.data);
      dispatch({
        type: UserTypes.USER_LOGIN_SUCCESS,
        payload: {
          userinfo: response.data,
        }
      });
      // 返回成功响应
      console.log('Action Response:', response.data);
      return response.data;
    } catch (error) {
      let errorMessage = error.response ? error.response.data.message : error.message;
      Alert.alert('Login Failure', errorMessage);
      dispatch({
        type: UserTypes.USER_LOGIN_FAILURE,
        payload: {
          loginerror: errorMessage,
        }
      });
      // 返回失败响应
      return { success: false, error: errorMessage };
    }
  };
}


export function fetchUserChats() {
  return async (dispatch) => {
    dispatch({ type: ChatTypes.FETCH_CHATS_REQUEST });

    try {
      const response = await api.get('/users/chats');
      const chatsObject = response.data;
      console.log('Fetched chats:', chatsObject);

      // 将对象转换为数组
      const chatsArray = Object.values(chatsObject);

      // 遍历每个聊天窗口，处理图像消息
      const processedChatsArray = await Promise.all(
        chatsArray.map(async (chat) => {
          const processedMessages = await Promise.all(
            chat.messages.map(async (message) => {
              if (message.content.type === 'image_url') {
                const imageUrl = message.content.url;

                // 下载图像并转换为 Base64
                const base64Image = await fetchImageAsBase64(imageUrl);

                // 替换消息中的 URL 为 Base64 数据
                return {
                  ...message,
                  content: {
                    type: 'image_base64',
                    data: base64Image, // 存储 Base64 数据
                  },
                };
              }

              // 如果不是图像消息，直接返回原消息
              return message;
            })
          );

          // 返回处理后的聊天窗口
          return {
            ...chat,
            messages: processedMessages,
          };
        })
      );

      console.log('Processed chats array:', processedChatsArray);

      dispatch({
        type: ChatTypes.FETCH_CHATS_SUCCESS,
        payload: processedChatsArray,
      });

      return { payload: processedChatsArray };
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      console.error('Error fetching chats:', errorMessage);

      dispatch({
        type: ChatTypes.FETCH_CHATS_FAILURE,
        payload: {
          fetchError: errorMessage,
        },
      });

      throw error;
    }
  };
}

// 辅助函数：从 URL 下载图像并转换为 Base64
async function fetchImageAsBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // 返回 Base64 数据（去掉前缀）
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image as Base64:', error, imageUrl);
    return null;
  }
}


export const setChats = (chats) => ({
  type: 'SET_CHATS',
  payload: chats,
});

export const updateApiHeaders = () => {
  return async (dispatch) => {
    try {
      console.log('Updating API headers');
      const token = await AsyncStorage.getItem('@access_token');
      console.log('Access token:', token);
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('API headers updated');
      }
    } catch (error) {
      console.error('Failed to update API headers:', error);
    }
  };
};

export const userGoogleAuth = (idToken) => {
  return async (dispatch) => {
    dispatch({ type: UserTypes.USER_LOGIN_REQUEST });

    try {
      const response = await api.post('/auth/google-signin', { idToken });
      console.log('Google Signin Response:', response.data);
      dispatch({
        type: UserTypes.USER_LOGIN_SUCCESS,
        payload: {
          userinfo: response.data.userinfo,
        }
      });
      return response.data; // 返回响应数据
    } catch (error) {
      let errorMessage = error.response ? error.response.data.message : error.message;
      Alert.alert('Login Failure', errorMessage);
      dispatch({
        type: UserTypes.USER_LOGIN_FAILURE,
        payload: {
          loginerror: errorMessage,
        }
      });
      throw error; // 抛出错误以便在调用处捕获
    }
  };
};


export const setUser = (userInfo) => (dispatch) => {
  dispatch({
    type: UserTypes.USER_LOGIN_SUCCESS,
    payload: {
      userinfo: userInfo,
    }
  });
};

export const userLogout = () => async (dispatch) => {
  try {
    // 清空缓存
    await AsyncStorage.removeItem('@user_info');
    await AsyncStorage.removeItem('@access_token');
    await AsyncStorage.removeItem('@refresh_token');
    await AsyncStorage.removeItem('@chat_records');
    
    // 触发 reducer 清空状态
    dispatch({ type: 'USER_LOGOUT' });
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};


export const updateUserInfo = (userinfo) => ({
  type: UserTypes.USER_REGISTER_UPDATE_INFOO,
  payload: userinfo,
});

export function userRegister(email, code, Registerpassword, Confirmpassword) {
  return async (dispatch) => {
    // 构建注册数据
    const registerData = {
      email: email,
      code: code,
      Registerpassword: Registerpassword,
      Confirmpassword: Confirmpassword,
    };

    try {
      // 调用注册接口
      const registerResponse = await api.post('/users/register', {
        email: registerData.email,
        code: registerData.code,
        Registerpassword: registerData.Registerpassword,
        Confirmpassword: registerData.Confirmpassword,
      });

      Alert.alert('Success', registerResponse.data.message);

      // 派发成功动作
      dispatch({
        type: UserTypes.USER_REGISTER_SUCCESS,
      });

      // 返回成功标志
      return Promise.resolve(true);

    } catch (error) {
      // 提取具体的错误信息
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;

      Alert.alert('Failure', errorMessage);

      dispatch({
        type: UserTypes.USER_REGISTER_FAILURE,
        payload: errorMessage,
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
      ////console.log(error, error.message, error.data, '****');
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