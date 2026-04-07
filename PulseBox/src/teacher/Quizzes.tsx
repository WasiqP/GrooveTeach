import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import BottomTab from '../components/BottomTab';
import { PulseScrollView } from '../components/PulseScrollView';
import TabScreenHeaderBar from '../components/TabScreenHeaderBar';
import { useForms } from '../context/FormsContext';
import FormIcon from '../components/FormIcons';
import { theme, fonts as F, ink, radius } from '../theme';
import Svg, { Path } from 'react-native-svg';

const CANVAS = ink.canvas;
const INK = ink.ink;
const INK_SOFT = ink.inkSoft;
const BORDER_INK = ink.borderInk;
const BORDER_WIDTH = ink.borderWidth;
const ROW_DIVIDER = ink.rowDivider;
const R_CARD = radius.card;
const R_INPUT = radius.input;
import ShareIcon from '../../assets/images/share.svg';
import EditIcon from '../../assets/images/edit.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Quizzes'>;

interface Quiz {
  id: string;
  title: string;
  type: 'quiz' | 'assignment' | 'test';
  classId: string;
  className: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  createdAt: string;
}

// Icons
const QuizIcon = ({ size = 24, color = ink.inkSoft }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 11L12 14L22 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const Quizzes: React.FC<Props> = ({ navigation }) => {
  const { forms } = useForms(); // Use existing forms context - forms are now quizzes
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'quiz' | 'assignment' | 'test'>('all');
  
  // Convert forms to quizzes format (forms are now quizzes/assessments/tests)
  const quizzes: Quiz[] = forms.map(form => ({
    id: form.id,
    title: form.name,
    type: 'quiz' as const, // Default to quiz, can be enhanced later
    classId: '1', // Will be linked to classes later
    className: 'All Classes', // Will be linked to classes later
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    submissions: 0, // Will be tracked later
    totalStudents: 28, // Will be linked to classes later
    createdAt: form.createdAt,
  }));
  
  // Mock additional quizzes for demo (can be removed when forms are fully integrated)
  const mockQuizzes: Quiz[] = forms.length === 0 ? [
    {
      id: '1',
      title: 'Algebra Quiz - Chapter 5',
      type: 'quiz',
      classId: '1',
      className: 'Mathematics 101',
      dueDate: '2024-02-15',
      submissions: 24,
      totalStudents: 28,
      createdAt: '2024-02-01',
    },
    {
      id: '2',
      title: 'Essay: Shakespeare Analysis',
      type: 'assignment',
      classId: '2',
      className: 'English Literature',
      dueDate: '2024-02-20',
      submissions: 18,
      totalStudents: 24,
      createdAt: '2024-02-05',
    },
    {
      id: '3',
      title: 'Midterm Exam - Biology',
      type: 'test',
      classId: '3',
      className: 'Biology 201',
      dueDate: '2024-02-25',
      submissions: 0,
      totalStudents: 30,
      createdAt: '2024-02-10',
    },
  ] : [];
  
  // Combine forms (as quizzes) with mock data
  const allQuizzes = [...quizzes, ...mockQuizzes];

  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || quiz.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return '#4CAF50';
      case 'assignment': return '#2196F3';
      case 'test': return '#F44336';
      default: return '#1A1A22';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz': return 'Quiz';
      case 'assignment': return 'Assignment';
      case 'test': return 'Test';
      default: return type;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TabScreenHeaderBar navigation={navigation}>
        <View>
          <Text style={styles.title}>Quizzes & Assignments</Text>
          <Text style={styles.subtitle}>Create and manage quizzes, assignments, and tests</Text>
        </View>
      </TabScreenHeaderBar>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search quizzes..."
          placeholderTextColor={ink.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <Pressable
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'quiz' && styles.filterTabActive]}
          onPress={() => setFilter('quiz')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'quiz' && styles.filterTabTextActive]}>
            Quizzes
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'assignment' && styles.filterTabActive]}
          onPress={() => setFilter('assignment')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'assignment' && styles.filterTabTextActive]}>
            Assignments
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'test' && styles.filterTabActive]}
          onPress={() => setFilter('test')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'test' && styles.filterTabTextActive]}>
            Tests
          </Text>
        </Pressable>
      </View>

      {/* Create New Button */}
      <Pressable
        style={styles.createBtn}
        android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
        onPress={() => navigation.navigate('CreateForm')}
      >
        <View style={styles.createContent}>
          <View style={styles.plusIcon}>
            <Text style={styles.plusText}>+</Text>
          </View>
          <View style={styles.createText}>
            <Text style={styles.createTitle}>Create New Quiz/Assignment</Text>
            <Text style={styles.createDesc}>Create a quiz, assignment, or test</Text>
          </View>
        </View>
      </Pressable>

      {/* Quizzes List */}
      <PulseScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredQuizzes.length === 0 ? (
          <View style={styles.emptyState}>
            <QuizIcon size={64} color={ink.iconMuted} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No quizzes found' : 'No quizzes yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try adjusting your search'
                : 'Create your first quiz or assignment to get started'}
            </Text>
          </View>
        ) : (
          filteredQuizzes.map((quiz) => {
            const form = forms.find(f => f.id === quiz.id);
            return (
            <Pressable
              key={quiz.id}
              style={styles.quizCard}
              android_ripple={{ color: 'rgba(160,96,255,0.08)' }}
              onPress={() => navigation.navigate('EditForm', { formId: quiz.id })}
            >
              <View style={styles.quizIcon}>
                {form ? (
                  <FormIcon iconId={form.iconId} size={24} color={getTypeColor(quiz.type)} />
                ) : (
                  <QuizIcon size={24} color={getTypeColor(quiz.type)} />
                )}
              </View>
              <View style={styles.quizContent}>
                <View style={styles.quizHeader}>
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(quiz.type) + '20' }]}>
                    <Text style={[styles.typeBadgeText, { color: getTypeColor(quiz.type) }]}>
                      {getTypeLabel(quiz.type)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.quizClass}>{quiz.className}</Text>
                <View style={styles.quizInfo}>
                  <Text style={styles.quizInfoText}>
                    Due: {new Date(quiz.dueDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.quizInfoText}>
                    • {quiz.submissions}/{quiz.totalStudents} submitted
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(quiz.submissions / quiz.totalStudents) * 100}%`,
                        backgroundColor: getTypeColor(quiz.type),
                      },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.quizActions}>
                <Pressable
                  style={styles.actionBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate('EditForm', { formId: quiz.id });
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
                >
                  <EditIcon width={18} height={18} stroke="#000000" />
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, { marginLeft: 8 }]}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate('ShareForm', { formId: quiz.id });
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
                >
                  <ShareIcon width={18} height={18} stroke="#000000" />
                </Pressable>
              </View>
            </Pressable>
          )})
        )}
      </PulseScrollView>

      <BottomTab navigation={navigation} currentRoute="Quizzes" />
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
    paddingBottom: 12,
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
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
    backgroundColor: CANVAS,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
  },
  filterTabActive: {
    backgroundColor: INK,
    borderColor: INK,
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: F.dmMedium,
    color: INK_SOFT,
  },
  filterTabTextActive: {
    color: CANVAS,
  },
  createBtn: {
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: theme.primary,
    borderRadius: R_CARD,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  createContent: {
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
  createText: {
    flex: 1,
  },
  createTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: F.outfitBold,
    color: theme.primary,
    marginBottom: 3,
  },
  createDesc: {
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
  quizCard: {
    flexDirection: 'row',
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    borderRadius: R_CARD,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  quizIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  quizContent: {
    flex: 1,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  quizTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: F.dmBold,
    color: INK,
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: F.dmSemi,
  },
  quizClass: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginBottom: 8,
  },
  quizInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  quizInfoText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: F.dmRegular,
    color: INK_SOFT,
    marginRight: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: ROW_DIVIDER,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quizActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CANVAS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_INK,
    alignItems: 'center',
    justifyContent: 'center',
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

export default Quizzes;

