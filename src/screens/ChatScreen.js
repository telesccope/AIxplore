import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useDispatch, useSelector } from 'react-redux';
import { getSystemReply, addMessage, removeChat } from '../actions/ChatAction';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import CameraButton from '../components/CameraButton';
import { readFile } from 'react-native-fs';
import uuid from 'react-native-uuid';

const ChatScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentChatId = useSelector(state => state.currentChatId);
  const currentMessages = useSelector(state =>
    state.chatWindows.find(chat => chat.id === currentChatId)?.messages || []
  );
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      const isNewChat = currentMessages.length === 0;
      if (!messageSent && isNewChat) {
        dispatch(removeChat(currentChatId));
      }
    });

    return unsubscribe;
  }, [navigation, messageSent, currentChatId, currentMessages, dispatch]);

  const handleSend = async (text) => {
    if (!currentChatId) return;

    setMessageSent(true);

    const userMessage = { id: uuid.v4(), text, sender: 'user' };

    dispatch(addMessage(currentChatId, userMessage));

    const chatMessages = currentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'system',
      content: msg.text || msg.uri,
      type: msg.type || 'text'
    }));

    chatMessages.push({
      role: 'user',
      content: text,
      type: 'text'
    });

    const systemReply = await getSystemReply(chatMessages);

    dispatch(addMessage(currentChatId, { ...systemReply, id: uuid.v4(), sender: 'system' }));
  };

  const handleCameraOpen = async () => {
    let permission;

    if (Platform.OS === 'android') {
      permission = await check(PERMISSIONS.ANDROID.CAMERA);
    } else {
      permission = await check(PERMISSIONS.IOS.CAMERA);
    }

    if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
      let requestResult;

      if (Platform.OS === 'android') {
        requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      } else {
        requestResult = await request(PERMISSIONS.IOS.CAMERA);
      }

      if (requestResult !== RESULTS.GRANTED) {
        console.warn('Camera permission denied');
        return;
      }
    } else if (permission !== RESULTS.GRANTED) {
      console.warn('Camera permission not granted');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
      },
      async (response) => {
        if (response.didCancel || response.errorCode) {
          console.warn('Camera operation cancelled or failed');
          return;
        }

        const { assets } = response;
        if (assets && assets.length > 0) {
          const { uri } = assets[0];

          try {
            const base64Image = await readFile(uri, 'base64');
            const photoMessage = {
              id: uuid.v4(),
              uri: `data:image/jpeg;base64,${base64Image}`,
              sender: 'user',
              type: 'image'
            };

            dispatch(addMessage(currentChatId, photoMessage));
            setMessageSent(true);

            const chatMessages = currentMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'system',
              content: msg.text || msg.uri,
              type: msg.type || 'text'
            }));

            chatMessages.push({
              role: 'user',
              content: `data:image/jpeg;base64,${base64Image}`,
              type: 'image'
            });

            const systemReply = await getSystemReply(chatMessages);

            dispatch(addMessage(currentChatId, { ...systemReply, id: uuid.v4(), sender: 'system' }));
          } catch (error) {
            console.error('Error reading file:', error);
          }
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <ChatWindow messages={currentMessages} />
      <CameraButton onPress={handleCameraOpen} />
      <View style={styles.inputContainer}>
        <MessageInput onSend={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ChatScreen;
