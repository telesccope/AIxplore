// constants/api.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//export const BASE_URL = "http://192.168.1.164:8000";

export const BASE_URL = "https://travelassistant.uk"
//export const BASE_URL = "http://127.0.0.1:8000";
//export const BASE_URL = "http://10.97.8.119:8000"
//export const BASE_URL = "http://10.62.4.83:8000"
//export const BASE_URL = "http://10.97.201.208:8000"
//export const BASE_URL = "http://10.97.226.115:8000"
const api = axios.create({
  baseURL: BASE_URL, 
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    console.log('Request:', JSON.stringify({
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    }, null, 2));

    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response) {
      console.log('Network error or server is unreachable');
      return Promise.reject(new Error('Network error or server is unreachable'));
    }
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('@refresh_token');
        console.log('Get refresh_token from storage:', refreshToken);
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

    console.error('Response Error:', JSON.stringify({
      url: error.config.url,
      status: error.response.status,
      data: error.response.data
    }, null, 2));

    return Promise.reject(error);
  }
);

export default api;
