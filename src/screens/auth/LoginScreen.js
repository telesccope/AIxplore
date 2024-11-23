import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { userLogin, setUser, userGoogleAuth, fetchUserChats, setChats, updateApiHeaders } from '../../actions/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton } from '../../components/Button';
import { MyInput } from '../../components/Input';
import { MyBackground } from '../../components/Background';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userLoginState = useSelector(state => state.loginReducer);
  const { loginloading, loginerror, userinfo } = userLoginState; 
  console.log('userinfo state', userinfo);
  const hasNavigatedRef = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      setUsername('');
      setPassword('');
      return () => {};
    }, [])
  );

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '842353906367-e4gvdn4rhhpl2j8a25l3jgbtaqp93s46.apps.googleusercontent.com'
    });

    const checkLoginStatus = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log('userInfo', userInfo);
    
        if (userInfo && userInfo.email) {
          dispatch(setUser(userInfo));
    
          const chats = await getChatsFromStorage();
          console.log('chats', chats);
          dispatch(setChats(chats)); 
    
          if (!hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    
    

    checkLoginStatus();
  }, []);

  const fetchAdditionalData = async () => {
    try {
      const response = await dispatch(fetchUserChats());
      const chats = response.payload;
  
      if (chats.length === 0) {
        console.log('No chats available.');
        // 处理空数据的逻辑，比如显示提示信息
      } else {
        await saveChatsToStorage(chats);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };
  
  

  useEffect(() => {
    if (loginerror) {
      console.log('useEffect error', loginerror);
    }
  }, [loginerror]); 

  const saveUserInfo = async (userInfo) => {
    console.log('saveUserInfo', userInfo);
    try {
      const jsonValue = JSON.stringify(userInfo);
      await AsyncStorage.setItem('@user_info', jsonValue);
      await AsyncStorage.setItem('@access_token', userInfo.access_token);
      await AsyncStorage.setItem('@refresh_token', userInfo.refresh_token);
    } catch (e) {}
  };

  const saveChatsToStorage = async (chats) => {
    try {
      const jsonValue = JSON.stringify(chats);
      await AsyncStorage.setItem('@chat_records', jsonValue);
    } catch (e) {
      console.error('Failed to save chats to storage:', e);
    }
  };
  
  const getUserInfo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
    }
  };

  const getChatsFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@chat_records');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to load chats from storage:', e);
      return [];
    }
  };  

  const requestLocationPermission = async () => {
    let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Foreground location permission denied');
      return false;
    }
    console.log("Successfully obtained front location permissions");
    return true; 
  };

  const [errorMessages, setErrorMessages] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async () => { 
    let errors = {};
    if (!username) {
      errors.username = 'Username is required.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }
    setErrorMessages({});
    
    try {
      const response = await dispatch(userLogin(username, password));
      console.log('Action Response2:', response);
      const userInfo = response.userinfo;
      console.log('Login Response:', userInfo);
      if (userInfo) {
        await saveUserInfo(userInfo);
        await dispatch(updateApiHeaders());
        await fetchAdditionalData();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Google Sign-In');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('user info', userInfo);
  
      const idToken = userInfo.data.idToken;
      if (!idToken) {
        console.error('idToken is undefined');
        return;
      }
      
      console.log('idToken', idToken);
  
      const response = await dispatch(userGoogleAuth(idToken));
      console.log('Google Sign-In Response:', response);
      const user = response.userinfo;
      if (user) {
        await saveUserInfo(user);
        await dispatch(updateApiHeaders());
      }

      if (response) {
        await fetchAdditionalData();
      }

      
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };
  

  return (
    <MyBackground>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo.jpg')} 
          style={styles.titleLogo} 
        />
      </View>
      <Text style={styles.title}>Your Journey to a Greener Tomorrow</Text>
      <MyInput 
        placeholder="Please enter your email or account" 
        value={username}
        onChangeText={setUsername}
        errorMessage={errorMessages.username}
      />
      <MyInput 
        placeholder="Password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
        errorMessage={errorMessages.password}
      />
      <MyButton title='Login' text='Sign In' onPress={handleLogin}/>
      <MyButton title='Register' text='Create an Account' onPress={handleRegister}/>
      <MyButton title='Google Sign-In' text='Sign In with Google' onPress={handleGoogleSignIn}/>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo.jpg')} 
          style={{ width: 120, height: 80 }} 
        />
        <Text style={styles.footerText}> Copyright © 2024</Text>
      </View>
    </MyBackground>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 5, 
    marginVertical: 1,
  },
  titleLogo: {
    width: 100, 
    height: 100, 
    borderRadius: 20,
  },
  title: {
    fontSize: 14, 
    marginBottom: 20, 
    textAlign: 'center',
    color: 'black', 
    fontWeight: 'bold', 
    padding: 20,
  },
  footerText: {
    color: 'grey', 
    fontSize: 14, 
    marginTop: 10,
  },
});

export default LoginScreen;
