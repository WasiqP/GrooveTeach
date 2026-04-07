import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';
import FormDetailsModal from '../components/FormDetailsModal';
import { useForms, FormData } from '../context/FormsContext';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'FormBuilder'>;

const questions = [
  {
    title: 'What are you?',
  },
  {
    title: 'What are you trying to collect feedback about?',
  },
  {
    title: 'Who is your target audience?',
  },
  {
    title: 'What\'s your main goal?',
  },
  {
    title: 'What information do you want to collect?',
  },
];

const FormBuilder: React.FC<Props> = ({ navigation, route }) => {
  const { answers } = route.params || {};
  const [showModal, setShowModal] = useState(false);
  const { addForm } = useForms();

  const handleSave = async (formName: string, iconId: string) => {
    const formData: FormData = {
      id: Date.now().toString(),
      name: formName,
      iconId: iconId,
      answers: answers,
      createdAt: new Date().toISOString(),
    };
    
    await addForm(formData);
    
    // Navigate back to Home after saving
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PulseScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Publish Form</Text>
          <Text style={styles.subtitle}>This is where you'll build your form</Text>
          
          {answers && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Form Preview</Text>
              <Text style={styles.previewSubtitle}>Review your selections</Text>
              
              {Object.entries(answers).map(([step, answerArray], index) => (
                <View key={index} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>Q{parseInt(step) + 1}</Text>
                    <View style={styles.questionDivider} />
                  </View>
                  <Text style={styles.questionTitle}>{questions[parseInt(step)].title}</Text>
                  
                  <View style={styles.tagsContainer}>
                    {Array.isArray(answerArray) && answerArray.length > 0 ? (
                      answerArray.map((answer: string, idx: number) => (
                        <View key={idx} style={styles.tag}>
                          <Text style={styles.tagText}>
                            {answer.charAt(0).toUpperCase() + answer.slice(1).replace(/_/g, ' ')}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{String(answerArray || '')}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable 
            style={styles.backButton}
            onPress={() => setShowModal(true)}
            android_ripple={{ color: 'rgba(160,96,255,0.2)' }}
          >
            <Text style={styles.backButtonText}>Publish Form</Text>
          </Pressable>
          <Pressable 
            style={styles.cancelButton}
            onPress={() => navigation.navigate('Home')}
            android_ripple={{ color: 'rgba(160,96,255,0.2)' }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </PulseScrollView>

      <FormDetailsModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    marginBottom: 32,
  },
  previewContainer: {
    marginBottom: 32,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 6,
  },
  previewSubtitle: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#1A1A22',
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: theme.primary,
    backgroundColor: '#F0F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  questionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 12,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'DMSans-Medium',
    color: '#333333',
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F5F5FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0FF',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'DMSans-Medium',
    color: theme.primary,
  },
  backButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans-Medium',
  },
  cancelButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans-Medium',
  },
});

export default FormBuilder;

