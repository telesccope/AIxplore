import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView,} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadChatHistory, setCurrentChat,  deleteChat, addChat,handleChatMessages, handleChatTitleAndCategory } from '../../actions/ChatAction';
import { userLogout } from '../../actions/UserAction';
import ChatList from '../../components/ChatList';
import { QuestionCard,HomeInputCard } from '../../components/Card';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';
import { openCamera } from '../../actions/CameraAction';
import CustomMenu from '../../components/CustomMenu';
import { v4 as uuidv4 } from 'uuid';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const chatWindows = useSelector(state => state.chatReducer.chatWindows);
  const [photoUri, setPhotoUri] = useState(null);
  const [message, setMessage] = useState('');
  
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    try {
      await dispatch(userLogout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  const menuItems = [
    //{ title: 'View Details', onPress: () => console.log('View Details pressed') },
    { title: 'Share', onPress: () => console.log('Share pressed') },
    { title: 'Report', onPress: () => console.log('Report pressed') },
    //{ title: 'Logout', onPress: handleLogout },
  ];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CustomMenu menuItems={menuItems} />,
    });
  }, [navigation, menuItems]);

  const handleSelectChat = (chatId) => {
    dispatch(setCurrentChat(chatId));
    navigation.navigate('Chat', { chatId }); 
  };  

  const handleNewChat = async (chatId, initialMessage, photoUri, dispatch, navigation) => {
    console.log('***handleNewChat called with chatId:', chatId, 'initialMessage:', initialMessage, 'photoUri:', photoUri);
    if (!photoUri) 
      return;
    // 创建新的聊天

    const newChat = {
      id: chatId,
      title: 'New Chat',
      category: 'general',
      lastUsed: new Date().toISOString(),
      messages: [],
    };
    console.log('handleNewChat called with chatId:', chatId, 'initialMessage:', initialMessage, 'photoUri:', photoUri);
    // 添加新聊天并设置为当前聊天
    dispatch(addChat(newChat));
    dispatch(setCurrentChat(chatId));
  
    // 导航到聊天屏幕
    navigation.navigate('Chat', { chatId: chatId });
  
    // 处理聊天消息
    await dispatch(handleChatMessages(chatId, initialMessage, photoUri));
  };
  
  const handleDeleteChat = (chatId) => {
    //console.log('Deleting chat with ID:', chatId);
    dispatch(deleteChat(chatId));
  };
  
  const handleCameraOpen = async () => {
    const uri = await openCamera();
    console.log('Camera opened, URI:', uri); 
    if (uri) {
      console.log('Camera URI:', uri);
      setPhotoUri(uri);
      const chatId = uuidv4();
      console.log('calling handleNewChat with chatId:', chatId, 'message:', '', 'uri:', uri);
      handleNewChat(chatId, message, uri, dispatch, navigation);
      /*
      setTimeout(() => {
        dispatch(handleChatTitleAndCategory(chatId, message));
      }, 1000);*/
    }
    else{
      console.log('No photo taken or camera operation cancelled');
    }
};

  console.log('chatWindows', chatWindows, Object.values(chatWindows));
  const chatsWithLastUsed = Object.values(chatWindows).map(chat => ({
    ...chat,
    lastUsed: chat.lastUsed || moment().toISOString(),
  }));
  
  

  return (
    <KeyboardAvoidingView style={styles.container} behavior='height'>
      {/*
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

        {/* 放大按钮覆盖在地图右下角 
        <TouchableOpacity 
          style={styles.zoomButton}
          onPress={() => navigation.navigate('Map')} // 替换为跳转或其他功能
        >
          <Text style={styles.zoomButtonText}>⊕</Text>
        </TouchableOpacity>
      </View>
      */}
      {/* 两个问题卡片 
      <View style={styles.questionContainer}>
        <QuestionCard question='Any good restaurant near by?'></QuestionCard>
        <QuestionCard question='Tell me more about The British Museum.'></QuestionCard>
      </View>
        */}

      <View style={styles.chatListContainer}>
        <ChatList 
          chats={chatsWithLastUsed} 
          onSelect={handleSelectChat} 
          onDelete={handleDeleteChat} 
        />
      </View>
      <View style={styles.newChatContainer}>
        <HomeInputCard 
          //onSend={handleSend}
          onOpenCamera={handleCameraOpen}
          photoUri={photoUri}
          />
      </View>
    </KeyboardAvoidingView>
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
      width: '100%', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: 30, 
  },  
    chatListContainer: {
      flex: 4, 
      width: '100%',
    },
  newChatContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
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
    position: 'absolute', 
    bottom: 10,          
    right: 10,          
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
