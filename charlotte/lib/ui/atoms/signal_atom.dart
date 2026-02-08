import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';
import 'types.dart';

/// SignalAtom - Observed value point with visual representation by type.
class SignalAtom extends StatelessWidget {
  final dynamic value;
  final String valueType;
  final bool isFromProtocol;
  final SignalState state;

  const SignalAtom({
    super.key,
    required this.value,
    required this.valueType,
    this.isFromProtocol = false,
    this.state = SignalState.normal,
  });

  double get _opacity {
    return switch (state) {
      SignalState.normal => 1.0,
      SignalState.highlighted => 1.0,
      SignalState.dimmed => 0.4,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: _opacity,
      child: Container(
        decoration: state == SignalState.highlighted
            ? BoxDecoration(
                boxShadow: [
                  BoxShadow(
                    color: CharlotteColors.primary.withValues(alpha: 0.5),
                    blurRadius: 12,
                    spreadRadius: 2,
                  ),
                ],
              )
            : null,
        child: _buildShape(),
      ),
    );
  }

  Widget _buildShape() {
    return switch (valueType.toUpperCase()) {
      'NUMBER' => _buildNumber(),
      'BOOLEAN' => _buildBoolean(),
      'SCORE' => _buildScore(),
      'STATUS' => _buildStatus(),
      'EVENT' => _buildEvent(),
      'DATE' => _buildDate(),
      'CURRENCY' => _buildCurrency(),
      'TEXT' => _buildText(),
      _ => _buildNumber(),
    };
  }

  Widget _buildNumber() {
    // Size relative to value (clamped between 16 and 40)
    final numValue = (value is num) ? value.toDouble() : 50.0;
    final sizeValue = (16.0 + (numValue / 100 * 24)).clamp(16.0, 40.0);

    return Container(
      width: sizeValue,
      height: sizeValue,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: CharlotteColors.primary,
        border: isFromProtocol
            ? Border.all(color: CharlotteColors.secondary, width: 2)
            : null,
      ),
      child: Center(
        child: Text(
          '$value',
          style: TextStyle(
            color: CharlotteColors.white,
            fontSize: sizeValue * 0.35,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildBoolean() {
    final boolValue = value == true || value == 'true';
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: boolValue
            ? CharlotteVisualizationColors.boolTrue
            : Colors.transparent,
        border: Border.all(
          color: boolValue
              ? CharlotteVisualizationColors.boolTrue
              : CharlotteColors.grey,
          width: 2,
        ),
      ),
      child: boolValue
          ? const Icon(Icons.check, size: 14, color: Colors.white)
          : null,
    );
  }

  Widget _buildScore() {
    final scoreValue = (value is num) ? value.toDouble() : 50.0;
    final color = CharlotteVisualizationColors.scoreColor(scoreValue, 0, 100);

    return SizedBox(
      width: 40,
      height: 40,
      child: CustomPaint(
        painter: _ScoreArcPainter(
          score: scoreValue / 100,
          color: color,
        ),
        child: Center(
          child: Text(
            '${scoreValue.toInt()}',
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatus() {
    final statusText = value?.toString() ?? 'Unknown';
    final color = CharlotteVisualizationColors.statusColorFor(statusText);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(
        statusText,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildEvent() {
    return Container(
      width: 4,
      height: 32,
      decoration: BoxDecoration(
        color: CharlotteVisualizationColors.eventImpulse,
        borderRadius: BorderRadius.circular(2),
        boxShadow: [
          BoxShadow(
            color: CharlotteVisualizationColors.eventImpulse.withValues(alpha: 0.5),
            blurRadius: 4,
            spreadRadius: 1,
          ),
        ],
      ),
    );
  }

  Widget _buildDate() {
    return CustomPaint(
      size: const Size(24, 28),
      painter: _DateFlagPainter(color: CharlotteVisualizationColors.dateFlag),
    );
  }

  Widget _buildCurrency() {
    final numValue = (value is num) ? value.toDouble() : 0.0;
    final isPositive = numValue >= 0;
    final color = isPositive
        ? CharlotteVisualizationColors.currencyPositive
        : CharlotteVisualizationColors.currencyNegative;

    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color.withValues(alpha: 0.2),
        border: Border.all(color: color, width: 2),
      ),
      child: Center(
        child: Text(
          '\$',
          style: TextStyle(
            color: color,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildText() {
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4),
        color: CharlotteColors.surface,
        border: Border.all(color: CharlotteColors.glassBorder),
      ),
      child: Icon(
        Icons.description_outlined,
        size: 18,
        color: CharlotteColors.white,
      ),
    );
  }
}

/// Score arc painter for SignalAtom SCORE type
class _ScoreArcPainter extends CustomPainter {
  final double score;
  final Color color;

  _ScoreArcPainter({required this.score, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 4;

    // Background arc
    final bgPaint = Paint()
      ..color = CharlotteColors.surface
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi * 0.75,
      math.pi * 1.5,
      false,
      bgPaint,
    );

    // Score arc
    final scorePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi * 0.75,
      math.pi * 1.5 * score.clamp(0.0, 1.0),
      false,
      scorePaint,
    );
  }

  @override
  bool shouldRepaint(_ScoreArcPainter oldDelegate) {
    return score != oldDelegate.score || color != oldDelegate.color;
  }
}

/// Date flag painter for SignalAtom DATE type
class _DateFlagPainter extends CustomPainter {
  final Color color;

  _DateFlagPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    // Draw flag pole
    canvas.drawRect(
      Rect.fromLTWH(0, 0, 2, size.height),
      paint,
    );

    // Draw flag
    final path = Path()
      ..moveTo(2, 0)
      ..lineTo(size.width, 6)
      ..lineTo(2, 12)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_DateFlagPainter oldDelegate) {
    return color != oldDelegate.color;
  }
}
