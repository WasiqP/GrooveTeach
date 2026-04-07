import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme';

const MIN_TOUCH = 44;

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Arrow-only back control: large hit area, ripple on Android, a11y label for VoiceOver/TalkBack.
 */
const BackButton: React.FC<Props> = ({ onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      android_ripple={{ color: theme.ripple, borderless: true, radius: 28 }}
      style={({ pressed }) => [styles.root, style, pressed && styles.pressed]}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 12 }}
    >
      <Text style={styles.arrow} allowFontScaling={false}>
        ←
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    minWidth: MIN_TOUCH,
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -6,
  },
  pressed: {
    opacity: 0.55,
  },
  arrow: {
    fontSize: 28,
    lineHeight: 32,
    color: theme.primary,
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default BackButton;
