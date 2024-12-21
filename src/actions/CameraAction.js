import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchCamera } from 'react-native-image-picker';

export const openCamera = async () => {
  try {
    let permission;

    // 检查相机权限
    if (Platform.OS === 'android') {
      permission = await check(PERMISSIONS.ANDROID.CAMERA);
    } else {
      permission = await check(PERMISSIONS.IOS.CAMERA);
    }

    // 请求权限
    if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
      let requestResult;

      if (Platform.OS === 'android') {
        requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      } else {
        requestResult = await request(PERMISSIONS.IOS.CAMERA);
      }

      // 如果权限未授予
      if (requestResult !== RESULTS.GRANTED) {
        console.warn('Camera permission denied');
        return null;
      }
    } else if (permission !== RESULTS.GRANTED) {
      console.warn('Camera permission not granted');
      return null;
    }

    // 调用相机
    return new Promise((resolve, reject) => {
      launchCamera(
        {
          mediaType: 'photo', // 仅限照片
          saveToPhotos: true, // 保存到相册
        },
        (response) => {
          if (response.didCancel || response.errorCode) {
            console.warn('Camera operation cancelled or failed');
            resolve(null);
            return;
          }

          const { assets } = response;
          if (assets && assets.length > 0) {
            const { uri } = assets[0];
            resolve(uri); // 返回照片 URI
          } else {
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error handling camera open:', error);
    return null;
  }
};
