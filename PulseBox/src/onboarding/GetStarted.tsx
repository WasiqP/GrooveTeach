import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { theme, fonts as F, ink } from '../theme';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'GetStarted'>;

const GetStarted: React.FC<Props> = ({ navigation }) => {
  const flyY = useRef(new Animated.Value(0)).current;
  const flyScale = useRef(new Animated.Value(1)).current;
  const flyOpacity = useRef(new Animated.Value(1)).current;
  const animatingRef = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const resetLogoMotion = useCallback(() => {
    flyY.setValue(0);
    flyScale.setValue(1);
    flyOpacity.setValue(1);
    animatingRef.current = false;
    setIsAnimating(false);
  }, [flyY, flyScale, flyOpacity]);

  useFocusEffect(
    useCallback(() => {
      resetLogoMotion();
    }, [resetLogoMotion]),
  );

  const flyLogoThenNavigateToLogin = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);

    const up = -Math.min(Dimensions.get('window').height * 0.42, 320);

    Animated.parallel([
      Animated.timing(flyY, {
        toValue: up,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(flyScale, {
        toValue: 1.14,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(180),
        Animated.timing(flyOpacity, {
          toValue: 0,
          duration: 340,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(({ finished }) => {
      if (!finished) {
        resetLogoMotion();
      }
    });

    navigation.navigate('Login');
  };

  const logoMotion = {
    transform: [{ translateY: flyY }, { scale: flyScale }],
    opacity: flyOpacity,
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <PulseScrollView
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!isAnimating}
      >
        <View style={styles.hero}>
          <View style={styles.illustrationWrap}>
            <Animated.View style={[styles.logoAnimated, logoMotion]}>
              <Image
                source={require('../../assets/images/logo-transparent.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
          <Text style={styles.eyebrow}>Welcome to GrooveBox</Text>

          <Text style={styles.title}>
            <Text style={styles.titleGroove}>Groove</Text>
            <Text style={styles.titleBox}>Box</Text>
          </Text>

          <Text style={styles.lede}>
            Complete personal assistant for teachers. Plan classes, run quizzes, and track
            attendance—without jumping between apps.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.buttonZone}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.pressed,
              isAnimating && styles.btnDisabled,
            ]}
            android_ripple={{ color: theme.rippleLight }}
            disabled={isAnimating}
            onPress={() => navigation.navigate('Onboarding01')}
          >
            <Text style={styles.primaryLabel}>Get Started</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.pressed,
              isAnimating && styles.btnDisabled,
            ]}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            disabled={isAnimating}
            onPress={flyLogoThenNavigateToLogin}
          >
            <Text style={styles.secondaryLabel}>Log In</Text>
          </Pressable>
        </View>
      </PulseScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ink.canvas,
  },
  scrollInner: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  illustrationWrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 2,
    overflow: 'visible',
    zIndex: 2,
  },
  logoAnimated: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 248,
    maxWidth: '100%',
  },
  btnDisabled: {
    opacity: 0.55,
  },
  hero: {
    alignSelf: 'flex-start',
    width: '100%',
    maxWidth: 360,
    alignItems: 'flex-start',
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontFamily: F.dmSemi,
    color: ink.inkSoft,
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    fontFamily: F.outfitBlack,
    letterSpacing: -1,
    marginBottom: 12,
  },
  titleGroove: {
    color: ink.ink,
  },
  titleBox: {
    color: theme.brandLogoPurple,
  },
  lede: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: F.dmRegular,
    color: ink.inkSoft,
    maxWidth: 320,
  },
  divider: {
    alignSelf: 'flex-start',
    width: '100%',
    maxWidth: 360,
    height: StyleSheet.hairlineWidth,
    backgroundColor: ink.rowDivider,
    marginTop: 28,
    marginBottom: 22,
  },
  buttonZone: {
    alignSelf: 'stretch',
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  primaryBtn: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryBtn: {
    width: '100%',
    maxWidth: 320,
    borderWidth: ink.borderWidth,
    borderColor: ink.borderInk,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: ink.canvas,
  },
  pressed: {
    opacity: 0.88,
  },
  primaryLabel: {
    color: theme.white,
    fontSize: 17,
    fontFamily: F.outfitBold,
  },
  secondaryLabel: {
    color: ink.ink,
    fontSize: 17,
    fontFamily: F.outfitBold,
  },
});

export default GetStarted;
