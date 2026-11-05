import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { subscribeNotices } from '../services/noticeService';
import { categories } from '../constants/categories';

export default function CategoriesScreen({ navigation }) {
  const { colors } = useTheme();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const unsub = subscribeNotices(setNotices, () => {});
    return unsub;
  }, []);

  const countOf = (name) => notices.filter((n) => n.category === name).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.name}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CategoryNotices', { category: c.name })}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.icon, { backgroundColor: c.bg }]}>
                <Ionicons name={c.icon} size={26} color={c.color} />
              </View>
              <Text style={[styles.name, { color: colors.text }]}>{c.name}</Text>
              <Text style={{ color: colors.subText }}>{countOf(c.name)} posts</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 14,
  },
  icon: {
    width: 52, height: 52, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginBottom: 14,
  },
  name: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
});