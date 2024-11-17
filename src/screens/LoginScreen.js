import React, { useState, useEffect,useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image,Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { userLogin,setUser } from '../actions/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton } from '../components/Button'
import { MyInput } from '../components/Input';
import { MyBackground } from '../components/Background';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({ navigation }) {
  console.log("navigation","LoginScreen")
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userLoginState = useSelector(state => state.loginReducer);
  const { loginloading, loginerror, userinfo } = userLoginState; 
  const hasNavigatedRef = useRef(false);

  useFocusEffect(
    
    React.useCallback(() => {
      setUsername('');
      setPassword('');

      return () => {
      };
    }, [])
  );
  const saveUserInfo = async (userInfo) => {
    try {
      const jsonValue = JSON.stringify(userInfo)
      await AsyncStorage.setItem('@user_info', jsonValue)
      await AsyncStorage.setItem('@access_token', userInfo.access_token);
      await AsyncStorage.setItem('@refresh_token', userInfo.refresh_token);
    } catch (e) {
    }
  }
  const getUserInfo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      return null;
    }
  }
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userInfo = await getUserInfo();
      console.log('get user info from storage:',userInfo)
      dispatch(setUser(userInfo))
      if(userInfo && userInfo.email){
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          navigation.replace('Home');
        }
      }
    }
  
    checkLoginStatus();
  }, []);
  
  useEffect(() => {
    saveUserInfo(userinfo);
    const fetchData = async () => {
      if (userinfo) {
        await requestLocationPermission();
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
      console.log('useEffect error',loginerror)
    }
  }, [loginerror]); 

  const requestLocationPermission = async () => {
    let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Foreground location permission denied');
      return false;
    }
    /*
    let postNotificationsGranted = true;  
    if (Platform.OS === 'android' && parseInt(Platform.Version, 10) >= 31) {
    const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    if (status) {
        postNotificationsGranted = true;
    } else {
        const postNotificationsStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
                title: "Notification Permission",
                message: "This app needs permission to post notifications.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK",
            }
        );
        postNotificationsGranted = postNotificationsStatus === PermissionsAndroid.RESULTS.GRANTED;
    }
        
        if (!postNotificationsGranted) {
            Alert.alert('Permission Denied', 'Post notification permission is denied');
            return false;
        }
    }
    */
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
  

  return (
      <MyBackground>
      <View style={styles.logoContainer}>
      <Image
        source={require('../../assets/logo.jpg')} 
        style={styles.titleLogo} 
      />
      </View>
      <Text style={styles.title}>Your Journey to a Greener Tomorrow</Text>
      <MyInput placeholder="Please enter your email or account" value={username}
          onChangeText={newText => setUsername(newText)}
          errorMessage={errorMessages.username}
          />
      <MyInput placeholder="Password" secureTextEntry value={password}
          onChangeText={newText => setPassword(newText)}
          errorMessage={errorMessages.password}
          />
      <MyButton title='Login' text='Sign In' onPress={handleLogin}/>
      <MyButton title='Register' text='Create an Account' onPress={handleRegister}/>
      {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate('Forget')
            }}
        >
          <Text style={styles.forgetPassword}>Forget password?</Text>
        </TouchableOpacity> */}
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
    borderRadius:20,
  },
  title: {
    fontSize: 14, 
    marginBottom: 20, 
    textAlign: 'center',
    color: 'black', 
    fontWeight: 'bold', 
    padding:20,
  },
  forgetPassword: {
    color: '#6FC39C', 
    marginTop: 12, 
    marginBottom: 35, 
  },
  footer: {
    position: 'absolute', 
    bottom: 10, 
    alignSelf: 'center',
    marginTop: 0,
  },
  footerText: {
    color: 'grey', 
    fontSize: 14, 
    marginTop: 10,
  },
});

export default LoginScreen;