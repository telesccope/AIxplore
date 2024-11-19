import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export const QuestionCard = ({ question }) => {
  return (
    <LinearGradient
      colors={['#CFF5E0','#CFF5E0','#CFF5E0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.questionBackground}
    >
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question}</Text>
      </View>
    </LinearGradient>
  );
};

export const HomeInputCard = ({ onSend, onOpenCamera, photoUri }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!photoUri) {
      // Reset the text input if needed when photoUri changes
    }
  }, [photoUri]);

  const handleSend = () => {
    onSend(text);
    setText(''); // Clear the text input
  };

  return (
    <LinearGradient
      colors={['#CFF5E0', '#CFF5E0', '#CFF5E0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      <View style={styles.inputContainer}>
        {photoUri && (
          <View style={styles.thumbnailContainer}>
            <Image 
              source={{ uri: photoUri }} 
              style={styles.thumbnail} 
            />
          </View>
        )}
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Type your message..."
            value={text}
            onChangeText={setText}
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </View>
      <TouchableOpacity style={styles.cameraButton} onPress={onOpenCamera}>
        <Icon name="camera-outline" size={30} color="#000" />
      </TouchableOpacity>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  background: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: "100%",
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionBackground: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    height: '60%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    },
  inputContainer: {
    width: '100%',
  },
  thumbnailContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  thumbnail: {
    width: 70,
    height: 70,
  },
});
