import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadChatHistory, setCurrentChat, addChat, deleteChat } from '../actions/ChatAction';
import ChatList from '../components/ChatList';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const chatWindows = useSelector(state => state.chatWindows);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await dispatch(loadChatHistory());
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    fetchHistory();
  }, [dispatch]);

  const handleSelectChat = (chatId) => {
    dispatch(setCurrentChat(chatId));
    navigation.navigate('ChatScreen');
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      name: 'New Chat',
      messages: [],
      lastUsed: moment().toISOString(),
    };

    dispatch(setCurrentChat(newChatId));
    navigation.navigate('ChatScreen');

    setTimeout(() => {
      dispatch(addChat(newChat));
    }, 300);
  };

  const handleDeleteChat = (chatId) => {
    dispatch(deleteChat(chatId));
  };

  const chatsWithLastUsed = chatWindows.map(chat => ({
    ...chat,
    lastUsed: chat.lastUsed || moment().toISOString(),
  }));

  return (
    <View style={styles.container}>
      {chatsWithLastUsed && (
        <ChatList chats={chatsWithLastUsed} onSelect={handleSelectChat} onDelete={handleDeleteChat} />
      )}
      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
        <Text style={styles.newChatButtonText}>+ New Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
