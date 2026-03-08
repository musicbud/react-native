/**
 * Unified Design System for MusicBud (React Native)
 * 
 * Ported from Flutter's core/theme/design_system.dart
 */

export const DesignSystem = {
  colors: {
    // Primary brand colors
    primary: '#FF2D55',
    primaryContainer: '#FF6B8F',
    onPrimary: '#FFFFFF',
    primaryVariant: '#FE2C54',
    primaryRed: '#FF2D55',
    primaryDark: '#D81B60',

    // Secondary colors
    secondary: '#0ACF83',
    secondaryContainer: '#71C173',
    onSecondary: '#000000',

    // Surface colors
    surface: '#0F0E12',
    surfaceContainer: '#1A1A22',
    surfaceContainerHigh: '#282833',
    surfaceContainerHighest: '#333342',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#CFD0FD',
    onSurfaceDim: '#888888',
    surfaceDark: '#0F0F13',
    surfaceLight: '#282833',
    cardBackground: '#1A1A22',
    textPrimary: '#FFFFFF',
    textMuted: '#CFD0FD',

    // Background colors
    background: '#0F0E12',
    backgroundDark: '#000000',
    onBackground: '#FFFFFF',
    backgroundPrimary: '#0F0E12',

    // Status colors
    error: '#CF6679',
    errorRed: '#E53935',
    errorContainer: '#FF0000',
    onError: '#000000',
    onErrorContainer: '#FFFFFF',

    success: '#4CAF50',
    successGreen: '#4CAF50',
    successContainer: '#66BB6A',
    onSuccess: '#FFFFFF',

    warning: '#FFA726',
    warningOrange: '#FFA726',
    warningContainer: '#FFB74D',
    onWarning: '#000000',

    info: '#29B6F6',
    infoContainer: '#4FC3F7',
    onInfo: '#FFFFFF',

    // Neutral colors
    neutral50: '#FAFAFA',
    neutral100: '#F5F5F5',
    neutral200: '#EEEEEE',
    neutral300: '#E0E0E0',
    neutral400: '#BDBDBD',
    neutral500: '#9E9E9E',
    neutral600: '#757575',
    neutral700: '#616161',
    neutral800: '#424242',
    neutral900: '#212121',
    textSecondary: '#CFD0FD',

    // Accent colors
    accentBlue: '#448AFF',
    accentPurple: '#7C4DFF',
    accentGreen: '#00E676',
    accentOrange: '#FF9100', // Replaced FFFF9100 to standard 6-digit hex

    // Special colors
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.54)', // Approximated 0x8A000000 to alpha
    border: '#282833',
    borderLight: '#CFD0FD',
    borderColor: '#282833',
  },
  typography: {
    fontFamily: 'Josefin Sans', // Extracted from Figma (screens1.json)
    displayLarge: { fontSize: 57, fontWeight: '800', letterSpacing: -0.25 },
    displayMedium: { fontSize: 45, fontWeight: '700' },
    displaySmall: { fontSize: 36, fontWeight: '600' },
    headlineLarge: { fontSize: 32, fontWeight: '700' },
    headlineMedium: { fontSize: 28, fontWeight: '600' },
    headlineSmall: { fontSize: 24, fontWeight: '600' },
    titleLarge: { fontSize: 24, fontWeight: '600' },
    titleMedium: { fontSize: 16, fontWeight: '600', letterSpacing: 0.15 },
    titleSmall: { fontSize: 14, fontWeight: '600', letterSpacing: 0.1 },
    bodyLarge: { fontSize: 16, fontWeight: '400', letterSpacing: 0.5 },
    bodyMedium: { fontSize: 14, fontWeight: '400', letterSpacing: 0.25 },
    bodySmall: { fontSize: 12, fontWeight: '400', letterSpacing: 0.4 },
    caption: { fontSize: 10, fontWeight: '400', letterSpacing: 0.4 },
    labelLarge: { fontSize: 14, fontWeight: '600', letterSpacing: 0.1 },
    labelMedium: { fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },
    labelSmall: { fontSize: 11, fontWeight: '500', letterSpacing: 0.5 },
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
    circular: 50,
  }
} as const;
