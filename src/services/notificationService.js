import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const defaultPrefs = {
  emergency: true,
  announcements: false,
  events: false,
  myNotices: true,
};

export const loadPrefs = async () => {
  try {
    const v = await AsyncStorage.getItem('notifPrefs');
    return v ? { ...defaultPrefs, ...JSON.parse(v) } : defaultPrefs;
  } catch (e) {
    return defaultPrefs;
  }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alerts', {
        name: 'Community alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const res = await Notifications.requestPermissionsAsync();
      status = res.status;
    }
    return status === 'granted';
  } catch (e) {
    return false;
  }
};

export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: true },
      trigger: Platform.OS === 'android' ? { channelId: 'alerts' } : null,
    });
  } catch (e) {}
};