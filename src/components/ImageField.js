import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { pickImage } from '../services/imageService';

export default function ImageField({ value, onChange }) {
  const { colors } = useTheme();

  const take = async () => {
    const img = await pickImage({ camera: true });
    if (img) onChange(img);
  };
  const choose = async () => {
    const img = await pickImage({ camera: false });
    if (img) onChange(img);
  };

  const Btn = ({ icon, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={{ color: colors.text, fontWeight: '600', marginLeft: 8 }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.label, { color: colors.text }]}>Image (optional)</Text>
      {value ? (
        <View style={{ marginBottom: 10 }}>
          <Image source={{ uri: value }} style={styles.preview} />
          <TouchableOpacity style={styles.remove} onPress={() => onChange('')}>
            <Ionicons name="close-circle" size={30} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Btn icon="camera-outline" label="Camera" onPress={take} />
        <Btn icon="images-outline" label="Gallery" onPress={choose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  preview: { width: '100%', height: 200, borderRadius: 14 },
  remove: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', borderRadius: 15 },
  btn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderWidth: 1, borderRadius: 14, marginRight: 8,
  },
});