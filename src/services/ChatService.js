import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadChatHistory = async () => {
  console.log('loadChatHistory called');
  try {
    const history = await AsyncStorage.getItem('chatHistory');
    console.log('Loaded chat history:', history);
    return [];
  } catch (error) {
    console.error('Failed to load chat history', error);
    return [];
  }
};

export const getSystemReply = async (chatMessages) => {
  chatMessages.forEach((msg, index) => {
    console.log(`Message ${index}:`, msg);
    console.log(`Keys:`, Object.keys(msg));
  });

  const url = 'http://3.80.143.117:3000/v1/chat/completions';
  const headers = { 'Content-Type': 'application/json' };

  const messages = chatMessages.map(msg => {
    if (msg.type === 'image') {
      const imgType = 'image/jpeg';
      const imgB64Str = msg.content.split(',')[1];

      return {
        role: msg.role,
        content: [
          { type: 'text', text: 'Describe the image' },
          {
            type: 'image_url',
            image_url: { url: `data:${imgType};base64,${imgB64Str}` }
          }
        ]
      };
    } else {
      return {
        role: msg.role,
        content: msg.content
      };
    }
  });

  const data = {
    model: 'chatgpt-4o-latest',
    messages: messages
  };

  console.log('Data sent to backend:', JSON.stringify(data, null, 2));

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });
  console.log('Response:', response);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const responseData = await response.json();
  return {
    type: 'text',
    text: responseData.choices[0]?.message?.content || "No response"
  };
};