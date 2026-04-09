import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, PanResponder, Dimensions, Vibration } from 'react-native';
import type { ScrollView } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { useForms } from '../context/FormsContext';
import { useThemeMode } from '../theme';
import BackButton from '../components/Reusable-Components/BackButton';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'SwapQuestions'>;

interface QuestionItem {
  id: string;
  title: string;
}

const SwapQuestionsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { ink, theme } = useThemeMode();
  const { formId } = route.params;
  const { forms, updateForm } = useForms();
  const form = forms.find(f => f.id === formId);
  
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView | null>(null);
  const scrollYRef = useRef(0);
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollDeltaRef = useRef(0); // negative = up, positive = down
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const ITEM_HEIGHT = 64; // approximate row height for drag calculations
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          width: 32,
        },
        headerCenter: {
          flex: 1,
          alignItems: 'center',
        },
        screenTitle: {
          fontSize: 16,
          fontWeight: '700',
          fontFamily: 'Outfit-Bold',
          color: theme.text,
        },
        content: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 20,
        },
        infoSection: {
          marginBottom: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderColor: theme.border,
        },
        infoTitle: {
          fontSize: 20,
          fontWeight: '700',
          fontFamily: 'Outfit-Bold',
          color: theme.text,
          marginBottom: 8,
        },
        infoDesc: {
          fontSize: 14,
          fontFamily: 'DMSans-Regular',
          color: ink.inkSoft,
          lineHeight: 20,
        },
        swapList: {
          paddingVertical: 6,
          paddingBottom: 100,
          flexGrow: 1,
        },
        swapItem: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.primary,
          borderRadius: 10,
          paddingVertical: 14,
          paddingHorizontal: 16,
          marginBottom: 12,
        },
        swapIndex: {
          width: 32,
          height: 32,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.primary,
          textAlign: 'center',
          textAlignVertical: 'center',
          marginRight: 14,
          fontSize: 14,
          fontFamily: 'DMSans-Medium',
          color: theme.text,
          backgroundColor: ink.canvas,
        },
        swapText: {
          flex: 1,
          fontSize: 16,
          fontFamily: 'DMSans-Medium',
          color: theme.text,
        },
      }),
    [ink, theme],
  );

  useEffect(() => {
    // Derive questions from stored answers if present
    const derived: QuestionItem[] = (form?.answers?.questions as QuestionItem[] | undefined)
      || Array.from({ length: 6 }).map((_, i) => ({ id: `${i + 1}`, title: `Question ${i + 1}` }));
    setQuestions(derived);
  }, [form]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset and fade in animation when screen comes into focus
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  const swapQuestions = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= questions.length || toIndex === fromIndex) return;
    setQuestions(prev => {
      const copy = prev.slice();
      const tmp = copy[fromIndex];
      copy[fromIndex] = copy[toIndex];
      copy[toIndex] = tmp;
      if (form) {
        updateForm(formId, {
          answers: {
            ...form.answers,
            questions: copy,
          },
        });
      }
      return copy;
    });
  };

  // Saving occurs on each swap; no explicit save needed

  const SwapRow: React.FC<{ q: QuestionItem; index: number }> = ({ q, index }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragActiveRef = useRef(false);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => {
          // Arm a long-press without taking responder yet to keep scroll smooth
          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = setTimeout(() => {
            dragActiveRef.current = true;
            Vibration.vibrate(10);
            Animated.parallel([
              Animated.spring(scale, { toValue: 1.02, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0.96, duration: 100, useNativeDriver: true }),
            ]).start();
          }, 200);
          return false; // don't capture yet; allow scroll
        },
        onMoveShouldSetPanResponder: () => {
          return dragActiveRef.current; // take over only after long press armed
        },
        onPanResponderGrant: () => {
          // already armed by long-press; nothing extra needed here
        },
        onPanResponderMove: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (!dragActiveRef.current) return;
          translateY.setValue(gesture.dy);

          // Auto-scroll when dragging near edges
          const topEdge = 120;
          const bottomEdge = SCREEN_HEIGHT - (insets.bottom + 40); // account for bottom inset
          const shouldScrollUp = gesture.moveY < topEdge;
          const shouldScrollDown = gesture.moveY > bottomEdge;

          // set desired scroll direction
          if (shouldScrollUp) {
            scrollDeltaRef.current = -12;
          } else if (shouldScrollDown) {
            scrollDeltaRef.current = 12;
          } else {
            scrollDeltaRef.current = 0;
          }

          // start timer once; it will read latest delta from ref
          if (!autoScrollTimerRef.current) {
            autoScrollTimerRef.current = setInterval(() => {
              if (!scrollRef.current) return;
              const delta = scrollDeltaRef.current;
              if (delta === 0) return;
              const next = Math.max(0, scrollYRef.current + delta);
              scrollRef.current.scrollTo({ y: next, animated: false });
              scrollYRef.current = next;
            }, 16);
          }
        },
        onPanResponderRelease: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          if (autoScrollTimerRef.current) {
            clearInterval(autoScrollTimerRef.current);
            autoScrollTimerRef.current = null;
          }
          scrollDeltaRef.current = 0;
          if (dragActiveRef.current && Math.abs(gesture.dy) > ITEM_HEIGHT / 2) {
            const steps = Math.round(gesture.dy / ITEM_HEIGHT);
            const targetIndex = Math.max(0, Math.min(questions.length - 1, index + steps));
            if (targetIndex !== index) {
              swapQuestions(index, targetIndex);
            }
          }
          dragActiveRef.current = false;
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
        },
        onPanResponderTerminate: () => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          if (autoScrollTimerRef.current) {
            clearInterval(autoScrollTimerRef.current);
            autoScrollTimerRef.current = null;
          }
          scrollDeltaRef.current = 0;
          dragActiveRef.current = false;
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
        },
      })
    ).current;

    return (
      <Animated.View
        style={[styles.swapItem, { transform: [{ translateY }, { scale }], opacity }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.swapIndex}>{index + 1}</Text>
        <Text style={styles.swapText}>{q.title}</Text>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Subtle purple-white gradient background */}
      <Svg pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <SvgLinearGradient id="bgGradSwap" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.96" />
            <Stop offset="100%" stopColor="#A060FF" stopOpacity="0.12" />
          </SvgLinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGradSwap)" />
      </Svg>
      {/* Header */}
      <View style={styles.header}>
        <BackButton
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          size={16}
          stroke={theme.text}
          rippleColor="rgba(160,96,255,0.12)"
        />
        <View style={styles.headerCenter}>
          <Text style={styles.screenTitle}>Reorder Questions</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Drag to Reorder</Text>
          <Text style={styles.infoDesc}>Long press and drag questions up or down to change their order</Text>
        </View>

        <PulseScrollView 
          ref={ref => {
            scrollRef.current = ref;
          }}
          contentContainerStyle={[styles.swapList, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          onScroll={e => {
            scrollYRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {questions.map((q, i) => (
            <SwapRow key={`swap-${q.id}-${i}`} q={q} index={i} />
          ))}
        </PulseScrollView>
      </View>
    </Animated.View>
  );
};

export default SwapQuestionsScreen;

