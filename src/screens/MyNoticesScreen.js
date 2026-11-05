import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { subscribeNotices, deleteNotice } from '../services/noticeService';
import NoticeCard from '../components/NoticeCard';

export default function MyNoticesScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeNotices(
      (list) => {
        setNotices(list.filter((n) => n.authorId === user.uid));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user.uid]);

  const handleDelete = (id) => {
    Alert.alert('Delete notice', 'Are you sure you want to delete this notice?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNotice(id);
          } catch (e) {
            Alert.alert('Error', 'Could not delete the notice.');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>My Notices</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <NoticeCard
                notice={item}
                onPress={() => navigation.navigate('NoticeDetails', { id: item.id })}
              />
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actBtn, { borderColor: colors.primary }]}
                  onPress={() => navigation.navigate('EditNotice', { notice: item })}
                >
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 6 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actBtn, { borderColor: colors.danger }]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  <Text style={{ color: colors.danger, fontWeight: '700', marginLeft: 6 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Ionicons name="document-text-outline" size={50} color={colors.subText} />
              <Text style={{ color: colors.subText, marginTop: 10 }}>You haven't posted any notices yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 60 },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800' },
  actions: { flexDirection: 'row', marginTop: -6, marginBottom: 18 },
  actBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 42, borderWidth: 1, borderRadius: 12, marginHorizontal: 4,
  },
});