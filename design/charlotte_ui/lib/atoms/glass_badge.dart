import 'package:flutter/material.dart';

import '../theme.dart';

/// GlassBadge - Counter/notification indicator with glassmorphic styling.
/// Displays a count, dot indicator, or custom content.
class GlassBadge extends StatelessWidget {
  final int? count;
  final bool showDot;
  final Color? color;
  final double size;
  final Widget? child;

  const GlassBadge({
    super.key,
    this.count,
    this.showDot = false,
    this.color,
    this.size = 18,
    this.child,
  });

  /// Creates a dot-only badge
  const GlassBadge.dot({
    super.key,
    this.color,
    this.size = 8,
  })  : count = null,
        showDot = true,
        child = null;

  /// Creates a count badge
  const GlassBadge.count({
    super.key,
    required int value,
    this.color,
    this.size = 18,
  })  : count = value,
        showDot = false,
        child = null;

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? CharlotteColors.highlight;

    // Dot indicator
    if (showDot && count == null && child == null) {
      return Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: effectiveColor,
          shape: BoxShape.circle,
          border: Border.all(
            color: CharlotteColors.background,
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: effectiveColor.withValues(alpha: 0.4),
              blurRadius: 4,
              spreadRadius: 1,
            ),
          ],
        ),
      );
    }

    // Count or custom content badge
    final displayText = count != null
        ? (count! > 99 ? '99+' : count.toString())
        : null;

    final minWidth = displayText != null && displayText.length > 1
        ? size + (displayText.length - 1) * 6
        : size;

    return Container(
      constraints: BoxConstraints(
        minWidth: minWidth,
        minHeight: size,
      ),
      padding: EdgeInsets.symmetric(
        horizontal: size * 0.3,
        vertical: size * 0.1,
      ),
      decoration: BoxDecoration(
        color: effectiveColor,
        borderRadius: BorderRadius.circular(size / 2),
        border: Border.all(
          color: CharlotteColors.background,
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: effectiveColor.withValues(alpha: 0.3),
            blurRadius: 4,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Center(
        child: child ??
            (displayText != null
                ? Text(
                    displayText,
                    style: TextStyle(
                      color: CharlotteColors.white,
                      fontSize: size * 0.6,
                      fontWeight: FontWeight.w600,
                      height: 1,
                    ),
                  )
                : null),
      ),
    );
  }
}

/// Wrapper to position a badge relative to another widget
class GlassBadgeWrapper extends StatelessWidget {
  final Widget child;
  final Widget badge;
  final AlignmentGeometry alignment;
  final Offset offset;

  const GlassBadgeWrapper({
    super.key,
    required this.child,
    required this.badge,
    this.alignment = Alignment.topRight,
    this.offset = Offset.zero,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        child,
        Positioned(
          top: alignment == Alignment.topRight || alignment == Alignment.topLeft
              ? -4 + offset.dy
              : null,
          bottom: alignment == Alignment.bottomRight ||
                  alignment == Alignment.bottomLeft
              ? -4 + offset.dy
              : null,
          right:
              alignment == Alignment.topRight || alignment == Alignment.bottomRight
                  ? -4 + offset.dx
                  : null,
          left: alignment == Alignment.topLeft || alignment == Alignment.bottomLeft
              ? -4 + offset.dx
              : null,
          child: badge,
        ),
      ],
    );
  }
}
