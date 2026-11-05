import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth, getErrorMessage } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Login failed', getErrorMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <View style={[styles.brandIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="location" size={22} color="#fff" />
          </View>
          <Text style={[styles.brandText, { color: colors.text }]}>Community Board</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.sub, { color: colors.subText }]}>
          Sign in to check the latest updates around you
        </Text>

        <Input
          label="Email"
          icon="mail-outline"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          icon="lock-closed-outline"
          placeholder="Enter your password"
          secure
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={{ alignSelf: 'flex-end', marginBottom: 20 }}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button title="Login" onPress={handleLogin} loading={loading} />

        <View style={styles.footer}>
          <Text style={{ color: colors.subText }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 70, flexGrow: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', marginBottom: 50 },
  brandIcon: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  brandText: { fontSize: 18, fontWeight: '700', marginLeft: 10 },
  title: { fontSize: 32, fontWeight: '800' },
  sub: { fontSize: 15, marginTop: 4, marginBottom: 28 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
});