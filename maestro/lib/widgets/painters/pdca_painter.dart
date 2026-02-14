import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/maestro_colors.dart';

/// CustomPainter for the PDCA (Plan-Do-Check-Act) cycle wheel.
/// Ports JS prototype lines 508-565.
class PdcaPainter extends CustomPainter {
  final int activePhase; // 0=Plan, 1=Do, 2=Check, 3=Act

  static const _colors = [
    MaestroColors.pdcaPlan,
    MaestroColors.pdcaDo,
    MaestroColors.pdcaCheck,
    MaestroColors.pdcaAct,
  ];

  static const _labels = ['PLAN', 'DO', 'CHECK', 'ACT'];

  PdcaPainter({required this.activePhase});

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final radius = math.min(cx, cy) * 0.8;

    // Four quadrant arcs
    for (var i = 0; i < 4; i++) {
      final startAngle = -math.pi + (i * math.pi / 2);
      final isActive = i == activePhase;
      final r = isActive ? radius + 10 : radius;

      final paint = Paint()
        ..color = isActive
            ? _colors[i]
            : _colors[i].withValues(alpha: 0.4)
        ..style = PaintingStyle.fill;

      final path = Path()
        ..moveTo(cx, cy)
        ..arcTo(
          Rect.fromCircle(center: Offset(cx, cy), radius: r),
          startAngle,
          math.pi / 2,
          false,
        )
        ..close();

      canvas.drawPath(path, paint);

      // Arc stroke
      canvas.drawPath(
        path,
        Paint()
          ..color = _colors[i]
          ..style = PaintingStyle.stroke
          ..strokeWidth = isActive ? 3 : 1.5,
      );

      // Label at 55% radius, midpoint of arc
      final midAngle = startAngle + math.pi / 4;
      final labelR = r * 0.55;
      final lx = cx + labelR * math.cos(midAngle);
      final ly = cy + labelR * math.sin(midAngle);

      final span = TextSpan(
        text: _labels[i],
        style: TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.w700,
          fontFamily: 'Inter',
        ),
      );
      final tp = TextPainter(
        text: span,
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset(lx - tp.width / 2, ly - tp.height / 2));
    }

    // Center circle
    canvas.drawCircle(
      Offset(cx, cy),
      40,
      Paint()..color = MaestroColors.background,
    );
    canvas.drawCircle(
      Offset(cx, cy),
      40,
      Paint()
        ..color = MaestroColors.accent
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );

    // Rotation arrow in center
    final arrowPaint = Paint()
      ..color = MaestroColors.accent
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;

    final arrowPath = Path()
      ..addArc(
        Rect.fromCircle(center: Offset(cx, cy), radius: 20),
        -0.8 * math.pi,
        1.4 * math.pi,
      );
    canvas.drawPath(arrowPath, arrowPaint);

    // Arrowhead
    final endAngle = -0.8 * math.pi + 1.4 * math.pi;
    final ax = cx + 20 * math.cos(endAngle);
    final ay = cy + 20 * math.sin(endAngle);
    final headPaint = Paint()
      ..color = MaestroColors.accent
      ..style = PaintingStyle.fill;
    final head = Path()
      ..moveTo(ax, ay)
      ..lineTo(ax + 6 * math.cos(endAngle + 0.5), ay + 6 * math.sin(endAngle + 0.5))
      ..lineTo(ax + 6 * math.cos(endAngle - 0.8), ay + 6 * math.sin(endAngle - 0.8))
      ..close();
    canvas.drawPath(head, headPaint);
  }

  @override
  bool shouldRepaint(covariant PdcaPainter old) =>
      old.activePhase != activePhase;

  /// Hit-test: which quadrant was tapped?
  static int? hitTestQuadrant(Offset tap, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final dx = tap.dx - cx;
    final dy = tap.dy - cy;

    // Must be within radius
    if (dx * dx + dy * dy > (math.min(cx, cy) * 0.9) * (math.min(cx, cy) * 0.9)) {
      return null;
    }
    // Must be outside center circle
    if (dx * dx + dy * dy < 40 * 40) return null;

    if (dx < 0 && dy < 0) return 0; // Plan (top-left)
    if (dx >= 0 && dy < 0) return 1; // Do (top-right)
    if (dx >= 0 && dy >= 0) return 2; // Check (bottom-right)
    return 3; // Act (bottom-left)
  }
}
