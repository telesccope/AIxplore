import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TextInput, Button, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export const QuestionCard = ({ question }) => {
  return (
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question}</Text>
      </View>
  );
};

export const HomeInputCard = ({ onSend, onOpenCamera, photoUri }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!photoUri) {
      // Reset the text input if needed when photoUri changes
    }
  }, [photoUri]);

  const handleSend = () => {
    onSend(text);
    setText(''); // Clear the text input
  };

  return (
    <LinearGradient
      colors={['#dfdfdf', '#dfdfdf', '#efefef']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.fullTextInput}
          multiline
          placeholder="Type your message..."
          value={text}
          onChangeText={setText}
          placeholderTextColor="#555555"
        />
        {photoUri && (
          <Image 
            source={{ uri: photoUri }} 
            style={styles.thumbnail} 
          />
        )}
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Icon name="send-outline" size={25} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cameraButton} onPress={onOpenCamera}>
        <Icon name="camera-outline" size={30} color="#000" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
    height: '90%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionContainer: {
    width: '45%',
    height: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#D3D3D3', // 使用亮灰色作为背景
    borderRadius: 10, // 设置圆角的弧度（值越大，弧度越圆）
    padding: 5, // 添加内边距，使内容与边框有间距
},
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    flex: 1,
  },
  fullTextInput: {
    padding: 10,
    borderRadius: 10,
  },
  thumbnail: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  sendButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

