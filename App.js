import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { ConnectivityProvider } from './src/context/ConnectivityContext';
import { AuthProvider } from './src/context/AuthContext';
import { FavouritesProvider } from './src/context/FavouritesContext';
import AppNavigator from './src/navigation/AppNavigator';
import OfflineBanner from './src/components/OfflineBanner';
import NotificationWatcher from './src/components/NotificationWatcher';

export default function App() {
  return (
    <ThemeProvider>
      <ConnectivityProvider>
        <AuthProvider>
          <FavouritesProvider>
            <StatusBar style="auto" />
            <View style={{ flex: 1 }}>
              <AppNavigator />
              <OfflineBanner />
            </View>
            <NotificationWatcher />
          </FavouritesProvider>
        </AuthProvider>
      </ConnectivityProvider>
    </ThemeProvider>
  );
}