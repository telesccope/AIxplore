import React, { useEffect,useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getSystemReply, addMessage, removeChat,handleChatMessages } from '../actions/ChatAction';
import { HomeInputCard } from '../components/Card';
import ChatWindow from '../components/ChatWindow';
import { openCamera } from '../actions/CameraAction';
import { v4 as uuidv4 } from 'uuid';
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu } from 'react-native-paper';

const ChatScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const chatState = useSelector(state => state.chatReducer);
  const [photoUri, setPhotoUri] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
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
          <Menu.Item onPress={() => {}} title="Option 1" />
          <Menu.Item onPress={() => {}} title="Option 2" />
          <Menu.Item onPress={() => {}} title="Option 3" />
        </Menu>
      ),
    });
  }, [navigation, menuVisible]);

  //console.log("chatReducer state:", chatState);
  const currentChatId = useSelector(state => state.chatReducer.currentChatId);
  const currentMessages = useSelector(state => {
    const currentChat = state.chatReducer.chatWindows[state.chatReducer.currentChatId];
    return currentChat ? currentChat.messages : [];
  });
  //console.log("currentMessages", currentMessages);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      const isNewChat = currentMessages.length === 0;
      if (isNewChat) {
        dispatch(removeChat(currentChatId));
      }
    });

    return unsubscribe;
  }, [navigation, currentChatId, currentMessages, dispatch]);

  const handleNewChat = async (initialMessage) => {
    if (!initialMessage && !photoUri) {
      return;
    }
    console.log("initialMessage", initialMessage);
    try {
      console.log("Before userMessage log");
      const userMessage = initialMessage ? { id: uuidv4(), text: initialMessage, sender: 'user', type: 'text' } : null;
      console.log("userMessage", userMessage);
      dispatch(addMessage(currentChatId, userMessage));
      await handleChatMessages(currentChatId, userMessage, photoUri, dispatch);
    } catch (error) {
      console.error("Error in handleNewChat:", error);
    }    
  };

  // Wrapper function for sending messages
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
