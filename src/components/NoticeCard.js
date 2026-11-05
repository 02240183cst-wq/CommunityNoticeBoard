import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../context/FavouritesContext';
import { getCategory } from '../constants/categories';
import { timeAgo } from '../services/format';

export default function NoticeCard({ notice, onPress }) {
  const { colors } = useTheme();
  const { isFavourite, toggleFavourite } = useFavourites();
  const cat = getCategory(notice.category);
  const emergency = notice.category === 'Emergency';
  const fav = isFavourite(notice.id);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: emergency ? colors.danger : colors.border,
          borderWidth: emergency ? 2 : 1,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.tag, { backgroundColor: cat.bg }]}>
          <Text style={{ color: cat.color, fontWeight: '700', fontSize: 12 }}>
            {notice.category}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: colors.subText, fontSize: 12 }}>{timeAgo(notice.createdAt)}</Text>
          <TouchableOpacity
            onPress={() => toggleFavourite(notice.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ marginLeft: 10 }}
          >
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={22}
              color={fav ? '#EF4444' : colors.subText}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{notice.title}</Text>

          {notice.location ? (
            <View style={[styles.row, { justifyContent: 'flex-start', marginBottom: 4 }]}>
              <Ionicons name="location" size={14} color={colors.subText} />
              <Text style={{ color: colors.subText, marginLeft: 4, fontSize: 13 }}>
                {notice.eventDate ? `${notice.eventDate} — ` : ''}
                {notice.location}
              </Text>
            </View>
          ) : null}

          <Text numberOfLines={2} style={{ color: colors.subText, fontSize: 14 }}>
            {notice.description}
          </Text>
        </View>

        {notice.imageURL ? (
          <Image source={{ uri: notice.imageURL }} style={styles.thumb} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, padding: 16, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: '800', marginVertical: 8 },
  thumb: { width: 80, height: 80, borderRadius: 14, marginLeft: 12 },
});