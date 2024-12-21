import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CustomMenu from '../components/CustomMenu';
import Icon from 'react-native-vector-icons/Ionicons';

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const chatWindows = useSelector(state => state.chatReducer.chatWindows);

  const handleNavigateToChat = (chatId) => {
    navigation.navigate('Chat', { chatId });
  };

  // 定义菜单项
  const menuItems = [
    { title: 'Settings', onPress: () => navigation.navigate('Settings') },
    { title: 'Profile', onPress: () => navigation.navigate('Profile') }
  ];

  //console.log(Object.entries(chatWindows), 'customDrawer');

  return (
    <DrawerContentScrollView {...props}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Chat History</Text>
        <CustomMenu menuItems={menuItems} />
      </View>
      
      {/* Chat Items */}
      {Object.entries(chatWindows).map(([_, chat]) => {
        //console.log(chat, 'chatwindowsdrawer');

        // 如果 title 存在且是字符串，显示 title；否则显示 "New Chat"
        const label = typeof chat.title === 'string' && chat.title.trim() !== '' 
          ? chat.title.replace(/^"|"$/g, '') 
          : 'New Chat';

        return (
          <DrawerItem
            key={chat.id} // 使用 chat.id 作为唯一键
            label={label}
            onPress={() => handleNavigateToChat(chat.id)} // 传递 chat.id
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
