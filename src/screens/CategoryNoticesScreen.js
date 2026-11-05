import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { subscribeNotices } from '../services/noticeService';
import NoticeCard from '../components/NoticeCard';

export default function CategoryNoticesScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { category } = route.params;
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeNotices(
      (list) => {
        setNotices(list.filter((n) => n.category === category));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [category]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{category}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NoticeCard
              notice={item}
              onPress={() => navigation.navigate('NoticeDetails', { id: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Ionicons name="document-text-outline" size={50} color={colors.subText} />
              <Text style={{ color: colors.subText, marginTop: 10 }}>No notices in this category</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 60 },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800' },
});