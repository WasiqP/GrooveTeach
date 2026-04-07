import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';
import { ink } from '../theme/typography';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateForm'>;

const CreateForm: React.FC<Props> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const questions = [
    {
      title: 'What type of assessment are you creating?',
      subtitle: 'Select the type that best fits your needs',
      options: [
        { id: 'quiz', title: 'Quiz', description: 'Short assessment with quick questions' },
        { id: 'assignment', title: 'Assignment', description: 'Longer project or homework' },
        { id: 'test', title: 'Test', description: 'Formal examination or assessment' },
        { id: 'survey', title: 'Survey', description: 'Collect feedback or opinions' },
        { id: 'poll', title: 'Poll', description: 'Quick question with multiple choices' },
      ],
    },
    {
      title: 'Which class is this for?',
      subtitle: 'Select the class or create for all classes',
      options: [
        { id: 'math', title: 'Mathematics', description: 'Math-related assessments' },
        { id: 'english', title: 'English', description: 'Language and literature' },
        { id: 'science', title: 'Science', description: 'Science subjects' },
        { id: 'history', title: 'History', description: 'Social studies and history' },
        { id: 'all', title: 'All Classes', description: 'Use across multiple classes' },
        { id: 'other', title: 'Other Subject', description: 'Different subject area' },
      ],
    },
    {
      title: 'What\'s the main topic?',
      subtitle: 'What will this assessment cover?',
      options: [
        { id: 'chapter', title: 'Chapter Review', description: 'Review specific chapter content' },
        { id: 'unit', title: 'Unit Test', description: 'Test entire unit knowledge' },
        { id: 'midterm', title: 'Midterm Exam', description: 'Mid-semester assessment' },
        { id: 'final', title: 'Final Exam', description: 'End of term assessment' },
        { id: 'homework', title: 'Homework', description: 'Practice and reinforcement' },
        { id: 'project', title: 'Project', description: 'Long-term project assessment' },
      ],
    },
    {
      title: 'What question types do you need?',
      subtitle: 'Select the types of questions you want to include',
      options: [
        { id: 'multiple_choice', title: 'Multiple Choice', description: 'Select one correct answer' },
        { id: 'true_false', title: 'True/False', description: 'Binary choice questions' },
        { id: 'short_answer', title: 'Short Answer', description: 'Brief text responses' },
        { id: 'essay', title: 'Essay', description: 'Long-form written responses' },
        { id: 'matching', title: 'Matching', description: 'Match items together' },
        { id: 'all', title: 'All Types', description: 'Mix of different question types' },
      ],
    },
    {
      title: 'When is this due?',
      subtitle: 'Set a deadline for submissions',
      options: [
        { id: 'today', title: 'Today', description: 'Due by end of day' },
        { id: 'tomorrow', title: 'Tomorrow', description: 'Due tomorrow' },
        { id: 'week', title: 'This Week', description: 'Due within 7 days' },
        { id: 'two_weeks', title: 'Two Weeks', description: 'Due within 14 days' },
        { id: 'month', title: 'This Month', description: 'Due within 30 days' },
        { id: 'custom', title: 'Custom Date', description: 'Set your own deadline' },
      ],
    },
  ];

  const handleSelectOption = (optionId: string) => {
    const currentAnswers = answers[currentStep] || [];
    const isSelected = currentAnswers.includes(optionId);
    
    let updatedAnswers;
    if (isSelected) {
      // Remove if already selected
      updatedAnswers = {
        ...answers,
        [currentStep]: currentAnswers.filter((id: string) => id !== optionId)
      };
    } else {
      // Add to selection
      updatedAnswers = {
        ...answers,
        [currentStep]: [...currentAnswers, optionId]
      };
    }
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      // All questions answered, proceed to form builder
      navigation.navigate('FormBuilder', { answers });
    }
  };

  const hasSelection = answers[currentStep] && answers[currentStep].length > 0;

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      navigation.goBack();
    }
  };

  const currentQuestion = questions[currentStep];
  const selectedAnswers = answers[currentStep] || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PulseScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentStep + 1) / questions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {currentStep + 1} of {questions.length}</Text>
        </View>

        {/* Back Button */}
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        {/* Question Content */}
        <View style={styles.content}>
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
          <Text style={styles.questionSubtitle}>{currentQuestion.subtitle}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers.includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
                  onPress={() => handleSelectOption(option.id)}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <View style={styles.checkboxInner} />}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Next/Continue Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.nextButton, !hasSelection && styles.nextButtonDisabled]}
              onPress={handleNext}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              disabled={!hasSelection}
            >
              <Text style={[styles.nextButtonText, !hasSelection && styles.nextButtonTextDisabled]}>
                {currentStep === questions.length - 1 ? 'Continue' : 'Next'}
              </Text>
            </Pressable>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 24,
    color: theme.primary,
    fontFamily: 'DMSans-Regular',
  },
  content: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 12,
    lineHeight: 36,
  },
  questionSubtitle: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 20,
    marginBottom: 12,
  },
  optionCardSelected: {
    backgroundColor: '#F0F0FF',
    borderColor: theme.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'DMSans-Medium',
    color: '#000000',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ink.borderInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.primary,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'DMSans-Medium',
  },
  nextButtonTextDisabled: {
    color: '#1A1A22',
  },
});

export default CreateForm;

