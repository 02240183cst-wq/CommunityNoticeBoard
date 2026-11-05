import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { defaultFilters, sortOptions, dateOptions } from '../services/filterNotices';

export default function FilterModal({ visible, onClose, filters, onApply }) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible]);

  const Option = ({ label, active, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.primary : colors.card,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={[styles.title, { color: colors.text }]}>Filter & Sort</Text>

            <Text style={[styles.label, { color: colors.text }]}>Sort by</Text>
            <View style={styles.wrap}>
              {sortOptions.map((o) => (
                <Option
                  key={o.key}
                  label={o.label}
                  active={draft.sort === o.key}
                  onPress={() => setDraft({ ...draft, sort: o.key })}
                />
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Date posted</Text>
            <View style={styles.wrap}>
              {dateOptions.map((o) => (
                <Option
                  key={o.key}
                  label={o.label}
                  active={draft.dateRange === o.key}
                  onPress={() => setDraft({ ...draft, dateRange: o.key })}
                />
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="e.g. Central Park"
              placeholderTextColor={colors.subText}
              value={draft.location}
              onChangeText={(t) => setDraft({ ...draft, location: t })}
            />

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, { borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => setDraft(defaultFilters)}
              >
                <Text style={{ color: colors.text, fontWeight: '700' }}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.primary }]}
                onPress={() => {
                  onApply(draft);
                  onClose();
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Apply</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', marginTop: 14 }}>
              <Text style={{ color: colors.subText }}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, maxHeight: '85%' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1, marginRight: 8, marginBottom: 8,
  },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, height: 48 },
  btnRow: { flexDirection: 'row', marginTop: 24 },
  btn: {
    flex: 1, height: 50, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginHorizontal: 5,
  },
});