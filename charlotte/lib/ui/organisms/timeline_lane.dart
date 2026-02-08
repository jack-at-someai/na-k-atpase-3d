import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import '../molecules/molecules.dart';
import 'types.dart';

/// TimelineLane - Multiple MetricLanes stacked for a single node (SQUIRT's swimming lanes).
class TimelineLane extends StatelessWidget {
  final String nodeLabel;
  final String nodeCategory;
  final List<MetricLaneData> metrics;
  final DateRange range;
  final bool showNowIndicator;

  const TimelineLane({
    super.key,
    required this.nodeLabel,
    required this.nodeCategory,
    required this.metrics,
    required this.range,
    this.showNowIndicator = false,
  });

  String _formatDate(DateTime date) {
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[date.month - 1]} ${date.day}';
  }

  @override
  Widget build(BuildContext context) {
    final nowPosition = showNowIndicator ? range.positionFor(DateTime.now()) : null;

    return GlassContainer(
      intensity: GlassIntensity.subtle,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Node header
          Row(
            children: [
              NodeAtom(
                category: nodeCategory,
                size: 40,
                depth: 0,
              ),
              const SizedBox(width: 12),
              Text(
                nodeLabel,
                style: TextStyle(
                  color: CharlotteColors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Metric lanes with now indicator
          Stack(
            children: [
              Column(
                children: metrics.map((metric) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: MetricLane(
                    metricLabel: metric.label,
                    valueType: metric.valueType,
                    signals: metric.signals,
                    isExpanded: metric.isExpanded,
                  ),
                )).toList(),
              ),
              // Now indicator line
              if (nowPosition != null && nowPosition >= 0 && nowPosition <= 1)
                Positioned(
                  left: 120 + (nowPosition * 200), // Approximate positioning
                  top: 0,
                  bottom: 0,
                  child: Container(
                    width: 2,
                    decoration: BoxDecoration(
                      color: CharlotteColors.error,
                      boxShadow: [
                        BoxShadow(
                          color: CharlotteColors.error.withValues(alpha: 0.5),
                          blurRadius: 4,
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),

          // Time axis
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _formatDate(range.start),
                style: TextStyle(
                  color: CharlotteColors.textTertiary,
                  fontSize: 11,
                ),
              ),
              if (showNowIndicator)
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: CharlotteColors.error,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'NOW',
                      style: TextStyle(
                        color: CharlotteColors.error,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              Text(
                _formatDate(range.end),
                style: TextStyle(
                  color: CharlotteColors.textTertiary,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
