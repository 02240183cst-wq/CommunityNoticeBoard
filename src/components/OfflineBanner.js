import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConnectivity } from '../context/ConnectivityContext';

export default function OfflineBanner() {
  const { isOnline } = useConnectivity();
  const [showBack, setShowBack] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      setShowBack(false);
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      setShowBack(true);
      const t = setTimeout(() => setShowBack(false), 2500);
      return () => clearTimeout(t);
    }
  }, [isOnline]);

  if (isOnline && !showBack) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.bar, { backgroundColor: isOnline ? '#16A34A' : '#DC2626' }]}
    >
      <Ionicons name={isOnline ? 'wifi' : 'cloud-offline-outline'} size={14} color="#fff" />
      <Text style={styles.text}>
        {isOnline
          ? 'Back online. Refreshing data...'
          : 'No internet connection. Showing saved notices.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingTop: 30, paddingBottom: 6,
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 12, marginLeft: 6 },
});