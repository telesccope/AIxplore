import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateResetEmail } from '../actions/UserActions';
import { MyButton } from '../components/Button';
import { MyInput, MyCodeInput } from '../components/Input';
import { MyBackground } from '../components/Background';
import { sendNotification, verifyCode, resetUserPassword } from '../actions/UserActions';

const ForgetScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isCodeSending, setIsCodeSending] = useState(false); // 用于控制验证码按钮的禁用状态
  const [errorMessages, setErrorMessages] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });

  const clearError = (field) => {
    setErrorMessages(prevErrors => ({ ...prevErrors, [field]: '' }));
  };

  const dispatch = useDispatch();

  const handleCodeChange = (newText) => {
    setCode(newText);
    clearError('code');
  };

  const handleEmailChange = (newText) => {
    setEmail(newText);
    clearError('email');
  };

  const handleSendNotification = async (email) => {
    console.log(email, "***");
    let errors = {};
  
    // 验证 email 格式
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!email.includes('@') || !email.includes('.')) {
      errors.email = 'Invalid email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format.';
    }
  
    // 如果有错误，返回 false
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return false;  // 返回 false 表示发送失败
    }
  
    try {
      setIsCodeSending(true); // 发送验证码时禁用按钮
      await dispatch(sendNotification({ email }));
      return true;  // 返回 true 表示发送成功
    } catch (error) {
      setErrorMessages({ email: 'Failed to send code. Please try again.' });
      return false;  // 返回 false 表示发送失败
    } finally {
      setIsCodeSending(false); // 发送完成后启用按钮
    }
  };
  

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async () => {
    console.log('Password Reset Request');
    let errors = {};

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (!passwordRegex.test(newPassword)) {
      errors.newPassword = 'Password must be at least 8 characters long and include both letters and numbers.';
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      await dispatch(resetUserPassword(email, code, newPassword));
      Alert.alert('Success', 'Password has been successfully reset.');
      navigation.navigate('Login');
    } catch (error) {
      if (error.message.includes('verifyCode')) {
        setErrorMessages({ code: 'Verification failed. Please try again.' });
      } else if (error.message.includes('resetUserPassword')) {
        setErrorMessages({ password: 'Password reset failed. Please try again.' });
      } else {
        setErrorMessages({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  return (
    <MyBackground>
      <View style={styles.container}>
        <MyInput 
          placeholder='Email' 
          value={email}
          onChangeText={handleEmailChange}
          errorMessage={errorMessages.email} 
        />
        <MyCodeInput 
          placeholder='Code' 
          value={code}
          onChangeText={handleCodeChange}
          email={email}
          onSendNotification={handleSendNotification}
          isDisabled={isCodeSending} 
          errorMessage={errorMessages.code} 
        />
        <MyInput 
          placeholder='New Password'
          value={newPassword}
          onChangeText={text => setNewPassword(text)}
          secureTextEntry
          errorMessage={errorMessages.newPassword}
        />
        <MyInput 
          placeholder='Confirm New Password'
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          secureTextEntry
          errorMessage={errorMessages.confirmPassword}
        />
        <MyButton text='Submit' onPress={handleSubmit} />
      </View>
    </MyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '5%', 
    paddingHorizontal: '5%', 
    alignItems: 'flex-start',
    marginVertical: 1,
    width: '100%'
  },
});

export default ForgetScreen;
