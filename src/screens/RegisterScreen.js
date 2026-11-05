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
import { communities } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [community, setCommunity] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !community) {
      Alert.alert('Missing details', 'Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    if (!agree) {
      Alert.alert('Terms', 'Please agree to the Terms & Conditions.');
      return;
    }
    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        community,
      });
    } catch (e) {
      Alert.alert('Registration failed', getErrorMessage(e.code));
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
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.sub, { color: colors.subText }]}>
          Join your neighbors on the bulletin board
        </Text>

        <Input label="Full Name" icon="person-outline" placeholder="John Doe"
          autoCapitalize="words" value={name} onChangeText={setName} />
        <Input label="Email Address" icon="mail-outline" placeholder="johndoe@example.com"
          keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input label="Phone Number" icon="call-outline" placeholder="17123456"
          keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <Input label="Password" icon="lock-closed-outline"
          placeholder="Must be at least 8 characters" secure
          value={password} onChangeText={setPassword} />
        <Input label="Confirm Password" icon="lock-closed-outline"
          placeholder="Retype password" secure
          value={confirm} onChangeText={setConfirm} />

        <Text style={[styles.label, { color: colors.text }]}>Community / Location</Text>
        <View style={styles.chips}>
          {communities.map((c) => {
            const active = community === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCommunity(c)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.terms} onPress={() => setAgree(!agree)}>
          <Ionicons
            name={agree ? 'checkbox' : 'square-outline'}
            size={26}
            color={colors.primary}
          />
          <Text style={{ color: colors.text, marginLeft: 8 }}>
            I agree to the{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>

        <Button title="Sign Up" onPress={handleRegister} loading={loading} />

        <View style={styles.footer}>
          <Text style={{ color: colors.subText }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 50 },
  title: { fontSize: 32, fontWeight: '800' },
  sub: { fontSize: 15, marginTop: 4, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1, marginRight: 8, marginBottom: 8,
  },
  terms: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});