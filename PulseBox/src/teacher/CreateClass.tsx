import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import BackIcon from '../../assets/images/Back.svg';
import { useClasses, ClassData } from '../context/ClassesContext';
import { ink } from '../theme/typography';
import Svg, { Path } from 'react-native-svg';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateClass'>;

interface Student {
  id: string;
  name: string;
  email?: string;
}

// Icons
const PlusIcon = ({ size = 20, color = '#A060FF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const XIcon = ({ size = 18, color = '#F44336' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UserIcon = ({ size = 20, color = ink.inkSoft }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CreateClass: React.FC<Props> = ({ navigation }) => {
  const { addClass } = useClasses();
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [schedule, setSchedule] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const gradeLevels = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
                       'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const handleAddStudent = () => {
    if (!studentName.trim()) {
      Alert.alert('Missing Information', 'Please enter a student name');
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: studentName.trim(),
      email: studentEmail.trim() || undefined,
    };

    setStudents([...students, newStudent]);
    setStudentName('');
    setStudentEmail('');
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
  };

  const handleCreate = async () => {
    if (!className || !subject || !gradeLevel) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Create new class object
    const newClass: ClassData = {
      id: Date.now().toString(), // Simple ID generation - will be replaced with Firebase
      name: className,
      subject: subject,
      gradeLevel: gradeLevel,
      studentCount: students.length, // Set to number of added students
      schedule: schedule || 'Not set',
      roomNumber: roomNumber || undefined,
      createdAt: new Date().toISOString(),
    };

    // Save to context (which saves to AsyncStorage)
    await addClass(newClass);

    Alert.alert('Success', `Class created successfully with ${students.length} student${students.length !== 1 ? 's' : ''}!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
        >
          <BackIcon width={24} height={24} stroke="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>Create New Class</Text>
        <View style={styles.placeholder} />
      </View>

      <PulseScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Class Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mathematics 101"
              placeholderTextColor={ink.placeholder}
              value={className}
              onChangeText={setClassName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mathematics, English, Science"
              placeholderTextColor={ink.placeholder}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grade Level *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradeScroll}>
              {gradeLevels.map((grade) => (
                <Pressable
                  key={grade}
                  style={[
                    styles.gradeChip,
                    gradeLevel === grade && styles.gradeChipActive,
                  ]}
                  onPress={() => setGradeLevel(grade)}
                  android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
                >
                  <Text
                    style={[
                      styles.gradeChipText,
                      gradeLevel === grade && styles.gradeChipTextActive,
                    ]}
                  >
                    {grade}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Schedule (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
              placeholderTextColor={ink.placeholder}
              value={schedule}
              onChangeText={setSchedule}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Room Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Room 205"
              placeholderTextColor={ink.placeholder}
              value={roomNumber}
              onChangeText={setRoomNumber}
            />
          </View>

          {/* Add Students Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Add Students (Optional)</Text>
            <Text style={styles.subLabel}>You can add students now or later</Text>
            
            <View style={styles.addStudentContainer}>
              <View style={styles.studentInputRow}>
                <View style={styles.studentInputGroup}>
                  <TextInput
                    style={[styles.input, styles.studentNameInput]}
                    placeholder="Student Name"
                    placeholderTextColor={ink.placeholder}
                    value={studentName}
                    onChangeText={setStudentName}
                  />
                </View>
                <View style={styles.studentInputGroup}>
                  <TextInput
                    style={[styles.input, styles.studentEmailInput]}
                    placeholder="Email (Optional)"
                    placeholderTextColor={ink.placeholder}
                    value={studentEmail}
                    onChangeText={setStudentEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <Pressable
                  style={styles.addStudentBtn}
                  onPress={handleAddStudent}
                  android_ripple={{ color: 'rgba(160,96,255,0.2)' }}
                >
                  <PlusIcon size={20} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            {/* Students List */}
            {students.length > 0 && (
              <View style={styles.studentsList}>
                <Text style={styles.studentsListTitle}>
                  Added Students ({students.length})
                </Text>
                {students.map((student) => (
                  <View key={student.id} style={styles.studentItem}>
                    <View style={styles.studentItemInfo}>
                      <View style={styles.studentAvatar}>
                        <UserIcon size={16} color="#FFFFFF" />
                      </View>
                      <View style={styles.studentItemText}>
                        <Text style={styles.studentItemName}>{student.name}</Text>
                        {student.email && (
                          <Text style={styles.studentItemEmail}>{student.email}</Text>
                        )}
                      </View>
                    </View>
                    <Pressable
                      style={styles.removeStudentBtn}
                      onPress={() => handleRemoveStudent(student.id)}
                      android_ripple={{ color: 'rgba(244,67,54,0.1)', borderless: true }}
                    >
                      <XIcon size={18} color="#F44336" />
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
            <Text style={styles.createBtnText}>Create Class</Text>
          </Pressable>
        </View>
      </PulseScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
  },
  gradeScroll: {
    marginTop: 8,
  },
  gradeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  gradeChipActive: {
    backgroundColor: '#A060FF',
    borderColor: '#A060FF',
  },
  gradeChipText: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    color: '#1A1A22',
  },
  gradeChipTextActive: {
    color: '#FFFFFF',
  },
  createBtn: {
    backgroundColor: '#A060FF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#A060FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  createBtnText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
  },
  subLabel: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    marginTop: 4,
    marginBottom: 12,
  },
  addStudentContainer: {
    marginTop: 8,
  },
  studentInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  studentInputGroup: {
    flex: 1,
  },
  studentNameInput: {
    flex: 1,
  },
  studentEmailInput: {
    flex: 1,
  },
  addStudentBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#A060FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  studentsList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  studentsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  studentItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A060FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentItemText: {
    flex: 1,
  },
  studentItemName: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
    marginBottom: 2,
  },
  studentItemEmail: {
    fontSize: 13,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
  },
  removeStudentBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default CreateClass;

