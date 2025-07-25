import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';

function RootNavigator() {
  const isAuthenticated = useSelector(state => state.loginReducer.isAuthenticated);

  return (
    <NavigationContainer>
      {/*{isAuthenticated ? <HomeNavigator /> : <AuthNavigator />}*/}
      <HomeNavigator />
    </NavigationContainer>
  );
}

export default RootNavigator;
