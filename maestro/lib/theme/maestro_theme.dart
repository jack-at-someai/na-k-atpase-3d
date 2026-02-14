import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// Re-export the SomeAI brand config for direct access
export 'package:charlotte_ui/theme.dart' show CharlotteThemeConfig, CharlotteTheme, ColorSwatch9;

/// SomeAI brand theme config — imported from design tokens.
/// Red primary, mauve secondary, blue tertiary, Inter typography.
const maestroThemeConfig = CharlotteThemeConfig(
  primary: _MaestroColors.primary,
  secondary: _MaestroColors.secondary,
  tertiary: _MaestroColors.tertiary,
  error: _MaestroColors.error,
  background: Color(0xFF141414),
  surface: Color(0xFF1A1A1A),
  surfaceVariant: Color(0xFF222222),
  textPrimary: Color(0xFFE8E0E0),
  textSecondary: Color(0xFFE8E0E0),
  textTertiary: Color(0xFF666666),
  textDisabled: Color(0xFF666666),
  glassBlurSubtle: 12,
  glassBlurStandard: 24,
  glassBlurFrosted: 40,
  glassBlurDeep: 60,
  glassFillOpacity: 0.15,
  glassBorderOpacity: 0.18,
  headingFontFamily: 'Inter',
  bodyFontFamily: 'Inter',
  radiusSmall: 10,
  radiusMedium: 16,
  radiusLarge: 22,
);

/// Material ThemeData built from SomeAI config.
final ThemeData maestroTheme = buildCharlotteTheme(maestroThemeConfig);

/// Cupertino ThemeData built from SomeAI config.
final CupertinoThemeData maestroCupertinoTheme =
    buildCharlotteCupertinoTheme(maestroThemeConfig);

/// SomeAI brand palette (mirrors someai_theme.dart without import path issues).
class _MaestroColors {
  _MaestroColors._();

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
}
