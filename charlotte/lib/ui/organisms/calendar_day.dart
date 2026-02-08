import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/types.dart';
import 'types.dart';

/// CalendarDay - A single calendar cell with signal indicators (CAL's calendar cells).
class CalendarDay extends StatelessWidget {
  final DateTime date;
  final List<CalendarSignal> signals;
  final List<CalendarCheckpoint> checkpoints;
  final bool isToday;
  final bool isSelected;
  final bool isCurrentMonth;
  final VoidCallback? onTap;

  const CalendarDay({
    super.key,
    required this.date,
    this.signals = const [],
    this.checkpoints = const [],
    this.isToday = false,
    this.isSelected = false,
    this.isCurrentMonth = true,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final visibleSignals = signals.take(4).toList();
    final overflowCount = signals.length > 4 ? signals.length - 4 : 0;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 64,
        decoration: BoxDecoration(
          color: isSelected
              ? CharlotteColors.primary.withValues(alpha: 0.2)
              : isToday
                  ? CharlotteColors.surface.withValues(alpha: 0.8)
                  : CharlotteColors.surface.withValues(alpha: 0.3),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected
                ? CharlotteColors.primary
                : isToday
                    ? CharlotteColors.primary.withValues(alpha: 0.5)
                    : CharlotteColors.glassBorder,
            width: isSelected || isToday ? 2 : 1,
          ),
        ),
        child: Stack(
          children: [
            // Day number
            Positioned(
              top: 4,
              right: 6,
              child: Text(
                '${date.day}',
                style: TextStyle(
                  color: isCurrentMonth
                      ? (isToday ? CharlotteColors.primary : CharlotteColors.white)
                      : CharlotteColors.textTertiary,
                  fontSize: 14,
                  fontWeight: isToday ? FontWeight.bold : FontWeight.w500,
                ),
              ),
            ),
            // Signal dots
            Positioned(
              bottom: 6,
              left: 4,
              right: 4,
              child: Wrap(
                spacing: 3,
                runSpacing: 2,
                children: [
                  ...visibleSignals.map((signal) => Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: signal.color,
                      shape: BoxShape.circle,
                    ),
                  )),
                  if (overflowCount > 0)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 1),
                      decoration: BoxDecoration(
                        color: CharlotteColors.surface,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '+$overflowCount',
                        style: TextStyle(
                          color: CharlotteColors.textTertiary,
                          fontSize: 8,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            // Protocol checkpoint diamond
            if (checkpoints.isNotEmpty)
              Positioned(
                top: 4,
                left: 4,
                child: CustomPaint(
                  size: const Size(12, 12),
                  painter: _SmallDiamondPainter(
                    state: checkpoints.first.state,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Small diamond painter for CalendarDay checkpoints
class _SmallDiamondPainter extends CustomPainter {
  final ProtocolState state;

  _SmallDiamondPainter({required this.state});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final halfSize = size.width / 2 - 1;

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

    if (state != ProtocolState.pending) {
      final fillPaint = Paint()
        ..color = fillColor
        ..style = PaintingStyle.fill;
      canvas.drawPath(path, fillPaint);
    }

    final strokePaint = Paint()
      ..color = strokeColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    canvas.drawPath(path, strokePaint);
  }

  @override
  bool shouldRepaint(_SmallDiamondPainter oldDelegate) {
    return state != oldDelegate.state;
  }
}
