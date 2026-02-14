import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../models/catchball.dart';
import '../../theme/maestro_colors.dart';

/// CustomPainter for the Catchball hierarchy visualizer.
/// 5 levels with 8 throw/catch arrow transitions.
/// Ports JS prototype lines 919-1018.
class CatchballPainter extends CustomPainter {
  final CatchballProcess data;

  CatchballPainter({required this.data});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final levelCount = data.levels.length;
    if (levelCount == 0) return;

    final rowH = h / levelCount;
    final boxW = w * 0.35;
    final boxH = rowH * 0.48;

    // Draw levels
    for (var i = 0; i < levelCount; i++) {
      final level = data.levels[i];
      final color = MaestroColors.catchballLevels[i % MaestroColors.catchballLevels.length];
      final cy = i * rowH + rowH / 2;
      final bx = (w - boxW) / 2;
      final by = cy - boxH / 2;
      final isActive = data.currentStep >= i * 2;

      // Background band
      canvas.drawRect(
        Rect.fromLTWH(0, i * rowH, w, rowH),
        Paint()..color = color.withValues(alpha: 0.03),
      );

      // Box
      final boxRect = RRect.fromRectAndRadius(
        Rect.fromLTWH(bx, by, boxW, boxH),
        const Radius.circular(6),
      );

      canvas.drawRRect(
        boxRect,
        Paint()..color = color.withValues(alpha: 0.13),
      );
      canvas.drawRRect(
        boxRect,
        Paint()
          ..color = color
          ..style = PaintingStyle.stroke
          ..strokeWidth = isActive ? 2.5 : 1,
      );

      // Role label
      final roleSpan = TextSpan(
        text: level.role,
        style: TextStyle(
          color: Colors.white,
          fontSize: 13,
          fontWeight: FontWeight.w700,
          fontFamily: 'Inter',
        ),
      );
      final roleTp = TextPainter(
        text: roleSpan,
        textDirection: TextDirection.ltr,
      )..layout(maxWidth: boxW - 16);
      roleTp.paint(canvas, Offset(bx + 8, by + 8));

      // Description
      final descSpan = TextSpan(
        text: level.description,
        style: TextStyle(
          color: Colors.white.withValues(alpha: 0.7),
          fontSize: 10,
          fontFamily: 'Inter',
        ),
      );
      final descTp = TextPainter(
        text: descSpan,
        textDirection: TextDirection.ltr,
      )..layout(maxWidth: boxW - 16);
      descTp.paint(canvas, Offset(bx + 8, by + 26));
    }

    // Draw arrows for each round
    for (var s = 0; s < data.rounds.length; s++) {
      final round = data.rounds[s];
      final fromY = round.fromLevel * rowH + rowH / 2;
      final toY = round.toLevel * rowH + rowH / 2;

      final isCurrent = s == data.currentStep;
      final isPast = s < data.currentStep;
      if (!isCurrent && !isPast) continue;

      // X offset for visual separation
      final xOffset = (s % 2 == 0) ? -50.0 : 50.0;
      final furtherOffset = (s ~/ 2).isEven ? -40.0 : 40.0;
      final ax = w / 2 + xOffset + furtherOffset;

      final arrowPaint = Paint()
        ..color = isCurrent
            ? MaestroColors.accent
            : MaestroColors.accent.withValues(alpha: 0.55)
        ..strokeWidth = isCurrent ? 3 : 1.5
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round;

      // Dashed for catch (upward), solid for throw (downward)
      if (round.isThrow) {
        canvas.drawLine(Offset(ax, fromY), Offset(ax, toY), arrowPaint);
      } else {
        _drawDashedLine(canvas, Offset(ax, fromY), Offset(ax, toY), arrowPaint);
      }

      // Arrowhead
      final dir = toY > fromY ? 1.0 : -1.0;
      final headY = toY;
      final headPath = Path()
        ..moveTo(ax - 6, headY - 8 * dir)
        ..lineTo(ax, headY)
        ..lineTo(ax + 6, headY - 8 * dir);
      canvas.drawPath(headPath, arrowPaint..style = PaintingStyle.stroke);

      // Label next to arrow
      if (isCurrent) {
        final labelSpan = TextSpan(
          text: round.label,
          style: TextStyle(
            color: MaestroColors.accent,
            fontSize: 9,
            fontFamily: 'Inter',
            fontWeight: FontWeight.w600,
          ),
        );
        final labelTp = TextPainter(
          text: labelSpan,
          textDirection: TextDirection.ltr,
        )..layout();
        final labelY = (fromY + toY) / 2 - labelTp.height / 2;
        labelTp.paint(canvas, Offset(ax + 10, labelY));
      }
    }
  }

  void _drawDashedLine(
      Canvas canvas, Offset from, Offset to, Paint paint) {
    final distance = (to - from).distance;
    final direction = (to - from) / distance;
    const dashLen = 6.0;
    const gapLen = 4.0;
    var d = 0.0;

    while (d < distance) {
      final start = from + direction * d;
      final end = from + direction * math.min(d + dashLen, distance);
      canvas.drawLine(start, end, paint);
      d += dashLen + gapLen;
    }
  }

  @override
  bool shouldRepaint(covariant CatchballPainter old) => old.data != data;
}
