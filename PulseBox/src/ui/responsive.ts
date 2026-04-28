import { useMemo } from 'react';
import { PixelRatio, useWindowDimensions } from 'react-native';

type Responsive = {
  width: number;
  height: number;
  isSmallPhone: boolean;
  isLargePhone: boolean;
  gutter: number;
  contentMaxWidth: number;
  /** Multipliers for typography sizing (clamped for readability). */
  titleScale: number;
  bodyScale: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Centralized responsive tokens for phones.
 * - Uses dp width (RN layout units) and respects system font scaling via PixelRatio.
 * - Designed to be used across screens to keep paddings & max widths consistent.
 */
export function useResponsive(): Responsive {
  const { width, height, fontScale } = useWindowDimensions();

  return useMemo(() => {
    const isSmallPhone = width <= 360;
    const isLargePhone = width >= 430;

    // Full-width mode (minimal gutters; no centered max-width cap).
    const gutter = isSmallPhone ? 12 : isLargePhone ? 16 : 14;

    // Keep scaling subtle; also incorporate system font scaling but clamp it.
    const effectiveFontScale = clamp(fontScale || 1, 0.9, 1.25);
    const titleScale = clamp((isSmallPhone ? 0.94 : isLargePhone ? 1.04 : 1) * effectiveFontScale, 0.92, 1.18);
    const bodyScale = clamp((isSmallPhone ? 0.97 : 1) * effectiveFontScale, 0.92, 1.15);

    // If user has very large accessibility fonts, avoid shrinking gutters too much.
    const scaledGutter = clamp(Math.round(gutter * clamp(PixelRatio.getFontScale(), 1, 1.15)), gutter, gutter + 6);

    // Full-width content area (still applies gutters elsewhere).
    const contentMaxWidth = width;

    return {
      width,
      height,
      isSmallPhone,
      isLargePhone,
      gutter: scaledGutter,
      contentMaxWidth,
      titleScale,
      bodyScale,
    };
  }, [width, height, fontScale]);
}

export function scaleFont(size: number, scale: number) {
  return Math.round(size * scale);
}

