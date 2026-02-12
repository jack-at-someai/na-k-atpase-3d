import 'package:flutter/material.dart';

import '../theme.dart';

/// LegendItemAtom - Color swatch with label for chart legends.
///
/// Displays a colored indicator (circle, square, or line) with accompanying
/// text label. Supports both active and dimmed states for interactive legends.
class LegendItemAtom extends StatelessWidget {
  /// Display label
  final String label;

  /// Legend color
  final Color color;

  /// Shape of the color indicator
  final LegendShape shape;

  /// Size of the color indicator
  final double indicatorSize;

  /// Whether this item is active (not filtered out)
  final bool isActive;

  /// Optional value to display after label
  final String? value;

  /// Callback when tapped (for interactive legends)
  final VoidCallback? onTap;

  const LegendItemAtom({
    super.key,
    required this.label,
    required this.color,
    this.shape = LegendShape.circle,
    this.indicatorSize = 12,
    this.isActive = true,
    this.value,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = isActive ? color : color.withValues(alpha: 0.3);
    final textColor = isActive
        ? CharlotteColors.textSecondary
        : CharlotteColors.textDisabled;

    Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _buildIndicator(effectiveColor),
        const SizedBox(width: 6),
        Text(
          label,
          style: TextStyle(
            color: textColor,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
        if (value != null) ...[
          const SizedBox(width: 4),
          Text(
            value!,
            style: TextStyle(
              color: isActive
                  ? CharlotteColors.textTertiary
                  : CharlotteColors.textDisabled,
              fontSize: 11,
            ),
          ),
        ],
      ],
    );

    if (onTap != null) {
      content = GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: content,
      );
    }

    return content;
  }

  Widget _buildIndicator(Color effectiveColor) {
    switch (shape) {
      case LegendShape.circle:
        return Container(
          width: indicatorSize,
          height: indicatorSize,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: effectiveColor,
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: effectiveColor.withValues(alpha: 0.4),
                      blurRadius: 4,
                      spreadRadius: 1,
                    ),
                  ]
                : null,
          ),
        );

      case LegendShape.square:
        return Container(
          width: indicatorSize,
          height: indicatorSize,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(2),
            color: effectiveColor,
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: effectiveColor.withValues(alpha: 0.4),
                      blurRadius: 4,
                      spreadRadius: 1,
                    ),
                  ]
                : null,
          ),
        );

      case LegendShape.line:
        return Container(
          width: indicatorSize * 1.5,
          height: 3,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(1.5),
            color: effectiveColor,
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: effectiveColor.withValues(alpha: 0.4),
                      blurRadius: 4,
                      spreadRadius: 1,
                    ),
                  ]
                : null,
          ),
        );

      case LegendShape.dashed:
        return SizedBox(
          width: indicatorSize * 1.5,
          height: 3,
          child: CustomPaint(
            painter: _DashedLinePainter(color: effectiveColor),
          ),
        );
    }
  }
}

/// Shape options for legend indicators
enum LegendShape { circle, square, line, dashed }

/// Horizontal legend row with multiple items
class LegendRow extends StatelessWidget {
  final List<LegendItemAtom> items;
  final double spacing;
  final MainAxisAlignment alignment;

  const LegendRow({
    super.key,
    required this.items,
    this.spacing = 16,
    this.alignment = MainAxisAlignment.center,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: spacing,
      runSpacing: 8,
      alignment: WrapAlignment.center,
      children: items,
    );
  }
}

/// Vertical legend column
class LegendColumn extends StatelessWidget {
  final List<LegendItemAtom> items;
  final double spacing;

  const LegendColumn({
    super.key,
    required this.items,
    this.spacing = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: items
          .expand((item) => [item, SizedBox(height: spacing)])
          .take(items.length * 2 - 1)
          .toList(),
    );
  }
}

class _DashedLinePainter extends CustomPainter {
  final Color color;

  _DashedLinePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = size.height
      ..strokeCap = StrokeCap.round;

    const dashWidth = 4.0;
    const dashSpace = 3.0;

    double startX = 0;
    while (startX < size.width) {
      canvas.drawLine(
        Offset(startX, size.height / 2),
        Offset((startX + dashWidth).clamp(0, size.width), size.height / 2),
        paint,
      );
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(_DashedLinePainter oldDelegate) {
    return color != oldDelegate.color;
  }
}
