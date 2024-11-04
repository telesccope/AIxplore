import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatSelectionScreen from './src/screens/ChatSelectionScreen';
import ChatScreen from './src/screens/ChatScreen';
import { ChatProvider } from './src/context/ChatContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ChatProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ChatSelection">
          <Stack.Screen name="ChatSelection" component={ChatSelectionScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ChatProvider>
  );
};

export default App;
