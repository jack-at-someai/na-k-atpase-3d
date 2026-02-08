import 'package:flutter/material.dart';

import '../../theme.dart';

/// GlassDivider - Visual separator with glassmorphic styling.
/// Supports horizontal and vertical orientation with customizable thickness.
class GlassDivider extends StatelessWidget {
  final bool isVertical;
  final double thickness;
  final double? length;
  final EdgeInsetsGeometry? margin;
  final Color? color;

  const GlassDivider({
    super.key,
    this.isVertical = false,
    this.thickness = 1,
    this.length,
    this.margin,
    this.color,
  });

  /// Creates a horizontal divider
  const GlassDivider.horizontal({
    super.key,
    this.thickness = 1,
    this.length,
    this.margin,
    this.color,
  }) : isVertical = false;

  /// Creates a vertical divider
  const GlassDivider.vertical({
    super.key,
    this.thickness = 1,
    this.length,
    this.margin,
    this.color,
  }) : isVertical = true;

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? CharlotteColors.glassBorder;

    return Container(
      margin: margin,
      width: isVertical ? thickness : length,
      height: isVertical ? length : thickness,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: isVertical ? Alignment.topCenter : Alignment.centerLeft,
          end: isVertical ? Alignment.bottomCenter : Alignment.centerRight,
          colors: [
            effectiveColor.withValues(alpha: 0.0),
            effectiveColor,
            effectiveColor,
            effectiveColor.withValues(alpha: 0.0),
          ],
          stops: const [0.0, 0.1, 0.9, 1.0],
        ),
      ),
    );
  }
}
