import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { subscribeNotices } from '../services/noticeService';
import { getCategory } from '../constants/categories';
import { timeAgo } from '../services/format';

const defaultPrefs = { emergency: true, announcements: false, events: false, myNotices: true };
const WEEK = 7 * 86400000;

export default function AlertsScreen({ navigation }) {
  const { colors } = useTheme();
  const [notices, setNotices] = useState([]);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const load = () =>
      AsyncStorage.getItem('notifPrefs').then((v) => {
        setPrefs(v ? { ...defaultPrefs, ...JSON.parse(v) } : defaultPrefs);
      });
    load();
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const now = Date.now();
  const alerts = notices.filter((n) => {
    const created = n.createdAt && n.createdAt.toMillis ? n.createdAt.toMillis() : now;
    if (now - created > WEEK) return false;
    if (n.category === 'Emergency') return prefs.emergency;
    if (n.category === 'Announcements') return prefs.announcements;
    if (n.category === 'Events') return prefs.events;
    return false;
  });

  // Emergency alerts always first
  const sorted = [
    ...alerts.filter((n) => n.category === 'Emergency'),
    ...alerts.filter((n) => n.category !== 'Emergency'),
  ];

  const label = (cat) =>
    cat === 'Emergency' ? 'Emergency alert' : cat === 'Events' ? 'Event update' : 'Announcement';

  const extras = prefs.announcements || prefs.events;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Alerts</Text>
      <Text style={{ color: colors.subText, marginBottom: 16 }}>
        {extras
          ? 'Emergency notices plus the updates you turned on, from the last 7 days'
          : 'Emergency notices from the last 7 days'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const cat = getCategory(item.category);
            const emergency = item.category === 'Emergency';
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('NoticeDetails', { id: item.id })}
                style={[
                  styles.item,
                  {
                    backgroundColor: colors.card,
                    borderColor: emergency ? colors.danger : colors.border,
                    borderWidth: emergency ? 2 : 1,
                  },
                ]}
              >
                <View style={[styles.icon, { backgroundColor: cat.bg }]}>
                  <Ionicons name={cat.icon} size={22} color={cat.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      color: emergency ? colors.danger : colors.subText,
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    {label(item.category)} • {timeAgo(item.createdAt)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 2 }}
                  >
                    {item.title}
                  </Text>
                  <Text numberOfLines={1} style={{ color: colors.subText, marginTop: 2 }}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Ionicons name="shield-checkmark-outline" size={50} color={colors.subText} />
              <Text style={{ color: colors.subText, marginTop: 10 }}>No active alerts</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, padding: 14, marginBottom: 10,
  },
  icon: {
    width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
});