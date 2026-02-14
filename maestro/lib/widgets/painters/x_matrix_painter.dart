import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../models/x_matrix.dart';
import '../../theme/maestro_colors.dart';

/// CustomPainter that renders the Hoshin Kanri X-Matrix.
/// Ports JS prototype lines 285-419 to Flutter Canvas.
class XMatrixPainter extends CustomPainter {
  final XMatrix data;

  XMatrixPainter({required this.data});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final fontSize = math.max(7.0, w * 0.013);
    final cellSize = math.max(8.0, w * 0.022);

    // Background
    canvas.drawRect(
      Rect.fromLTWH(0, 0, w, h),
      Paint()..color = MaestroColors.background,
    );

    // Diagonal X-lines
    final linePaint = Paint()
      ..color = MaestroColors.border
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    canvas.drawLine(Offset(0, 0), Offset(w, h), linePaint);
    canvas.drawLine(Offset(w, 0), Offset(0, h), linePaint);

    // Center vision box
    final boxW = w * 0.28;
    final boxH = h * 0.12;
    final boxX = (w - boxW) / 2;
    final boxY = (h - boxH) / 2;
    final boxRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(boxX, boxY, boxW, boxH),
      const Radius.circular(8),
    );

    canvas.drawRRect(
      boxRect,
      Paint()..color = MaestroColors.card,
    );
    canvas.drawRRect(
      boxRect,
      Paint()
        ..color = MaestroColors.accent
        ..strokeWidth = 2
        ..style = PaintingStyle.stroke,
    );

    // "TRUE NORTH" label
    _drawText(canvas, 'TRUE NORTH', w / 2, boxY + 12, fontSize,
        MaestroColors.accent,
        bold: true, align: TextAlign.center, maxWidth: boxW - 16);

    // Vision text
    if (data.vision.isNotEmpty) {
      _drawWrappedText(canvas, data.vision, boxX + 8, boxY + 24, boxW - 16,
          fontSize * 0.9, MaestroColors.mauveLt);
    }

    // Quadrant labels
    _drawQuadrantLabel(canvas, 'BREAKTHROUGHS', w / 2, h * 0.88, fontSize * 1.1,
        MaestroColors.xSouth);
    _drawQuadrantLabel(canvas, 'ANNUAL OBJECTIVES', w * 0.06, h / 2,
        fontSize * 1.1, MaestroColors.xWest,
        rotate: -math.pi / 2);
    _drawQuadrantLabel(canvas, 'IMPROVEMENT PRIORITIES', w / 2, h * 0.08,
        fontSize * 1.1, MaestroColors.xNorth);
    _drawQuadrantLabel(canvas, 'TARGETS / KPIs', w * 0.94, h / 2,
        fontSize * 1.1, MaestroColors.xEast,
        rotate: math.pi / 2);

    // Item labels — South (breakthroughs)
    for (var i = 0; i < data.breakthroughs.length; i++) {
      final x = w * 0.25 + (i * w * 0.5 / math.max(1, data.breakthroughs.length));
      _drawText(canvas, _truncate(data.breakthroughs[i], 25), x, h * 0.82,
          fontSize, MaestroColors.text);
    }

    // Item labels — West (annuals)
    for (var i = 0; i < data.annuals.length; i++) {
      final y = h * 0.25 + (i * h * 0.5 / math.max(1, data.annuals.length));
      _drawText(canvas, _truncate(data.annuals[i], 20), w * 0.12, y, fontSize,
          MaestroColors.text,
          rotate: -math.pi / 2);
    }

    // Item labels — North (priorities)
    for (var i = 0; i < data.priorities.length; i++) {
      final x = w * 0.25 + (i * w * 0.5 / math.max(1, data.priorities.length));
      _drawText(canvas, _truncate(data.priorities[i], 25), x, h * 0.14,
          fontSize, MaestroColors.text);
    }

    // Item labels — East (metrics)
    for (var i = 0; i < data.metrics.length; i++) {
      final y = h * 0.25 + (i * h * 0.5 / math.max(1, data.metrics.length));
      _drawText(canvas, _truncate(data.metrics[i].name, 20), w * 0.88, y,
          fontSize, MaestroColors.text,
          rotate: math.pi / 2);
    }

    // Correlation matrices
    _drawCorrelationMatrix(canvas, data.corrSW, w * 0.18, h * 0.62, cellSize);
    _drawCorrelationMatrix(canvas, data.corrNW, w * 0.18, h * 0.18, cellSize);
    _drawCorrelationMatrix(canvas, data.corrNE, w * 0.62, h * 0.18, cellSize);
  }

  void _drawCorrelationMatrix(
      Canvas canvas, List<List<int>> matrix, double ox, double oy, double cs) {
    for (var r = 0; r < matrix.length; r++) {
      for (var c = 0; c < matrix[r].length; c++) {
        final cx = ox + c * cs + cs / 2;
        final cy = oy + r * cs + cs / 2;
        final val = matrix[r][c];

        // Cell background
        canvas.drawRect(
          Rect.fromCenter(center: Offset(cx, cy), width: cs, height: cs),
          Paint()
            ..color = MaestroColors.card
            ..style = PaintingStyle.fill,
        );
        canvas.drawRect(
          Rect.fromCenter(center: Offset(cx, cy), width: cs, height: cs),
          Paint()
            ..color = MaestroColors.border
            ..style = PaintingStyle.stroke
            ..strokeWidth = 0.5,
        );

        // Correlation symbol
        final radius = cs * 0.3;
        if (val == 1) {
          // Weak — outline circle
          canvas.drawCircle(
            Offset(cx, cy),
            radius,
            Paint()
              ..color = MaestroColors.correlationColor
              ..style = PaintingStyle.stroke
              ..strokeWidth = 1.5,
          );
        } else if (val == 2) {
          // Moderate — half-fill
          canvas.drawCircle(
            Offset(cx, cy),
            radius,
            Paint()
              ..color = MaestroColors.correlationColor
              ..style = PaintingStyle.stroke
              ..strokeWidth = 1.5,
          );
          canvas.save();
          canvas.clipRect(Rect.fromLTWH(cx - radius, cy, radius * 2, radius));
          canvas.drawCircle(
            Offset(cx, cy),
            radius,
            Paint()
              ..color = MaestroColors.correlationColor
              ..style = PaintingStyle.fill,
          );
          canvas.restore();
        } else if (val == 3) {
          // Strong — filled circle
          canvas.drawCircle(
            Offset(cx, cy),
            radius,
            Paint()
              ..color = MaestroColors.correlationColor
              ..style = PaintingStyle.fill,
          );
        }
      }
    }
  }

  void _drawText(Canvas canvas, String text, double x, double y,
      double fontSize, Color color,
      {bool bold = false,
      TextAlign align = TextAlign.left,
      double? maxWidth,
      double rotate = 0}) {
    final span = TextSpan(
      text: text,
      style: TextStyle(
        color: color,
        fontSize: fontSize,
        fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
        fontFamily: 'Inter',
      ),
    );
    final tp = TextPainter(
      text: span,
      textAlign: align,
      textDirection: TextDirection.ltr,
    )..layout(maxWidth: maxWidth ?? double.infinity);

    if (rotate != 0) {
      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(rotate);
      tp.paint(canvas, Offset(-tp.width / 2, -tp.height / 2));
      canvas.restore();
    } else {
      final dx = align == TextAlign.center ? x - tp.width / 2 : x;
      tp.paint(canvas, Offset(dx, y));
    }
  }

  void _drawWrappedText(Canvas canvas, String text, double x, double y,
      double maxWidth, double fontSize, Color color) {
    final words = text.split(' ');
    var line = '';
    var currentY = y;

    for (final word in words) {
      final testLine = line.isEmpty ? word : '$line $word';
      final span = TextSpan(
        text: testLine,
        style: TextStyle(
            color: color, fontSize: fontSize, fontFamily: 'Inter'),
      );
      final tp = TextPainter(
        text: span,
        textDirection: TextDirection.ltr,
      )..layout();

      if (tp.width > maxWidth && line.isNotEmpty) {
        _drawText(canvas, line, x, currentY, fontSize, color);
        currentY += fontSize * 1.4;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line.isNotEmpty) {
      _drawText(canvas, line, x, currentY, fontSize, color);
    }
  }

  void _drawQuadrantLabel(Canvas canvas, String text, double x, double y,
      double fontSize, Color color,
      {double rotate = 0}) {
    _drawText(canvas, text, x, y, fontSize, color,
        bold: true, align: TextAlign.center, rotate: rotate);
  }

  String _truncate(String s, int n) {
    if (s.length <= n) return s;
    return '${s.substring(0, n - 1)}\u2026';
  }

  @override
  bool shouldRepaint(covariant XMatrixPainter old) => old.data != data;
}

/// Hit-test helper: which correlation cell was tapped?
class CorrelationHitTest {
  final String matrixKey; // 'SW', 'NW', 'NE'
  final int row;
  final int col;

  const CorrelationHitTest(this.matrixKey, this.row, this.col);

  /// Returns hit info or null if tap was outside correlation areas.
  static CorrelationHitTest? test(
      Offset tap, Size size, XMatrix data) {
    final w = size.width;
    final h = size.height;
    final cs = math.max(8.0, w * 0.022);

    // SW matrix
    final swResult = _hitMatrix(
        tap, w * 0.18, h * 0.62, cs, data.corrSW);
    if (swResult != null) return CorrelationHitTest('SW', swResult.$1, swResult.$2);

    // NW matrix
    final nwResult = _hitMatrix(
        tap, w * 0.18, h * 0.18, cs, data.corrNW);
    if (nwResult != null) return CorrelationHitTest('NW', nwResult.$1, nwResult.$2);

    // NE matrix
    final neResult = _hitMatrix(
        tap, w * 0.62, h * 0.18, cs, data.corrNE);
    if (neResult != null) return CorrelationHitTest('NE', neResult.$1, neResult.$2);

    return null;
  }

  static (int, int)? _hitMatrix(
      Offset tap, double ox, double oy, double cs, List<List<int>> matrix) {
    for (var r = 0; r < matrix.length; r++) {
      for (var c = 0; c < matrix[r].length; c++) {
        final cellRect = Rect.fromLTWH(ox + c * cs, oy + r * cs, cs, cs);
        if (cellRect.contains(tap)) return (r, c);
      }
    }
    return null;
  }
}
