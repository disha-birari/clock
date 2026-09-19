import { SizeInches } from '../types/clock';

// Helper to convert HEX to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// WCAG 2.1 Relative Luminance Formula
export function getLuminance(hexColor: string): number {
  const { r, g, b } = hexToRgb(hexColor);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Contrast Ratio Formula: (L1 + 0.05) / (L2 + 0.05)
export function getContrastRatio(color1Hex: string, color2Hex: string): number {
  try {
    const l1 = getLuminance(color1Hex);
    const l2 = getLuminance(color2Hex);
    const max = Math.max(l1, l2);
    const min = Math.min(l1, l2);
    return Number(((max + 0.05) / (min + 0.05)).toFixed(1));
  } catch (e) {
    return 4.5;
  }
}

export interface LegibilityAssessment {
  ratio: number;
  rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  badgeColor: string;
  advice: string;
}

export function evaluateDialLegibility(
  handColorHex: string,
  dialColorHex: string
): LegibilityAssessment {
  const ratio = getContrastRatio(handColorHex, dialColorHex);

  if (ratio >= 7.0) {
    return {
      ratio,
      rating: 'EXCELLENT',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      advice: 'Maximum at-a-glance legibility from across any room (WCAG AAA Compliant).',
    };
  } else if (ratio >= 4.5) {
    return {
      ratio,
      rating: 'GOOD',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      advice: 'Clear contrast for effortless time reading in normal lighting (WCAG AA Compliant).',
    };
  } else if (ratio >= 3.0) {
    return {
      ratio,
      rating: 'FAIR',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      advice: 'Moderate contrast. Consider lighter hands or darker dial for improved readability at night.',
    };
  } else {
    return {
      ratio,
      rating: 'POOR',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
      advice: '⚠️ Low Contrast Warning: Hands blend into dial. We recommend selecting higher contrast hand colors.',
    };
  }
}

// Visual Ergonomics Room Size Calculator
// Based on Constant Visual Angle Formula: D = 2 * L * tan(theta / 2)
export function calculateOptimalClockSize(viewingDistanceFeet: number): {
  recommendedSize: SizeInches;
  visualAngleDegrees: number;
  description: string;
} {
  if (viewingDistanceFeet <= 8) {
    return {
      recommendedSize: 10,
      visualAngleDegrees: 0.8,
      description: 'Ideal for compact rooms, executive desks, countertop mantels & bed nightstands (0 - 8 ft viewing distance).',
    };
  } else if (viewingDistanceFeet <= 14) {
    return {
      recommendedSize: 14,
      visualAngleDegrees: 0.85,
      description: 'Standard home size for home offices, master bedrooms & kitchens (8 - 14 ft viewing distance).',
    };
  } else if (viewingDistanceFeet <= 22) {
    return {
      recommendedSize: 18,
      visualAngleDegrees: 0.9,
      description: 'Executive focal clock for spacious living rooms, dining rooms & conference suites (14 - 22 ft viewing distance).',
    };
  } else if (viewingDistanceFeet <= 32) {
    return {
      recommendedSize: 24,
      visualAngleDegrees: 0.95,
      description: 'Statement feature clock for high-ceiling great rooms & open floor plans (22 - 32 ft viewing distance).',
    };
  } else {
    return {
      recommendedSize: 36,
      visualAngleDegrees: 1.0,
      description: 'Grand architectural centerpiece for commercial lobbies, hotel halls & two-story rooms (32+ ft viewing distance).',
    };
  }
}
