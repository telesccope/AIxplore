import React from 'react';
import { FlatList, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import moment from 'moment';

export const ChatListItem = ({ chat, onSelect, onDelete, style }) => (
  <TouchableOpacity
    onPress={() => onSelect(chat.id)}
    style={[styles.buttonContainer, style]}
  >
    <View style={styles.textContainer}>
      <Text style={styles.buttonText}>{chat.name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.messageCount}>{chat.messages.length} messages</Text>
        <Text style={styles.lastUsed}>
          {moment(chat.lastUsed).fromNow()}
        </Text>
      </View>
    </View>
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => onDelete(chat.id)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const ChatList = ({ chats, onSelect, onDelete }) => {
    return (
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatListItem chat={item} onSelect={onSelect} onDelete={onDelete} />
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
    deleteButton: {
      backgroundColor: '#FF3B30',
      padding: 5,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
  
export default ChatList;
