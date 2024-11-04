import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadChatHistory = async () => {
  console.log('loadChatHistory called');
  try {
    const history = await AsyncStorage.getItem('chatHistory');
    console.log('Loaded chat history:', history);
    //return history ? JSON.parse(history) : [];
    return [];
  } catch (error) {
    console.error('Failed to load chat history', error);
    return [];
  }
};

export const getSystemReply = async (userMessage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userMessage.type === 'image') {
          resolve({
            type: 'text',
            text: 'Thanks for sending an image!',
          });
        } else {
          resolve({
            type: 'text',
            text: `Echo: ${userMessage.text}`,
          });
        }
      }, 1000); 
    });
  };
  
  