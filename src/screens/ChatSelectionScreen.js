import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ChatContext } from '../context/ChatContext';
import { loadChatHistory } from '../services/ChatService';
import ChatList from '../components/ChatList';
import moment from 'moment';

const ChatSelectionScreen = ({ navigation }) => {
  const { state, dispatch } = useContext(ChatContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await loadChatHistory();
        dispatch({ type: 'LOAD_HISTORY', payload: history });
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    fetchHistory();
  }, [dispatch]);

  const handleSelectChat = (chatId) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chatId });
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

    // Set current chat and navigate first
    dispatch({ type: 'SET_CURRENT_CHAT', payload: newChatId });
    navigation.navigate('ChatScreen');

    // Add the new chat after a short delay
    setTimeout(() => {
      dispatch({ type: 'ADD_CHAT', payload: newChat });
    }, 300); // Adjust delay as needed
  };
  
  const handleDeleteChat = (chatId) => {
    dispatch({ type: 'DELETE_CHAT', payload: chatId });
  };

  const chatWindows = state.chatState.chatWindows.map(chat => ({
    ...chat,
    lastUsed: chat.lastUsed || moment().toISOString(),
  }));

  return (
    <View style={styles.container}>
      {chatWindows && (
        <ChatList chats={chatWindows} onSelect={handleSelectChat} onDelete={handleDeleteChat} />
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

export default ChatSelectionScreen;
