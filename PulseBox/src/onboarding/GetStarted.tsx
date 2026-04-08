import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { theme, fonts as F, ink } from '../theme';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'GetStarted'>;

const GetStarted: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <PulseScrollView
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View style={styles.illustrationWrap}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../../assets/images/logo-transparent.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
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
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            android_ripple={{ color: theme.rippleLight }}
            onPress={() => navigation.navigate('Onboarding01')}
          >
            <Text style={styles.primaryLabel}>Get Started</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            onPress={() => navigation.navigate('Login')}
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
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 248,
    maxWidth: '100%',
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
