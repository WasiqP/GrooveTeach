import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { fonts as F, radius, useThemeMode } from '../theme';
import ScreenFrame from './layout/ScreenFrame';
import { scaleFont, useResponsive } from '../ui/responsive';

interface Props {
  Illustration: React.ComponentType<any>;
  title: string;
  description: string;
  step: number;
  total: number;
  onNext: () => void;
  nextLabel?: string;
  onSkip?: () => void;
}

const OnboardingCard: React.FC<Props> = ({
  Illustration,
  title,
  description,
  step,
  total,
  onNext,
  nextLabel = 'Continue',
  onSkip,
}) => {
  const { ink, theme } = useThemeMode();
  const r = useResponsive();
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const { illusWidth, illusHeight } = useMemo(() => {
    const aspect = 1024 / 768;
    const maxZoneHeight = SCREEN_HEIGHT * 0.55 - 60;
    const maxZoneWidth = SCREEN_WIDTH - r.gutter * 2;
    let w = Math.min(maxZoneWidth, 420);
    let h = w / aspect;
    if (h > maxZoneHeight) {
      h = maxZoneHeight;
      w = h * aspect;
    }
    if (w < 220) {
      w = 220;
      h = w / aspect;
    }
    return { illusWidth: Math.round(w), illusHeight: Math.round(h) };
  }, [SCREEN_HEIGHT, SCREEN_WIDTH, r.gutter]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: ink.canvas,
          paddingTop: 40,
          paddingBottom: 32,
        },
        content: {
          flex: 1,
          width: '100%',
          maxWidth: r.contentMaxWidth,
          alignSelf: 'center',
          paddingHorizontal: r.gutter,
        },
        illustrationZone: {
          flex: 0.55,
          justifyContent: 'center',
          alignItems: 'center',
        },
        textZone: {
          flex: 0.45,
          alignItems: 'center',
        },
        title: {
          fontSize: scaleFont(26, r.titleScale),
          lineHeight: scaleFont(32, r.titleScale),
          fontFamily: F.outfitExtraBold,
          color: ink.ink,
          textAlign: 'center',
          marginTop: 8,
          letterSpacing: -0.5,
        },
        desc: {
          fontSize: 15,
          lineHeight: 22,
          color: ink.inkSoft,
          textAlign: 'center',
          marginTop: 14,
          fontFamily: F.dmRegular,
          paddingHorizontal: 8,
        },
        pagination: {
          flexDirection: 'row',
          gap: 8,
          marginTop: 24,
        },
        dot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: ink.rowDivider,
        },
        dotActive: {
          width: 18,
          backgroundColor: theme.primary,
        },
        primaryBtn: {
          marginTop: 28,
          backgroundColor: theme.primary,
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: radius.btn,
          alignSelf: 'stretch',
          alignItems: 'center',
        },
        primaryLabel: {
          color: theme.white,
          fontSize: 17,
          fontFamily: F.outfitBold,
        },
        secondaryBtn: {
          marginTop: 14,
          backgroundColor: ink.canvas,
          borderWidth: ink.borderWidth,
          borderColor: ink.borderInk,
          paddingVertical: 15,
          paddingHorizontal: 32,
          borderRadius: radius.btn,
          alignSelf: 'stretch',
          alignItems: 'center',
        },
        secondaryLabel: {
          color: ink.ink,
          fontSize: 17,
          fontFamily: F.outfitBold,
        },
      }),
    [ink, theme, r.gutter, r.contentMaxWidth, r.titleScale],
  );

  return (
    <ScreenFrame style={styles.screen} edges={['top', 'bottom']} framed={false}>
      <View style={styles.content}>
        <View style={styles.illustrationZone}>
          <Illustration width={illusWidth} height={illusHeight} />
        </View>
        <View style={styles.textZone}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{description}</Text>
          <View style={styles.pagination}>
            {Array.from({ length: total }).map((_, i) => (
              <View key={i} style={[styles.dot, i + 1 === step && styles.dotActive]} />
            ))}
          </View>
          <Pressable
            onPress={onNext}
            style={styles.primaryBtn}
            android_ripple={{ color: theme.rippleLight }}
          >
            <Text style={styles.primaryLabel}>{nextLabel}</Text>
          </Pressable>
          {onSkip && (
            <Pressable
              onPress={onSkip}
              style={styles.secondaryBtn}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            >
              <Text style={styles.secondaryLabel}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenFrame>
  );
};

export default OnboardingCard;
