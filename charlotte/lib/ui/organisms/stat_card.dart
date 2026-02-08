import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import '../molecules/molecules.dart';

/// StatCard - Big number display with trend indicator and sparkline.
///
/// A glassmorphic card for displaying key metrics with context about
/// trends and historical data.
class StatCard extends StatelessWidget {
  /// The stat data to display
  final StatData data;

  /// Whether to show the sparkline
  final bool showSparkline;

  /// Whether to show the trend indicator
  final bool showTrend;

  /// Card width (null for flexible)
  final double? width;

  /// Card height
  final double height;

  /// Callback when card is tapped
  final VoidCallback? onTap;

  const StatCard({
    super.key,
    required this.data,
    this.showSparkline = true,
    this.showTrend = true,
    this.width,
    this.height = 120,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = data.color ?? CharlotteColors.primary;

    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            width: width,
            height: height,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: CharlotteColors.glassFill,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: CharlotteColors.glassBorder,
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Label row
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        data.label,
                        style: TextStyle(
                          color: CharlotteColors.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (showTrend && data.change != null)
                      TrendBadge.fromChange(data.change!, compact: true),
                  ],
                ),

                const Spacer(),

                // Value row
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                data.value,
                                style: TextStyle(
                                  color: CharlotteColors.textPrimary,
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              if (data.unit != null) ...[
                                const SizedBox(width: 4),
                                Text(
                                  data.unit!,
                                  style: TextStyle(
                                    color: CharlotteColors.textTertiary,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ),

                    // Sparkline
                    if (showSparkline && data.sparkline != null && data.sparkline!.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(left: 8),
                        child: GlassSparkline(
                          values: data.sparkline!,
                          width: 80,
                          height: 32,
                          color: effectiveColor,
                          showArea: true,
                          highlightLast: true,
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// StatCardRow - Horizontal layout of multiple stat cards.
class StatCardRow extends StatelessWidget {
  final List<StatData> stats;
  final double spacing;
  final double cardHeight;

  const StatCardRow({
    super.key,
    required this.stats,
    this.spacing = 12,
    this.cardHeight = 120,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: stats
          .expand((stat) => [
                Expanded(
                  child: StatCard(data: stat, height: cardHeight),
                ),
                SizedBox(width: spacing),
              ])
          .take(stats.length * 2 - 1)
          .toList(),
    );
  }
}

/// StatCardGrid - Grid layout of stat cards.
class StatCardGrid extends StatelessWidget {
  final List<StatData> stats;
  final int crossAxisCount;
  final double spacing;
  final double cardHeight;

  const StatCardGrid({
    super.key,
    required this.stats,
    this.crossAxisCount = 2,
    this.spacing = 12,
    this.cardHeight = 120,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        crossAxisSpacing: spacing,
        mainAxisSpacing: spacing,
        mainAxisExtent: cardHeight,
      ),
      itemCount: stats.length,
      itemBuilder: (context, index) {
        return StatCard(data: stats[index], height: cardHeight);
      },
    );
  }
}
