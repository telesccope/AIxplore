import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadChatHistory, setCurrentChat, addChat, deleteChat, getSystemReply,addMessage,addNewChat,handleChatMessages } from '../actions/ChatAction';
import ChatList from '../components/ChatList';
import { QuestionCard,HomeInputCard } from '../components/Card';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';
import { openCamera } from '../actions/CameraAction';
import { Menu, Provider, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const chatWindows = useSelector(state => state.chatReducer.chatWindows);
  const [photoUri, setPhotoUri] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Icon
              name="ellipsis-vertical"
              size={24}
              onPress={() => setMenuVisible(true)}
              style={{ marginRight: 10 }}
            />
          }
        >
          <Menu.Item onPress={() => {}} title="View Details" />
          <Menu.Item onPress={() => {}} title="Share" />
          <Menu.Item onPress={() => {}} title="Report" />
        </Menu>
      ),
    });
  }, [navigation, menuVisible]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await dispatch(loadChatHistory());
      } catch (error) {
        //console.error('Error loading chat history:', error);
      }
    };
    fetchHistory();
  }, [dispatch]);

  const handleSelectChat = (chatId) => {
    dispatch(setCurrentChat(chatId));
    navigation.navigate('Chat');
  };

  const handleNewChat = async (initialMessage, photoUri, dispatch, navigation) => {
    ////console.log("PhotoUri", photoUri);
    if (!initialMessage && !photoUri) {
      return;
    }
    const { newChatId, userMessage } = addNewChat(initialMessage, dispatch, navigation);
    console.log("userMessage", userMessage);
    await handleChatMessages(newChatId, userMessage, photoUri, dispatch);
  };

  const handleNewChatWrapper = (initialMessage) => {
    handleNewChat(initialMessage, photoUri, dispatch, navigation);
  };

  const handleSend = (message) => {
    handleNewChatWrapper(message);
    setPhotoUri(null);
  };
  
  const handleDeleteChat = (chatId) => {
    //console.log('Deleting chat with ID:', chatId);
    dispatch(deleteChat(chatId));
  };
  
  const handleCameraOpen = async () => {
    const uri = await openCamera();
    if (uri) {
      setPhotoUri(uri);
    }
  };


  const chatsWithLastUsed = Object.values(chatWindows).map(chat => ({
    ...chat,
    lastUsed: chat.lastUsed || moment().toISOString(),
  }));
  

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapContainer}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="My Marker"
          description="Some description"
        />
      </MapView>

      <View style={styles.questionContainer}>
        <QuestionCard question='Any good restaurant near by?'></QuestionCard>
        <QuestionCard question='Tell me more about The British Museum.'></QuestionCard>
      </View>

      <View style={styles.chatListContainer}>
        <ChatList 
          chats={chatsWithLastUsed} 
          onSelect={handleSelectChat} 
          onDelete={handleDeleteChat} 
        />
      </View>
      <View style={styles.newChatContainer}>
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
    flexDirection: 'column',
    flex: 1,
    },
    mapContainer: {
      flex: 1, 
    },
    questionContainer: {
      flex: 2, 
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    chatListContainer: {
      flex: 4, 
    },
  newChatContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    flex: 2,
  },
  newChatButton: {
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: '#007aff',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,

  },
  newChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
