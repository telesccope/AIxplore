import React from 'react';
import { Provider } from 'react-redux';
import RootNavigator from './src/navigation/RootNavigator.js';
import store from './store.js';

console.log("App component rendered0");

const App = () => {
  console.log("App component rendered");
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default App;
