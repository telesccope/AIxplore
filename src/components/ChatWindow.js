import React, { useRef, useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import ImageViewing from 'react-native-image-viewing';
import Markdown from 'react-native-markdown-display';

const ChatWindow = ({ messages }) => {
  const flatListRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isUserMessage = item.sender === 'user';

    const handleImagePress = () => {
      if (item.type === 'image') {
        setSelectedImage([{ uri: `file://${item.uri}` }]);
        setIsVisible(true);
      }
    };

    console.log('item', item);

    return (
      <View style={[styles.messageContainer, isUserMessage ? styles.userMessage : styles.systemMessage]}>
        {item.type === 'image' ? (
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={{ uri: `file://${item.uri}` }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <Markdown style={isUserMessage ? styles.userText : styles.systemText}>
            {item.text}
          </Markdown>
        )}
      </View>
    );
  };

  return (
    <>
      <KeyboardAwareFlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <ImageViewing
        images={selectedImage || []}
        imageIndex={0}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff',
  },
  systemMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  userText: {
    color: '#fff',
  },
  systemText: {
    color: '#000',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
});

export default ChatWindow;
