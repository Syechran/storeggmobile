import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import MainNavigator from './src/navigation/MainNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <MainNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}