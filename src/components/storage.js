import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLocationListToStorage = async (locationList) => {
  try {
    const jsonValue = JSON.stringify(locationList);
    await AsyncStorage.setItem('locationList', jsonValue);
  } catch (e) {
    console.error('Failed to save location list to storage', e);
  }
};

export const loadLocationListFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('locationList');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.error('Failed to load location list from storage', e);
    return null;
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Storage successfully cleared!');
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};
