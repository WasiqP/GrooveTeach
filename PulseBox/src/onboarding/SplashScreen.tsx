import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, fonts as F } from '../theme';

const BG = theme.primary;

/**
 * Short branded splash shown while the app loads—matches native purple (#A060FF) and introduces the product for teachers.
 */
const SplashScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <View style={styles.inner}>
        <Image
          source={require('../../assets/images/logo-transparent.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headline} accessibilityRole="header">
          Built for teachers
        </Text>
        <Text style={styles.sub}>
          Plan lessons, take attendance, and run class—from one clear dashboard.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 220,
    height: 200,
    maxWidth: '88%',
    marginBottom: 28,
  },
  headline: {
    fontSize: 30,
    lineHeight: 36,
    fontFamily: F.outfitBlack,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  sub: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: F.dmRegular,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: 320,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
});

export default SplashScreen;
