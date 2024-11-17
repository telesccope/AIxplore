// constants/api.js

//export const BASE_URL = 'https://travelassistant.uk/';
export const BASE_URL = "http://127.0.0.1:8000"
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: BASE_URL, 
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 禁用缓存
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response) {
      console.log('Error is undefined, skipping...');
      return Promise.reject(error);
    }
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('@refresh_token');
        console.log('get refresh_token from storage:',refreshToken)
        const res = await axios.post(`${BASE_URL}/token/refresh`, {}, { 
          headers: {
            'Authorization': `Bearer ${refreshToken}` 
          }
        });
        const { access_token } = res.data;
        await AsyncStorage.setItem('@access_token', access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (e) {
        console.log('Unable to refresh token', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
