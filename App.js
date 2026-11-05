import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { FavouritesProvider } from './src/context/FavouritesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavouritesProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </FavouritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}