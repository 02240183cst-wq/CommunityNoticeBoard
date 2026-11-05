import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PlaceholderScreen({ route }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700' }}>{route.name}</Text>
      <Text style={{ color: colors.subText, marginTop: 6 }}>Coming soon</Text>
    </View>
  );
}