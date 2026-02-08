import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

const lightColorScheme = ColorScheme(
  brightness: Brightness.light,
  primary: Color(0xFF1960A5),
  onPrimary: Color(0xFFFFFFFF),
  primaryContainer: Color(0xFFD3E3FF),
  onPrimaryContainer: Color(0xFF001C39),
  secondary: Color(0xFF006491),
  onSecondary: Color(0xFFFFFFFF),
  secondaryContainer: Color(0xFFC9E6FF),
  onSecondaryContainer: Color(0xFF001E2F),
  tertiary: Color(0xFF006687),
  onTertiary: Color(0xFFFFFFFF),
  tertiaryContainer: Color(0xFFC1E8FF),
  onTertiaryContainer: Color(0xFF001E2B),
  error: Color(0xFFBA1A1A),
  errorContainer: Color(0xFFFFDAD6),
  onError: Color(0xFFFFFFFF),
  onErrorContainer: Color(0xFF410002),
  background: Color(0xFFFAFCFF),
  onBackground: Color(0xFF001F2A),
  surface: Color(0xFFFAFCFF),
  onSurface: Color(0xFF001F2A),
  surfaceVariant: Color(0xFFDFE2EB),
  onSurfaceVariant: Color(0xFF43474E),
  outline: Color(0xFF73777F),
  onInverseSurface: Color(0xFFE1F4FF),
  inverseSurface: Color(0xFF003547),
  inversePrimary: Color(0xFFA3C9FF),
  shadow: Color(0xFF000000),
  surfaceTint: Color(0xFF1960A5),
  outlineVariant: Color(0xFFC3C6CF),
  scrim: Color(0xFF000000),
);
final textTheme = TextTheme(
  displayLarge: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 57,
    height: 64 / 57,
    letterSpacing: -0.25,
  ),
  displayMedium: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 45,
    height: 52 / 45,
  ),
  displaySmall: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 36,
    height: 44 / 36,
  ),
  headlineLarge: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 32,
    height: 40 / 32,
  ),
  headlineMedium: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 28,
    height: 36 / 28,
  ),
  headlineSmall: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 24,
    height: 32 / 24,
  ),
  titleLarge: GoogleFonts.poppins(
    fontWeight: FontWeight.w700,
    fontSize: 22,
    height: 28 / 22,
  ),
  titleMedium: GoogleFonts.poppins(
    fontWeight: FontWeight.w600,
    fontSize: 16,
    height: 24 / 16,
    letterSpacing: 0.1,
  ),
  titleSmall: GoogleFonts.poppins(
    fontWeight: FontWeight.w600,
    fontSize: 14,
    height: 20 / 14,
    letterSpacing: 0.1,
  ),
  labelLarge: GoogleFonts.poppins(
    fontWeight: FontWeight.w700,
    fontSize: 14,
    height: 20 / 14,
  ),
  labelMedium: GoogleFonts.poppins(
    fontWeight: FontWeight.w700,
    fontSize: 12,
    height: 16 / 12,
  ),
  labelSmall: GoogleFonts.poppins(
    fontWeight: FontWeight.w700,
    fontSize: 11,
    height: 16 / 11,
  ),
  bodyLarge: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 16,
    height: 24 / 16,
  ),
  bodyMedium: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 14,
    height: 20 / 14,
  ),
  bodySmall: GoogleFonts.poppins(
    fontWeight: FontWeight.w400,
    fontSize: 12,
    height: 16 / 12,
  ),
);

const darkColorScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: Color(0xFFA3C9FF),
  onPrimary: Color(0xFF00315D),
  primaryContainer: Color(0xFF004883),
  onPrimaryContainer: Color(0xFFD3E3FF),
  secondary: Color(0xFF8ACEFF),
  onSecondary: Color(0xFF00344E),
  secondaryContainer: Color(0xFF004B6F),
  onSecondaryContainer: Color(0xFFC9E6FF),
  tertiary: Color(0xFF73D1FF),
  onTertiary: Color(0xFF003548),
  tertiaryContainer: Color(0xFF004D67),
  onTertiaryContainer: Color(0xFFC1E8FF),
  error: Color(0xFFFFB4AB),
  errorContainer: Color(0xFF93000A),
  onError: Color(0xFF690005),
  onErrorContainer: Color(0xFFFFDAD6),
  background: Color(0xFF001F2A),
  onBackground: Color(0xFFBFE9FF),
  surface: Color(0xFF001F2A),
  onSurface: Color(0xFFBFE9FF),
  surfaceVariant: Color(0xFF43474E),
  onSurfaceVariant: Color(0xFFC3C6CF),
  outline: Color(0xFF8D9199),
  onInverseSurface: Color(0xFF001F2A),
  inverseSurface: Color(0xFFBFE9FF),
  inversePrimary: Color(0xFF1960A5),
  shadow: Color(0xFF000000),
  surfaceTint: Color(0xFFA3C9FF),
  outlineVariant: Color(0xFF43474E),
  scrim: Color(0xFF000000),
);

final lightTheme = ThemeData(
    useMaterial3: true,
    cardTheme: CardTheme(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4))),
    colorScheme: lightColorScheme,
    textTheme: textTheme);

final darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: darkColorScheme,
    cardTheme: CardTheme(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4))),
    textTheme: textTheme);
