import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import BottomTab from '../components/BottomTab';
import Svg, { Path } from 'react-native-svg';
import { useClasses } from '../context/ClassesContext';
import { theme, fonts as F, ink, radius } from '../theme';
import { PulseScrollView } from '../components/PulseScrollView';
import TabScreenHeaderBar from '../components/TabScreenHeaderBar';

type Props = NativeStackScreenProps<RootStackParamList, 'MyClasses'>;

const CANVAS = ink.canvas;
const INK = ink.ink;
const INK_SOFT = ink.inkSoft;
const BORDER_INK = ink.borderInk;
const BORDER_WIDTH = ink.borderWidth;
const R_CARD = radius.card;
const R_INPUT = radius.input;

// ClassData is now imported from context

// Icons
const BookIcon = ({ size = 24, color = ink.inkSoft }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StudentsIcon = ({ size = 24, color = ink.inkSoft }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CalendarIcon = ({ size = 24, color = ink.inkSoft }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MyClasses: React.FC<Props> = ({ navigation }) => {
  const { classes } = useClasses();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TabScreenHeaderBar navigation={navigation}>
        <View>
          <Text style={styles.title}>My Classes</Text>
          <Text style={styles.subtitle}>Manage your classes and students</Text>
        </View>
      </TabScreenHeaderBar>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search classes..."
          placeholderTextColor={ink.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Create New Class Button */}
      <Pressable
        style={styles.createClassBtn}
        android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
        onPress={() => navigation.navigate('CreateClass')}
      >
        <View style={styles.createClassContent}>
          <View style={styles.plusIcon}>
            <Text style={styles.plusText}>+</Text>
          </View>
          <View style={styles.createClassText}>
            <Text style={styles.createClassTitle}>Create New Class</Text>
            <Text style={styles.createClassDesc}>Add a new class to manage</Text>
          </View>
        </View>
      </Pressable>

      {/* Classes List */}
      <PulseScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredClasses.length === 0 ? (
          <View style={styles.emptyState}>
            <BookIcon size={64} color={ink.iconMuted} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No classes found' : 'No classes yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try adjusting your search'
                : 'Create your first class to get started'}
            </Text>
          </View>
        ) : (
          filteredClasses.map((classItem) => (
            <Pressable
              key={classItem.id}
              style={styles.classCard}
              android_ripple={{ color: 'rgba(160,96,255,0.08)' }}
              onPress={() => navigation.navigate('ClassDetails', { classId: classItem.id })}
            >
              <View style={styles.classIcon}>
                <BookIcon size={24} color={theme.primary} />
              </View>
              <View style={styles.classContent}>
                <Text style={styles.className}>{classItem.name}</Text>
                <Text style={styles.classSubject}>{classItem.subject} • {classItem.gradeLevel}</Text>
                <View style={styles.classInfo}>
                  <View style={styles.infoItem}>
                    <StudentsIcon size={16} color={ink.inkSoft} />
                    <Text style={styles.infoText}>{classItem.studentCount} students</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <CalendarIcon size={16} color={ink.inkSoft} />
                    <Text style={styles.infoText}>{classItem.schedule}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.classActions}>
                <Pressable
                  style={styles.actionBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate('Attendance', { classId: classItem.id });
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
                >
                  <Text style={styles.actionEmoji}>✓</Text>
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </PulseScrollView>

      <BottomTab navigation={navigation} currentRoute="MyClasses" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: F.outfitBlack,
    color: INK,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: CANVAS,
  },
  searchInput: {
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    borderRadius: R_INPUT,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: F.dmRegular,
    color: INK,
  },
  createClassBtn: {
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: theme.primary,
    borderRadius: R_CARD,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
  },
  createClassContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  plusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  plusText: {
    fontSize: 22,
    fontFamily: F.dmBold,
    color: theme.white,
  },
  createClassText: {
    flex: 1,
  },
  createClassTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: F.outfitBold,
    color: theme.primary,
    marginBottom: 3,
  },
  createClassDesc: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    borderRadius: R_CARD,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  classIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  classContent: {
    flex: 1,
  },
  className: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: F.dmBold,
    color: INK,
    marginBottom: 3,
  },
  classSubject: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginBottom: 8,
  },
  classInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
  },
  classActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 18,
    color: INK_SOFT,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: F.outfitExtraBold,
    color: INK,
    letterSpacing: -0.5,
    marginTop: 16,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    lineHeight: 23,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default MyClasses;

