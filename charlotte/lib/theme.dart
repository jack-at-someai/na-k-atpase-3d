// SomeAI Theme — branded configuration of the charlotte_ui design system.
// Re-exports all types from charlotte_ui, adds SomeAI-specific colors and config.
export 'package:charlotte_ui/theme.dart';

import 'dart:ui';
import 'package:charlotte_ui/theme.dart';

/// SomeAI brand color palette (from tokens.json)
class SomeAIColors {
  SomeAIColors._();

  // Primary - Red
  static const primary = ColorSwatch9(
    shade100: Color(0xFFFED7D7),
    shade200: Color(0xFFFEB2B2),
    shade300: Color(0xFFFC8181),
    shade400: Color(0xFFF56565),
    shade500: Color(0xFFE53E3E),
    shade600: Color(0xFFC53030),
    shade700: Color(0xFF9B2C2C),
    shade800: Color(0xFF7B2020),
    shade900: Color(0xFF5C1111),
  );

  // Secondary - Mauve
  static const secondary = ColorSwatch9(
    shade100: Color(0xFFE8D5D5),
    shade200: Color(0xFFD4BCBC),
    shade300: Color(0xFFC4A8A8),
    shade400: Color(0xFFAB9090),
    shade500: Color(0xFF9B7878),
    shade600: Color(0xFF876464),
    shade700: Color(0xFF6B4F4F),
    shade800: Color(0xFF503C3C),
    shade900: Color(0xFF382A2A),
  );

  // Tertiary - Blue
  static const tertiary = ColorSwatch9(
    shade100: Color(0xFFD4EEFC),
    shade200: Color(0xFFA8DBF8),
    shade300: Color(0xFF6EC2F0),
    shade400: Color(0xFF3BABE8),
    shade500: Color(0xFF1A94D5),
    shade600: Color(0xFF1478AB),
    shade700: Color(0xFF0F5C82),
    shade800: Color(0xFF0A4058),
    shade900: Color(0xFF06242F),
  );

  // Error - Red (same family, shifted)
  static const error = ColorSwatch9(
    shade100: Color(0xFFFED7D7),
    shade200: Color(0xFFFEB2B2),
    shade300: Color(0xFFFC8181),
    shade400: Color(0xFFF56565),
    shade500: Color(0xFFE53E3E),
    shade600: Color(0xFFC53030),
    shade700: Color(0xFF9B2C2C),
    shade800: Color(0xFF822727),
    shade900: Color(0xFF63171B),
  );

  // Surfaces - Dark
  static const background = Color(0xFF141414);
  static const surface = Color(0xFF1A1A1A);
  static const surfaceVariant = Color(0xFF222222);

  // Text
  static const textPrimary = Color(0xFFE8E0E0);
  static const textSecondary = Color(0xFFCCCCCC);
  static const textTertiary = Color(0xFF666666);
  static const textDisabled = Color(0xFF444444);
}

/// SomeAI theme configuration for charlotte_ui components
const someaiThemeConfig = CharlotteThemeConfig(
  primary: SomeAIColors.primary,
  secondary: SomeAIColors.secondary,
  tertiary: SomeAIColors.tertiary,
  error: SomeAIColors.error,
  background: SomeAIColors.background,
  surface: SomeAIColors.surface,
  surfaceVariant: SomeAIColors.surfaceVariant,
  textPrimary: SomeAIColors.textPrimary,
  textSecondary: SomeAIColors.textSecondary,
  textTertiary: SomeAIColors.textTertiary,
  textDisabled: SomeAIColors.textDisabled,
  glassFillOpacity: 0.15,
  glassBorderOpacity: 0.18,
  headingFontFamily: 'Inter',
  bodyFontFamily: 'Inter',
  radiusSmall: 10,
  radiusMedium: 16,
  radiusLarge: 22,
  categoryPalette: [
    Color(0xFFE53E3E), // Red
    Color(0xFF1A94D5), // Blue
    Color(0xFF9B7878), // Mauve
    Color(0xFFF56565), // Light Red
    Color(0xFF6EC2F0), // Light Blue
    Color(0xFFC4A8A8), // Light Mauve
    Color(0xFFC53030), // Dark Red
    Color(0xFF0F5C82), // Dark Blue
    Color(0xFF6B4F4F), // Dark Mauve
    Color(0xFFFC8181), // Salmon
    Color(0xFF3BABE8), // Sky Blue
    Color(0xFFE8D5D5), // Rose
    Color(0xFF9B2C2C), // Crimson
    Color(0xFF1478AB), // Teal Blue
  ],
  statusPalette: [
    Color(0xFFE53E3E), // Red
    Color(0xFF1A94D5), // Blue
    Color(0xFF4CAF50), // Green
    Color(0xFFFFD93D), // Yellow
    Color(0xFF9B7878), // Mauve
    Color(0xFFF56565), // Light Red
    Color(0xFF6EC2F0), // Light Blue
    Color(0xFFC53030), // Dark Red
    Color(0xFF0F5C82), // Dark Blue
    Color(0xFFFC8181), // Salmon
  ],
);
