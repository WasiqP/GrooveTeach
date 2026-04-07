import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { theme, fonts as F, ink, radius } from '../theme';
import BackButton from '../components/Reusable-Components/BackButton';
import { useUser } from '../context/UserContext';
import { PulseScrollView } from '../components/PulseScrollView';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp: React.FC<Props> = ({ navigation }) => {
  const { setDisplayName } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('GetStarted');
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <PulseScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <BackButton onPress={handleBack} style={styles.backBtn} />

          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/images/logo-transparent.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="App logo"
            />
          </View>

          <View style={styles.inner}>
            <Text style={styles.sub}>Join today</Text>
            <Text style={styles.heading}>Sign up</Text>

            <TextInput
              style={[styles.input, styles.inputFirst]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={ink.inkSoft}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={ink.inkSoft}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={ink.inkSoft}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm your password"
              placeholderTextColor={ink.inkSoft}
              secureTextEntry
            />

            <Pressable
              style={styles.primaryBtn}
              android_ripple={{ color: theme.rippleLight }}
              onPress={async () => {
                await setDisplayName(name);
                navigation.replace('Home');
              }}
            >
              <Text style={styles.primaryLabel}>Sign Up</Text>
            </Pressable>

            <Text style={styles.socialHint}>Sign up with socials</Text>
            <View style={styles.socialRow}>
              <Pressable style={styles.socialBtn} android_ripple={{ color: 'rgba(255,255,255,0.15)' }}>
                <Text style={styles.socialText}>G</Text>
              </Pressable>
              <Pressable style={styles.socialBtn} android_ripple={{ color: 'rgba(255,255,255,0.15)' }}>
                <Text style={styles.socialText}>f</Text>
              </Pressable>
            </View>

            <Text style={styles.terms}>
              By signing up, you agree to our <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>

            <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginRow} hitSlop={8}>
              <Text style={styles.alt}>
                Already have an account? <Text style={styles.altLink}>Log In</Text>
              </Text>
            </Pressable>
          </View>
        </PulseScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    flex: 1,
    backgroundColor: ink.canvas,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 6,
    paddingBottom: 28,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  brandRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 128,
    height: 108,
    maxWidth: '100%',
  },
  inner: {
    width: '100%',
  },
  sub: {
    fontSize: 15,
    fontFamily: F.dmMedium,
    color: ink.inkSoft,
    marginBottom: 6,
  },
  heading: {
    fontSize: 36,
    lineHeight: 40,
    fontFamily: F.outfitBlack,
    color: ink.ink,
    marginTop: 2,
    marginBottom: 18,
    letterSpacing: -0.8,
  },
  input: {
    width: '100%',
    borderWidth: ink.borderWidth,
    borderColor: ink.borderInk,
    borderRadius: radius.input,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    fontFamily: F.dmRegular,
    color: ink.ink,
    marginTop: 12,
    backgroundColor: ink.canvas,
  },
  inputFirst: {
    marginTop: 0,
  },
  primaryBtn: {
    marginTop: 22,
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: radius.btn,
    alignItems: 'center',
  },
  primaryLabel: {
    color: theme.white,
    fontSize: 17,
    fontFamily: F.outfitBold,
  },
  socialHint: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    color: ink.inkSoft,
    fontFamily: F.dmMedium,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  socialBtn: {
    backgroundColor: ink.borderInk,
    width: 98,
    paddingVertical: 12,
    borderRadius: radius.btn,
    alignItems: 'center',
    borderWidth: ink.borderWidth,
    borderColor: ink.borderInk,
  },
  socialText: {
    color: theme.white,
    fontSize: 18,
    fontFamily: F.dmBold,
  },
  terms: {
    marginTop: 20,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: ink.inkSoft,
    fontFamily: F.dmRegular,
    paddingHorizontal: 6,
  },
  link: {
    color: theme.primary,
    fontFamily: F.dmBold,
  },
  loginRow: {
    marginTop: 22,
    paddingBottom: 10,
    alignItems: 'center',
  },
  alt: {
    fontSize: 14,
    textAlign: 'center',
    color: ink.inkSoft,
    fontFamily: F.dmRegular,
  },
  altLink: {
    color: theme.primary,
    fontFamily: F.outfitBold,
  },
});

export default SignUp;
