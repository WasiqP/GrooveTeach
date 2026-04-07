import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Modal, Pressable, PanResponder, Vibration } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { theme } from '../theme/Colors';
import { ink } from '../theme/typography';
import { useForms } from '../context/FormsContext';
import ShareIcon from '../../assets/images/share.svg';
import EditIcon from '../../assets/images/edit.svg';
import EditPurpleIcon from '../../assets/images/edit-purple.svg';
import TrashIcon from '../../assets/images/trash.svg';
import SwapIcon from '../../assets/images/swap.svg';
import ArrowUp from '../../assets/images/purple-arrow-up.svg';
import ArrowDown from '../../assets/images/purple-arrow-down.svg';
import BackIcon from '../../assets/images/Back.svg';
import type { QuestionData, QuestionType } from './QuestionsScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'EditForm'>;

const ITEM_HEIGHT = 96;

const EditForm: React.FC<Props> = ({ route, navigation }) => {
  const { formId } = route.params;
  const { forms, addForm, updateForm } = useForms();
  const form = useMemo(() => forms.find(f => f.id === formId), [forms, formId]);

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const trashScale = useRef(new Animated.Value(1)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;
  const [pageStart, setPageStart] = useState(0);
  const PAGE_SIZE = 4;

  const loadQuestions = () => {
    // derive questions from stored answers if present
    const derived: QuestionData[] = (form?.answers?.questions as QuestionData[] | undefined)
      || Array.from({ length: 6 }).map((_, i) => ({ 
          id: `${i + 1}`, 
          title: `Question ${i + 1}`,
          type: 'shortText' as QuestionType,
          required: false
        }));
    setQuestions(derived);
  };

  useEffect(() => {
    loadQuestions();
  }, [form]);

  // Reload questions when screen comes into focus (e.g., returning from QuestionsScreen)
  useFocusEffect(
    React.useCallback(() => {
      loadQuestions();
    }, [form])
  );

  const handleDeleteByIndex = (index: number) => {
    setQuestions(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (form) {
        updateForm(formId, {
          answers: {
            ...form.answers,
            questions: next,
          },
        });
      }
      return next;
    });
    setShowDeleteModal(true);
    setTimeout(() => setShowDeleteModal(false), 1600);
  };

  const swapQuestions = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= questions.length || toIndex === fromIndex) return;
    setQuestions(prev => {
      const copy = prev.slice();
      const tmp = copy[fromIndex];
      copy[fromIndex] = copy[toIndex];
      copy[toIndex] = tmp;
      // Save to form context
      if (form) {
        updateForm(formId, {
          answers: {
            ...form.answers,
            questions: copy
          }
        });
      }
      return copy;
    });
  };

  const QuestionRow: React.FC<{ q: QuestionData; index: number }> = ({ q, index }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const [isDragging, setIsDragging] = useState(false);
    const hasMovedRef = useRef(false);
    const dragStartY = useRef(0);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => {
          // Only start drag if movement is significant (more than 5 pixels)
          return Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5;
        },
        onPanResponderGrant: () => {
          hasMovedRef.current = false;
          setIsDragging(true);
          dragStartY.current = 0;
        },
        onPanResponderMove: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5) {
            hasMovedRef.current = true;
            if (!dragStartY.current) {
              // First significant movement - activate drag
              dragStartY.current = gesture.moveY;
              Vibration.vibrate(10);
              Animated.parallel([
                Animated.spring(scale, { toValue: 1.02, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.95, duration: 120, useNativeDriver: true }),
              ]).start();
              Animated.spring(trashScale, { toValue: 1.2, friction: 4, useNativeDriver: true }).start();
            }
            translateX.setValue(gesture.dx);
            translateY.setValue(gesture.dy);
          }
        },
        onPanResponderRelease: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          // Only handle drag actions if there was significant movement
          if (hasMovedRef.current) {
            Animated.parallel([
              Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
              Animated.spring(trashScale, { toValue: 1, useNativeDriver: true }),
            ]).start();

            if (gesture.dx < -80) {
              handleDeleteByIndex(index);
              hasMovedRef.current = false;
              setIsDragging(false);
              Animated.parallel([
                Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
              ]).start();
              return;
            }

            if (gesture.dx > 100 && gesture.dy < -60) {
              handleDeleteByIndex(index);
              hasMovedRef.current = false;
              setIsDragging(false);
              Animated.parallel([
                Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
              ]).start();
              return;
            }

            if (Math.abs(gesture.dy) > ITEM_HEIGHT / 2) {
              const steps = Math.round(gesture.dy / ITEM_HEIGHT);
              const targetIndex = Math.max(0, Math.min(questions.length - 1, index + steps));
              if (targetIndex !== index) {
                swapQuestions(index, targetIndex);
              }
            }

            Animated.parallel([
              Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
              Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            ]).start();
          }
          hasMovedRef.current = false;
          setIsDragging(false);
          dragStartY.current = 0;
        },
        onPanResponderTerminate: () => {
          hasMovedRef.current = false;
          setIsDragging(false);
          dragStartY.current = 0;
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(trashScale, { toValue: 1, useNativeDriver: true }),
          ]).start();
        },
      })
    ).current;

    return (
      <Pressable 
        onPress={() => {
          // Only navigate if it wasn't a drag gesture
          if (!hasMovedRef.current && !isDragging) {
            navigation.navigate('QuestionsScreen', { formId, questionId: q.id });
          }
        }}
        delayLongPress={200}
      >
        <Animated.View
          style={[
            styles.questionItem,
            { transform: [{ translateX }, { translateY }, { scale }], opacity },
            isDragging ? { zIndex: 9999, elevation: 9999 } : null,
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.qLeft}>
            <Text style={styles.qIndex}>{index + 1}</Text>
          </View>
          <View style={styles.qContent}>
            <Text style={styles.qTitle}>{q.title || 'Untitled Question'}</Text>
            <View style={styles.qSubRow}>
              <Text style={styles.qSub}>
                {q.type === 'multipleChoice' && q.options && q.options.length > 0 
                  ? `${q.options.length} options`
                  : q.type === 'checkbox' && q.options && q.options.length > 0
                  ? `${q.options.length} options`
                  : q.type === 'dropdown' && q.options && q.options.length > 0
                  ? `${q.options.length} options`
                  : q.type === 'rating'
                  ? `Rating (${q.maxRating || 5} max)`
                  : q.type === 'number'
                  ? `Number${q.min !== undefined || q.max !== undefined ? ' (constrained)' : ''}`
                  : q.type === 'date'
                  ? `Date (${q.dateFormat || 'MM/DD/YYYY'})`
                  : q.type === 'shortText' || q.type === 'longText'
                  ? `${q.type === 'shortText' ? 'Short' : 'Long'} Answer${q.maxLength ? ` (${q.maxLength} chars)` : ''}`
                  : q.type === 'email'
                  ? 'Email'
                  : q.type ? q.type.charAt(0).toUpperCase() + q.type.slice(1) : 'Question'}
              </Text>
              {q.required && (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredText}>Required</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.qRight}>
            <Pressable 
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('QuestionsScreen', { formId, questionId: q.id });
              }}
              style={styles.editIconBtn}
              android_ripple={{ color: 'rgba(160,96,255,0.12)', borderless: true }}
            >
              <EditPurpleIcon width={24} height={24} />
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  if (!form) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}> 
        <Text style={{ fontSize: 16 }}>Form not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Subtle purple-white gradient background */}
      <Svg pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <SvgLinearGradient id="bgGradEdit" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.96" />
            <Stop offset="85%" stopColor="#F3E9FF" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#A060FF" stopOpacity="0.30" />
          </SvgLinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGradEdit)" />
      </Svg>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} android_ripple={{ color: 'rgba(160,96,255,0.12)', borderless: true }}>
          <BackIcon width={16} height={16} stroke={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.screenTitle}>Edit Your Forms</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable 
            style={styles.headerAction}
            onPress={() => navigation.navigate('ShareForm', { formId })}
            android_ripple={{ color: 'rgba(160,96,255,0.12)', borderless: true }}
          >
            <ShareIcon width={22} height={22} stroke={theme.text} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>        
        {/* Page Title */}
        <View style={styles.pageHead}>
          <Text style={styles.pageTitle}>{form.name}</Text>
          <Text style={styles.pageDesc}>Edit as You go. Your Questions are already created as Per your Requirement</Text>
        </View>

        {/* Toolbar Row */}
        <View style={styles.toolsRow}>
          <Animated.View style={[styles.trashTarget, { transform: [{ scale: trashScale }] }]}> 
            <TrashIcon width={30} height={30} stroke={theme.text} />
          </Animated.View>
          <Pressable style={styles.addBtn} onPress={() => setQuestions(prev => {
            const maxId = prev.reduce((max, q) => {
              const n = parseInt(q.id, 10);
              return Number.isFinite(n) ? Math.max(max, n) : max;
            }, 0);
            const nextId = (maxId + 1).toString();
            const next = [...prev, { 
              id: nextId, 
              title: `Question ${nextId}`,
              type: 'shortText' as QuestionType,
              required: false
            }];
            if (form) {
              updateForm(formId, {
                answers: {
                  ...form.answers,
                  questions: next,
                },
              });
            }
            return next;
          })} android_ripple={{ color: 'rgba(0,0,0,0.06)' }}>
            <Text style={styles.addBtnText}>Add a Question</Text>
          </Pressable>
          <View style={{ flex: 1 }} />
          <Pressable style={styles.rowEndIcon} onPress={() => navigation.navigate('SwapQuestions', { formId })} android_ripple={{ color: 'rgba(160,96,255,0.12)', borderless: true }}>
            <SwapIcon width={28} height={28} stroke={theme.text} />
          </Pressable>
        </View>

        <Animated.View style={[styles.pagedList, { opacity: listOpacity }]}>
          <Text style={styles.sectionTitle}>Questions</Text>
          {questions.slice(pageStart, pageStart + PAGE_SIZE).map((q, i) => (
            <QuestionRow key={`${q.id}-${pageStart + i}`} q={q} index={pageStart + i} />
          ))}
        </Animated.View>
      </View>

      {questions.length > PAGE_SIZE && (
        <View style={styles.pageControls}>
          <Pressable 
            onPress={() => {
              if (pageStart === 0) return;
              Animated.timing(listOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
                setPageStart(prev => Math.max(0, prev - PAGE_SIZE));
                Animated.timing(listOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
              });
            }}
            style={styles.pageBtn}
              android_ripple={pageStart === 0 ? undefined : { color: 'rgba(160,96,255,0.12)', borderless: true }}
            disabled={pageStart === 0}
          >
              <View style={pageStart === 0 ? styles.iconDisabled : null}>
                <ArrowUp width={50} height={50} />
            </View>
          </Pressable>
          <Pressable 
            onPress={() => {
              if (pageStart + PAGE_SIZE >= questions.length) return;
              Animated.timing(listOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
                setPageStart(prev => Math.min(questions.length - PAGE_SIZE, prev + PAGE_SIZE));
                Animated.timing(listOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
              });
            }}
            style={styles.pageBtn}
              android_ripple={pageStart + PAGE_SIZE >= questions.length ? undefined : { color: 'rgba(160,96,255,0.12)', borderless: true }}
            disabled={pageStart + PAGE_SIZE >= questions.length}
          >
              <View style={pageStart + PAGE_SIZE >= questions.length ? styles.iconDisabled : null}>
                <ArrowDown width={50} height={50} />
            </View>
          </Pressable>
        </View>
      )}

      {/* Delete toast */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalIcon}>🗑️</Text>
              <Text style={styles.modalTitle}>Question Deleted</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ink.canvas,
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: theme.border,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHead: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    marginBottom: 6,
  },
  pageDesc: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
    lineHeight: 18,
  },
  content: {
    flex: 1,
    backgroundColor: ink.canvas,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 160,
    overflow: 'visible',
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  trashTarget: {
    padding: 6,
  },
  rowEndIcon: {
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 18,
    paddingBottom: 60,
  },
  scrollView: {
    overflow: 'visible',
  },
  pagedList: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  pageControls: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 30,
  },
  pageBtn: {
    padding: 4,
    borderRadius: 8,
  },
  iconDisabled: {
    opacity: 0.3,
  },
  questionItem: {
    height: ITEM_HEIGHT,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: 'transparent',
    elevation: 0,
  },
  qLeft: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  qIndex: {
    width: 28,
    height: 28,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.primary,
    backgroundColor: ink.canvas,
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    color: '#000000',
    overflow: 'hidden',
    includeFontPadding: false,
  },
  qContent: {
    flex: 1,
  },
  qTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans-Medium',
    color: '#000000',
  },
  qSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
    flexWrap: 'wrap',
  },
  qSub: {
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    color: '#888888',
  },
  requiredBadge: {
    backgroundColor: '#FFE5E5',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  requiredText: {
    fontSize: 10,
    fontFamily: 'DMSans-SemiBold',
    color: '#D32F2F',
  },
  qRight: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.card,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
  addBtn: {
    alignSelf: 'flex-start',
    backgroundColor: theme.card,
    borderWidth: 2,
    borderColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
    marginLeft: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    color: theme.primary,
  },
  sectionTitle: {
    display: 'none',
  },
});

export default EditForm;


