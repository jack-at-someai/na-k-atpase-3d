import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';

/// EdgeAtomPainter - CustomPainter for drawing edge lines between nodes.
/// Supports different edge types with distinct visual styles.
class EdgeAtomPainter extends CustomPainter {
  final Offset start;
  final Offset end;
  final String edgeType;
  final bool isDirected;
  final bool isSelected;
  final double curvature;

  EdgeAtomPainter({
    required this.start,
    required this.end,
    required this.edgeType,
    this.isDirected = false,
    this.isSelected = false,
    this.curvature = 0.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final (color, isDashed, strokeWidth) = _styleForEdgeType(edgeType);

    final paint = Paint()
      ..color = isSelected ? color : color.withValues(alpha: 0.7)
      ..strokeWidth = isSelected ? strokeWidth * 1.5 : strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    // Calculate control point for curve
    final midX = (start.dx + end.dx) / 2;
    final midY = (start.dy + end.dy) / 2;

    // Perpendicular offset for curvature
    final dx = end.dx - start.dx;
    final dy = end.dy - start.dy;
    final length = math.sqrt(dx * dx + dy * dy);
    final perpX = -dy / length * curvature * 50;
    final perpY = dx / length * curvature * 50;

    final controlPoint = Offset(midX + perpX, midY + perpY);

    if (isDashed) {
      _drawDashedCurve(canvas, start, controlPoint, end, paint);
    } else {
      final path = Path()
        ..moveTo(start.dx, start.dy)
        ..quadraticBezierTo(controlPoint.dx, controlPoint.dy, end.dx, end.dy);
      canvas.drawPath(path, paint);
    }

    // Draw arrow if directed
    if (isDirected) {
      _drawArrow(canvas, controlPoint, end, paint);
    }
  }

  void _drawDashedCurve(Canvas canvas, Offset start, Offset control, Offset end, Paint paint) {
    const dashLength = 8.0;
    const gapLength = 4.0;

    final path = Path()
      ..moveTo(start.dx, start.dy)
      ..quadraticBezierTo(control.dx, control.dy, end.dx, end.dy);

    final metrics = path.computeMetrics().first;
    double distance = 0;
    bool draw = true;

    while (distance < metrics.length) {
      final segmentLength = draw ? dashLength : gapLength;
      final nextDistance = (distance + segmentLength).clamp(0.0, metrics.length);

      if (draw) {
        final extractedPath = metrics.extractPath(distance, nextDistance);
        canvas.drawPath(extractedPath, paint);
      }

      distance = nextDistance;
      draw = !draw;
    }
  }

  void _drawArrow(Canvas canvas, Offset control, Offset end, Paint paint) {
    final arrowPaint = Paint()
      ..color = paint.color
      ..style = PaintingStyle.fill;

    // Calculate direction from control point to end
    final dx = end.dx - control.dx;
    final dy = end.dy - control.dy;
    final angle = math.atan2(dy, dx);

    const arrowSize = 10.0;
    const arrowAngle = 0.5;

    final path = Path();
    path.moveTo(end.dx, end.dy);
    path.lineTo(
      end.dx - arrowSize * math.cos(angle - arrowAngle),
      end.dy - arrowSize * math.sin(angle - arrowAngle),
    );
    path.lineTo(
      end.dx - arrowSize * math.cos(angle + arrowAngle),
      end.dy - arrowSize * math.sin(angle + arrowAngle),
    );
    path.close();

    canvas.drawPath(path, arrowPaint);
  }

  (Color, bool, double) _styleForEdgeType(String type) {
    return switch (type.toUpperCase()) {
      'OWNS' => (const Color(0xFF2196F3), false, 2.0),
      'MEMBER_OF' => (const Color(0xFF4CAF50), false, 2.0),
      'TRACKS' => (const Color(0xFF009688), true, 2.0),
      'SIRED_BY' => (const Color(0xFFE91E63), true, 2.0),
      'DAM_OF' => (const Color(0xFFE91E63), true, 2.0),
      'NEXT' => (const Color(0xFF9E9E9E), false, 1.0),
      'LOCATED_IN' => (const Color(0xFFFF9800), false, 2.0),
      _ => (CharlotteColors.grey, false, 1.5),
    };
  }

  @override
  bool shouldRepaint(EdgeAtomPainter oldDelegate) {
    return start != oldDelegate.start ||
        end != oldDelegate.end ||
        edgeType != oldDelegate.edgeType ||
        isDirected != oldDelegate.isDirected ||
        isSelected != oldDelegate.isSelected ||
        curvature != oldDelegate.curvature;
  }
}

/// EdgeAtom - Widget wrapper for EdgeAtomPainter
class EdgeAtom extends StatelessWidget {
  final Offset start;
  final Offset end;
  final String edgeType;
  final bool isDirected;
  final bool isSelected;
  final double curvature;

  const EdgeAtom({
    super.key,
    required this.start,
    required this.end,
    required this.edgeType,
    this.isDirected = false,
    this.isSelected = false,
    this.curvature = 0.0,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: EdgeAtomPainter(
        start: start,
        end: end,
        edgeType: edgeType,
        isDirected: isDirected,
        isSelected: isSelected,
        curvature: curvature,
      ),
    );
  }
}
