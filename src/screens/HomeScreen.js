import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { subscribeNotices } from '../services/noticeService';
import { categories } from '../constants/categories';
import { applyFilters, defaultFilters, activeFilterCount } from '../services/filterNotices';
import NoticeCard from '../components/NoticeCard';
import FilterModal from '../components/FilterModal';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { profile, user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('All');
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const unsub = subscribeNotices(
      (list) => {
        setNotices(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const name = profile?.name || user?.displayName || 'Neighbor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const count = activeFilterCount(filters);

  const data = applyFilters(notices, { search, category: selected, filters });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Avatar uri={profile?.photoURL} name={name} size={48} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>
            {greeting}, {name.split(' ')[0]}!
          </Text>
          <Text style={{ color: colors.subText }}>{profile?.community || ''}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Favourites')}
          style={[styles.bell, { backgroundColor: colors.card, borderColor: colors.border, marginRight: 8 }]}
        >
          <Ionicons name="heart-outline" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Alerts')}
          style={[styles.bell, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 14 }}>
        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.subText} />
          <TextInput
            style={{ flex: 1, marginLeft: 10, color: colors.text }}
            placeholder="Search notices..."
            placeholderTextColor={colors.subText}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.subText} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          style={[
            styles.filterBtn,
            { backgroundColor: count ? colors.primary : colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="options-outline" size={22} color={count ? '#fff' : colors.text} />
          {count ? (
            <View style={styles.badge}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{count}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', ...categories.map((c) => c.name)].map((c) => {
            const active = selected === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setSelected(c)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={[styles.section, { color: colors.text }]}>Recent Posts</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
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
              <Text style={{ color: colors.subText, marginTop: 10 }}>No notices found</Text>
            </View>
          }
        />
      )}

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  bell: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  search: {
    flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 14, paddingHorizontal: 14, height: 50,
  },
  filterBtn: {
    width: 50, height: 50, borderRadius: 14, borderWidth: 1, marginLeft: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: -6, right: -6, backgroundColor: '#EF4444',
    borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 16, height: 40, borderRadius: 20, borderWidth: 1,
    marginRight: 8, alignItems: 'center', justifyContent: 'center',
  },
  section: { fontSize: 20, fontWeight: '800', marginVertical: 12 },
});