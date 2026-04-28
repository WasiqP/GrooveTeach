import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import BackButton from './Reusable-Components/BackButton';
import { useThemeMode } from '../theme';
import { useResponsive } from '../ui/responsive';

/** Minimal navigation shape for back affordance on tab-root screens */
export type TabHeaderNavigation = {
  canGoBack: () => boolean;
  goBack: () => void;
};

type Props = {
  navigation: TabHeaderNavigation;
  children: React.ReactNode;
  right?: React.ReactNode;
  /**
   * If the current screen is a tab root (no stack history), use this to define
   * where the back button should go (e.g. back to the Home tab).
   */
  onBackFallback?: () => void;
  /** Extra top inset so headers sit slightly below the safe area */
  paddingTop?: number;
  paddingHorizontal?: number;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_PADDING_TOP = 18;

/**
 * Shared header for tab screens: back control + title area + optional trailing action.
 */
export default function TabScreenHeaderBar({
  navigation,
  children,
  right,
  onBackFallback,
  paddingTop = DEFAULT_PADDING_TOP,
  paddingHorizontal,
  style,
}: Props) {
  const { ink } = useThemeMode();
  const r = useResponsive();
  const gutter = paddingHorizontal ?? r.gutter;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          paddingBottom: 16,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: ink.rowDivider,
          backgroundColor: ink.canvas,
        },
        inner: {
          width: '100%',
          maxWidth: r.contentMaxWidth,
          alignSelf: 'center',
        },
        row: {
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
        main: {
          flex: 1,
          minWidth: 0,
          paddingLeft: 2,
          justifyContent: 'center',
        },
        rightSlot: {
          marginLeft: 4,
        },
        rightSpacer: {
          width: 40,
        },
        backMuted: {
          opacity: 0.32,
        },
      }),
    [ink, r.contentMaxWidth],
  );

  const canBack = navigation.canGoBack();
  const canPressBack = canBack || !!onBackFallback;
  return (
    <View style={[styles.wrap, { paddingTop }, style]}>
      <View style={[styles.inner, { paddingHorizontal: gutter }]}>
        <View style={styles.row}>
          <BackButton
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
              else onBackFallback?.();
            }}
            style={!canPressBack ? styles.backMuted : undefined}
          />
          <View style={styles.main}>{children}</View>
          {right != null ? <View style={styles.rightSlot}>{right}</View> : <View style={styles.rightSpacer} />}
        </View>
      </View>
    </View>
  );
}
