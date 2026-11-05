import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, Image, Share, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import ReportModal from '../components/ReportModal';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import { subscribeNotice, deleteNotice, updateNotice } from '../services/noticeService';
import { addReport } from '../services/reportService';
import { getCategory, getStatuses, getStatus, statusColor } from '../constants/categories';
import { timeAgo } from '../services/format';

export default function NoticeDetailsScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { id } = route.params;
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    const unsub = subscribeNotice(
      id,
      (n) => {
        if (!n && !deleting) {
          navigation.goBack();
          return;
        }
        setNotice(n);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [id]);

  const handleDelete = () => {
    Alert.alert('Delete notice', 'Are you sure you want to delete this notice?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteNotice(id);
            navigation.goBack();
          } catch (e) {
            setDeleting(false);
            Alert.alert('Error', 'Could not delete the notice.');
          }
        },
      },
    ]);
  };

  const handleShare = async () => {
    const lines = [`[${notice.category}] ${notice.title}`, '', notice.description];
    if (notice.location) lines.push('', `Location: ${notice.location}`);
    if (notice.eventDate) lines.push(`When: ${notice.eventDate}`);
    if (notice.contact) lines.push(`Contact: ${notice.contact}`);
    if (notice.latitude != null) {
      lines.push(
        `Map: https://www.google.com/maps/search/?api=1&query=${notice.latitude},${notice.longitude}`
      );
    }
    lines.push('', 'Shared from Community Notice Board');
    try {
      await Share.share({ message: lines.join('\n') });
    } catch (e) {
      Alert.alert('Error', 'Could not share this notice.');
    }
  };

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${notice.latitude},${notice.longitude}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open the maps app.'));
  };

  const changeStatus = async (s) => {
    try {
      await updateNotice(id, { status: s });
    } catch (e) {
      Alert.alert('Error', 'Could not update the status.');
    }
  };

  const submitReport = async (reason) => {
    try {
      setReporting(true);
      await addReport({
        noticeId: id,
        noticeTitle: notice.title,
        reason,
        reporterId: user.uid,
      });
      setShowReport(false);
      Alert.alert('Report sent', 'Thank you. We will review this notice.');
    } catch (e) {
      Alert.alert('Error', 'Could not send the report. Try again.');
    } finally {
      setReporting(false);
    }
  };

  if (loading || !notice) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const cat = getCategory(notice.category);
  const isOwner = notice.authorId === user?.uid;
  const fav = isFavourite(id);
  const hasCoords = notice.latitude != null && notice.longitude != null;
  const emergency = notice.category === 'Emergency';
  const statuses = getStatuses(notice.category);
  const status = getStatus(notice);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleShare} style={{ marginRight: 18 }}>
              <Ionicons name="share-social-outline" size={26} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavourite(id)}>
              <Ionicons
                name={fav ? 'heart' : 'heart-outline'}
                size={28}
                color={fav ? '#EF4444' : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {emergency ? (
          <View style={[styles.alertBar, { backgroundColor: colors.danger }]}>
            <Ionicons name="warning" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', marginLeft: 8 }}>
              EMERGENCY NOTICE
            </Text>
          </View>
        ) : null}

        {notice.imageURL ? (
          <Image source={{ uri: notice.imageURL }} style={styles.image} />
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.tag, { backgroundColor: cat.bg }]}>
            <Text style={{ color: cat.color, fontWeight: '700' }}>{notice.category}</Text>
          </View>
          {status ? (
            <View
              style={[
                styles.tag,
                { backgroundColor: statusColor(status) + '22', marginLeft: 8 },
              ]}
            >
              <Text style={{ color: statusColor(status), fontWeight: '700' }}>{status}</Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{notice.title}</Text>
        <Text style={{ color: colors.subText, marginBottom: 20 }}>
          Posted {timeAgo(notice.createdAt)} by {notice.authorName}
        </Text>

        <View style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }}>
            {notice.description}
          </Text>
        </View>

        {notice.location ? (
          <Row icon="location-outline" label="Location" value={notice.location} colors={colors} />
        ) : null}
        {hasCoords ? (
          <TouchableOpacity onPress={openMaps} style={[styles.mapBtn, { borderColor: colors.primary }]}>
            <Ionicons name="map-outline" size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 8 }}>
              Open in Maps
            </Text>
          </TouchableOpacity>
        ) : null}
        {notice.eventDate ? (
          <Row icon="calendar-outline" label="Date / Time" value={notice.eventDate} colors={colors} />
        ) : null}
        {notice.contact ? (
          <Row icon="call-outline" label="Contact" value={notice.contact} colors={colors} />
        ) : null}
        {notice.community ? (
          <Row icon="home-outline" label="Community" value={notice.community} colors={colors} />
        ) : null}

        {isOwner && statuses.length ? (
          <View style={{ marginTop: 22 }}>
            <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>
              Change status
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {statuses.map((s) => {
                const active = status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => changeStatus(s)}
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor: active ? statusColor(s) : colors.card,
                        borderColor: active ? statusColor(s) : colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}

        <Button title="Share Notice" onPress={handleShare} outline style={{ marginTop: 24 }} />

        {isOwner ? (
          <View style={{ marginTop: 12 }}>
            <Button
              title="Edit Notice"
              onPress={() => navigation.navigate('EditNotice', { notice })}
            />
            <Button
              title="Delete Notice"
              onPress={handleDelete}
              outline
              color={colors.danger}
              style={{ marginTop: 12 }}
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowReport(true)}
            style={styles.reportBtn}
          >
            <Ionicons name="flag-outline" size={18} color={colors.danger} />
            <Text style={{ color: colors.danger, fontWeight: '700', marginLeft: 6 }}>
              Report this notice
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={submitReport}
        loading={reporting}
      />
    </View>
  );
}

function Row({ icon, label, value, colors }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ color: colors.subText, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 20, paddingTop: 60, paddingBottom: 50 },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  alertBar: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    borderRadius: 12, marginBottom: 16,
  },
  image: { width: '100%', height: 220, borderRadius: 16, marginBottom: 16 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  title: { fontSize: 28, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  box: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 44, borderWidth: 1, borderRadius: 12, marginTop: 12,
  },
  statusChip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1, marginRight: 8, marginBottom: 8,
  },
  reportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 18, padding: 12,
  },
});