import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View, StyleSheet } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeMode } from '../../theme';
import { useResponsive } from '../../ui/responsive';

type Props = {
  children: React.ReactNode;
  /** Which safe-area edges to apply. Default: ['top'] */
  edges?: Edge[];
  /** Optional screen-level style override */
  style?: StyleProp<ViewStyle>;
  /** Optional content wrapper style override */
  contentStyle?: StyleProp<ViewStyle>;
  /** When false, skips the centered content wrapper (useful for full-bleed layouts). Default true. */
  framed?: boolean;
};

/**
 * Standard screen wrapper:\n+ * - Applies SafeAreaView edges\n+ * - Sets background from theme\n+ * - Centers content with responsive gutters + maxWidth\n+ */
export default function ScreenFrame({
  children,
  edges = ['top'],
  style,
  contentStyle,
  framed = true,
}: Props) {
  const { ink } = useThemeMode();
  const r = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: ink.canvas,
        },
        content: {
          flex: 1,
          width: '100%',
          maxWidth: r.contentMaxWidth,
          alignSelf: 'center',
          paddingHorizontal: r.gutter,
        },
      }),
    [ink.canvas, r.contentMaxWidth, r.gutter],
  );

  return (
    <SafeAreaView style={[styles.screen, style]} edges={edges}>
      {framed ? <View style={[styles.content, contentStyle]}>{children}</View> : children}
    </SafeAreaView>
  );
}

