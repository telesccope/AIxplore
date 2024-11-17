// navigation/RootNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen.js';

const Stack = createStackNavigator();
function RootNavigator() {
  console.log("navigation","RootNavigator")
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{title:'Login', headerTitleAlign: 'center',
          headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
