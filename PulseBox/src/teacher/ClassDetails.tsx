import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { ink } from '../theme/typography';
import BackIcon from '../../assets/images/Back.svg';
import { PulseScrollView } from '../components/PulseScrollView';
import Svg, { Path } from 'react-native-svg';
import {
  useClasses,
  type ClassAnnouncement,
  type ClassActivityItem,
  type ClassActivityKind,
} from '../context/ClassesContext';
import { useGradesTasks, type TaskKind } from '../context/GradesTasksContext';
import { usePulseAlert } from '../context/AlertModalContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ClassDetails'>;

const TASK_KIND_LABEL: Record<TaskKind, string> = {
  quiz: 'Quiz',
  assignment: 'Assignment',
  project: 'Project',
  test: 'Test',
};

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 45) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

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

const MegaphoneIcon = ({ size = 20, color = '#A060FF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 11V9a2 2 0 012-2h2l5-3v14l-5-3H5a2 2 0 01-2-2v-2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M16 8v8M19 10v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ActivityKindIcon = ({ kind }: { kind: ClassActivityKind }) => {
  switch (kind) {
    case 'announcement':
      return <MegaphoneIcon size={18} color="#A060FF" />;
    case 'attendance':
      return <CheckIcon size={18} color="#4CAF50" />;
    case 'task_assigned':
      return <DocumentIcon size={18} color="#A060FF" />;
  }
};

const ClassDetails: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params;
  const { classes, deleteClass, updateClass } = useClasses();
  const { getTasksForClass } = useGradesTasks();
  const { showAlert, showSuccess } = usePulseAlert();
  const [announcementDraft, setAnnouncementDraft] = useState('');

  const classData = classes.find((c) => c.id === classId);

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
      onPress: () => navigation.navigate('ViewStudents', { classId }),
    },
    {
      id: 'quizzes',
      title: 'Quizzes & assignments',
      icon: DocumentIcon,
      color: '#A060FF',
      onPress: () => navigation.navigate('Home', { tab: 'Quizzes' }),
    },
    {
      id: 'grades',
      title: 'View Grades',
      icon: ChartIcon,
      color: '#FF9800',
      onPress: () => navigation.navigate('Home', { tab: 'ViewGrades' }),
    },
  ];

  const announcements = useMemo(() => {
    const list = classData?.announcements ?? [];
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [classData?.announcements]);

  const recentActivityItems = useMemo(() => {
    if (!classData) return [];
    const log = classData.activityLog ?? [];
    const tasks = getTasksForClass(classId);
    const fromTasks: ClassActivityItem[] = tasks.map((t) => ({
      id: `task-${t.id}`,
      kind: 'task_assigned' as const,
      headline: `Assigned: ${t.title}`,
      detail: [TASK_KIND_LABEL[t.kind], t.dueLabel].filter(Boolean).join(' · '),
      createdAt: t.createdAt,
    }));
    const merged = [...log, ...fromTasks];
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const seen = new Set<string>();
    const out: ClassActivityItem[] = [];
    for (const item of merged) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      out.push(item);
    }
    return out.slice(0, 25);
  }, [classData, classId, getTasksForClass]);

  const postAnnouncement = () => {
    if (!classData) return;
    const body = announcementDraft.trim();
    if (!body) {
      showAlert({
        variant: 'warning',
        title: 'Empty announcement',
        message: 'Write something before posting.',
      });
      return;
    }
    const createdAt = new Date().toISOString();
    const next: ClassAnnouncement = {
      id: `ann-${Date.now()}`,
      body,
      createdAt,
    };
    const merged = [next, ...(classData.announcements ?? [])];
    const activity: ClassActivityItem = {
      id: `act-${Date.now()}`,
      kind: 'announcement',
      headline: 'Posted an announcement',
      detail: body.length > 100 ? `${body.slice(0, 100)}…` : body,
      createdAt,
    };
    void updateClass(classData.id, {
      announcements: merged,
      activityLog: [activity, ...(classData.activityLog ?? [])].slice(0, 40),
    }).then(() => {
      setAnnouncementDraft('');
      showSuccess('Posted', 'Your announcement was added for this class.');
    });
  };

  const confirmDelete = () => {
    if (!classData) return;
    showAlert({
      variant: 'warning',
      title: 'Delete this class?',
      message: `“${classData.name}” will be removed. This cannot be undone.`,
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void deleteClass(classData.id).then(() => navigation.goBack());
          },
        },
      ],
    });
  };

  if (!classData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
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
        <View style={styles.notFoundWrap}>
          <Text style={styles.notFoundTitle}>Class not found</Text>
          <Text style={styles.notFoundSub}>It may have been deleted.</Text>
          <Pressable style={styles.notFoundBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.notFoundBtnTxt}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
        keyboardShouldPersistTaps="handled"
      >
        {/* Class Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.className}>{classData.name}</Text>
          {(classData.schoolName || classData.schoolType) ? (
            <Text style={styles.schoolLine}>
              {[classData.schoolName, classData.schoolType].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
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

        {/* Announcements */}
        <View style={styles.sectionOuter}>
          <View style={styles.borderedSection}>
            <Text style={styles.sectionTitleInCard}>Announcements</Text>
            <Text style={styles.announcementLead}>
              Share updates with everyone in this class. New posts appear at the top.
            </Text>
            <View style={styles.announcementComposer}>
              <TextInput
                style={styles.announcementInput}
                placeholder="Write an announcement…"
                placeholderTextColor="#94A3B8"
                value={announcementDraft}
                onChangeText={setAnnouncementDraft}
                multiline
                textAlignVertical="top"
                maxLength={2000}
              />
              <Pressable
                style={({ pressed }) => [styles.postAnnouncementBtn, pressed && styles.postAnnouncementBtnPressed]}
                onPress={postAnnouncement}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <Text style={styles.postAnnouncementBtnText}>Post announcement</Text>
              </Pressable>
            </View>
            {announcements.length > 0 ? (
              <View style={styles.announcementList}>
                {announcements.map((a, index) => (
                  <View
                    key={a.id}
                    style={[
                      styles.announcementRow,
                      index === announcements.length - 1 && styles.announcementRowLast,
                    ]}
                  >
                    <View style={styles.announcementRowHeader}>
                      <MegaphoneIcon size={16} color="#A060FF" />
                      <Text style={styles.announcementDate}>
                        {new Date(a.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </Text>
                    </View>
                    <Text style={styles.announcementBody}>{a.body}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.announcementEmpty}>No announcements yet. Be the first to post.</Text>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionOuter}>
          <View style={styles.borderedSection}>
            <View style={styles.activitySectionHeader}>
              <Text style={styles.sectionTitleInCard}>Recent activity</Text>
              <View style={styles.notifPill}>
                <Text style={styles.notifPillText}>Notifications</Text>
              </View>
            </View>
            <Text style={styles.activityIntro}>
              Tasks, attendance, and announcements for this class appear here.
            </Text>
            {recentActivityItems.length === 0 ? (
              <View style={styles.activityEmptyBox}>
                <Text style={styles.activityEmptyTitle}>No activity yet</Text>
                <Text style={styles.activityEmptySub}>
                  Post an announcement, mark attendance, or assign a task to see updates.
                </Text>
              </View>
            ) : (
              <View style={styles.activityList}>
                {recentActivityItems.map((item) => (
                  <View key={item.id} style={styles.activityRow}>
                    <View style={styles.activityUnreadDot} />
                    <View style={styles.activityIconWrap}>
                      <ActivityKindIcon kind={item.kind} />
                    </View>
                    <View style={styles.activityCopy}>
                      <Text style={styles.activityHeadline}>{item.headline}</Text>
                      {item.detail ? (
                        <Text style={styles.activityDetail} numberOfLines={3}>
                          {item.detail}
                        </Text>
                      ) : null}
                      <Text style={styles.activityTime}>{formatRelativeTime(item.createdAt)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <Pressable
          style={styles.deleteBtn}
          onPress={confirmDelete}
          android_ripple={{ color: 'rgba(220,38,38,0.12)' }}
        >
          <Text style={styles.deleteBtnText}>Delete class</Text>
        </Pressable>
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
  schoolLine: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#64748B',
    marginBottom: 10,
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
  sectionOuter: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  borderedSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitleInCard: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  announcementLead: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#64748B',
    marginBottom: 14,
  },
  announcementComposer: {
    marginBottom: 16,
  },
  announcementInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
  },
  postAnnouncementBtn: {
    backgroundColor: '#A060FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  postAnnouncementBtnPressed: {
    opacity: 0.9,
  },
  postAnnouncementBtnText: {
    fontSize: 16,
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
  },
  announcementList: {
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
  },
  announcementRow: {
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  announcementRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  announcementRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  announcementDate: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#64748B',
  },
  announcementBody: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
  },
  announcementEmpty: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 4,
  },
  activitySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  notifPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: 'rgba(160, 96, 255, 0.08)',
  },
  notifPillText: {
    fontSize: 11,
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
    letterSpacing: 0.2,
  },
  activityIntro: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'DMSans-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  activityEmptyBox: {
    paddingVertical: 12,
  },
  activityEmptyTitle: {
    fontSize: 15,
    fontFamily: 'DMSans-SemiBold',
    color: '#1A1A22',
    marginBottom: 4,
  },
  activityEmptySub: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#64748B',
  },
  activityList: {
    gap: 0,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  activityUnreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A060FF',
    marginTop: 14,
    marginRight: 8,
  },
  activityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(160, 96, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityCopy: {
    flex: 1,
    minWidth: 0,
  },
  activityHeadline: {
    fontSize: 15,
    fontFamily: 'DMSans-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  activityDetail: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#475569',
    marginBottom: 6,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#94A3B8',
  },
  deleteBtn: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(220, 38, 38, 0.45)',
    backgroundColor: 'rgba(220, 38, 38, 0.06)',
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 16,
    fontFamily: 'DMSans-SemiBold',
    color: '#DC2626',
  },
  notFoundWrap: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  notFoundSub: {
    fontSize: 15,
    fontFamily: 'DMSans-Regular',
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  notFoundBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#A060FF',
  },
  notFoundBtnTxt: {
    fontSize: 16,
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
  },
});

export default ClassDetails;

