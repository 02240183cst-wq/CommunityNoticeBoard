import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Avatar({ uri, name = '?', size = 48 }) {
  const { colors } = useTheme();
  const base = { width: size, height: size, borderRadius: size / 2 };
  if (uri) return <Image source={{ uri }} style={base} />;
  return (
    <View
      style={[
        base,
        { backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Text style={{ color: colors.primary, fontWeight: '800', fontSize: size * 0.4 }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}