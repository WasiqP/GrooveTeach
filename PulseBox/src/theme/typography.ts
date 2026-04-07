/**
 * Outfit + DM Sans (linked via react-native.config.js → assets/Fonts).
 * Same tokens as Home — use across onboarding & auth for one visual system.
 */
export const fonts = {
  outfitBlack: 'Outfit-Black',
  outfitExtraBold: 'Outfit-ExtraBold',
  outfitBold: 'Outfit-Bold',
  outfitSemi: 'Outfit-SemiBold',
  dmExtraBold: 'DMSans-ExtraBold',
  dmBold: 'DMSans-Bold',
  dmSemi: 'DMSans-SemiBold',
  dmMedium: 'DMSans-Medium',
  dmRegular: 'DMSans-Regular',
} as const;

export const ink = {
  canvas: '#FFFFFF',
  ink: '#050508',
  inkSoft: '#1A1A22',
  /** Inputs — soft but readable on white */
  placeholder: 'rgba(26, 26, 34, 0.45)',
  /** Empty states, large decorative icons */
  iconMuted: 'rgba(26, 26, 34, 0.32)',
  borderInk: '#000000',
  borderWidth: 2,
  rowDivider: 'rgba(0, 0, 0, 0.12)',
  iconWell: 'rgba(160, 96, 255, 0.14)',
  pressTint: 'rgba(160, 96, 255, 0.07)',
} as const;

export const radius = {
  card: 16,
  input: 12,
  btn: 14,
} as const;
