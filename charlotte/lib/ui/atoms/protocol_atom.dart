import 'package:flutter/material.dart';

import '../../theme.dart';
import 'types.dart';

/// ProtocolAtom - Checkpoint marker with state-based visualization.
class ProtocolAtom extends StatelessWidget {
  final ProtocolState state;
  final DateTime? targetDate;

  const ProtocolAtom({
    super.key,
    required this.state,
    this.targetDate,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(32, 32),
      painter: ProtocolDiamondPainter(state: state),
    );
  }
}

/// Diamond painter for ProtocolAtom
class ProtocolDiamondPainter extends CustomPainter {
  final ProtocolState state;

  ProtocolDiamondPainter({required this.state});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final halfSize = size.width / 2 - 4;

    final path = Path()
      ..moveTo(center.dx, center.dy - halfSize)
      ..lineTo(center.dx + halfSize, center.dy)
      ..lineTo(center.dx, center.dy + halfSize)
      ..lineTo(center.dx - halfSize, center.dy)
      ..close();

    final (fillColor, strokeColor) = switch (state) {
      ProtocolState.pending => (Colors.transparent, CharlotteColors.grey),
      ProtocolState.completed => (CharlotteColors.success, CharlotteColors.success),
      ProtocolState.missed => (CharlotteColors.error, CharlotteColors.error),
    };

    // Fill
    if (state != ProtocolState.pending) {
      final fillPaint = Paint()
        ..color = fillColor
        ..style = PaintingStyle.fill;
      canvas.drawPath(path, fillPaint);
    }

    // Stroke
    final strokePaint = Paint()
      ..color = strokeColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    canvas.drawPath(path, strokePaint);

    // Icon for completed/missed
    if (state == ProtocolState.completed) {
      final iconPaint = Paint()
        ..color = Colors.white
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..strokeCap = StrokeCap.round;

      final checkPath = Path()
        ..moveTo(center.dx - 5, center.dy)
        ..lineTo(center.dx - 1, center.dy + 4)
        ..lineTo(center.dx + 6, center.dy - 4);

      canvas.drawPath(checkPath, iconPaint);
    } else if (state == ProtocolState.missed) {
      final iconPaint = Paint()
        ..color = Colors.white
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..strokeCap = StrokeCap.round;

      canvas.drawLine(
        Offset(center.dx - 4, center.dy - 4),
        Offset(center.dx + 4, center.dy + 4),
        iconPaint,
      );
      canvas.drawLine(
        Offset(center.dx + 4, center.dy - 4),
        Offset(center.dx - 4, center.dy + 4),
        iconPaint,
      );
    }
  }

  @override
  bool shouldRepaint(ProtocolDiamondPainter oldDelegate) {
    return state != oldDelegate.state;
  }
}
