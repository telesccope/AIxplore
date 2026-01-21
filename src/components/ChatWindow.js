import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import Markdown from 'react-native-markdown-display';
import ImageViewing from 'react-native-image-viewing';

const ChatWindow = ({ messages = [] }) => {
  //console.log('chatwindow messages', messages);
  const flatListRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isUserMessage = item.role === 'user';
  
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.assistantMessage,
        ]}
      >
        {Array.isArray(item.content) ? (
          item.content.map((contentItem, index) => {
            if (contentItem.type === 'text') {
              // 渲染文本消息
              return (
                <Markdown
                  key={index}
                  style={isUserMessage ? styles.userText : styles.assistantText}
                >
                  {contentItem.text}
                </Markdown>
              );
            } else if (contentItem.type === 'image_url') {
              // 渲染图片消息
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedImage([{ uri: contentItem.image_url.url }]);
                    setIsVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: contentItem.image_url.url }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              );
            }
            return null; // 如果类型未知，不渲染
          })
        ) : (
          <Markdown
            style={isUserMessage ? styles.userText : styles.assistantText}
          >
            {typeof item.content === 'string' ? item.content : ''}
          </Markdown>
        )}
      </View>
    );
  };
  
  

  // Sort messages by timestamp
  const sortedMessages = messages
    .filter(item => item !== null)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  //console.log('sortedMessages', sortedMessages);

  return (
    <>
      <KeyboardAwareFlatList
        ref={flatListRef}
        data={sortedMessages}
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
    backgroundColor: '#e5e5ea',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  userText: {
    color: '#000',
    textAlign: 'justify'
  },
  assistantText: {
    color: '#000',
    textAlign: 'justify'
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
});

export default ChatWindow;
