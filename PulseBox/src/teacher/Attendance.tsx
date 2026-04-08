import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { theme, fonts as F, ink, radius } from '../theme';
import BackButton from '../components/Reusable-Components/BackButton';
import Svg, { Path } from 'react-native-svg';
import { PulseScrollView } from '../components/PulseScrollView';
import { useClasses, type ClassActivityItem } from '../context/ClassesContext';
import { usePulseAlert } from '../context/AlertModalContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Attendance'>;

interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late' | null;
}

const CANVAS = ink.canvas;
const INK = ink.ink;
const INK_SOFT = ink.inkSoft;
const BORDER_INK = ink.borderInk;
const BORDER_WIDTH = ink.borderWidth;
const ROW_DIVIDER = ink.rowDivider;
const R_CARD = radius.card;
const R_INPUT = radius.input;
const R_BTN = radius.btn;

const PRESENT = '#0D9488';
const PRESENT_BG = 'rgba(13, 148, 136, 0.12)';
const LATE = '#D97706';
const LATE_BG = 'rgba(217, 119, 6, 0.12)';
const ABSENT = '#DC2626';
const ABSENT_BG = 'rgba(220, 38, 38, 0.1)';

const CheckIcon = ({ size = 18, color = PRESENT }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const XIcon = ({ size = 18, color = ABSENT }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ClockIcon = ({ size = 18, color = LATE }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 6V12L16 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BookIconSmall = ({ size = 22, color = theme.primary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Attendance: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { classes, updateClass } = useClasses();
  const { showAlert, showSuccess } = usePulseAlert();
  const [activeClassId, setActiveClassId] = useState<string | undefined>(() => route.params?.classId);
  const [searchQuery, setSearchQuery] = useState('');

  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', status: null },
    { id: '2', name: 'Bob Smith', status: null },
    { id: '3', name: 'Charlie Brown', status: null },
    { id: '4', name: 'Diana Prince', status: null },
    { id: '5', name: 'Ethan Hunt', status: null },
    { id: '6', name: 'Fiona Apple', status: null },
    { id: '7', name: 'George Washington', status: null },
    { id: '8', name: 'Hannah Montana', status: null },
  ]);

  useEffect(() => {
    if (route.params?.classId) {
      setActiveClassId(route.params.classId);
    }
  }, [route.params?.classId]);

  useEffect(() => {
    if (!activeClassId) return;
    setSearchQuery('');
    setStudents((prev) => prev.map((s) => ({ ...s, status: null })));
  }, [activeClassId]);

  const classInfo = useMemo(
    () => (activeClassId ? classes.find((c) => c.id === activeClassId) : undefined),
    [classes, activeClassId],
  );

  const filteredStudents = useMemo(
    () => students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [students, searchQuery],
  );

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [],
  );

  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const lateCount = students.filter((s) => s.status === 'late').length;
  const unmarkedCount = students.filter((s) => s.status === null).length;

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, status: s.status === status ? null : status } : s,
      ),
    );
  };

  const saveAttendance = (studentSnapshot?: Student[]) => {
    const roster = studentSnapshot ?? students;
    const present = roster.filter((s) => s.status === 'present').length;
    const late = roster.filter((s) => s.status === 'late').length;
    const absent = roster.filter((s) => s.status === 'absent').length;

    if (activeClassId) {
      const cls = classes.find((c) => c.id === activeClassId);
      if (cls) {
        const item: ClassActivityItem = {
          id: `act-${Date.now()}`,
          kind: 'attendance',
          headline: 'Attendance marked',
          detail: `${present} present · ${late} late · ${absent} absent`,
          createdAt: new Date().toISOString(),
        };
        void updateClass(activeClassId, {
          activityLog: [item, ...(cls.activityLog ?? [])].slice(0, 40),
        });
      }
    }

    showSuccess('Saved', 'Attendance has been recorded.', () => navigation.goBack());
  };

  const handleSave = () => {
    const notMarked = students.filter((s) => s.status === null).length;
    if (notMarked > 0) {
      showAlert({
        variant: 'warning',
        title: 'Some students unmarked',
        message: `${notMarked} student(s) have no status. Mark them as absent and save?`,
        buttons: [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Mark absent & save',
            style: 'default',
            onPress: () => {
              const finalStudents = students.map((s) =>
                s.status === null ? { ...s, status: 'absent' as const } : s,
              );
              setStudents(finalStudents);
              saveAttendance(finalStudents);
            },
          },
        ],
      });
    } else {
      saveAttendance();
    }
  };

  if (!activeClassId) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Which class?</Text>
            <Text style={styles.pickSub}>
              Choose a class to take attendance for today.
            </Text>
          </View>
        </View>

        <PulseScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.pickScrollContent, { paddingBottom: 24 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          {classes.length === 0 ? (
            <View style={styles.pickEmpty}>
              <Text style={styles.pickEmptyTitle}>No classes yet</Text>
              <Text style={styles.pickEmptyBody}>
                Add a class first, then you can take attendance for that roster.
              </Text>
              <Pressable
                style={styles.pickPrimaryBtn}
                onPress={() => navigation.navigate('CreateClass')}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <Text style={styles.pickPrimaryBtnText}>Create a class</Text>
              </Pressable>
            </View>
          ) : (
            classes.map((c) => (
              <Pressable
                key={c.id}
                style={({ pressed }) => [styles.pickCard, pressed && styles.pickCardPressed]}
                onPress={() => setActiveClassId(c.id)}
                android_ripple={{ color: ink.pressTint }}
              >
                <View style={styles.pickIconWell}>
                  <BookIconSmall size={24} color={theme.primary} />
                </View>
                <View style={styles.pickCardMain}>
                  <Text style={styles.pickCardTitle} numberOfLines={1}>
                    {c.name}
                  </Text>
                  <Text style={styles.pickCardMeta} numberOfLines={2}>
                    {c.subject} · {c.gradeLevel} · {c.studentCount} students
                  </Text>
                  {c.schedule ? (
                    <Text style={styles.pickCardSchedule} numberOfLines={1}>
                      {c.schedule}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.pickChevron}>›</Text>
              </Pressable>
            ))
          )}
        </PulseScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Mark attendance</Text>
          <Text style={styles.subDate}>{dateLabel}</Text>
          {classInfo ? (
            <Text style={styles.subClass} numberOfLines={1}>
              {classInfo.name}
              <Text style={styles.subMeta}> · {classInfo.subject}</Text>
            </Text>
          ) : (
            <Text style={styles.subClass}>Class</Text>
          )}
          <Pressable
            onPress={() => setActiveClassId(undefined)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Choose a different class"
          >
            <Text style={styles.changeClassLink}>Change class</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Today</Text>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCell, { backgroundColor: PRESENT_BG }]}>
            <Text style={[styles.summaryNum, { color: PRESENT }]}>{presentCount}</Text>
            <Text style={styles.summaryLab}>Present</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: LATE_BG }]}>
            <Text style={[styles.summaryNum, { color: LATE }]}>{lateCount}</Text>
            <Text style={styles.summaryLab}>Late</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: ABSENT_BG }]}>
            <Text style={[styles.summaryNum, { color: ABSENT }]}>{absentCount}</Text>
            <Text style={styles.summaryLab}>Absent</Text>
          </View>
          <View style={[styles.summaryCell, styles.summaryCellMuted]}>
            <Text style={[styles.summaryNum, { color: INK }]}>{unmarkedCount}</Text>
            <Text style={styles.summaryLab}>Unmarked</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search students"
          placeholderTextColor={ink.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <PulseScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 108 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.listEyebrow}>
          Roster · {filteredStudents.length} of {students.length}
        </Text>
        {filteredStudents.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>{student.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.studentName} numberOfLines={2}>
                {student.name}
              </Text>
            </View>
            <View style={styles.segment}>
              <Pressable
                accessibilityLabel={`${student.name} present`}
                style={[
                  styles.segBtn,
                  styles.segLeft,
                  student.status === 'present' && styles.segActivePresent,
                ]}
                onPress={() => handleStatusChange(student.id, 'present')}
                android_ripple={{ color: 'rgba(13,148,136,0.15)' }}
              >
                <CheckIcon
                  size={17}
                  color={student.status === 'present' ? '#FFFFFF' : PRESENT}
                />
                <Text
                  style={[
                    styles.segLabel,
                    student.status === 'present' && styles.segLabelOnLight,
                  ]}
                >
                  Present
                </Text>
              </Pressable>
              <View style={styles.segDivider} />
              <Pressable
                accessibilityLabel={`${student.name} late`}
                style={[styles.segBtn, student.status === 'late' && styles.segActiveLate]}
                onPress={() => handleStatusChange(student.id, 'late')}
                android_ripple={{ color: 'rgba(217,119,6,0.15)' }}
              >
                <ClockIcon
                  size={17}
                  color={student.status === 'late' ? '#FFFFFF' : LATE}
                />
                <Text
                  style={[
                    styles.segLabel,
                    student.status === 'late' && styles.segLabelOnLight,
                  ]}
                >
                  Late
                </Text>
              </Pressable>
              <View style={styles.segDivider} />
              <Pressable
                accessibilityLabel={`${student.name} absent`}
                style={[styles.segBtn, styles.segRight, student.status === 'absent' && styles.segActiveAbsent]}
                onPress={() => handleStatusChange(student.id, 'absent')}
                android_ripple={{ color: 'rgba(220,38,38,0.12)' }}
              >
                <XIcon
                  size={17}
                  color={student.status === 'absent' ? '#FFFFFF' : ABSENT}
                />
                <Text
                  style={[
                    styles.segLabel,
                    student.status === 'absent' && styles.segLabelOnLight,
                  ]}
                >
                  Absent
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </PulseScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
          onPress={handleSave}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.saveBtnText}>Save attendance</Text>
        </Pressable>
      </View>
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
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ROW_DIVIDER,
    backgroundColor: CANVAS,
  },
  headerText: {
    flex: 1,
    paddingLeft: 4,
    minWidth: 0,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: F.outfitBlack,
    color: INK,
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  subDate: {
    fontSize: 14,
    fontFamily: F.dmMedium,
    color: INK_SOFT,
    marginBottom: 2,
  },
  subClass: {
    fontSize: 15,
    fontFamily: F.dmSemi,
    color: INK,
  },
  subMeta: {
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    fontWeight: '400',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: R_CARD,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    backgroundColor: CANVAS,
  },
  summaryEyebrow: {
    fontSize: 11,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCell: {
    flexGrow: 1,
    minWidth: '22%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  summaryCellMuted: {
    backgroundColor: 'rgba(26, 26, 34, 0.06)',
  },
  summaryNum: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: F.outfitBold,
    marginBottom: 2,
  },
  summaryLab: {
    fontSize: 11,
    fontFamily: F.dmMedium,
    color: INK_SOFT,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    borderRadius: R_INPUT,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    fontFamily: F.dmRegular,
    color: INK,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  listEyebrow: {
    fontSize: 11,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  studentCard: {
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    borderRadius: R_CARD,
    padding: 14,
    marginBottom: 10,
    backgroundColor: CANVAS,
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.primarySoft,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    fontSize: 16,
    fontFamily: F.dmBold,
    color: theme.primary,
  },
  studentName: {
    flex: 1,
    fontSize: 16,
    fontFamily: F.dmSemi,
    color: INK,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 12,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 34, 0.03)',
  },
  segBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  segLeft: {},
  segRight: {},
  segDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: ROW_DIVIDER,
  },
  segLabel: {
    fontSize: 11,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
  },
  segLabelOnLight: {
    color: '#FFFFFF',
  },
  segActivePresent: {
    backgroundColor: PRESENT,
  },
  segActiveLate: {
    backgroundColor: LATE,
  },
  segActiveAbsent: {
    backgroundColor: ABSENT,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: ROW_DIVIDER,
    backgroundColor: CANVAS,
  },
  saveBtn: {
    backgroundColor: theme.primary,
    borderRadius: R_BTN,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnPressed: {
    opacity: 0.92,
  },
  saveBtnText: {
    fontSize: 17,
    fontFamily: F.outfitBold,
    color: theme.white,
  },
  pickSub: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginTop: 4,
  },
  pickScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  pickEmpty: {
    paddingVertical: 32,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  pickEmptyTitle: {
    fontSize: 20,
    fontFamily: F.outfitExtraBold,
    color: INK,
    marginBottom: 8,
    textAlign: 'center',
  },
  pickEmptyBody: {
    fontSize: 15,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    maxWidth: 300,
  },
  pickPrimaryBtn: {
    backgroundColor: theme.primary,
    borderRadius: R_BTN,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  pickPrimaryBtnText: {
    fontSize: 16,
    fontFamily: F.outfitBold,
    color: theme.white,
  },
  pickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    borderRadius: R_CARD,
    padding: 14,
    marginBottom: 10,
    backgroundColor: CANVAS,
  },
  pickCardPressed: {
    opacity: 0.92,
  },
  pickIconWell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.primarySoft,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pickCardMain: {
    flex: 1,
    minWidth: 0,
  },
  pickCardTitle: {
    fontSize: 17,
    fontFamily: F.dmSemi,
    color: INK,
    marginBottom: 4,
  },
  pickCardMeta: {
    fontSize: 14,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    lineHeight: 20,
  },
  pickCardSchedule: {
    fontSize: 12,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginTop: 4,
  },
  pickChevron: {
    fontSize: 22,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginLeft: 4,
  },
  changeClassLink: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: F.dmSemi,
    color: theme.primary,
  },
});

export default Attendance;
