import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function Input({ label, icon, secure, ...props }) {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
      <View
        style={[
          styles.box,
          { backgroundColor: colors.inputBg, borderColor: colors.border },
        ]}
      >
        {icon ? <Ionicons name={icon} size={20} color={colors.subText} /> : null}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.subText}
          secureTextEntry={hidden}
          autoCapitalize="none"
          {...props}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.subText}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
});