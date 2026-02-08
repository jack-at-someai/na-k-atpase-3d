import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// =============================================================================
// CHARLOTTE THEME - Client-Configurable Glassmorphic Design System
// =============================================================================
//
// This theme is designed to be generated from a client configuration.
// All colors, typography, and styling are centralized here for easy customization.
//
// To create a custom theme:
// 1. Create a CharlotteThemeConfig with your brand colors
// 2. Call CharlotteTheme.fromConfig(config) to generate the theme
// 3. Access colors via CharlotteTheme.of(context) in widgets
//
// =============================================================================

// -----------------------------------------------------------------------------
// COLOR SWATCH - 9-step color ramp (100-900)
// -----------------------------------------------------------------------------

/// A 9-step color swatch following Material Design naming (100-900).
/// Can be generated from a single base color or defined explicitly.
class ColorSwatch9 {
  final Color shade100;
  final Color shade200;
  final Color shade300;
  final Color shade400;
  final Color shade500; // Base/primary shade
  final Color shade600;
  final Color shade700;
  final Color shade800;
  final Color shade900;

  const ColorSwatch9({
    required this.shade100,
    required this.shade200,
    required this.shade300,
    required this.shade400,
    required this.shade500,
    required this.shade600,
    required this.shade700,
    required this.shade800,
    required this.shade900,
  });

  /// Get shade by index (1-9 maps to 100-900)
  Color operator [](int shade) {
    return switch (shade) {
      100 => shade100,
      200 => shade200,
      300 => shade300,
      400 => shade400,
      500 => shade500,
      600 => shade600,
      700 => shade700,
      800 => shade800,
      900 => shade900,
      _ => shade500,
    };
  }

  /// Primary/base color (shade500)
  Color get base => shade500;

  /// Light variant for backgrounds
  Color get light => shade100;

  /// Dark variant for emphasis
  Color get dark => shade900;
}

// -----------------------------------------------------------------------------
// THEME CONFIGURATION - Client-definable brand settings
// -----------------------------------------------------------------------------

/// Configuration for generating a Charlotte theme.
/// Clients can provide this to customize the entire look and feel.
class CharlotteThemeConfig {
  // === Brand Color Swatches ===
  final ColorSwatch9 primary;
  final ColorSwatch9 secondary;
  final ColorSwatch9 tertiary;
  final ColorSwatch9 error;

  // === Surface Colors ===
  final Color background;
  final Color surface;
  final Color surfaceVariant;

  // === Text Colors ===
  final Color textPrimary;
  final Color textSecondary;
  final Color textTertiary;
  final Color textDisabled;

  // === Glass Effect Settings ===
  final double glassBlurSubtle;
  final double glassBlurStandard;
  final double glassBlurFrosted;
  final double glassBlurDeep;
  final double glassFillOpacity;
  final double glassBorderOpacity;

  // === Typography ===
  final String headingFontFamily;
  final String bodyFontFamily;

  // === Border Radius ===
  final double radiusSmall;
  final double radiusMedium;
  final double radiusLarge;

  // === Category Colors (for dynamic data) ===
  final List<Color> categoryPalette;

  // === Status Colors (for enum visualization) ===
  final List<Color> statusPalette;

  const CharlotteThemeConfig({
    required this.primary,
    required this.secondary,
    required this.tertiary,
    required this.error,
    required this.background,
    required this.surface,
    required this.surfaceVariant,
    required this.textPrimary,
    required this.textSecondary,
    required this.textTertiary,
    required this.textDisabled,
    this.glassBlurSubtle = 12,
    this.glassBlurStandard = 24,
    this.glassBlurFrosted = 40,
    this.glassBlurDeep = 60,
    this.glassFillOpacity = 0.1,
    this.glassBorderOpacity = 0.2,
    this.headingFontFamily = 'Oswald',
    this.bodyFontFamily = 'Inter',
    this.radiusSmall = 4,
    this.radiusMedium = 12,
    this.radiusLarge = 24,
    this.categoryPalette = const [],
    this.statusPalette = const [],
  });
}

// -----------------------------------------------------------------------------
// SOUNDER THEME - Default Configuration
// -----------------------------------------------------------------------------

/// Sounder brand color palette (extracted from SOUNDER_COLORS_AND_TYPOGRAPHY.svg)
class SounderColors {
  SounderColors._();

  // Primary - Purple
  static const primary = ColorSwatch9(
    shade100: Color(0xFFE3CCF5),
    shade200: Color(0xFFC799EA),
    shade300: Color(0xFFAA66E0),
    shade400: Color(0xFF8E33D5),
    shade500: Color(0xFF7200CB),
    shade600: Color(0xFF5B00A2),
    shade700: Color(0xFF44007A),
    shade800: Color(0xFF2E0051),
    shade900: Color(0xFF170029),
  );

  // Secondary - Magenta/Pink
  static const secondary = ColorSwatch9(
    shade100: Color(0xFFFCCCF6),
    shade200: Color(0xFFF999ED),
    shade300: Color(0xFFF666E4),
    shade400: Color(0xFFF333DB),
    shade500: Color(0xFFF000D2),
    shade600: Color(0xFFC000A8),
    shade700: Color(0xFF90007E),
    shade800: Color(0xFF600054),
    shade900: Color(0xFF30002A),
  );

  // Tertiary - Teal/Cyan
  static const tertiary = ColorSwatch9(
    shade100: Color(0xFFD3F7F4),
    shade200: Color(0xFFA6EFE8),
    shade300: Color(0xFF7AE6DD),
    shade400: Color(0xFF4DDED1),
    shade500: Color(0xFF21D6C6),
    shade600: Color(0xFF1AAB9E),
    shade700: Color(0xFF148077),
    shade800: Color(0xFF0D564F),
    shade900: Color(0xFF072B28),
  );

  // Error - Red
  static const error = ColorSwatch9(
    shade100: Color(0xFFF5DCDC),
    shade200: Color(0xFFEBB9B9),
    shade300: Color(0xFFE29597),
    shade400: Color(0xFFD87274),
    shade500: Color(0xFFCE4F51),
    shade600: Color(0xFFA53F41),
    shade700: Color(0xFF7C2F31),
    shade800: Color(0xFF522020),
    shade900: Color(0xFF291010),
  );

  // Surfaces
  static const background = Color(0xFF232324);
  static const surface = Color(0xFF2D2B2E);
  static const surfaceVariant = Color(0xFF3D3B3E);

  // Text
  static const textPrimary = Color(0xFFF2F2F3);
  static const textSecondary = Color(0xFFECECEC);
  static const textTertiary = Color(0xFF5B575E);
  static const textDisabled = Color(0xFF4A474B);
}

/// Default Sounder theme configuration
const sounderThemeConfig = CharlotteThemeConfig(
  primary: SounderColors.primary,
  secondary: SounderColors.secondary,
  tertiary: SounderColors.tertiary,
  error: SounderColors.error,
  background: SounderColors.background,
  surface: SounderColors.surface,
  surfaceVariant: SounderColors.surfaceVariant,
  textPrimary: SounderColors.textPrimary,
  textSecondary: SounderColors.textSecondary,
  textTertiary: SounderColors.textTertiary,
  textDisabled: SounderColors.textDisabled,
  categoryPalette: [
    Color(0xFFE91E63), // Pink
    Color(0xFF9C27B0), // Purple
    Color(0xFF673AB7), // Deep Purple
    Color(0xFF3F51B5), // Indigo
    Color(0xFF2196F3), // Blue
    Color(0xFF00BCD4), // Cyan
    Color(0xFF009688), // Teal
    Color(0xFF4CAF50), // Green
    Color(0xFF8BC34A), // Light Green
    Color(0xFFCDDC39), // Lime
    Color(0xFFFFEB3B), // Yellow
    Color(0xFFFFC107), // Amber
    Color(0xFFFF9800), // Orange
    Color(0xFFFF5722), // Deep Orange
  ],
  statusPalette: [
    Color(0xFFFF1493), // Deep Pink
    Color(0xFF00FFFF), // Cyan
    Color(0xFFFF6B6B), // Coral
    Color(0xFF7B68EE), // Medium Slate Blue
    Color(0xFF00FF7F), // Spring Green
    Color(0xFFFFD700), // Gold
    Color(0xFFFF4500), // Orange Red
    Color(0xFF9370DB), // Medium Purple
    Color(0xFF20B2AA), // Light Sea Green
    Color(0xFFFF69B4), // Hot Pink
  ],
);

// -----------------------------------------------------------------------------
// CHARLOTTE THEME - Main Theme Provider
// -----------------------------------------------------------------------------

/// The main Charlotte theme provider.
/// Use [CharlotteTheme.of(context)] to access theme values in widgets.
class CharlotteTheme extends InheritedWidget {
  final CharlotteThemeConfig config;

  const CharlotteTheme({
    super.key,
    required this.config,
    required super.child,
  });

  /// Get the current theme from context
  static CharlotteTheme of(BuildContext context) {
    final theme = context.dependOnInheritedWidgetOfExactType<CharlotteTheme>();
    assert(theme != null, 'No CharlotteTheme found in context');
    return theme!;
  }

  /// Try to get theme, returns null if not found
  static CharlotteTheme? maybeOf(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<CharlotteTheme>();
  }

  @override
  bool updateShouldNotify(CharlotteTheme oldWidget) {
    return config != oldWidget.config;
  }
}

// -----------------------------------------------------------------------------
// STATIC COLOR ACCESSORS (for backwards compatibility)
// -----------------------------------------------------------------------------

/// Static color accessors using the default Sounder configuration.
/// For full customization, use CharlotteTheme.of(context).config instead.
class CharlotteColors {
  CharlotteColors._();

  static CharlotteThemeConfig get _config => sounderThemeConfig;

  // === Brand Colors ===
  static Color get primary => _config.primary.base;
  static Color get secondary => _config.secondary.base;
  static Color get tertiary => _config.tertiary.base;
  static Color get highlight => _config.secondary.base; // Alias for secondary

  // === Surfaces ===
  static Color get background => _config.background;
  static Color get surface => _config.surface;
  static Color get surfaceVariant => _config.surfaceVariant;

  // === Legacy aliases ===
  static Color get white => _config.textPrimary;
  static Color get grey => _config.textTertiary;
  static Color get success => _config.tertiary.base;
  static Color get error => _config.error.base;

  // === Text Colors ===
  static Color get textPrimary => _config.textPrimary;
  static Color get textSecondary => _config.textPrimary.withValues(alpha: 0.7);
  static Color get textTertiary => _config.textPrimary.withValues(alpha: 0.5);
  static Color get textDisabled => _config.textPrimary.withValues(alpha: 0.35);

  // === Icon Colors ===
  static Color get iconPrimary => _config.textPrimary;
  static Color get iconSecondary => _config.textPrimary.withValues(alpha: 0.7);
  static Color get iconTertiary => _config.textPrimary.withValues(alpha: 0.5);

  // === Primary Shades ===
  static Color get primary100 => _config.primary.shade100;
  static Color get primary200 => _config.primary.shade200;
  static Color get primary300 => _config.primary.shade300;
  static Color get primary400 => _config.primary.shade400;
  static Color get primary500 => _config.primary.shade500;
  static Color get primary600 => _config.primary.shade600;
  static Color get primary700 => _config.primary.shade700;
  static Color get primary800 => _config.primary.shade800;
  static Color get primary900 => _config.primary.shade900;

  // === Glass Effects ===
  static Color get glassFill => Colors.white.withValues(alpha: _config.glassFillOpacity);
  static Color get glassBorder => Colors.white.withValues(alpha: _config.glassBorderOpacity);
  static Color get glassHighlight => Colors.white.withValues(alpha: 0.05);

  // === Track/Timeline ===
  static Color get trackBackground => _config.background;
  static Color get trackBorder => Colors.white.withValues(alpha: 0.2);
  static Color get nowIndicator => _config.secondary.base;
}

// -----------------------------------------------------------------------------
// CATEGORY COLORS
// -----------------------------------------------------------------------------

/// Dynamic category color generation.
class CharlotteCategoryColors {
  CharlotteCategoryColors._();

  static List<Color> get _palette => sounderThemeConfig.categoryPalette;

  /// Get a consistent color for a category name.
  static Color forCategory(String? category) {
    if (category == null || category.isEmpty) {
      return CharlotteColors.primary;
    }
    if (_palette.isEmpty) return CharlotteColors.primary;
    final hash = category.toUpperCase().hashCode.abs();
    return _palette[hash % _palette.length];
  }

  /// Get color by index
  static Color atIndex(int index) {
    if (_palette.isEmpty) return CharlotteColors.primary;
    return _palette[index % _palette.length];
  }
}

// -----------------------------------------------------------------------------
// VISUALIZATION COLORS
// -----------------------------------------------------------------------------

/// Semantic colors for data visualization.
class CharlotteVisualizationColors {
  CharlotteVisualizationColors._();

  static CharlotteThemeConfig get _config => sounderThemeConfig;

  // === Score Range Bands ===
  static Color get scoreLow => _config.error.shade400;
  static Color get scoreMid => const Color(0xFFFFD93D); // Yellow (universal)
  static Color get scoreHigh => _config.tertiary.shade500;

  // === Boolean States ===
  static Color get boolTrue => _config.tertiary.shade500;
  static Color get boolFalse => Colors.white.withValues(alpha: 0.2);

  // === Inventory Deltas ===
  static Color get inventoryAdd => _config.tertiary.shade500;
  static Color get inventoryRemove => _config.error.shade500;
  static Color get inventoryAdjust => const Color(0xFFFFD93D);

  // === Event/Impulse ===
  static Color get eventImpulse => _config.secondary.shade500;

  // === Date Flag ===
  static Color get dateFlag => const Color(0xFF2196F3);

  // === Currency ===
  static Color get currencyPositive => _config.tertiary.shade500;
  static Color get currencyNegative => _config.error.shade500;

  // === Status Palette ===
  static List<Color> get statusPalette => _config.statusPalette;

  static Color statusColorAt(int index) {
    if (statusPalette.isEmpty) return CharlotteColors.primary;
    return statusPalette[index % statusPalette.length];
  }

  static Color statusColorFor(String status) {
    if (statusPalette.isEmpty) return CharlotteColors.primary;
    final hash = status.hashCode.abs();
    return statusPalette[hash % statusPalette.length];
  }

  /// Get color for a score value within bounds.
  static Color scoreColor(double value, double min, double max) {
    if (max <= min) return scoreMid;
    final normalized = ((value - min) / (max - min)).clamp(0.0, 1.0);

    if (normalized < 0.33) {
      final t = normalized / 0.33;
      return Color.lerp(scoreLow, scoreMid, t)!;
    } else if (normalized < 0.67) {
      return scoreMid;
    } else {
      final t = (normalized - 0.67) / 0.33;
      return Color.lerp(scoreMid, scoreHigh, t)!;
    }
  }

  static Color scoreBandColor(double min, double max, double rangeMin, double rangeMax) {
    final midpoint = (min + max) / 2;
    return scoreColor(midpoint, rangeMin, rangeMax).withValues(alpha: 0.15);
  }
}

// -----------------------------------------------------------------------------
// GRADIENTS
// -----------------------------------------------------------------------------

class CharlotteGradients {
  CharlotteGradients._();

  static LinearGradient get brand => LinearGradient(
        colors: [
          CharlotteColors.secondary,
          CharlotteColors.primary,
          CharlotteColors.tertiary,
        ],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      );

  static LinearGradient get primaryDark => LinearGradient(
        colors: [
          CharlotteColors.primary,
          CharlotteColors.primary.withValues(alpha: 0.8),
          CharlotteColors.primary.withValues(alpha: 0.6),
          CharlotteColors.primary.withValues(alpha: 0.3),
        ],
        begin: Alignment.bottomLeft,
        end: Alignment.topRight,
        stops: const [0.1, 0.35, 0.71, 0.99],
      );

  static const LinearGradient fade = LinearGradient(
    colors: [Colors.black54, Colors.transparent],
    begin: Alignment.bottomCenter,
    end: Alignment.topCenter,
  );
}

// -----------------------------------------------------------------------------
// GLASSMORPHISM - Liquid Glass System
// -----------------------------------------------------------------------------

enum GlassIntensity { subtle, standard, frosted, deep }

class GlassConfig {
  final double blur;
  final double fillOpacity;
  final double borderOpacity;
  final double glowOpacity;

  const GlassConfig({
    required this.blur,
    required this.fillOpacity,
    required this.borderOpacity,
    this.glowOpacity = 0,
  });

  static GlassConfig forIntensity(GlassIntensity intensity, [CharlotteThemeConfig? config]) {
    final c = config ?? sounderThemeConfig;
    return switch (intensity) {
      GlassIntensity.subtle => GlassConfig(
          blur: c.glassBlurSubtle,
          fillOpacity: 0.05,
          borderOpacity: 0.1,
        ),
      GlassIntensity.standard => GlassConfig(
          blur: c.glassBlurStandard,
          fillOpacity: c.glassFillOpacity,
          borderOpacity: c.glassBorderOpacity,
          glowOpacity: 0.05,
        ),
      GlassIntensity.frosted => GlassConfig(
          blur: c.glassBlurFrosted,
          fillOpacity: 0.15,
          borderOpacity: 0.25,
          glowOpacity: 0.1,
        ),
      GlassIntensity.deep => GlassConfig(
          blur: c.glassBlurDeep,
          fillOpacity: 0.25,
          borderOpacity: 0.3,
          glowOpacity: 0.15,
        ),
    };
  }
}

/// Primary glass container with liquid glass effect.
class GlassContainer extends StatelessWidget {
  final Widget child;
  final double? blur;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final GlassIntensity intensity;
  final Color? tint;
  final bool showGlow;
  final Color? glowColor;

  const GlassContainer({
    super.key,
    required this.child,
    this.blur,
    this.padding,
    this.margin,
    this.borderRadius,
    this.intensity = GlassIntensity.standard,
    this.tint,
    this.showGlow = false,
    this.glowColor,
  });

  @override
  Widget build(BuildContext context) {
    final themeConfig = CharlotteTheme.maybeOf(context)?.config ?? sounderThemeConfig;
    final config = GlassConfig.forIntensity(intensity, themeConfig);
    final effectiveBlur = blur ?? config.blur;
    final radius = borderRadius ?? BorderRadius.circular(themeConfig.radiusMedium);
    final effectiveTint = tint ?? Colors.white;
    final effectiveGlowColor = glowColor ?? themeConfig.primary.base;

    Widget container = Container(
      margin: margin,
      child: ClipRRect(
        borderRadius: radius,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: effectiveBlur, sigmaY: effectiveBlur),
          child: Container(
            padding: padding ?? const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: effectiveTint.withValues(alpha: config.fillOpacity),
              borderRadius: radius,
              border: Border.all(
                color: effectiveTint.withValues(alpha: config.borderOpacity),
                width: 1,
              ),
            ),
            child: child,
          ),
        ),
      ),
    );

    if (showGlow && config.glowOpacity > 0) {
      container = Container(
        decoration: BoxDecoration(
          borderRadius: radius,
          boxShadow: [
            BoxShadow(
              color: effectiveGlowColor.withValues(alpha: config.glowOpacity),
              blurRadius: effectiveBlur,
              spreadRadius: 2,
            ),
          ],
        ),
        child: container,
      );
    }

    return container;
  }
}

/// Glass card with optional glow corona effect.
class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final GlassIntensity intensity;
  final Color? accentColor;
  final bool isHighlighted;
  final VoidCallback? onTap;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius,
    this.intensity = GlassIntensity.standard,
    this.accentColor,
    this.isHighlighted = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final themeConfig = CharlotteTheme.maybeOf(context)?.config ?? sounderThemeConfig;
    final config = GlassConfig.forIntensity(intensity, themeConfig);
    final radius = borderRadius ?? BorderRadius.circular(themeConfig.radiusMedium);
    final accent = accentColor ?? themeConfig.primary.base;

    Widget card = ClipRRect(
      borderRadius: radius,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: config.blur, sigmaY: config.blur),
        child: Container(
          padding: padding ?? const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: config.fillOpacity),
            borderRadius: radius,
            border: Border.all(
              color: isHighlighted
                  ? accent.withValues(alpha: 0.6)
                  : Colors.white.withValues(alpha: config.borderOpacity),
              width: isHighlighted ? 2 : 1,
            ),
          ),
          child: child,
        ),
      ),
    );

    if (isHighlighted) {
      card = Container(
        margin: margin,
        decoration: BoxDecoration(
          borderRadius: radius,
          boxShadow: [
            BoxShadow(
              color: accent.withValues(alpha: 0.3),
              blurRadius: 20,
              spreadRadius: 2,
            ),
          ],
        ),
        child: card,
      );
    } else {
      card = Container(margin: margin, child: card);
    }

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: card);
    }
    return card;
  }
}

/// Glass chip for small interactive elements.
class GlassChip extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final Color? accentColor;
  final bool isSelected;
  final VoidCallback? onTap;

  const GlassChip({
    super.key,
    required this.child,
    this.padding,
    this.accentColor,
    this.isSelected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final themeConfig = CharlotteTheme.maybeOf(context)?.config ?? sounderThemeConfig;
    final accent = accentColor ?? themeConfig.primary.base;

    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
          child: Container(
            padding: padding ?? const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected
                  ? accent.withValues(alpha: 0.3)
                  : Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isSelected
                    ? accent.withValues(alpha: 0.8)
                    : Colors.white.withValues(alpha: 0.2),
                width: 1,
              ),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

/// Glass track for timeline/signal visualization.
class GlassTrack extends StatelessWidget {
  final Widget child;
  final Widget? leading;
  final double height;
  final EdgeInsetsGeometry? margin;
  final bool isExpanded;
  final Color? accentColor;

  const GlassTrack({
    super.key,
    required this.child,
    this.leading,
    this.height = 56,
    this.margin,
    this.isExpanded = false,
    this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    final themeConfig = CharlotteTheme.maybeOf(context)?.config ?? sounderThemeConfig;
    final accent = accentColor ?? themeConfig.primary.base;

    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      height: height,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(themeConfig.radiusMedium),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(themeConfig.radiusMedium),
              border: Border.all(
                color: isExpanded
                    ? accent.withValues(alpha: 0.5)
                    : Colors.white.withValues(alpha: 0.15),
                width: isExpanded ? 1.5 : 1,
              ),
            ),
            child: Row(
              children: [
                if (leading != null) leading!,
                Expanded(child: child),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Glass cell for calendar/hex grid items.
class GlassCell extends StatelessWidget {
  final Widget child;
  final double size;
  final BorderRadius? borderRadius;
  final Color? accentColor;
  final bool isHighlighted;
  final bool isFocused;
  final double depth;
  final VoidCallback? onTap;

  const GlassCell({
    super.key,
    required this.child,
    this.size = 48,
    this.borderRadius,
    this.accentColor,
    this.isHighlighted = false,
    this.isFocused = false,
    this.depth = 0,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final themeConfig = CharlotteTheme.maybeOf(context)?.config ?? sounderThemeConfig;
    final accent = accentColor ?? themeConfig.primary.base;
    final radius = borderRadius ?? BorderRadius.circular(size * 0.25);

    final blurAmount = (16.0 + (depth * 8)).clamp(0.0, 56.0);
    final fillOpacity = (0.1 - depth * 0.02).clamp(0.02, 0.15);
    final borderOpacity = (0.3 - depth * 0.05).clamp(0.1, 0.4);

    Widget cell = ClipRRect(
      borderRadius: radius,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blurAmount, sigmaY: blurAmount),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: isFocused
                ? accent.withValues(alpha: 0.25)
                : Colors.white.withValues(alpha: fillOpacity),
            borderRadius: radius,
            border: Border.all(
              color: isFocused
                  ? accent
                  : isHighlighted
                      ? accent.withValues(alpha: 0.6)
                      : Colors.white.withValues(alpha: borderOpacity),
              width: isFocused ? 2.5 : isHighlighted ? 2 : 1,
            ),
          ),
          child: child,
        ),
      ),
    );

    if (isFocused || isHighlighted) {
      cell = Container(
        decoration: BoxDecoration(
          borderRadius: radius,
          boxShadow: [
            BoxShadow(
              color: accent.withValues(alpha: isFocused ? 0.4 : 0.25),
              blurRadius: isFocused ? 24 : 16,
              spreadRadius: isFocused ? 4 : 2,
            ),
          ],
        ),
        child: cell,
      );
    }

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: cell);
    }
    return cell;
  }
}

/// Glass modal/sheet background.
class GlassSheet extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final BorderRadius? borderRadius;

  const GlassSheet({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final themeConfig = CharlotteTheme.maybeOf(context)?.config ?? sounderThemeConfig;
    final radius = borderRadius ?? BorderRadius.vertical(top: Radius.circular(themeConfig.radiusLarge));

    return ClipRRect(
      borderRadius: radius,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 40, sigmaY: 40),
        child: Container(
          padding: padding ?? const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: themeConfig.surface.withValues(alpha: 0.85),
            borderRadius: radius,
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.1),
              width: 1,
            ),
          ),
          child: child,
        ),
      ),
    );
  }
}

/// Cupertino-style glass container.
class CupertinoGlassContainer extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;

  const CupertinoGlassContainer({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final themeConfig = CharlotteTheme.maybeOf(context)?.config ?? sounderThemeConfig;
    final radius = borderRadius ?? BorderRadius.circular(themeConfig.radiusMedium);
    return Container(
      margin: margin,
      child: ClipRRect(
        borderRadius: radius,
        child: CupertinoPopupSurface(
          isSurfacePainted: true,
          child: Container(
            padding: padding ?? const EdgeInsets.all(16),
            child: child,
          ),
        ),
      ),
    );
  }
}

/// Glass-styled navigation indicator dot.
class GlassDot extends StatelessWidget {
  final bool isActive;
  final Color? activeColor;
  final double size;
  final VoidCallback? onTap;

  const GlassDot({
    super.key,
    this.isActive = false,
    this.activeColor,
    this.size = 8,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final themeConfig = CharlotteTheme.maybeOf(context)?.config ?? sounderThemeConfig;
    final color = activeColor ?? themeConfig.primary.base;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: isActive ? size * 3 : size,
        height: size,
        decoration: BoxDecoration(
          color: isActive
              ? color.withValues(alpha: 0.8)
              : Colors.white.withValues(alpha: 0.3),
          borderRadius: BorderRadius.circular(size / 2),
          border: Border.all(
            color: isActive ? color : Colors.white.withValues(alpha: 0.2),
            width: 1,
          ),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: color.withValues(alpha: 0.4),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ]
              : null,
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// THEME DATA BUILDERS
// -----------------------------------------------------------------------------

/// Build Material ThemeData from config
ThemeData buildCharlotteTheme([CharlotteThemeConfig? config]) {
  final c = config ?? sounderThemeConfig;

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: c.background,
    colorScheme: ColorScheme.dark(
      primary: c.primary.base,
      secondary: c.secondary.base,
      tertiary: c.tertiary.base,
      error: c.error.base,
      surface: c.surface,
      onSurface: c.textPrimary,
      onPrimary: c.textPrimary,
      onSecondary: c.background,
    ),
    fontFamily: c.bodyFontFamily,
    textTheme: _buildTextTheme(c),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      foregroundColor: c.textPrimary,
    ),
    cardTheme: CardThemeData(
      color: c.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(c.radiusMedium)),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: c.primary.base,
        foregroundColor: c.textPrimary,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(c.radiusMedium)),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: c.primary.base,
        side: BorderSide(color: c.primary.base),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(c.radiusMedium)),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: c.surface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(c.radiusMedium),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(c.radiusMedium),
        borderSide: BorderSide(color: c.primary.base),
      ),
      hintStyle: TextStyle(color: c.textPrimary.withValues(alpha: 0.5)),
    ),
    iconTheme: IconThemeData(color: c.textPrimary),
    dividerTheme: DividerThemeData(color: c.surface, thickness: 1),
  );
}

/// Build Cupertino ThemeData from config
CupertinoThemeData buildCharlotteCupertinoTheme([CharlotteThemeConfig? config]) {
  final c = config ?? sounderThemeConfig;

  return CupertinoThemeData(
    brightness: Brightness.dark,
    primaryColor: c.primary.base,
    primaryContrastingColor: c.textPrimary,
    scaffoldBackgroundColor: c.background,
    barBackgroundColor: c.surface.withValues(alpha: 0.9),
    textTheme: CupertinoTextThemeData(
      primaryColor: c.textPrimary,
      textStyle: TextStyle(
        fontFamily: c.bodyFontFamily,
        color: c.textPrimary,
      ),
    ),
  );
}

TextTheme _buildTextTheme(CharlotteThemeConfig c) {
  TextStyle oswald({
    double fontSize = 16,
    FontWeight fontWeight = FontWeight.w400,
    double letterSpacing = 0,
    double height = 1.2,
  }) {
    return GoogleFonts.oswald(
      fontSize: fontSize,
      fontWeight: fontWeight,
      letterSpacing: letterSpacing,
      height: height,
      color: c.textPrimary,
    );
  }

  TextStyle inter({
    double fontSize = 14,
    FontWeight fontWeight = FontWeight.w400,
    double letterSpacing = 0.25,
    double height = 1.5,
  }) {
    return GoogleFonts.inter(
      fontSize: fontSize,
      fontWeight: fontWeight,
      letterSpacing: letterSpacing,
      height: height,
      color: c.textPrimary,
    );
  }

  return TextTheme(
    displayLarge: oswald(fontSize: 57, fontWeight: FontWeight.w400, letterSpacing: 0),
    displayMedium: oswald(fontSize: 45, fontWeight: FontWeight.w400, letterSpacing: 0),
    displaySmall: oswald(fontSize: 36, fontWeight: FontWeight.w400, letterSpacing: 0),
    headlineLarge: oswald(fontSize: 32, fontWeight: FontWeight.w400),
    headlineMedium: oswald(fontSize: 28, fontWeight: FontWeight.w400),
    headlineSmall: oswald(fontSize: 24, fontWeight: FontWeight.w400),
    titleLarge: oswald(fontSize: 22, fontWeight: FontWeight.w500),
    titleMedium: oswald(fontSize: 16, fontWeight: FontWeight.w500, letterSpacing: 0.15),
    titleSmall: oswald(fontSize: 14, fontWeight: FontWeight.w500, letterSpacing: 0.1),
    labelLarge: oswald(fontSize: 14, fontWeight: FontWeight.w500, letterSpacing: 0.1),
    labelMedium: oswald(fontSize: 12, fontWeight: FontWeight.w500, letterSpacing: 0.5),
    labelSmall: oswald(fontSize: 11, fontWeight: FontWeight.w400),
    bodyLarge: inter(fontSize: 16, letterSpacing: 0.15),
    bodyMedium: inter(fontSize: 14, letterSpacing: 0.25),
    bodySmall: inter(fontSize: 12, letterSpacing: 0.4),
  );
}

// -----------------------------------------------------------------------------
// LEGACY COMPATIBILITY
// -----------------------------------------------------------------------------

/// Legacy getter for backwards compatibility
ThemeData get charlotteTheme => buildCharlotteTheme();

/// Legacy getter for backwards compatibility
CupertinoThemeData get charlotteCupertinoTheme => buildCharlotteCupertinoTheme();
