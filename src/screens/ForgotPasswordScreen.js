import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth, getErrorMessage } from '../context/AuthContext';

export default function ForgotPasswordScreen({ navigation }) {
  const { colors } = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your email address.');
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email.trim());
      Alert.alert('Email sent', 'Check your inbox for the reset link.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 30 }}>
        <Ionicons name="arrow-back" size={26} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
      <Text style={[styles.sub, { color: colors.subText }]}>
        Enter your email and we'll send you a reset link.
      </Text>
      <Input label="Email" icon="mail-outline" placeholder="Enter your email"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Button title="Send Reset Link" onPress={handleReset} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 30, fontWeight: '800' },
  sub: { fontSize: 15, marginTop: 4, marginBottom: 28 },
});