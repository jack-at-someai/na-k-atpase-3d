import 'package:flutter/material.dart';

import '../../theme.dart';
import '../molecules/chart_data.dart';

/// AxisAtom - Renders X or Y axis with ticks and labels.
///
/// Uses CustomPainter for crisp rendering of axis lines and tick marks.
/// Follows Charlotte's glassmorphic design with subtle colors.
class AxisAtom extends StatelessWidget {
  /// Axis configuration
  final ChartAxis axis;

  /// Whether this is a horizontal (X) or vertical (Y) axis
  final bool isHorizontal;

  /// Size of the axis area
  final double size;

  /// Color for axis lines and labels
  final Color? color;

  /// Whether to show the axis line
  final bool showAxisLine;

  /// Whether to show tick marks
  final bool showTicks;

  /// Whether to show labels
  final bool showLabels;

  const AxisAtom({
    super.key,
    required this.axis,
    this.isHorizontal = true,
    this.size = 40,
    this.color,
    this.showAxisLine = true,
    this.showTicks = true,
    this.showLabels = true,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? CharlotteColors.textTertiary;

    if (isHorizontal) {
      return SizedBox(
        height: size,
        child: CustomPaint(
          painter: _HorizontalAxisPainter(
            axis: axis,
            color: effectiveColor,
            showAxisLine: showAxisLine,
            showTicks: showTicks,
          ),
          child: showLabels ? _buildHorizontalLabels(effectiveColor) : null,
        ),
      );
    } else {
      return SizedBox(
        width: size,
        child: CustomPaint(
          painter: _VerticalAxisPainter(
            axis: axis,
            color: effectiveColor,
            showAxisLine: showAxisLine,
            showTicks: showTicks,
          ),
          child: showLabels ? _buildVerticalLabels(effectiveColor) : null,
        ),
      );
    }
  }

  Widget _buildHorizontalLabels(Color textColor) {
    final labels = axis.getTickLabels();
    final positions = axis.getTickPositions();

    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: List.generate(labels.length, (i) {
            final xPos = positions[i] * constraints.maxWidth;
            return Positioned(
              left: xPos - 20,
              top: 12,
              child: SizedBox(
                width: 40,
                child: Text(
                  labels[i],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 10,
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildVerticalLabels(Color textColor) {
    final labels = axis.getTickLabels();
    final positions = axis.getTickPositions();

    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: List.generate(labels.length, (i) {
            // Y axis is inverted (0 at bottom)
            final yPos = (1 - positions[i]) * constraints.maxHeight;
            return Positioned(
              right: 8,
              top: yPos - 6,
              child: Text(
                labels[i],
                style: TextStyle(
                  color: textColor,
                  fontSize: 10,
                ),
              ),
            );
          }),
        );
      },
    );
  }
}

/// Painter for horizontal (X) axis
class _HorizontalAxisPainter extends CustomPainter {
  final ChartAxis axis;
  final Color color;
  final bool showAxisLine;
  final bool showTicks;

  _HorizontalAxisPainter({
    required this.axis,
    required this.color,
    required this.showAxisLine,
    required this.showTicks,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    // Draw axis line
    if (showAxisLine) {
      canvas.drawLine(
        Offset(0, 0),
        Offset(size.width, 0),
        paint,
      );
    }

    // Draw ticks
    if (showTicks) {
      final positions = axis.getTickPositions();
      for (final pos in positions) {
        final x = pos * size.width;
        canvas.drawLine(
          Offset(x, 0),
          Offset(x, 6),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(_HorizontalAxisPainter oldDelegate) {
    return axis != oldDelegate.axis || color != oldDelegate.color;
  }
}

/// Painter for vertical (Y) axis
class _VerticalAxisPainter extends CustomPainter {
  final ChartAxis axis;
  final Color color;
  final bool showAxisLine;
  final bool showTicks;

  _VerticalAxisPainter({
    required this.axis,
    required this.color,
    required this.showAxisLine,
    required this.showTicks,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    // Draw axis line (on right side for Y axis)
    if (showAxisLine) {
      canvas.drawLine(
        Offset(size.width, 0),
        Offset(size.width, size.height),
        paint,
      );
    }

    // Draw ticks
    if (showTicks) {
      final positions = axis.getTickPositions();
      for (final pos in positions) {
        // Y axis inverted
        final y = (1 - pos) * size.height;
        canvas.drawLine(
          Offset(size.width - 6, y),
          Offset(size.width, y),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(_VerticalAxisPainter oldDelegate) {
    return axis != oldDelegate.axis || color != oldDelegate.color;
  }
}
