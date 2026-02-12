import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme.dart';
import '../molecules/chart_data.dart';

/// GridAtom - Background grid lines for charts.
///
/// Renders horizontal and/or vertical grid lines with glassmorphic styling.
/// Uses subtle colors that don't compete with chart data.
class GridAtom extends StatelessWidget {
  /// X axis configuration (for vertical lines)
  final ChartAxis? xAxis;

  /// Y axis configuration (for horizontal lines)
  final ChartAxis? yAxis;

  /// Grid line color
  final Color? color;

  /// Grid line opacity
  final double opacity;

  /// Line width
  final double strokeWidth;

  /// Whether to show horizontal lines
  final bool showHorizontal;

  /// Whether to show vertical lines
  final bool showVertical;

  /// Whether to use dashed lines
  final bool dashed;

  const GridAtom({
    super.key,
    this.xAxis,
    this.yAxis,
    this.color,
    this.opacity = 0.2,
    this.strokeWidth = 1,
    this.showHorizontal = true,
    this.showVertical = true,
    this.dashed = false,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _GridPainter(
        xAxis: xAxis,
        yAxis: yAxis,
        color: (color ?? CharlotteColors.glassBorder).withValues(alpha: opacity),
        strokeWidth: strokeWidth,
        showHorizontal: showHorizontal,
        showVertical: showVertical,
        dashed: dashed,
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  final ChartAxis? xAxis;
  final ChartAxis? yAxis;
  final Color color;
  final double strokeWidth;
  final bool showHorizontal;
  final bool showVertical;
  final bool dashed;

  _GridPainter({
    required this.xAxis,
    required this.yAxis,
    required this.color,
    required this.strokeWidth,
    required this.showHorizontal,
    required this.showVertical,
    required this.dashed,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    // Draw horizontal lines (from Y axis)
    if (showHorizontal && yAxis != null) {
      final positions = yAxis!.getTickPositions();
      for (final pos in positions) {
        final y = (1 - pos) * size.height; // Inverted for screen coords
        if (dashed) {
          _drawDashedLine(
            canvas,
            Offset(0, y),
            Offset(size.width, y),
            paint,
          );
        } else {
          canvas.drawLine(
            Offset(0, y),
            Offset(size.width, y),
            paint,
          );
        }
      }
    }

    // Draw vertical lines (from X axis)
    if (showVertical && xAxis != null) {
      final positions = xAxis!.getTickPositions();
      for (final pos in positions) {
        final x = pos * size.width;
        if (dashed) {
          _drawDashedLine(
            canvas,
            Offset(x, 0),
            Offset(x, size.height),
            paint,
          );
        } else {
          canvas.drawLine(
            Offset(x, 0),
            Offset(x, size.height),
            paint,
          );
        }
      }
    }
  }

  void _drawDashedLine(Canvas canvas, Offset start, Offset end, Paint paint) {
    const dashLength = 4.0;
    const gapLength = 4.0;

    final dx = end.dx - start.dx;
    final dy = end.dy - start.dy;
    final distance = (dx * dx + dy * dy);
    final length = distance > 0 ? math.sqrt(distance) : 0.0;

    if (length == 0) return;

    final unitX = dx / length;
    final unitY = dy / length;

    double currentDistance = 0;
    bool drawing = true;

    while (currentDistance < length) {
      final segmentLength = drawing ? dashLength : gapLength;
      final nextDistance = (currentDistance + segmentLength).clamp(0.0, length);

      if (drawing) {
        canvas.drawLine(
          Offset(
            start.dx + unitX * currentDistance,
            start.dy + unitY * currentDistance,
          ),
          Offset(
            start.dx + unitX * nextDistance,
            start.dy + unitY * nextDistance,
          ),
          paint,
        );
      }

      currentDistance = nextDistance;
      drawing = !drawing;
    }
  }

  @override
  bool shouldRepaint(_GridPainter oldDelegate) {
    return xAxis != oldDelegate.xAxis ||
        yAxis != oldDelegate.yAxis ||
        color != oldDelegate.color ||
        strokeWidth != oldDelegate.strokeWidth ||
        showHorizontal != oldDelegate.showHorizontal ||
        showVertical != oldDelegate.showVertical ||
        dashed != oldDelegate.dashed;
  }
}
