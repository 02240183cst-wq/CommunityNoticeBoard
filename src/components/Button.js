import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Button({ title, onPress, loading, outline, color, style }) {
  const { colors } = useTheme();
  const bg = color || colors.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      style={[
        styles.btn,
        outline
          ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: bg }
          : { backgroundColor: bg },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? bg : '#fff'} />
      ) : (
        <Text style={[styles.text, { color: outline ? bg : '#fff' }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 16, fontWeight: '700' },
});