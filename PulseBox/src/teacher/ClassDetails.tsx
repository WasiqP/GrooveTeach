import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { ink } from '../theme/typography';
import BackIcon from '../../assets/images/Back.svg';
import { PulseScrollView } from '../components/PulseScrollView';
import Svg, { Path } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'ClassDetails'>;

// Icons
const StudentsIcon = ({ size = 24, color = ink.inkSoft }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CheckIcon = ({ size = 24, color = '#4CAF50' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UsersIcon = ({ size = 24, color = '#2196F3' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const DocumentIcon = ({ size = 24, color = '#A060FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChartIcon = ({ size = 24, color = '#FF9800' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 16L12 11L16 15L21 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 10H16V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ClassDetails: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params;
  
  // Mock class data - will be replaced with Firebase
  const classData = {
    id: classId,
    name: 'Mathematics 101',
    subject: 'Mathematics',
    gradeLevel: 'Grade 10',
    studentCount: 28,
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    roomNumber: 'Room 205',
  };

  const quickActions = [
    {
      id: 'attendance',
      title: 'Mark Attendance',
      icon: CheckIcon,
      color: '#4CAF50',
      onPress: () => navigation.navigate('Attendance', { classId }),
    },
    {
      id: 'students',
      title: 'View Students',
      icon: UsersIcon,
      color: '#2196F3',
      onPress: () => navigation.navigate('Responses'), // Will navigate to Students screen
    },
    {
      id: 'assignment',
      title: 'Create Assignment',
      icon: DocumentIcon,
      color: '#A060FF',
      onPress: () => navigation.navigate('CreateAssignment', { classId }),
    },
    {
      id: 'grades',
      title: 'View Grades',
      icon: ChartIcon,
      color: '#FF9800',
      onPress: () => navigation.navigate('Grading', { classId }),
    },
  ];

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
        <Text style={styles.headerTitle}>Class Details</Text>
        <View style={styles.placeholder} />
      </View>

      <PulseScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Class Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.className}>{classData.name}</Text>
          <Text style={styles.classSubject}>{classData.subject} • {classData.gradeLevel}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <StudentsIcon size={20} color={ink.inkSoft} />
              <Text style={styles.infoText}>{classData.studentCount} Students</Text>
            </View>
            <Text style={styles.infoText}>•</Text>
            <Text style={styles.infoText}>{classData.schedule}</Text>
          </View>
          {classData.roomNumber && (
            <Text style={styles.roomText}>{classData.roomNumber}</Text>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                style={styles.quickActionCard}
                onPress={action.onPress}
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <action.icon size={28} color={action.color} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>No recent activity</Text>
            <Text style={styles.activitySubtext}>Activity will appear here</Text>
          </View>
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
  infoCard: {
    backgroundColor: '#F8F5FF',
    borderWidth: 1,
    borderColor: '#E0D5FF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  className: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  classSubject: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    marginRight: 8,
  },
  roomText: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
    textAlign: 'center',
  },
  activitySection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    marginBottom: 4,
  },
  activitySubtext: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
  },
});

export default ClassDetails;

