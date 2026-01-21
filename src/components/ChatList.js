import React from 'react';
import { FlatList, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native';

export const ChatListItem = ({ chat, onSelect }) => {
  console.log('ChatListItem', JSON.stringify(chat, null, 2));

  const imageMessage = chat.messages?.[0]?.content?.find(
    item => item.type === 'image_url'
  );
  const imageUrl = imageMessage?.image_url?.url;

  return (
    <TouchableOpacity
      onPress={() => onSelect(chat.id)}
      style={styles.itemContainer}
    >
      <Image
        source={imageUrl ? { uri: imageUrl } : require('../../assets/logo.jpg')}
        style={styles.image}
      />
      <Text style={styles.title}>{chat.title}</Text>
    </TouchableOpacity>
  );
};

const ChatList = ({ chats, onSelect }) => {
  console.log('ChatList', chats);
  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ChatListItem chat={item} onSelect={onSelect} />
      )}
      contentContainerStyle={styles.listContainer}
      numColumns={3} // 每行三个
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
  image: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginRight: 10,
  },
  title: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
    flexWrap: 'wrap', 
  },
  itemContainer:{
    width: '30%', 
    alignItems: 'center',
  }

});

export default ChatList;
