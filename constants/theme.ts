// Design tokens for the Lingua design system.
// Mirrors the CSS variables defined in global.css — keep both in sync.

export const colors = {
  primary: '#6C4EF5',
  primaryDark: '#5B3BF6',
  blue: '#4D8BFF',
  green: '#21C16B',

  success: '#21C16B',
  warning: '#FFC800',
  streak: '#FF8A00',
  error: '#FF4D4F',
  info: '#4D8BFF',

  textPrimary: '#0D132B',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  surface: '#F6F7FB',
  background: '#FFFFFF',
} as const;

export const fontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

type TextStyleToken = {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
};

export const typography = {
  h1: { fontSize: 32, lineHeight: 32 * 1.2, fontFamily: fontFamily.bold },
  h2: { fontSize: 24, lineHeight: 24 * 1.3, fontFamily: fontFamily.semiBold },
  h3: { fontSize: 20, lineHeight: 20 * 1.3, fontFamily: fontFamily.semiBold },
  h4: { fontSize: 16, lineHeight: 16 * 1.4, fontFamily: fontFamily.medium },
  bodyLarge: { fontSize: 16, lineHeight: 16 * 1.6, fontFamily: fontFamily.regular },
  bodyMedium: { fontSize: 14, lineHeight: 14 * 1.6, fontFamily: fontFamily.regular },
  bodySmall: { fontSize: 13, lineHeight: 13 * 1.6, fontFamily: fontFamily.regular },
  caption: { fontSize: 11, lineHeight: 11 * 1.4, fontFamily: fontFamily.regular },
} satisfies Record<string, TextStyleToken>;
