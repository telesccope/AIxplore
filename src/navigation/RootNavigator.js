// navigation/RootNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen.js';
import RegisterScreen from '../screens/RegisterScreen';
import MapScreen from '../screens/MapScreen.js';
import HomeScreen from '../screens/HomeScreen.js';
import ChatScreen from '../screens/ChatScreen.js';
import ForgetScreen from '../screens/ForgetScreen.js';

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
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{title:'Create an account', headerTitleAlign: 'center'}} />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{title:'AIxplore', headerTitleAlign: 'center'}} />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{title:'AIxplore', headerTitleAlign: 'center'}} />
        <Stack.Screen 
          name="Forget" 
          component={ForgetScreen} 
          options={{title:'Forget', headerTitleAlign: 'center'}} />
        <Stack.Screen 
          name="Map" 
          component={MapScreen} 
          options={{headerTitleAlign: 'center', headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
