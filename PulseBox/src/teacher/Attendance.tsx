import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { ink } from '../theme/typography';
import BackIcon from '../../assets/images/Back.svg';
import Svg, { Path } from 'react-native-svg';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'Attendance'>;

interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late' | null;
}

// Icons
const CheckIcon = ({ size = 20, color = '#4CAF50' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const XIcon = ({ size = 20, color = '#F44336' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ClockIcon = ({ size = 20, color = '#FF9800' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const Attendance: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params;
  const insets = useSafeAreaInsets();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock students data - will be replaced with Firebase
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

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, status: student.status === status ? null : status }
          : student
      )
    );
  };

  const handleSave = () => {
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const lateCount = students.filter(s => s.status === 'late').length;
    const notMarked = students.filter(s => s.status === null).length;

    if (notMarked > 0) {
      Alert.alert(
        'Incomplete Attendance',
        `${notMarked} student(s) not marked. Do you want to mark them as absent?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Mark as Absent',
            onPress: () => {
              setStudents(prev =>
                prev.map(student =>
                  student.status === null ? { ...student, status: 'absent' } : student
                )
              );
              saveAttendance();
            },
          },
        ]
      );
    } else {
      saveAttendance();
    }
  };

  const saveAttendance = () => {
    // Save to Firebase here
    Alert.alert('Success', 'Attendance saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
        >
          <BackIcon width={24} height={24} stroke="#000000" />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mark Attendance</Text>
          <Text style={styles.headerDate}>{new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Stats - Reorganized */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Today's Summary</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <CheckIcon size={24} color="#4CAF50" />
            </View>
            <Text style={styles.statNumber}>{presentCount}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={[styles.statCard, styles.statCardAbsent]}>
            <View style={styles.statIconContainer}>
              <XIcon size={24} color="#F44336" />
            </View>
            <Text style={[styles.statNumber, styles.statNumberAbsent]}>{absentCount}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={[styles.statCard, styles.statCardLate]}>
            <View style={styles.statIconContainer}>
              <ClockIcon size={24} color="#FF9800" />
            </View>
            <Text style={[styles.statNumber, styles.statNumberLate]}>{lateCount}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          placeholderTextColor={ink.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Students List */}
      <PulseScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {filteredStudents.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <View style={styles.studentAvatar}>
                <Text style={styles.studentInitial}>
                  {student.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.studentName}>{student.name}</Text>
            </View>
            <View style={styles.statusButtons}>
              <Pressable
                style={[
                  styles.statusBtn,
                  styles.statusBtnPresent,
                  student.status === 'present' && styles.statusBtnActive,
                ]}
                onPress={() => handleStatusChange(student.id, 'present')}
                android_ripple={{ color: 'rgba(76,175,80,0.1)' }}
              >
                <CheckIcon
                  size={20}
                  color={student.status === 'present' ? '#FFFFFF' : '#4CAF50'}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.statusBtn,
                  styles.statusBtnLate,
                  student.status === 'late' && styles.statusBtnActiveLate,
                ]}
                onPress={() => handleStatusChange(student.id, 'late')}
                android_ripple={{ color: 'rgba(255,152,0,0.1)' }}
              >
                <ClockIcon
                  size={20}
                  color={student.status === 'late' ? '#FFFFFF' : '#FF9800'}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.statusBtn,
                  styles.statusBtnAbsent,
                  student.status === 'absent' && styles.statusBtnActiveAbsent,
                ]}
                onPress={() => handleStatusChange(student.id, 'absent')}
                android_ripple={{ color: 'rgba(244,67,54,0.1)' }}
              >
                <XIcon
                  size={20}
                  color={student.status === 'absent' ? '#FFFFFF' : '#F44336'}
                />
              </Pressable>
            </View>
          </View>
        ))}
      </PulseScrollView>

      {/* Save Button - Fixed Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable
          style={styles.saveBtn}
          onPress={handleSave}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.saveBtnText}>Save Attendance</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
  },
  placeholder: {
    width: 40,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statsTitle: {
    fontSize: 14,
    fontFamily: 'DMSans-SemiBold',
    color: '#1A1A22',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statCardAbsent: {
    backgroundColor: '#FFEBEE',
  },
  statCardLate: {
    backgroundColor: '#FFF3E0',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statNumberAbsent: {
    color: '#F44336',
  },
  statNumberLate: {
    color: '#FF9800',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    color: '#1A1A22',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 120,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A060FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentInitial: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'DMSans-Medium',
    color: '#000000',
    flex: 1,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  statusBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  statusBtnPresent: {
    borderColor: '#4CAF50',
    backgroundColor: '#FFFFFF',
  },
  statusBtnLate: {
    borderColor: '#FF9800',
    backgroundColor: '#FFFFFF',
  },
  statusBtnAbsent: {
    borderColor: '#F44336',
    backgroundColor: '#FFFFFF',
  },
  statusBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  statusBtnActiveLate: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  statusBtnActiveAbsent: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  saveBtn: {
    backgroundColor: '#A060FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A060FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
  },
});

export default Attendance;

