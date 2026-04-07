import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme, fonts as F, radius } from '../../theme';

const Button = ({ title, onPress, style }: { title: string; onPress: () => void; style?: ViewStyle }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress} android_ripple={{ color: theme.rippleLight }}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radius.btn,
  },
  text: {
    color: theme.white,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: F.outfitBold,
  },
});
