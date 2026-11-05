import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/community.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(15,23,42,0.75)', 'rgba(15,23,42,0.35)', 'rgba(15,23,42,0.75)']}
        style={styles.overlay}
      >
        <Animated.View style={[styles.center, { opacity: fade, transform: [{ scale }] }]}>
          <View style={styles.logo}>
            <Ionicons name="pin" size={52} color="#fff" />
          </View>
          <Text style={styles.title}>Community{'\n'}Notice Board</Text>
          <Text style={styles.sub}>Connect. Share. Stay Informed.</Text>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  logo: {
    width: 104, height: 104, borderRadius: 30, backgroundColor: '#2563EB',
    alignItems: 'center', justifyContent: 'center', marginBottom: 26,
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 }, elevation: 10,
  },
  title: {
    fontSize: 34, fontWeight: '800', textAlign: 'center',
    lineHeight: 42, color: '#fff',
  },
  sub: { fontSize: 16, marginTop: 10, color: '#E2E8F0' },
});
