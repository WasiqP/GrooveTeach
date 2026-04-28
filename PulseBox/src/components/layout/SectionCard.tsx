import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { useThemeMode, radius } from '../../theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

export default function SectionCard({ children, style, padded = true }: Props) {
  const { ink } = useThemeMode();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: ink.canvas,
          borderWidth: ink.borderWidth,
          borderColor: ink.borderInk,
          borderRadius: radius.card,
          padding: padded ? 16 : 0,
        },
      }),
    [ink, padded],
  );

  return <View style={[styles.card, style]}>{children}</View>;
}

