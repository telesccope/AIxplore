import React from 'react';
import { FlatList, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import moment from 'moment';

export const ChatListItem = ({ chat, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(chat.id)}
    style={styles.buttonContainer}
  >
    <View style={styles.textContainer}>
      {/* 显示 chat.title */}
      <Text style={styles.buttonText}>{chat.title}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.messageCount}>{chat.messages.length} messages</Text>
        <Text style={styles.lastUsed}>
          {moment(chat.lastUsed).fromNow()}
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
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  buttonContainer: {
    marginVertical: 5,
    marginHorizontal: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
  },
  textContainer: {
    flexDirection: 'column',
  },
  buttonText: {
    color: '#fff',
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
