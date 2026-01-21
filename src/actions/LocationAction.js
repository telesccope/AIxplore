import React from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import GetLocation from 'react-native-get-location';
import { UPDATE_LOCATION } from '../types/ChatTypes';
import { useDispatch } from 'react-redux';

// Action：更新位置
export const updateLocation = (location) => ({
  type: UPDATE_LOCATION,
  payload: location,
});

// 请求 Android 位置权限
const requestAndroidLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to work properly.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Permission error:', err);
    Alert.alert('Error', 'An error occurred while requesting location permission');
    return false;
  }
};

// 请求位置权限（跨平台）
const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    // iOS 不需要手动请求，直接返回 true
    return true;
  } else if (Platform.OS === 'android') {
    // Android 请求权限
    return await requestAndroidLocationPermission();
  }
  return false;
};

// 获取当前位置
const getCurrentLocation = async () => {
  console.log('Getting current location...');
  const hasPermission = await requestLocationPermission();
  console.log('Has permission:', hasPermission);
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Location permission is required to get your location');
    return null;
  }

  try {
    
    const location = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true, // 是否使用高精度定位
      timeout: 15000, // 超时时间（毫秒）
    });
    
   /*
    const location = {
      latitude: 51.256561,
      longitude: -2.2472996,
    }
    */
    console.log('Current location:', location);
    return location;
  } catch (error) {
    console.error('Location error:', error);

    // 根据错误代码展示更具体的错误信息
    switch (error.code) {
      case 'CANCELLED':
        Alert.alert('Error', 'Location request was cancelled');
        break;
      case 'UNAVAILABLE':
        Alert.alert('Error', 'Location service is disabled or unavailable');
        break;
      case 'TIMEOUT':
        Alert.alert('Error', 'Location request timed out');
        break;
      case 'UNAUTHORIZED':
        Alert.alert('Error', 'Authorization denied');
        break;
      default:
        Alert.alert('Error', error.message || 'Failed to get current location');
    }

    return null;
  }
};

// 更新用户位置到 Redux
const updateUserLocation = async () => {
  const dispatch = useDispatch();

  try {
    const location = await getCurrentLocation();

    if (location) {
      // 更新 Redux 中的 location
      dispatch(
        updateLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: location.time,
        })
      );

      console.log('Location updated in Redux:', location);
    }
  } catch (error) {
    console.error('Failed to fetch location:', error);
  }
};

// 订阅位置更新
const subscribeToLocationUpdates = async (callback) => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  try {
    // 模拟位置订阅（react-native-get-location 不支持实时订阅）
    const intervalId = setInterval(async () => {
      const location = await getCurrentLocation();
      if (location && callback) {
        callback(location);
      }
    }, 5000); // 每 5 秒获取一次位置

    return () => clearInterval(intervalId); // 返回取消订阅的方法
  } catch (error) {
    console.error('Subscription error:', error);
    Alert.alert('Error', 'Failed to subscribe to location updates');
    return null;
  }
};

export { getCurrentLocation, updateUserLocation, subscribeToLocationUpdates };
