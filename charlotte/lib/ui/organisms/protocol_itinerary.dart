import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import 'types.dart';

/// ProtocolItinerary - Journey visualization with checkpoints as a timeline.
class ProtocolItinerary extends StatelessWidget {
  final String protocolLabel;
  final String subjectLabel;
  final List<ItineraryCheckpoint> checkpoints;
  final int currentDay;
  final int totalDays;

  const ProtocolItinerary({
    super.key,
    required this.protocolLabel,
    required this.subjectLabel,
    required this.checkpoints,
    required this.currentDay,
    required this.totalDays,
  });

  String _formatDate(DateTime date) {
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[date.month - 1]} ${date.day}';
  }

  @override
  Widget build(BuildContext context) {
    final progress = (currentDay / totalDays).clamp(0.0, 1.0);
    final expectedEndDate = DateTime.now().add(Duration(days: totalDays - currentDay));

    return GlassContainer(
      intensity: GlassIntensity.subtle,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Text(
            protocolLabel,
            style: TextStyle(
              color: CharlotteColors.textTertiary,
              fontSize: 12,
              fontWeight: FontWeight.w500,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subjectLabel,
            style: TextStyle(
              color: CharlotteColors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          // Progress bar
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Day $currentDay of $totalDays',
                    style: TextStyle(
                      color: CharlotteColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                  Text(
                    '${(progress * 100).toInt()}%',
                    style: TextStyle(
                      color: CharlotteColors.primary,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Stack(
                children: [
                  Container(
                    height: 8,
                    decoration: BoxDecoration(
                      color: CharlotteColors.surface,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  FractionallySizedBox(
                    widthFactor: progress,
                    child: Container(
                      height: 8,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [CharlotteColors.primary, CharlotteColors.secondary],
                        ),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Checkpoints timeline
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                for (int i = 0; i < checkpoints.length; i++) ...[
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Day ${checkpoints[i].dayNumber}',
                        style: TextStyle(
                          color: CharlotteColors.textTertiary,
                          fontSize: 10,
                        ),
                      ),
                      const SizedBox(height: 4),
                      ProtocolAtom(state: checkpoints[i].state),
                      const SizedBox(height: 4),
                      SizedBox(
                        width: 70,
                        child: Text(
                          checkpoints[i].label,
                          style: TextStyle(
                            color: switch (checkpoints[i].state) {
                              ProtocolState.pending => CharlotteColors.textSecondary,
                              ProtocolState.completed => CharlotteColors.success,
                              ProtocolState.missed => CharlotteColors.error,
                            },
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (checkpoints[i].completedDate != null)
                        Text(
                          _formatDate(checkpoints[i].completedDate!),
                          style: TextStyle(
                            color: CharlotteColors.textTertiary,
                            fontSize: 9,
                          ),
                        ),
                    ],
                  ),
                  if (i < checkpoints.length - 1)
                    Container(
                      width: 30,
                      height: 2,
                      margin: const EdgeInsets.only(bottom: 30),
                      color: checkpoints[i].state == ProtocolState.completed
                          ? CharlotteColors.success.withValues(alpha: 0.5)
                          : CharlotteColors.trackBorder,
                    ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Status message
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: CharlotteColors.success.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: CharlotteColors.success.withValues(alpha: 0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.check_circle_outline,
                  size: 16,
                  color: CharlotteColors.success,
                ),
                const SizedBox(width: 8),
                Text(
                  'On track for ${_formatDate(expectedEndDate)}',
                  style: TextStyle(
                    color: CharlotteColors.success,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
