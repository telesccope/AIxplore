import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView,Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { MyInput } from '../../components/Input'
import { MyButton } from '../../components/Button';
import { userRegister, resetRegisterState } from '../../actions/UserAction'
import { MyBackground } from '../../components/Background';
import { fetchAllOptions } from '../../actions/UserAction';

export default function RegisterScreen({navigation}) {
  const dispatch = useDispatch();
  const registererror = useSelector(state => state.registerReducer.error);

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [Registerpassword, setRegisterpassword] = useState("")
  const [Confirmpassword, setConfirmpassword] = useState("")

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    code: '',
    Registerpassword: '',
    Confirmpassword: '',
  })

  const clearError = (field) => {
    setErrorMessages(prevErrors => ({ ...prevErrors, [field]: '' }));
  };
  
  const handleEmailChange = (newText) => {
    setEmail(newText);
  };
  const handleCodeChange = (newText) => {
    setCode(newText);
  }
  const handleRegisterpasswordChange = (newText) => {
    setRegisterpassword(newText);
  }
  const handleConfirmpasswordChange = (newText) => {
    setConfirmpassword(newText);
  }

  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (registererror) {
      console.log('useEffect registererror',registererror)
      Alert.alert('Register Failed', registererror['message'], [{ text: 'OK' }]);
    }
  }, [registererror]);

  const handleRegister = () => {
    console.log('Register');
    let errors = {};
  
    // 如果存在任何错误，则更新状态并阻止提交
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }
  
    // 清除错误信息并执行下一步操作
    setErrorMessages({});
    dispatch(userRegister(email, code, Registerpassword, Confirmpassword))
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(() => {
        // 如果注册失败，可以显示错误或执行其他操作
        console.log('Registration failed');
      });
  };

  return (
    <MyBackground>
      <MyInput 
        placeholder='Enter your email address' 
        value={email}
        onChangeText={handleEmailChange}
      />
      <MyInput 
        placeholder='Enter the verification code' 
        value={code}
        onChangeText={handleCodeChange}
      />
      <MyInput 
        placeholder='Create a password' 
        value={Registerpassword}
        onChangeText={handleRegisterpasswordChange}
      />
      <MyInput 
        placeholder='Confirm your password' 
        value={Confirmpassword}
        onChangeText={handleConfirmpasswordChange}
      />
      <MyButton text='Register' onPress={handleRegister}/>

    </MyBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    //justifyContent: 'center',
    alignItems: 'left',
    marginVertical: 1,
  },
  text: {
    marginBottom:10
  },
})
