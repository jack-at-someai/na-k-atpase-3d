import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../atoms/atoms.dart';
import '../molecules/molecules.dart';

/// ComparisonCard - Side-by-side metric comparison.
///
/// Displays two or more metrics for comparison with visual indicators
/// showing the relationship between them (bars, percentages, etc.).
class ComparisonCard extends StatelessWidget {
  /// Comparison items to display
  final List<ComparisonItem> items;

  /// Card title
  final String? title;

  /// Comparison display style
  final ComparisonStyle style;

  /// Whether to show percentage labels
  final bool showPercentages;

  /// Whether to show value labels
  final bool showValues;

  /// Whether to highlight the maximum value
  final bool highlightMax;

  /// Card height
  final double? height;

  const ComparisonCard({
    super.key,
    required this.items,
    this.title,
    this.style = ComparisonStyle.horizontalBars,
    this.showPercentages = true,
    this.showValues = true,
    this.highlightMax = true,
    this.height,
  });

  double get _maxValue => items.map((i) => i.value).reduce((a, b) => a > b ? a : b);
  double get _total => items.fold(0.0, (sum, i) => sum + i.value);

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
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
              if (title != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Text(
                    title!,
                    style: TextStyle(
                      color: CharlotteColors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),

              Expanded(child: _buildComparison()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildComparison() {
    switch (style) {
      case ComparisonStyle.horizontalBars:
        return _buildHorizontalBars();
      case ComparisonStyle.verticalBars:
        return _buildVerticalBars();
      case ComparisonStyle.donut:
        return _buildDonut();
      case ComparisonStyle.stacked:
        return _buildStacked();
      case ComparisonStyle.sideBySide:
        return _buildSideBySide();
    }
  }

  Widget _buildHorizontalBars() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: items.map((item) {
        final isMax = highlightMax && item.value == _maxValue;
        final fraction = _maxValue > 0 ? item.value / _maxValue : 0.0;
        final percentage = _total > 0 ? (item.value / _total * 100) : 0.0;

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      item.label,
                      style: TextStyle(
                        color: isMax
                            ? CharlotteColors.textPrimary
                            : CharlotteColors.textSecondary,
                        fontSize: 12,
                        fontWeight: isMax ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                  ),
                  if (showValues)
                    Text(
                      item.formattedValue ?? item.value.toStringAsFixed(0),
                      style: TextStyle(
                        color: CharlotteColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  if (showPercentages)
                    Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: Text(
                        '${percentage.toStringAsFixed(1)}%',
                        style: TextStyle(
                          color: CharlotteColors.textTertiary,
                          fontSize: 11,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 4),
              _buildBarWithGlow(
                fraction: fraction,
                color: item.color ?? CharlotteCategoryColors.forCategory(item.label),
                isHighlighted: isMax,
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildBarWithGlow({
    required double fraction,
    required Color color,
    required bool isHighlighted,
  }) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: [
            // Background track
            Container(
              height: 8,
              decoration: BoxDecoration(
                color: CharlotteColors.surface,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            // Filled bar
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              height: 8,
              width: constraints.maxWidth * fraction.clamp(0, 1),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    color,
                    color.withValues(alpha: 0.7),
                  ],
                ),
                borderRadius: BorderRadius.circular(4),
                boxShadow: isHighlighted
                    ? [
                        BoxShadow(
                          color: color.withValues(alpha: 0.5),
                          blurRadius: 8,
                          spreadRadius: 1,
                        ),
                      ]
                    : null,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildVerticalBars() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: items.map((item) {
        final isMax = highlightMax && item.value == _maxValue;
        final fraction = _maxValue > 0 ? item.value / _maxValue : 0.0;
        final color = item.color ?? CharlotteCategoryColors.forCategory(item.label);

        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (showValues)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text(
                      item.formattedValue ?? item.value.toStringAsFixed(0),
                      style: TextStyle(
                        color: CharlotteColors.textSecondary,
                        fontSize: 10,
                      ),
                    ),
                  ),
                Expanded(
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      return Align(
                        alignment: Alignment.bottomCenter,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          width: double.infinity,
                          height: constraints.maxHeight * fraction.clamp(0, 1),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                color,
                                color.withValues(alpha: 0.7),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(4),
                            boxShadow: isMax
                                ? [
                                    BoxShadow(
                                      color: color.withValues(alpha: 0.5),
                                      blurRadius: 8,
                                      spreadRadius: 1,
                                    ),
                                  ]
                                : null,
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  item.label,
                  style: TextStyle(
                    color: isMax
                        ? CharlotteColors.textPrimary
                        : CharlotteColors.textSecondary,
                    fontSize: 10,
                    fontWeight: isMax ? FontWeight.w600 : FontWeight.normal,
                  ),
                  textAlign: TextAlign.center,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildDonut() {
    final segments = items.map((item) {
      return DonutSegment(
        label: item.label,
        value: item.value,
        color: item.color ?? CharlotteCategoryColors.forCategory(item.label),
      );
    }).toList();

    return GlassDonutChart(
      segments: segments,
      showPercentages: showPercentages,
      legendPosition: LegendPosition.right,
    );
  }

  Widget _buildStacked() {
    return Column(
      children: [
        Expanded(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return Row(
                children: items.map((item) {
                  final fraction = _total > 0 ? item.value / _total : 0.0;
                  final color = item.color ?? CharlotteCategoryColors.forCategory(item.label);

                  return Expanded(
                    flex: (fraction * 1000).round(),
                    child: Container(
                      decoration: BoxDecoration(
                        color: color,
                      ),
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ),
        const SizedBox(height: 12),
        LegendRow(
          items: items.map((item) {
            final percentage = _total > 0 ? (item.value / _total * 100) : 0.0;
            return LegendItemAtom(
              label: item.label,
              color: item.color ?? CharlotteCategoryColors.forCategory(item.label),
              value: showPercentages ? '${percentage.toStringAsFixed(1)}%' : null,
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildSideBySide() {
    return Row(
      children: items.map((item) {
        final isMax = highlightMax && item.value == _maxValue;
        final color = item.color ?? CharlotteCategoryColors.forCategory(item.label);
        final percentage = _total > 0 ? (item.value / _total * 100) : 0.0;

        return Expanded(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 4),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isMax ? color : color.withValues(alpha: 0.3),
                width: isMax ? 2 : 1,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  item.formattedValue ?? item.value.toStringAsFixed(0),
                  style: TextStyle(
                    color: color,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (showPercentages)
                  Text(
                    '${percentage.toStringAsFixed(1)}%',
                    style: TextStyle(
                      color: color.withValues(alpha: 0.7),
                      fontSize: 12,
                    ),
                  ),
                const SizedBox(height: 4),
                Text(
                  item.label,
                  style: TextStyle(
                    color: CharlotteColors.textSecondary,
                    fontSize: 11,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}

/// A single item in a comparison.
class ComparisonItem {
  final String label;
  final double value;
  final String? formattedValue;
  final Color? color;

  const ComparisonItem({
    required this.label,
    required this.value,
    this.formattedValue,
    this.color,
  });
}

/// Comparison display styles.
enum ComparisonStyle {
  horizontalBars,
  verticalBars,
  donut,
  stacked,
  sideBySide,
}
