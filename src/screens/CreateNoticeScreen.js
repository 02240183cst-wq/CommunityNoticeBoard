import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import ImageField from '../components/ImageField';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useConnectivity } from '../context/ConnectivityContext';
import { categories } from '../constants/categories';
import { addNotice, updateNotice } from '../services/noticeService';
import { getCurrentPlace } from '../services/locationService';

export default function CreateNoticeScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { user, profile } = useAuth();
  const { isOnline } = useConnectivity();
  const editing = route?.params?.notice;

  const [title, setTitle] = useState(editing?.title || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [category, setCategory] = useState(editing?.category || '');
  const [location, setLocation] = useState(editing?.location || '');
  const [coords, setCoords] = useState(
    editing?.latitude != null
      ? { latitude: editing.latitude, longitude: editing.longitude }
      : null
  );
  const [eventDate, setEventDate] = useState(editing?.eventDate || '');
  const [contact, setContact] = useState(editing?.contact || '');
  const [imageURL, setImageURL] = useState(editing?.imageURL || '');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const useMyLocation = async () => {
    setLocating(true);
    const place = await getCurrentPlace();
    setLocating(false);
    if (place) {
      setLocation(place.text);
      setCoords({ latitude: place.latitude, longitude: place.longitude });
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category) {
      Alert.alert('Missing details', 'Title, description and category are required.');
      return;
    }
    if (!isOnline) {
      Alert.alert(
        'No internet connection',
        'Your details are kept on this screen. Please try again when you are back online.'
      );
      return;
    }
    const data = {
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      latitude: coords ? coords.latitude : null,
      longitude: coords ? coords.longitude : null,
      eventDate: eventDate.trim(),
      contact: contact.trim(),
      imageURL,
    };
    try {
      setLoading(true);
      if (editing) {
        await updateNotice(editing.id, data);
        Alert.alert('Updated', 'Your notice has been updated.');
        navigation.goBack();
      } else {
        await addNotice({
          ...data,
          status: 'Active',
          authorId: user.uid,
          authorName: profile?.name || user.displayName || 'Neighbor',
          community: profile?.community || '',
        });
        Alert.alert('Published', 'Your notice is now live.');
        setTitle(''); setDescription(''); setCategory('');
        setLocation(''); setCoords(null); setEventDate('');
        setContact(''); setImageURL('');
        navigation.navigate('Home');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save the notice. Your details are kept, so try again.');
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
        <View style={styles.top}>
          {editing ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={26} color={colors.text} />
            </TouchableOpacity>
          ) : null}
          <Text style={[styles.title, { color: colors.text }]}>
            {editing ? 'Edit Notice' : 'Create Notice'}
          </Text>
        </View>

        <Input label="Title *" icon="create-outline" placeholder="e.g. Lost Golden Retriever"
          autoCapitalize="sentences" value={title} onChangeText={setTitle} />

        <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
        <TextInput
          style={[
            styles.area,
            { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Write the details here..."
          placeholderTextColor={colors.subText}
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
        <View style={styles.chips}>
          {categories.map((c) => {
            const active = category === c.name;
            return (
              <TouchableOpacity
                key={c.name}
                onPress={() => setCategory(c.name)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? c.color : colors.card,
                    borderColor: active ? c.color : colors.border,
                  },
                ]}
              >
                <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ImageField value={imageURL} onChange={setImageURL} />

        <Input label="Location (optional)" icon="location-outline"
          placeholder="e.g. Near CST campus" autoCapitalize="sentences"
          value={location}
          onChangeText={(t) => {
            setLocation(t);
            setCoords(null);
          }} />

        <TouchableOpacity
          onPress={useMyLocation}
          disabled={locating}
          style={[styles.locBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {locating ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Ionicons name="navigate-outline" size={20} color={colors.primary} />
          )}
          <Text style={{ color: colors.text, fontWeight: '600', marginLeft: 8 }}>
            {locating ? 'Getting location...' : 'Use my current location'}
          </Text>
        </TouchableOpacity>
        {coords ? (
          <Text style={{ color: colors.subText, fontSize: 12, marginBottom: 12 }}>
            GPS location attached ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
          </Text>
        ) : null}

        <Input label="Date / Time" icon="calendar-outline"
          placeholder="e.g. Saturday, 9 AM" autoCapitalize="sentences"
          value={eventDate} onChangeText={setEventDate} />
        <Input label="Contact (optional)" icon="call-outline"
          placeholder="Phone or email" value={contact} onChangeText={setContact} />

        <Button
          title={editing ? 'Save Changes' : 'Publish Notice'}
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, paddingBottom: 50 },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  area: {
    borderWidth: 1, borderRadius: 14, padding: 14, height: 120,
    fontSize: 15, marginBottom: 14,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1, marginRight: 8, marginBottom: 8,
  },
  locBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 46, borderWidth: 1, borderRadius: 14, marginTop: -4, marginBottom: 12,
  },
});