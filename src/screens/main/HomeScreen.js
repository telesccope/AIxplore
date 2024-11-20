import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadChatHistory, setCurrentChat, addChat, deleteChat, getSystemReply,addMessage,addNewChat,handleChatMessages } from '../../actions/ChatAction';
import ChatList from '../../components/ChatList';
import { QuestionCard,HomeInputCard } from '../../components/Card';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';
import { openCamera } from '../../actions/CameraAction';
import CustomMenu from '../../components/CustomMenu';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const chatWindows = useSelector(state => state.chatReducer.chatWindows);
  const [photoUri, setPhotoUri] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);

  const menuItems = [
    { title: 'View Details', onPress: () => console.log('View Details pressed') },
    { title: 'Share', onPress: () => console.log('Share pressed') },
    { title: 'Report', onPress: () => console.log('Report pressed') },
  ];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CustomMenu menuItems={menuItems} />,
    });
  }, [navigation, menuItems]);

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
    navigation.navigate('Chat', { chatId }); // Pass chatId as a parameter
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
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject} // 地图填充整个 mapContainer 区域
          initialRegion={{
            latitude: 51.52155784686501,
            longitude: -0.13736509439905842,
            latitudeDelta: 0.02522,
            longitudeDelta: 0.0821,
          }}
        >
          <Marker
            coordinate={{ latitude: 51.52155784686501, longitude: -0.13736509439905842 }}
            title="My Marker"
            description="Some description"
          />
        </MapView>

        {/* 放大按钮覆盖在地图右下角 */}
        <TouchableOpacity 
          style={styles.zoomButton}
          onPress={() => navigation.navigate('Map')} // 替换为跳转或其他功能
        >
          <Text style={styles.zoomButtonText}>⊕</Text>
        </TouchableOpacity>
      </View>

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
      height: '30%', 
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
    marginVertical: 10,
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
  zoomButton: {
    position: 'absolute', // 定位到 mapContainer 的右下角
    bottom: 10,          // 距离底部 10 像素
    right: 10,           // 距离右边 10 像素
    opacity: 0.8,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 10,
  },
  zoomButtonText: {
    color: '#black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
