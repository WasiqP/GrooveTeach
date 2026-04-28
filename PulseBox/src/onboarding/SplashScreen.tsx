import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { fonts as F, useThemeMode } from '../theme';
import ScreenFrame from '../components/layout/ScreenFrame';
import { scaleFont, useResponsive } from '../ui/responsive';

/**
 * Short branded splash shown while the app loads—matches brand purple and introduces the product for teachers.
 */
const SplashScreen: React.FC = () => {
  const { theme } = useThemeMode();
  const r = useResponsive();
  const BG = theme.primary;

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          fontSize: scaleFont(30, r.titleScale),
          lineHeight: scaleFont(36, r.titleScale),
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
          color: 'rgba(255,255,255,0.92)',
          textAlign: 'center',
          maxWidth: r.contentMaxWidth,
        },
      }),
    [BG, r.titleScale, r.contentMaxWidth],
  );

  return (
    <ScreenFrame style={styles.safe} edges={['top', 'bottom', 'left', 'right']} framed={false}>
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
    </ScreenFrame>
  );
};

export default SplashScreen;
