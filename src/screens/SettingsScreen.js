import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  defaultPrefs, loadPrefs, requestNotificationPermission, sendLocalNotification,
} from '../services/notificationService';

export default function SettingsScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, resetPassword, logout } = useAuth();
  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    loadPrefs().then(setPrefs);
  }, []);

  const setPref = async (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    await AsyncStorage.setItem('notifPrefs', JSON.stringify(next));
    if (value) {
      const ok = await requestNotificationPermission();
      if (!ok) {
        Alert.alert(
          'Notifications blocked',
          'Allow notifications for this app in your phone settings to receive alerts.'
        );
      }
    }
  };

  const testNotification = async () => {
    const ok = await requestNotificationPermission();
    if (!ok) {
      Alert.alert(
        'Notifications blocked',
        'Allow notifications for this app in your phone settings first.'
      );
      return;
    }
    await sendLocalNotification(
      'EMERGENCY: Road closed near market',
      'This is a test alert from Community Notice Board.'
    );
  };

  const handlePasswordReset = async () => {
    try {
      await resetPassword(user.email);
      Alert.alert('Email sent', 'Check your inbox for the password reset link.');
    } catch (e) {
      Alert.alert('Error', 'Could not send the reset email.');
    }
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const Section = ({ title }) => (
    <Text style={[styles.section, { color: colors.subText }]}>{title}</Text>
  );

  const SwitchRow = ({ icon, label, value, onChange }) => (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: colors.text }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.primary }} />
    </View>
  );

  const PressRow = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Ionicons name={icon} size={22} color={danger ? colors.danger : colors.primary} />
      <Text
        style={{
          flex: 1, marginLeft: 12, fontSize: 16,
          color: danger ? colors.danger : colors.text,
        }}
      >
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
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <Section title="APPEARANCE" />
      <SwitchRow icon="moon-outline" label="Dark mode" value={isDark} onChange={toggleTheme} />

      <Section title="NOTIFICATIONS" />
      <SwitchRow
        icon="warning-outline"
        label="Emergency alerts"
        value={prefs.emergency}
        onChange={(v) => setPref('emergency', v)}
      />
      <SwitchRow
        icon="megaphone-outline"
        label="New announcements"
        value={prefs.announcements}
        onChange={(v) => setPref('announcements', v)}
      />
      <SwitchRow
        icon="calendar-outline"
        label="Event updates"
        value={prefs.events}
        onChange={(v) => setPref('events', v)}
      />
      <SwitchRow
        icon="document-text-outline"
        label="Updates to my notices"
        value={prefs.myNotices}
        onChange={(v) => setPref('myNotices', v)}
      />
      <Text style={{ color: colors.subText, fontSize: 12, marginTop: 4, marginBottom: 8 }}>
        Emergency alerts are on by default. Turn on the others if you also want them.
      </Text>
      <PressRow
        icon="notifications-outline"
        label="Send test notification"
        onPress={testNotification}
      />

      <Section title="ACCOUNT" />
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="mail-outline" size={22} color={colors.primary} />
        <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: colors.text }}>
          {user?.email}
        </Text>
      </View>
      <PressRow
        icon="person-outline"
        label="Edit profile"
        onPress={() => navigation.navigate('EditProfile')}
      />
      <PressRow icon="key-outline" label="Change password" onPress={handlePasswordReset} />

      <Section title="PRIVACY & ABOUT" />
      <PressRow
        icon="shield-checkmark-outline"
        label="Privacy"
        onPress={() =>
          Alert.alert(
            'Privacy',
            'Your name and community are shown on notices you post. Your email and phone number are never shown publicly.'
          )
        }
      />
      <PressRow
        icon="information-circle-outline"
        label="About"
        onPress={() =>
          Alert.alert('Community Notice Board', 'Version 1.0\nConnect. Share. Stay Informed.')
        }
      />

      <View style={{ height: 14 }} />
      <PressRow icon="log-out-outline" label="Logout" onPress={confirmLogout} danger />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, paddingBottom: 50 },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: '800' },
  section: { fontSize: 12, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 14, padding: 14, marginBottom: 8,
  },
});