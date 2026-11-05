import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Input from '../components/Input';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { pickImage } from '../services/imageService';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { communities } from '../constants/theme';

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, profile, loadProfile } = useAuth();
  const [name, setName] = useState(profile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [community, setCommunity] = useState(profile?.community || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const img = await pickImage({ camera: true, square: true, width: 400 });
    if (img) setPhotoURL(img);
  };
  const choosePhoto = async () => {
    const img = await pickImage({ camera: false, square: true, width: 400 });
    if (img) setPhotoURL(img);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter your name.');
      return;
    }
    try {
      setLoading(true);
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      await updateDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        community,
        photoURL,
      });
      await loadProfile(user.uid);
      Alert.alert('Saved', 'Your profile has been updated.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not update your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Avatar uri={photoURL} name={name || '?'} size={110} />
        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          <TouchableOpacity
            onPress={takePhoto}
            style={[styles.photoBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="camera-outline" size={18} color={colors.primary} />
            <Text style={{ color: colors.text, marginLeft: 6, fontWeight: '600' }}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={choosePhoto}
            style={[styles.photoBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="images-outline" size={18} color={colors.primary} />
            <Text style={{ color: colors.text, marginLeft: 6, fontWeight: '600' }}>Gallery</Text>
          </TouchableOpacity>
          {photoURL ? (
            <TouchableOpacity
              onPress={() => setPhotoURL('')}
              style={[styles.photoBtn, { backgroundColor: colors.card, borderColor: colors.danger }]}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Input label="Full Name" icon="person-outline" autoCapitalize="words"
        value={name} onChangeText={setName} />
      <Input label="Phone Number" icon="call-outline" keyboardType="phone-pad"
        value={phone} onChangeText={setPhone} />

      <Text style={[styles.label, { color: colors.text }]}>Short description</Text>
      <TextInput
        style={[styles.area, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
        placeholder="Tell your neighbours about yourself"
        placeholderTextColor={colors.subText}
        multiline
        textAlignVertical="top"
        value={bio}
        onChangeText={setBio}
      />

      <Text style={[styles.label, { color: colors.text }]}>Community / Location</Text>
      <View style={styles.chips}>
        {communities.map((c) => {
          const active = community === c;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCommunity(c)}
              style={[styles.chip, {
                backgroundColor: active ? colors.primary : colors.card,
                borderColor: active ? colors.primary : colors.border,
              }]}
            >
              <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button title="Save Changes" onPress={handleSave} loading={loading} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, paddingBottom: 50 },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  area: { borderWidth: 1, borderRadius: 14, padding: 14, height: 100, fontSize: 15, marginBottom: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1, marginRight: 8, marginBottom: 8,
  },
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
    height: 42, borderWidth: 1, borderRadius: 12, marginHorizontal: 4,
  },
});