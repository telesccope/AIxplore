import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { userLogin, setUser, userGoogleAuth } from '../actions/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton } from '../components/Button';
import { MyInput } from '../components/Input';
import { MyBackground } from '../components/Background';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userLoginState = useSelector(state => state.loginReducer);
  const { loginloading, loginerror, userinfo } = userLoginState; 
  console.log('userinfo', userinfo);
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
      const userInfo = await getUserInfo();
      dispatch(setUser(userInfo));
      if (userInfo && userInfo.email) {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          navigation.replace('Home');
        }
      }
    };

    //checkLoginStatus();
  }, []);

  useEffect(() => {
    saveUserInfo(userinfo);
    const fetchData = async () => {
      if (userinfo) {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          navigation.replace('Home');
        }
      }
    };

    fetchData();
  }, [userinfo]);

  useEffect(() => {
    if (loginerror) {
      console.log('useEffect error', loginerror);
    }
  }, [loginerror]); 

  const saveUserInfo = async (userInfo) => {
    try {
      const jsonValue = JSON.stringify(userInfo);
      await AsyncStorage.setItem('@user_info', jsonValue);
      await AsyncStorage.setItem('@access_token', userInfo.access_token);
      await AsyncStorage.setItem('@refresh_token', userInfo.refresh_token);
    } catch (e) {}
  };

  const getUserInfo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
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
    dispatch(userLogin(username, password));
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleGoogleSignIn = async () => {
    try {
        console.log('Google Sign-In');
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data.idToken;

        console.log('user info', userInfo);

        dispatch(userGoogleAuth(idToken));
    } catch (error) {
        console.error('Error during sign-in:', error);
        console.error('Error details:', error.message, error.code);
    }
};


  return (
    <MyBackground>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.jpg')} 
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
          source={require('../../assets/logo.jpg')} 
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
