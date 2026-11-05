import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import { subscribeNotices } from '../services/noticeService';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, profile, logout } = useAuth();
  const { favIds } = useFavourites();
  const [myCount, setMyCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeNotices(
      (list) => setMyCount(list.filter((n) => n.authorId === user.uid).length),
      () => {}
    );
    return unsub;
  }, [user.uid]);

  const name = profile?.name || user?.displayName || 'Neighbor';

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const Item = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Ionicons name={icon} size={22} color={danger ? colors.danger : colors.primary} />
      <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600',
        color: danger ? colors.danger : colors.text }}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={20} color={colors.subText} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

      <View style={styles.center}>
        <View style={{ marginBottom: 12 }}>
          <Avatar uri={profile?.photoURL} name={name} size={100} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={{ color: colors.subText }}>{user?.email}</Text>
        <Text style={{ color: colors.subText, marginTop: 2 }}>{profile?.community}</Text>
        {profile?.bio ? (
          <Text style={{ color: colors.text, marginTop: 10, textAlign: 'center' }}>
            {profile.bio}
          </Text>
        ) : null}
      </View>

      <View style={styles.stats}>
        <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{myCount}</Text>
          <Text style={{ color: colors.subText }}>My Notices</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{favIds.length}</Text>
          <Text style={{ color: colors.subText }}>Favourites</Text>
        </View>
      </View>

      <Item icon="person-outline" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
      <Item icon="document-text-outline" label="My Notices" onPress={() => navigation.navigate('MyNotices')} />
      <Item icon="heart-outline" label="Favourites" onPress={() => navigation.navigate('Favourites')} />
      <Item icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
      <Item icon="log-out-outline" label="Logout" onPress={confirmLogout} danger />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  center: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 24, fontWeight: '800' },
  stats: { flexDirection: 'row', marginBottom: 20 },
  stat: {
    flex: 1, borderWidth: 1, borderRadius: 16, padding: 16,
    alignItems: 'center', marginHorizontal: 5,
  },
  statNum: { fontSize: 26, fontWeight: '800' },
  item: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 14, padding: 16, marginBottom: 10,
  },
});