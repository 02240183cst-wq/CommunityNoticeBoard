import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useConnectivity } from '../context/ConnectivityContext';
import { subscribeComments, addComment, deleteComment } from '../services/commentService';
import { timeAgo } from '../services/format';

export default function CommentsSection({ noticeId, ownerId }) {
  const { colors } = useTheme();
  const { user, profile } = useAuth();
  const { isOnline } = useConnectivity();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const unsub = subscribeComments(
      noticeId,
      (list) => {
        setComments(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [noticeId]);

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    if (!isOnline) {
      Alert.alert('No internet connection', 'Your comment is kept. Try again when you are online.');
      return;
    }
    try {
      setSending(true);
      await addComment(noticeId, {
        text: t,
        authorId: user.uid,
        authorName: profile?.name || user.displayName || 'Neighbor',
      });
      setText('');
    } catch (e) {
      Alert.alert('Error', 'Could not post your comment. Try again.');
    } finally {
      setSending(false);
    }
  };

  const remove = (c) => {
    Alert.alert('Delete comment', 'Delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComment(noticeId, c.id);
          } catch (e) {
            Alert.alert('Error', 'Could not delete the comment.');
          }
        },
      },
    ]);
  };

  return (
    <View style={{ marginTop: 28 }}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Comments ({comments.length})
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
      ) : comments.length === 0 ? (
        <Text style={{ color: colors.subText, marginVertical: 14 }}>
          No comments yet. Be the first to respond.
        </Text>
      ) : (
        comments.map((c) => {
          const canDelete = c.authorId === user.uid || ownerId === user.uid;
          return (
            <View
              key={c.id}
              style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Avatar name={c.authorName || '?'} size={36} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{c.authorName}</Text>
                  {c.authorId === ownerId ? (
                    <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700', marginLeft: 6 }}>
                      OWNER
                    </Text>
                  ) : null}
                  <Text style={{ color: colors.subText, fontSize: 12, marginLeft: 8 }}>
                    {timeAgo(c.createdAt)}
                  </Text>
                </View>
                <Text style={{ color: colors.text, marginTop: 3, lineHeight: 20 }}>{c.text}</Text>
              </View>
              {canDelete ? (
                <TouchableOpacity
                  onPress={() => remove(c)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Write a comment..."
          placeholderTextColor={colors.subText}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          onPress={send}
          disabled={sending || !text.trim()}
          style={[
            styles.sendBtn,
            { backgroundColor: colors.primary, opacity: sending || !text.trim() ? 0.5 : 1 },
          ]}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1,
    borderRadius: 14, padding: 12, marginBottom: 8,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  input: {
    flex: 1, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14,
    paddingTop: 12, paddingBottom: 12, maxHeight: 110, fontSize: 15,
  },
  sendBtn: {
    width: 48, height: 48, borderRadius: 24, marginLeft: 8,
    alignItems: 'center', justifyContent: 'center',
  },
});