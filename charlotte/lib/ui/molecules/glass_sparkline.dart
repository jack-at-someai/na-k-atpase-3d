import 'package:flutter/material.dart';

import '../../theme.dart';

/// GlassSparkline - Mini inline trend visualization.
///
/// A compact line chart for showing trends in small spaces like stat cards.
/// Supports line and area fill variants with glassmorphic styling.
class GlassSparkline extends StatelessWidget {
  /// Data points (normalized 0-1 values)
  final List<double> values;

  /// Width of the sparkline
  final double width;

  /// Height of the sparkline
  final double height;

  /// Line color
  final Color? color;

  /// Line stroke width
  final double strokeWidth;

  /// Whether to show area fill under the line
  final bool showArea;

  /// Whether to show data point markers
  final bool showPoints;

  /// Whether to show min/max indicators
  final bool showMinMax;

  /// Whether to show the current (last) value highlighted
  final bool highlightLast;

  /// Whether to use smooth curves (Bezier) vs straight lines
  final bool smooth;

  const GlassSparkline({
    super.key,
    required this.values,
    this.width = 100,
    this.height = 32,
    this.color,
    this.strokeWidth = 2,
    this.showArea = false,
    this.showPoints = false,
    this.showMinMax = false,
    this.highlightLast = false,
    this.smooth = true,
  });

  @override
  Widget build(BuildContext context) {
    if (values.isEmpty) {
      return SizedBox(width: width, height: height);
    }

    final effectiveColor = color ?? CharlotteColors.primary;

    return SizedBox(
      width: width,
      height: height,
      child: CustomPaint(
        painter: _SparklinePainter(
          values: values,
          color: effectiveColor,
          strokeWidth: strokeWidth,
          showArea: showArea,
          showPoints: showPoints,
          showMinMax: showMinMax,
          highlightLast: highlightLast,
          smooth: smooth,
        ),
      ),
    );
  }
}

class _SparklinePainter extends CustomPainter {
  final List<double> values;
  final Color color;
  final double strokeWidth;
  final bool showArea;
  final bool showPoints;
  final bool showMinMax;
  final bool highlightLast;
  final bool smooth;

  _SparklinePainter({
    required this.values,
    required this.color,
    required this.strokeWidth,
    required this.showArea,
    required this.showPoints,
    required this.showMinMax,
    required this.highlightLast,
    required this.smooth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (values.isEmpty) return;

    // Normalize values to 0-1 range if not already
    final minVal = values.reduce((a, b) => a < b ? a : b);
    final maxVal = values.reduce((a, b) => a > b ? a : b);
    final range = maxVal - minVal;

    List<double> normalizedValues;
    if (range == 0) {
      normalizedValues = List.filled(values.length, 0.5);
    } else {
      normalizedValues = values.map((v) => (v - minVal) / range).toList();
    }

    // Calculate points
    final points = <Offset>[];
    final padding = 4.0;
    final chartWidth = size.width - padding * 2;
    final chartHeight = size.height - padding * 2;

    for (int i = 0; i < normalizedValues.length; i++) {
      final x = padding + (i / (normalizedValues.length - 1)) * chartWidth;
      final y = padding + (1 - normalizedValues[i]) * chartHeight;
      points.add(Offset(x, y));
    }

    // Draw area fill
    if (showArea) {
      final areaPath = _createPath(points, smooth);
      areaPath.lineTo(points.last.dx, size.height);
      areaPath.lineTo(points.first.dx, size.height);
      areaPath.close();

      final areaPaint = Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            color.withValues(alpha: 0.3),
            color.withValues(alpha: 0.0),
          ],
        ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

      canvas.drawPath(areaPath, areaPaint);
    }

    // Draw line
    final linePath = _createPath(points, smooth);
    final linePaint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(linePath, linePaint);

    // Draw points
    if (showPoints) {
      final pointPaint = Paint()
        ..color = color
        ..style = PaintingStyle.fill;

      for (final point in points) {
        canvas.drawCircle(point, strokeWidth, pointPaint);
      }
    }

    // Draw min/max indicators
    if (showMinMax && normalizedValues.length > 1) {
      final minIndex = normalizedValues.indexOf(normalizedValues.reduce((a, b) => a < b ? a : b));
      final maxIndex = normalizedValues.indexOf(normalizedValues.reduce((a, b) => a > b ? a : b));

      final markerPaint = Paint()
        ..style = PaintingStyle.fill;

      // Min marker (red)
      markerPaint.color = CharlotteVisualizationColors.scoreLow;
      canvas.drawCircle(points[minIndex], strokeWidth * 1.5, markerPaint);

      // Max marker (green)
      markerPaint.color = CharlotteVisualizationColors.scoreHigh;
      canvas.drawCircle(points[maxIndex], strokeWidth * 1.5, markerPaint);
    }

    // Highlight last point
    if (highlightLast && points.isNotEmpty) {
      // Glow
      final glowPaint = Paint()
        ..color = color.withValues(alpha: 0.3)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
      canvas.drawCircle(points.last, strokeWidth * 2, glowPaint);

      // Point
      final pointPaint = Paint()
        ..color = color
        ..style = PaintingStyle.fill;
      canvas.drawCircle(points.last, strokeWidth * 1.5, pointPaint);
    }
  }

  Path _createPath(List<Offset> points, bool smooth) {
    final path = Path();
    if (points.isEmpty) return path;

    path.moveTo(points.first.dx, points.first.dy);

    if (!smooth || points.length < 3) {
      // Straight lines
      for (int i = 1; i < points.length; i++) {
        path.lineTo(points[i].dx, points[i].dy);
      }
    } else {
      // Smooth Bezier curves (Catmull-Rom spline)
      for (int i = 0; i < points.length - 1; i++) {
        final p0 = i > 0 ? points[i - 1] : points[i];
        final p1 = points[i];
        final p2 = points[i + 1];
        final p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];

        final cp1x = p1.dx + (p2.dx - p0.dx) / 6;
        final cp1y = p1.dy + (p2.dy - p0.dy) / 6;
        final cp2x = p2.dx - (p3.dx - p1.dx) / 6;
        final cp2y = p2.dy - (p3.dy - p1.dy) / 6;

        path.cubicTo(cp1x, cp1y, cp2x, cp2y, p2.dx, p2.dy);
      }
    }

    return path;
  }

  @override
  bool shouldRepaint(_SparklinePainter oldDelegate) {
    return values != oldDelegate.values ||
        color != oldDelegate.color ||
        strokeWidth != oldDelegate.strokeWidth ||
        showArea != oldDelegate.showArea ||
        showPoints != oldDelegate.showPoints ||
        showMinMax != oldDelegate.showMinMax ||
        highlightLast != oldDelegate.highlightLast ||
        smooth != oldDelegate.smooth;
  }
}
