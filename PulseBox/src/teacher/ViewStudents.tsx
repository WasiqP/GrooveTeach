import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useClasses, type ClassStudentRecord } from '../context/ClassesContext';
import { usePulseAlert } from '../context/AlertModalContext';
import { theme, fonts as F, ink, radius } from '../theme';
import { PulseScrollView } from '../components/PulseScrollView';
import BackButton from '../components/Reusable-Components/BackButton';
import Svg, { Path } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewStudents'>;

const CANVAS = ink.canvas;
const INK = ink.ink;
const INK_SOFT = ink.inkSoft;
const BORDER = '#000000';
const BW = 1;
const R_CARD = radius.card;
const R_INPUT = radius.input;

const SearchIcon = ({ size = 20, color = INK_SOFT }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon = ({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

const TrashIcon = ({ size = 20, color = '#DC2626' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H5H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UserIcon = ({ size = 20, color = theme.white }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function newStudentId(): string {
  return `st-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const ViewStudents: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params;
  const { classes, updateClass } = useClasses();
  const { showAlert, showSuccess, showError } = usePulseAlert();

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');

  const classData = useMemo(() => classes.find((c) => c.id === classId), [classes, classId]);
  const roster: ClassStudentRecord[] = classData?.students ?? [];

  const filteredRoster = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)),
    );
  }, [roster, search]);

  const allVisibleSelected =
    filteredRoster.length > 0 && filteredRoster.every((s) => selectedIds.has(s.id));

  const selectedCount = selectedIds.size;

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const toggleSelectAllVisible = useCallback(() => {
    if (filteredRoster.length === 0) return;
    if (allVisibleSelected) {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        filteredRoster.forEach((s) => n.delete(s.id));
        return n;
      });
    } else {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        filteredRoster.forEach((s) => n.add(s.id));
        return n;
      });
    }
  }, [filteredRoster, allVisibleSelected]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const persistRoster = (next: ClassStudentRecord[]) => {
    if (!classData) return;
    void updateClass(classData.id, {
      students: next,
      studentCount: next.length,
    });
  };

  const openAdd = () => {
    setAddName('');
    setAddEmail('');
    setAddOpen(true);
  };

  const submitAdd = () => {
    if (!classData) return;
    const name = addName.trim();
    if (!name) {
      showError('Name required', 'Enter a student name.');
      return;
    }
    const email = addEmail.trim();
    const row: ClassStudentRecord = {
      id: newStudentId(),
      name,
      email: email ? email : undefined,
    };
    const next = [...roster, row];
    persistRoster(next);
    setAddOpen(false);
    showSuccess('Student added', `${name} was added to the class.`);
  };

  const confirmDeleteSelected = () => {
    if (!classData || selectedCount === 0) return;
    showAlert({
      variant: 'warning',
      title: selectedCount === 1 ? 'Remove student?' : `Remove ${selectedCount} students?`,
      message:
        'They will be removed from this class roster. Grade links for this class may need review.',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const next = roster.filter((s) => !selectedIds.has(s.id));
            persistRoster(next);
            clearSelection();
            showSuccess('Removed', 'Roster updated.');
          },
        },
      ],
    });
  };

  if (!classData) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            Students
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Class not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          Students
        </Text>
        <Pressable
          style={({ pressed }) => [styles.headerAddBtn, pressed && styles.headerAddBtnPressed]}
          onPress={openAdd}
          accessibilityLabel="Add student"
        >
          <PlusIcon size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <PulseScrollView
        customTrack={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroCard}>
          <Text style={styles.className}>{classData.name}</Text>
          <Text style={styles.heroMeta}>
            {roster.length === 0
              ? 'No students on roster yet — add names below.'
              : `${roster.length} student${roster.length === 1 ? '' : 's'} on roster`}
            {search.trim() ? ` · ${filteredRoster.length} match search` : ''}
          </Text>
        </View>

        <View style={styles.toolbar}>
          <Pressable
            style={({ pressed }) => [
              styles.toolBtn,
              styles.toolBtnOutline,
              filteredRoster.length === 0 && styles.toolBtnDisabled,
              pressed && filteredRoster.length > 0 && styles.toolBtnPressed,
            ]}
            onPress={toggleSelectAllVisible}
            disabled={filteredRoster.length === 0}
          >
            <Text
              style={[
                styles.toolBtnTxt,
                filteredRoster.length === 0 && styles.toolBtnTxtDisabled,
              ]}
            >
              {allVisibleSelected ? 'Deselect visible' : 'Select all'}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.toolBtn,
              styles.toolBtnOutline,
              selectedCount === 0 && styles.toolBtnDisabled,
              pressed && selectedCount > 0 && styles.toolBtnPressed,
            ]}
            onPress={clearSelection}
            disabled={selectedCount === 0}
          >
            <Text style={[styles.toolBtnTxt, selectedCount === 0 && styles.toolBtnTxtDisabled]}>
              Clear selection
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.toolBtn,
              styles.toolBtnDanger,
              selectedCount === 0 && styles.toolBtnDisabled,
              pressed && selectedCount > 0 && styles.toolBtnPressed,
            ]}
            onPress={confirmDeleteSelected}
            disabled={selectedCount === 0}
          >
            <TrashIcon size={18} color={selectedCount === 0 ? INK_SOFT : '#DC2626'} />
            <Text
              style={[
                styles.toolBtnTxtDanger,
                selectedCount === 0 && styles.toolBtnTxtDisabled,
              ]}
            >
              Delete
            </Text>
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <SearchIcon size={20} color={INK_SOFT} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email…"
            placeholderTextColor={ink.placeholder}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Pressable style={styles.addWideBtn} onPress={openAdd} android_ripple={{ color: theme.rippleLight }}>
          <PlusIcon size={20} color="#FFFFFF" />
          <Text style={styles.addWideBtnTxt}>Add student</Text>
        </Pressable>

        {roster.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Build your roster</Text>
            <Text style={styles.emptyBody}>
              Add students one at a time with the button above. Names and emails are saved to this
              class and used in grades and attendance.
            </Text>
          </View>
        ) : filteredRoster.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptyBody}>Try a different search term.</Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {filteredRoster.map((s, index) => {
              const selected = selectedIds.has(s.id);
              return (
                <Pressable
                  key={s.id}
                  style={[styles.row, index < filteredRoster.length - 1 && styles.rowDivider]}
                  onPress={() => toggleSelect(s.id)}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <View style={[styles.checkbox, selected && styles.checkboxOn]}>
                    {selected ? (
                      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M20 6L9 17L4 12"
                          stroke="#FFFFFF"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    ) : null}
                  </View>
                  <View style={styles.avatar}>
                    <UserIcon size={18} color={theme.white} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.name} numberOfLines={2}>
                      {s.name}
                    </Text>
                    {s.email ? (
                      <Text style={styles.email} numberOfLines={1}>
                        {s.email}
                      </Text>
                    ) : (
                      <Text style={styles.emailMuted}>No email</Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </PulseScrollView>

      <Modal visible={addOpen} transparent animationType="fade" onRequestClose={() => setAddOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalDimmer} onPress={() => setAddOpen(false)} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalCenter}
            pointerEvents="box-none"
          >
            <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add student</Text>
            <Text style={styles.modalHint}>Name is required. Email is optional.</Text>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Alex Morgan"
              placeholderTextColor={ink.placeholder}
              value={addName}
              onChangeText={setAddName}
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="student@school.edu"
              placeholderTextColor={ink.placeholder}
              value={addEmail}
              onChangeText={setAddEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setAddOpen(false)}>
                <Text style={styles.modalCancelTxt}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={submitAdd}>
                <Text style={styles.modalSaveTxt}>Add</Text>
              </Pressable>
            </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingLeft: 8,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ink.rowDivider,
    backgroundColor: CANVAS,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 2,
    fontSize: 22,
    fontFamily: F.outfitBold,
    color: INK,
    letterSpacing: -0.4,
  },
  headerSpacer: {
    width: 44,
  },
  headerAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BW,
    borderColor: BORDER,
  },
  headerAddBtnPressed: {
    opacity: 0.9,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroCard: {
    borderWidth: BW,
    borderColor: BORDER,
    borderRadius: R_CARD,
    padding: 16,
    marginBottom: 14,
    backgroundColor: CANVAS,
  },
  className: {
    fontSize: 20,
    fontFamily: F.outfitBold,
    color: INK,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroMeta: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: BW,
  },
  toolBtnOutline: {
    borderColor: BORDER,
    backgroundColor: CANVAS,
  },
  toolBtnDanger: {
    borderColor: 'rgba(220, 38, 38, 0.45)',
    backgroundColor: 'rgba(220, 38, 38, 0.06)',
  },
  toolBtnDisabled: {
    opacity: 0.45,
  },
  toolBtnPressed: {
    opacity: 0.88,
  },
  toolBtnTxt: {
    fontSize: 13,
    fontFamily: F.dmSemi,
    color: INK,
  },
  toolBtnTxtDanger: {
    fontSize: 13,
    fontFamily: F.dmSemi,
    color: '#DC2626',
  },
  toolBtnTxtDisabled: {
    color: INK_SOFT,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BW,
    borderColor: BORDER,
    borderRadius: R_INPUT,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: CANVAS,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    paddingHorizontal: 8,
    fontSize: 15,
    fontFamily: F.dmRegular,
    color: INK,
  },
  addWideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: R_CARD,
    backgroundColor: theme.primary,
    borderWidth: BW,
    borderColor: BORDER,
    marginBottom: 16,
  },
  addWideBtnTxt: {
    fontSize: 16,
    fontFamily: F.dmSemi,
    color: '#FFFFFF',
  },
  emptyCard: {
    padding: 18,
    borderRadius: R_CARD,
    borderWidth: BW,
    borderColor: BORDER,
    backgroundColor: CANVAS,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: F.outfitBold,
    color: INK,
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listCard: {
    borderRadius: R_CARD,
    borderWidth: BW,
    borderColor: BORDER,
    overflow: 'hidden',
    backgroundColor: CANVAS,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: CANVAS,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ink.rowDivider,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: BW,
    borderColor: BORDER,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CANVAS,
  },
  checkboxOn: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: BW,
    borderColor: BORDER,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontFamily: F.dmSemi,
    color: INK,
  },
  email: {
    fontSize: 13,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginTop: 4,
  },
  emailMuted: {
    fontSize: 12,
    fontFamily: F.dmRegular,
    color: '#94A3B8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalRoot: {
    flex: 1,
  },
  modalDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: CANVAS,
    borderRadius: R_CARD,
    borderWidth: BW,
    borderColor: BORDER,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: F.outfitBold,
    color: INK,
    marginBottom: 6,
  },
  modalHint: {
    fontSize: 14,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    borderWidth: BW,
    borderColor: BORDER,
    borderRadius: R_INPUT,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    fontFamily: F.dmRegular,
    color: INK,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  modalCancel: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: BW,
    borderColor: BORDER,
  },
  modalCancelTxt: {
    fontSize: 16,
    fontFamily: F.dmSemi,
    color: INK,
  },
  modalSave: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: theme.primary,
    borderWidth: BW,
    borderColor: BORDER,
  },
  modalSaveTxt: {
    fontSize: 16,
    fontFamily: F.dmSemi,
    color: '#FFFFFF',
  },
});

export default ViewStudents;
