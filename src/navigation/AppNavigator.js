import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatSelectionScreen from '../screens/ChatSelectionScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ChatSelection">
      <Stack.Screen name="ChatSelection" component={ChatSelectionScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
