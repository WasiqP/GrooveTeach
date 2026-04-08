import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import {
  useClasses,
  ClassData,
  type SchoolTypeOption,
  type ClassStudentRecord,
} from '../context/ClassesContext';
import { theme, fonts as F, ink, radius } from '../theme';
import Svg, { Path } from 'react-native-svg';
import { PulseScrollView } from '../components/PulseScrollView';
import { usePulseAlert } from '../context/AlertModalContext';
import BackButton from '../components/Reusable-Components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateClass'>;

interface Student {
  id: string;
  name: string;
  email?: string;
}

const CANVAS = ink.canvas;
const INK = ink.ink;
const INK_SOFT = ink.inkSoft;
const BORDER = ink.borderInk;
const BW = ink.borderWidth;
const R_CARD = radius.card;
const R_INPUT = radius.input;
const R_BTN = radius.btn;

const SCHOOL_TYPES: SchoolTypeOption[] = ['School', 'College', 'University', 'Others'];

/** Mon–Sun ids 1–7 for chip state */
const WEEK_CHIPS: { id: number; label: string }[] = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 7, label: 'Sun' },
];

const DAY_ID_TO_LABEL: Record<number, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatScheduleFromSelection(dayIds: number[], start: Date, end: Date): string {
  const sorted = [...new Set(dayIds)].sort((a, b) => a - b);
  const dayPart = sorted.map((id) => DAY_ID_TO_LABEL[id] ?? '').filter(Boolean).join(', ');
  const range = `${formatTime(start)} – ${formatTime(end)}`;
  return dayPart ? `${dayPart} · ${range}` : range;
}

function timeToMinutes(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

function parseCsvRows(text: string): { name: string; email?: string }[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  let start = 0;
  const first = lines[0].toLowerCase();
  if (first.includes('name') && (first.includes('email') || first.includes('e-mail'))) {
    start = 1;
  }
  const out: { name: string; email?: string }[] = [];
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
    const name = parts[0];
    if (!name) continue;
    out.push({ name, email: parts[1] || undefined });
  }
  return out;
}

const PlusIcon = ({ size = 20, color = theme.white }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const XIcon = ({ size = 18, color = '#DC2626' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2.5"
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

const CreateClass: React.FC<Props> = ({ navigation }) => {
  const { addClass } = useClasses();
  const { showAlert, showSuccess } = usePulseAlert();

  const [schoolName, setSchoolName] = useState('');
  const [schoolType, setSchoolType] = useState<SchoolTypeOption>('School');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [endTime, setEndTime] = useState(() => {
    const d = new Date();
    d.setHours(10, 0, 0, 0);
    return d;
  });
  /** Which time field the picker is editing */
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end'>('start');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [androidTimeOpen, setAndroidTimeOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvPaste, setCsvPaste] = useState('');

  const gradeLevels = useMemo(
    () => [
      'Kindergarten',
      'Grade 1',
      'Grade 2',
      'Grade 3',
      'Grade 4',
      'Grade 5',
      'Grade 6',
      'Grade 7',
      'Grade 8',
      'Grade 9',
      'Grade 10',
      'Grade 11',
      'Grade 12',
    ],
    [],
  );

  const startTimeLabel = useMemo(() => formatTime(startTime), [startTime]);
  const endTimeLabel = useMemo(() => formatTime(endTime), [endTime]);

  const pickerValue = activeTimeField === 'start' ? startTime : endTime;
  const setPickerTime = (d: Date) => {
    if (activeTimeField === 'start') {
      setStartTime(d);
    } else {
      setEndTime(d);
    }
  };

  const toggleDay = (id: number) => {
    setSelectedDays((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const handleAddStudent = () => {
    if (!studentName.trim()) {
      showAlert({
        variant: 'warning',
        title: 'Name required',
        message: 'Enter a student name before adding.',
      });
      return;
    }
    const newStudent: Student = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: studentName.trim(),
      email: studentEmail.trim() || undefined,
    };
    setStudents((s) => [...s, newStudent]);
    setStudentName('');
    setStudentEmail('');
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudents((s) => s.filter((x) => x.id !== studentId));
  };

  const handleImportCsv = () => {
    const rows = parseCsvRows(csvPaste);
    if (rows.length === 0) {
      showAlert({
        variant: 'warning',
        title: 'No rows found',
        message: 'Paste CSV lines with name and optional email, separated by commas.',
      });
      return;
    }
    const added = rows.map((r, i) => ({
      id: `csv-${Date.now()}-${i}`,
      name: r.name,
      email: r.email,
    }));
    setStudents((s) => [...s, ...added]);
    setCsvPaste('');
    setCsvModalOpen(false);
    showAlert({
      variant: 'success',
      title: 'Imported',
      message: `Added ${added.length} student${added.length === 1 ? '' : 's'} from CSV.`,
    });
  };

  const onAndroidTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    setAndroidTimeOpen(false);
    if (event.type === 'set' && date) {
      setPickerTime(date);
    }
  };

  const openTimePicker = (field: 'start' | 'end') => {
    Keyboard.dismiss();
    setActiveTimeField(field);
    if (Platform.OS === 'android') {
      setAndroidTimeOpen(true);
    } else {
      setShowTimeModal(true);
    }
  };

  const handleCreate = async () => {
    if (!schoolName.trim() || !className.trim() || !subject.trim() || !gradeLevel) {
      showAlert({
        variant: 'warning',
        title: 'Missing class details',
        message: 'Please enter school name, class name, subject, and grade level.',
      });
      return;
    }
    if (selectedDays.length === 0) {
      showAlert({
        variant: 'warning',
        title: 'Schedule',
        message: 'Select at least one day your class meets.',
      });
      return;
    }
    if (students.length === 0) {
      showAlert({
        variant: 'warning',
        title: 'Students required',
        message: 'Add at least one student, or import a CSV, before creating the class.',
      });
      return;
    }
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      showAlert({
        variant: 'warning',
        title: 'End time',
        message: 'End time must be after start time.',
      });
      return;
    }

    const scheduleStr = formatScheduleFromSelection(selectedDays, startTime, endTime);

    const roster: ClassStudentRecord[] = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
    }));

    const newClass: ClassData = {
      id: Date.now().toString(),
      name: className.trim(),
      subject: subject.trim(),
      gradeLevel,
      studentCount: students.length,
      schedule: scheduleStr,
      roomNumber: roomNumber.trim() || undefined,
      schoolName: schoolName.trim(),
      schoolType,
      students: roster,
      createdAt: new Date().toISOString(),
    };

    await addClass(newClass);

    showSuccess(
      'Class created',
      `${newClass.name} is ready with ${students.length} student${students.length === 1 ? '' : 's'}.`,
      () => navigation.goBack(),
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            Create new class
          </Text>
        </View>
      </View>

      <PulseScrollView
        customTrack={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.section, styles.sectionFirst]}>
          <Text style={styles.sectionEyebrow}>School</Text>
          <View style={styles.field}>
            <Text style={styles.label}>School name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Westside Academy"
              placeholderTextColor={ink.placeholder}
              value={schoolName}
              onChangeText={setSchoolName}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>School type *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gradeScrollContent}
            >
              {SCHOOL_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={[styles.gradeChip, schoolType === type && styles.gradeChipOn]}
                  onPress={() => setSchoolType(type)}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <Text style={[styles.gradeChipTxt, schoolType === type && styles.gradeChipTxtOn]}>
                    {type}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Basics</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Class name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mathematics 101"
              placeholderTextColor={ink.placeholder}
              value={className}
              onChangeText={setClassName}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mathematics"
              placeholderTextColor={ink.placeholder}
              value={subject}
              onChangeText={setSubject}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Grade level *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gradeScrollContent}
            >
              {gradeLevels.map((grade) => (
                <Pressable
                  key={grade}
                  style={[styles.gradeChip, gradeLevel === grade && styles.gradeChipOn]}
                  onPress={() => setGradeLevel(grade)}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <Text style={[styles.gradeChipTxt, gradeLevel === grade && styles.gradeChipTxtOn]}>
                    {grade}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Schedule</Text>
          <Text style={styles.sectionLead}>
            Choose the days this class meets, then set start and end times.
          </Text>

          <Text style={styles.label}>Days *</Text>
          <View style={styles.dayGrid}>
            {WEEK_CHIPS.map(({ id, label }) => {
              const on = selectedDays.includes(id);
              return (
                <Pressable
                  key={id}
                  style={[styles.dayChip, on && styles.dayChipOn]}
                  onPress={() => toggleDay(id)}
                  android_ripple={{ color: theme.rippleLight }}
                >
                  <Text style={[styles.dayChipTxt, on && styles.dayChipTxtOn]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.label, styles.labelSpaced]}>Start time *</Text>
          <Pressable
            style={styles.timeTrigger}
            onPress={() => openTimePicker('start')}
            android_ripple={{ color: ink.pressTint }}
          >
            <Text style={styles.timeTriggerLabel}>Start</Text>
            <Text style={styles.timeTriggerValue}>{startTimeLabel}</Text>
            <Text style={styles.timeTriggerHint}>Tap to change</Text>
          </Pressable>

          <Text style={[styles.label, styles.labelSpaced]}>End time *</Text>
          <Pressable
            style={styles.timeTrigger}
            onPress={() => openTimePicker('end')}
            android_ripple={{ color: ink.pressTint }}
          >
            <Text style={styles.timeTriggerLabel}>End</Text>
            <Text style={styles.timeTriggerValue}>{endTimeLabel}</Text>
            <Text style={styles.timeTriggerHint}>Tap to change</Text>
          </Pressable>

          {Platform.OS === 'android' && androidTimeOpen && (
            <DateTimePicker
              value={pickerValue}
              mode="time"
              display="default"
              onChange={onAndroidTimeChange}
            />
          )}

          {Platform.OS === 'ios' && (
            <Modal visible={showTimeModal} transparent animationType="fade">
              <TouchableWithoutFeedback onPress={() => setShowTimeModal(false)}>
                <View style={styles.modalBackdrop}>
                  <TouchableWithoutFeedback>
                    <View style={styles.timeSheet}>
                      <Text style={styles.timeSheetTitle}>
                        {activeTimeField === 'start' ? 'Start time' : 'End time'}
                      </Text>
                      <DateTimePicker
                        value={pickerValue}
                        mode="time"
                        display="spinner"
                        themeVariant="light"
                        onChange={(_, d) => d && setPickerTime(d)}
                        style={styles.iosPicker}
                      />
                      <Pressable
                        style={styles.timeSheetDone}
                        onPress={() => setShowTimeModal(false)}
                        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                      >
                        <Text style={styles.timeSheetDoneTxt}>Done</Text>
                      </Pressable>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Location</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Room (optional)</Text>
            <View style={styles.roomCard}>
              <Text style={styles.roomCardHint}>Where this class meets</Text>
              <TextInput
                style={styles.roomInputInner}
                placeholder="e.g. Room 205, Building B"
                placeholderTextColor={ink.placeholder}
                value={roomNumber}
                onChangeText={setRoomNumber}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        </View>

        <View style={styles.studentsSection}>
          <Text style={styles.sectionEyebrow}>Students *</Text>
          <Text style={styles.sectionLead}>
            Add at least one student. You can type them in, or paste / import a CSV list.
          </Text>

          <View style={styles.studentActions}>
            <Pressable
              style={styles.csvBtn}
              onPress={() => setCsvModalOpen(true)}
              android_ripple={{ color: ink.pressTint }}
            >
              <Text style={styles.csvBtnTxt}>Import CSV</Text>
            </Pressable>
          </View>

          <Text style={styles.subLabel}>Add manually</Text>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.input, styles.addInput]}
              placeholder="Student name"
              placeholderTextColor={ink.placeholder}
              value={studentName}
              onChangeText={setStudentName}
            />
            <TextInput
              style={[styles.input, styles.addInput]}
              placeholder="Email (optional)"
              placeholderTextColor={ink.placeholder}
              value={studentEmail}
              onChangeText={setStudentEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Pressable
              style={styles.addCircle}
              onPress={handleAddStudent}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
            >
              <PlusIcon size={22} color={theme.white} />
            </Pressable>
          </View>

          {students.length > 0 && (
            <View style={styles.roster}>
              <Text style={styles.rosterTitle}>Roster ({students.length})</Text>
              {students.map((student) => (
                <View key={student.id} style={styles.studentRow}>
                  <View style={styles.studentLeft}>
                    <View style={styles.avatar}>
                      <UserIcon size={16} color={theme.white} />
                    </View>
                    <View style={styles.studentTxt}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {student.name}
                      </Text>
                      {student.email ? (
                        <Text style={styles.studentEmail} numberOfLines={1}>
                          {student.email}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <Pressable
                    hitSlop={8}
                    onPress={() => handleRemoveStudent(student.id)}
                    android_ripple={{ color: 'rgba(220,38,38,0.12)', borderless: true }}
                  >
                    <XIcon size={18} color="#DC2626" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <Pressable
          style={styles.createBtn}
          onPress={handleCreate}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.createBtnTxt}>Create class</Text>
        </Pressable>
        <View style={styles.bottomPad} />
      </PulseScrollView>

      <Modal visible={csvModalOpen} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setCsvModalOpen(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.csvSheet}>
                <Text style={styles.csvSheetTitle}>Import from CSV</Text>
                <Text style={styles.csvSheetHelp}>
                  One student per line: <Text style={styles.csvMono}>Name, email</Text>. Optional header row
                  with “name” and “email”.
                </Text>
                <TextInput
                  style={styles.csvTextarea}
                  multiline
                  placeholder={'Jamie Lee, jamie@school.edu\nAlex Kim, alex.kim@school.edu'}
                  placeholderTextColor={ink.placeholder}
                  value={csvPaste}
                  onChangeText={setCsvPaste}
                  textAlignVertical="top"
                />
                <View style={styles.csvActions}>
                  <Pressable style={styles.csvCancel} onPress={() => setCsvModalOpen(false)}>
                    <Text style={styles.csvCancelTxt}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.csvConfirm} onPress={handleImportCsv}>
                    <Text style={styles.csvConfirmTxt}>Add to roster</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 2,
    fontSize: 20,
    fontFamily: F.outfitBold,
    color: INK,
    letterSpacing: -0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
  },
  sectionFirst: {
    paddingTop: 20,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  sectionLead: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginBottom: 18,
    maxWidth: 400,
  },
  field: {
    marginBottom: 22,
  },
  label: {
    fontSize: 15,
    fontFamily: F.dmSemi,
    color: INK,
    marginBottom: 10,
  },
  labelSpaced: {
    marginTop: 8,
  },
  input: {
    backgroundColor: CANVAS,
    borderWidth: BW,
    borderColor: BORDER,
    borderRadius: R_INPUT,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    fontFamily: F.dmRegular,
    color: INK,
  },
  gradeScrollContent: {
    paddingVertical: 4,
    gap: 10,
    paddingRight: 8,
  },
  gradeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: BW,
    borderColor: BORDER,
    backgroundColor: CANVAS,
    marginRight: 8,
  },
  gradeChipOn: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  gradeChipTxt: {
    fontSize: 14,
    fontFamily: F.dmMedium,
    color: INK_SOFT,
  },
  gradeChipTxtOn: {
    color: theme.white,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: R_BTN,
    borderWidth: BW,
    borderColor: BORDER,
    backgroundColor: CANVAS,
    minWidth: 52,
    alignItems: 'center',
  },
  dayChipOn: {
    backgroundColor: theme.primarySoft,
    borderColor: theme.primary,
  },
  dayChipTxt: {
    fontSize: 14,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
  },
  dayChipTxtOn: {
    color: theme.primary,
  },
  timeTrigger: {
    borderWidth: BW,
    borderColor: BORDER,
    borderRadius: R_CARD,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: CANVAS,
  },
  timeTriggerLabel: {
    fontSize: 12,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  timeTriggerValue: {
    fontSize: 28,
    fontFamily: F.outfitBold,
    color: INK,
    letterSpacing: -0.5,
  },
  timeTriggerHint: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  roomCard: {
    borderWidth: BW,
    borderColor: BORDER,
    borderRadius: R_CARD,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: CANVAS,
  },
  roomCardHint: {
    fontSize: 12,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  roomInputInner: {
    fontSize: 17,
    fontFamily: F.dmMedium,
    color: INK,
    paddingVertical: 0,
    margin: 0,
    minHeight: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  timeSheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: CANVAS,
    borderRadius: R_CARD + 4,
    borderWidth: BW,
    borderColor: BORDER,
    padding: 20,
    paddingBottom: 16,
  },
  timeSheetTitle: {
    fontSize: 20,
    fontFamily: F.outfitBold,
    color: INK,
    marginBottom: 12,
    textAlign: 'center',
  },
  iosPicker: {
    height: 180,
  },
  timeSheetDone: {
    marginTop: 8,
    backgroundColor: theme.primary,
    borderRadius: R_BTN,
    paddingVertical: 14,
    alignItems: 'center',
  },
  timeSheetDoneTxt: {
    fontSize: 17,
    fontFamily: F.outfitBold,
    color: theme.white,
  },
  studentsSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  studentActions: {
    marginBottom: 18,
  },
  csvBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: R_BTN,
    borderWidth: BW,
    borderColor: theme.primary,
    backgroundColor: theme.primarySoft,
  },
  csvBtnTxt: {
    fontSize: 15,
    fontFamily: F.dmSemi,
    color: theme.primary,
  },
  subLabel: {
    fontSize: 14,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
    marginBottom: 10,
  },
  addRow: {
    gap: 12,
    marginBottom: 8,
  },
  addInput: {
    marginBottom: 0,
  },
  addCircle: {
    alignSelf: 'flex-end',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  roster: {
    marginTop: 22,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: ink.rowDivider,
  },
  rosterTitle: {
    fontSize: 15,
    fontFamily: F.dmSemi,
    color: INK,
    marginBottom: 14,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: R_CARD,
    borderWidth: BW,
    borderColor: BORDER,
    marginBottom: 10,
    backgroundColor: CANVAS,
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentTxt: {
    flex: 1,
    minWidth: 0,
  },
  studentName: {
    fontSize: 16,
    fontFamily: F.dmSemi,
    color: INK,
  },
  studentEmail: {
    fontSize: 13,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginTop: 2,
  },
  createBtn: {
    marginHorizontal: 24,
    marginTop: 28,
    backgroundColor: theme.primary,
    borderRadius: R_BTN,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnTxt: {
    fontSize: 17,
    fontFamily: F.outfitBold,
    color: theme.white,
  },
  bottomPad: {
    height: 32,
  },
  csvSheet: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: CANVAS,
    borderRadius: R_CARD + 4,
    borderWidth: BW,
    borderColor: BORDER,
    padding: 20,
  },
  csvSheetTitle: {
    fontSize: 20,
    fontFamily: F.outfitBold,
    color: INK,
    marginBottom: 10,
  },
  csvSheetHelp: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginBottom: 14,
  },
  csvMono: {
    fontFamily: F.dmSemi,
    color: INK,
  },
  csvTextarea: {
    minHeight: 140,
    borderWidth: BW,
    borderColor: BORDER,
    borderRadius: R_INPUT,
    padding: 14,
    fontSize: 14,
    fontFamily: F.dmRegular,
    color: INK,
    marginBottom: 18,
  },
  csvActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  csvCancel: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  csvCancelTxt: {
    fontSize: 16,
    fontFamily: F.dmSemi,
    color: INK_SOFT,
  },
  csvConfirm: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: R_BTN,
  },
  csvConfirmTxt: {
    fontSize: 16,
    fontFamily: F.outfitBold,
    color: theme.white,
  },
});

export default CreateClass;
