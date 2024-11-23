import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getSystemReply, addMessage, removeChat, handleChatMessages, deleteChat } from '../../actions/ChatAction';
import { HomeInputCard } from '../../components/Card';
import ChatWindow from '../../components/ChatWindow';
import { openCamera } from '../../actions/CameraAction';
import { v4 as uuidv4 } from 'uuid';
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu } from 'react-native-paper';
import { setCurrentChat } from '../../actions/ChatAction';

const ChatScreen = ({ navigation, route }) => {
  console.log('route', route);
  const dispatch = useDispatch();
  const { chatId } = route.params;
  console.log('chatId', chatId);
  const chatState = useSelector(state => state.chatReducer);
  console.log('chatState', chatState);

  const chatwindow = chatState.chatWindows 
    ? Object.values(chatState.chatWindows).find(window => window.id === chatId)
    : null;

  console.log('chatwindow', chatwindow);

  const currentMessages = chatwindow ? chatwindow.messages : [];
  console.log('currentMessages', currentMessages);



  const [photoUri, setPhotoUri] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (chatId) {
      dispatch(setCurrentChat(chatId));
    }
  }, [chatId, dispatch]);

  React.useLayoutEffect(() => {
    const title = chatwindow ? chatwindow.title.replace(/^"|"$/g, '') : 'Chat';
  
    navigation.setOptions({
      headerTitle: title, // Set the title from chatwindow
      headerLeft: () => (
        <Icon
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        />
      ),
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Icon
              name="ellipsis-vertical"
              size={24}
              onPress={() => setMenuVisible(true)}
              style={{ marginRight: 10 }}
            />
          }
        >
        <Menu.Item onPress={() => { setMenuVisible(false); /* Option 1 action */ }} title="Option 1" />
        <Menu.Item onPress={() => { setMenuVisible(false); /* Option 2 action */ }} title="Option 2" />
        <Menu.Item onPress={() => { setMenuVisible(false); handleDeleteChat(); }} title="Delete Chat" />
        </Menu>
      ),
    });
  }, [navigation, menuVisible, chatwindow]);
  

  const handleDeleteChat = () => {
    dispatch(deleteChat(chatId));
    navigation.navigate('Home');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      const isNewChat = currentMessages.length === 0;
      if (isNewChat) {
        dispatch(removeChat(chatId));
      }
    });

    return unsubscribe;
  }, [navigation, chatId, currentMessages, dispatch]);

  const handleNewChat = async (initialMessage) => {
    if (!initialMessage && !photoUri) {
      return;
    }
    try {
      const userMessage = initialMessage ? { id: uuidv4(), content: initialMessage, role: 'user', type: 'text' } : null;
      dispatch(addMessage(chatId, userMessage));
      await handleChatMessages(chatId, userMessage, photoUri, dispatch);
    } catch (error) {
      console.error("Error in handleNewChat:", error);
    }    
  };

  const handleSend = (message) => {
    handleNewChat(message);
    setPhotoUri(null);
  };

  const handleCameraOpen = async () => {
    const uri = await openCamera();
    if (uri) {
      setPhotoUri(uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatwindowContainer}>
        <ChatWindow messages={currentMessages} />
      </View>
      <View style={styles.inputContainer}>
        <HomeInputCard 
            onSend={handleSend} 
            onOpenCamera={handleCameraOpen}
            photoUri={photoUri}
            />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatwindowContainer: {
    flex: 7,
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    flex: 2,
  },
});

export default ChatScreen;
