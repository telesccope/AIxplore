import React from 'react';
import { FlatList, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import moment from 'moment';

export const ChatListItem = ({ chat, onSelect, style }) => (
  <TouchableOpacity
    onPress={() => onSelect(chat.id)}
    style={[styles.buttonContainer, style]}
  >
    <View style={styles.textContainer}>
      <Text style={styles.buttonText}>{chat.name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.messageCount}>{chat.messages.length} messages</Text>
        <Text style={styles.lastUsed}>
          {moment(chat.lastUsed).fromNow()} {/* 格式化时间 */}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

  const ChatList = ({ chats, onSelect }) => {
    return (
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatListItem chat={item} onSelect={onSelect} />
        )}
      />
    );
  };

const styles = StyleSheet.create({
    buttonContainer: {
      marginVertical: 10,
      width: '80%',
      alignSelf: 'center',
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
    },
    textContainer: {
      flexDirection: 'column',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5,
    },
    messageCount: {
      color: '#fff',
      fontSize: 12,
    },
    lastUsed: {
      color: '#fff',
      fontSize: 12,
    },
  });
  
export default ChatList;
