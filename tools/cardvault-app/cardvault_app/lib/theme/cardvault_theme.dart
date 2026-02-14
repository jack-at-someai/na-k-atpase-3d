import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

export 'package:charlotte_ui/theme.dart'
    show CharlotteThemeConfig, CharlotteTheme, ColorSwatch9;

/// CardVault brand theme config — Vault Black + Championship Gold.
const cardvaultThemeConfig = CharlotteThemeConfig(
  primary: _CVColors.primary,
  secondary: _CVColors.secondary,
  tertiary: _CVColors.tertiary,
  error: _CVColors.error,
  background: Color(0xFF0A0A0A),
  surface: Color(0xFF1A1A1A),
  surfaceVariant: Color(0xFF141414),
  textPrimary: Color(0xFFE8E6E1),
  textSecondary: Color(0xFFA8A49C),
  textTertiary: Color(0xFF5C5C5C),
  textDisabled: Color(0xFF3D3B37),
  glassBlurSubtle: 12,
  glassBlurStandard: 16,
  glassBlurFrosted: 40,
  glassBlurDeep: 60,
  glassFillOpacity: 0.12,
  glassBorderOpacity: 0.18,
  headingFontFamily: 'Oswald',
  bodyFontFamily: 'Inter',
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 20,
);

/// Material ThemeData from CardVault config.
final ThemeData cardvaultTheme = buildCharlotteTheme(cardvaultThemeConfig);

/// Cupertino ThemeData from CardVault config.
final CupertinoThemeData cardvaultCupertinoTheme =
    buildCharlotteCupertinoTheme(cardvaultThemeConfig);

/// CardVault brand palette mapped to charlotte_ui ColorSwatch9 format.
class _CVColors {
  _CVColors._();

  static const primary = ColorSwatch9(
    shade100: Color(0xFFFCEFC5), // gold-100
    shade200: Color(0xFFF5E08A),
    shade300: Color(0xFFE8C84A), // gold-300
    shade400: Color(0xFFDEB430),
    shade500: Color(0xFFD4A017), // gold-500
    shade600: Color(0xFFB8860B), // gold-600
    shade700: Color(0xFF8B6914), // gold-700
    shade800: Color(0xFF5C4510), // gold-800
    shade900: Color(0xFF2E220A), // gold-900
  );

  static const secondary = ColorSwatch9(
    shade100: Color(0xFFE8E6E1), // vault-100
    shade200: Color(0xFFD1CFC8),
    shade300: Color(0xFFA8A49C), // vault-300
    shade400: Color(0xFF6E6B65),
    shade500: Color(0xFF3D3B37), // card-900
    shade600: Color(0xFF2A2A2A),
    shade700: Color(0xFF1A1A1A), // vault-500
    shade800: Color(0xFF141414),
    shade900: Color(0xFF0A0A0A), // vault-800
  );

  static const tertiary = ColorSwatch9(
    shade100: Color(0xFFD4F5E0),
    shade200: Color(0xFFA8EBC0),
    shade300: Color(0xFF7AE1A0),
    shade400: Color(0xFF4CD880),
    shade500: Color(0xFF00A651), // gradeGem
    shade600: Color(0xFF008541),
    shade700: Color(0xFF006431),
    shade800: Color(0xFF004220),
    shade900: Color(0xFF002110),
  );

  static const error = ColorSwatch9(
    shade100: Color(0xFFFED7D7),
    shade200: Color(0xFFFEB2B2),
    shade300: Color(0xFFFC8181),
    shade400: Color(0xFFF56565),
    shade500: Color(0xFFF44336), // gradePoor
    shade600: Color(0xFFC53030),
    shade700: Color(0xFF9B2C2C),
    shade800: Color(0xFF822727),
    shade900: Color(0xFF63171B),
  );
}
