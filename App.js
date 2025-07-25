import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store.js';
import RootNavigator from './src/navigation/RootNavigator.js';
import { ActivityIndicator } from 'react-native';
import 'react-native-get-random-values';

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <PaperProvider>
          <RootNavigator />
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
