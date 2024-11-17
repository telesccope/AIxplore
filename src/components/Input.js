import { StyleSheet, TextInput, View, Text,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react';

export const MyInput = ({value, placeholder,onChangeText,secureTextEntry,errorMessage}) =>(
    <View style={InputStyles.container}>
      <TextInput style={InputStyles.input} placeholder={placeholder} value={value}
          onChangeText={onChangeText} secureTextEntry={secureTextEntry} autoCapitalize="none"/>
      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
    </View>
    )

export const MySearchInput = ({ value, placeholder, onChangeText, secureTextEntry,onPress }) => { 
  return (
    <View style={InputStyles.inputContainer}>
      <TextInput
        style={InputStyles.searchinput}
        placeholder={placeholder}
        placeholderTextColor="#D3D3D3"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      <TouchableOpacity onPress={() => { onPress }}>
        <Icon name="search" size={36} style={InputStyles.icon} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export const MyCodeInput = ({ 
  value, 
  placeholder,  
  onChangeText, 
  secureTextEntry, 
  errorMessage, 
  onSendNotification, 
  email, 
  isDisabled
}) => {
  // 倒计时状态（初始为0，表示按钮可用）
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false); // 用于处理发送状态

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      // 如果倒计时大于0，则启动一个每秒递减的计时器
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }

    // 清除计时器
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleSend = async () => {
    if (countdown === 0 && !isSending) {
      setIsSending(true); // 设置发送状态为 true
      const success = await onSendNotification(email); // 发送验证码逻辑
      console.log
      if (success) {
        console.log('Starting countdown...');
        setCountdown(60); // 设置倒计时为60秒
      } else {
        console.log('Error or failed to send');
      }
      setIsSending(false); 
    }
  };
  

  return (
    <View style={styles.all_container}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
        <View style={styles.separator} />
        {/* 外部传入的 isDisabled 参数控制按钮禁用 */}
        <TouchableOpacity
          style={[
            styles.button,
            (countdown > 0 || isSending || isDisabled) ? styles.buttonDisabled : null, // 如果倒计时大于0、正在发送或外部禁用，禁用按钮
          ]}
          onPress={handleSend}
          disabled={countdown > 0 || isSending || isDisabled} // 外部传入的 isDisabled 控制按钮禁用
        >
          <Text style={styles.buttonText}>
            {countdown > 0 ? `Wait ${countdown}` : isSending ? 'Sending...' : 'Send'} {/* 显示倒计时或发送状态 */}
          </Text>
        </TouchableOpacity>
      </View>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};


const styles = StyleSheet.create({
  all_container:{
    alignItems: 'center',
    width: '100%',
    marginBottom: 25
},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    height: 50, 
    backgroundColor: '#fff', 
    marginBottom: 5, 
    paddingLeft: 20, 
    borderRadius: 30, 
    fontSize: 14, 
    borderWidth: 1, 
    borderColor: '#E8E8E8', 
    elevation: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
  },
  input: {
    width: '64.5%',
  },   
  button: {
    padding: 10,
    width: '25%',
    borderRadius: 30, 
    borderColor: '#E8E8E8', 
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9', // 禁用时的按钮颜色
  },
  buttonText: {
    color: 'gray',
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  separator: {
    height: '80%',
    width: 1,
    backgroundColor: '#E8E8E8',
    marginRight: 10,
    marginLeft: 10,
    width: '0.5%'
  },
});

const InputStyles = StyleSheet.create(
    {
        container: {
            //justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: 25
        },
        input: {
            height: 50, 
            width: '95%',
            backgroundColor: '#fff', 
            marginBottom: 5, 
            paddingLeft: 20, 
            borderRadius: 30, 
            fontSize: 14, 
            borderWidth: 1, 
            borderColor: '#E8E8E8', 
            elevation: 1, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.1, 
            shadowRadius: 4, 
          },   
          searchinput: {
            flex: 1, 
            height: 47,
            backgroundColor: '#fff',
            fontSize: 14,
            borderTopLeftRadius: 15, 
            borderBottomLeftRadius: 15, 
          },
          inputContainer: {
            width: "75%",
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E8E8E8',
            borderRadius: 15,
            backgroundColor: 'white',
            paddingLeft: 30,
            elevation: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            justifyContent: 'center',
          },
          icon: {
            right: 10, 
            alignSelf: 'center', 
          },
      }
  );
        