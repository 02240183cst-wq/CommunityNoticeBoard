import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { reportReasons } from '../services/reportService';

export default function ReportModal({ visible, onClose, onSubmit, loading }) {
  const { colors } = useTheme();
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (visible) setReason('');
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Report this notice</Text>
          <Text style={{ color: colors.subText, marginBottom: 14 }}>
            Why are you reporting it?
          </Text>

          {reportReasons.map((r) => {
            const active = reason === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => setReason(r)}
                style={[
                  styles.row,
                  {
                    backgroundColor: colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={active ? colors.primary : colors.subText}
                />
                <Text style={{ color: colors.text, marginLeft: 12, fontSize: 16 }}>{r}</Text>
              </TouchableOpacity>
            );
          })}

          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <TouchableOpacity
              style={[styles.btn, { borderColor: colors.border, borderWidth: 1 }]}
              onPress={onClose}
            >
              <Text style={{ color: colors.text, fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!reason || loading}
              style={[
                styles.btn,
                { backgroundColor: colors.danger, opacity: !reason || loading ? 0.5 : 1 },
              ]}
              onPress={() => onSubmit(reason)}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>
                {loading ? 'Sending...' : 'Submit Report'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, paddingBottom: 34 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  row: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 14, padding: 14, marginBottom: 8,
  },
  btn: {
    flex: 1, height: 50, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginHorizontal: 5,
  },
});