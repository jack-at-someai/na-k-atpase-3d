import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import 'chart_data.dart';

/// GlassBarChart - Vertical/horizontal/stacked/grouped bar visualization.
///
/// Supports multiple variants with glassmorphic styling, including gradient
/// fills and glow effects on highlighted bars.
class GlassBarChart extends StatefulWidget {
  /// Bar data to display
  final List<BarData> data;

  /// Series labels (for stacked/grouped variants)
  final List<String>? seriesLabels;

  /// Series colors (for stacked/grouped variants)
  final List<Color>? seriesColors;

  /// Chart variant
  final BarChartVariant variant;

  /// Y axis configuration
  final ChartAxis? yAxis;

  /// Whether to show Y axis labels
  final bool showYAxis;

  /// Whether to show X axis labels
  final bool showXAxis;

  /// Whether to show grid lines
  final bool showGrid;

  /// Whether to show bar value labels
  final bool showValues;

  /// Bar corner radius
  final double barRadius;

  /// Gap between bars (0-1, fraction of bar width)
  final double barGap;

  /// Selected bar index (-1 for none)
  final int selectedIndex;

  /// Callback when bar is tapped
  final void Function(int index, int? seriesIndex)? onBarTap;

  const GlassBarChart({
    super.key,
    required this.data,
    this.seriesLabels,
    this.seriesColors,
    this.variant = BarChartVariant.vertical,
    this.yAxis,
    this.showYAxis = true,
    this.showXAxis = true,
    this.showGrid = true,
    this.showValues = false,
    this.barRadius = 4,
    this.barGap = 0.2,
    this.selectedIndex = -1,
    this.onBarTap,
  });

  @override
  State<GlassBarChart> createState() => _GlassBarChartState();
}

class _GlassBarChartState extends State<GlassBarChart> {
  int _hoveredIndex = -1;

  ChartAxis get _effectiveYAxis {
    if (widget.yAxis != null) return widget.yAxis!;

    double maxValue = 0;
    for (final bar in widget.data) {
      if (widget.variant == BarChartVariant.stacked) {
        maxValue = maxValue > bar.total ? maxValue : bar.total;
      } else {
        for (final v in bar.values) {
          maxValue = maxValue > v ? maxValue : v;
        }
      }
    }
    return ChartAxis(min: 0, max: maxValue * 1.1, tickCount: 5);
  }

  @override
  Widget build(BuildContext context) {
    final isHorizontal = widget.variant == BarChartVariant.horizontal;

    return LayoutBuilder(
      builder: (context, constraints) {
        // chartWidth calculation (for potential future use)
        final chartHeight = widget.showXAxis && !isHorizontal
            ? constraints.maxHeight - 24
            : constraints.maxHeight;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Y Axis
            if (widget.showYAxis && !isHorizontal)
              SizedBox(
                width: 40,
                height: chartHeight,
                child: AxisAtom(
                  axis: _effectiveYAxis,
                  isHorizontal: false,
                  showAxisLine: false,
                ),
              ),

            // Chart area
            Expanded(
              child: Column(
                children: [
                  // Chart
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                        child: Container(
                          decoration: BoxDecoration(
                            color: CharlotteColors.glassFill,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: CharlotteColors.glassBorder,
                              width: 1,
                            ),
                          ),
                          child: Stack(
                            children: [
                              // Grid
                              if (widget.showGrid)
                                Positioned.fill(
                                  child: GridAtom(
                                    yAxis: _effectiveYAxis,
                                    showVertical: false,
                                  ),
                                ),

                              // Bars
                              Positioned.fill(
                                child: Padding(
                                  padding: const EdgeInsets.all(8),
                                  child: _buildBars(),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                  // X Axis labels
                  if (widget.showXAxis && !isHorizontal)
                    SizedBox(
                      height: 24,
                      child: _buildXLabels(),
                    ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildBars() {
    switch (widget.variant) {
      case BarChartVariant.vertical:
        return _buildVerticalBars();
      case BarChartVariant.horizontal:
        return _buildHorizontalBars();
      case BarChartVariant.stacked:
        return _buildStackedBars();
      case BarChartVariant.grouped:
        return _buildGroupedBars();
    }
  }

  Widget _buildVerticalBars() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final barCount = widget.data.length;
        final availableWidth = constraints.maxWidth;
        final barWidth = availableWidth / barCount;
        final actualBarWidth = barWidth * (1 - widget.barGap);

        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: List.generate(barCount, (index) {
            final bar = widget.data[index];
            final normalizedHeight = _effectiveYAxis.normalize(bar.value);
            final isSelected = index == widget.selectedIndex;
            final isHovered = index == _hoveredIndex;
            final color = bar.colors?.first ??
                CharlotteCategoryColors.forCategory(bar.label);

            return MouseRegion(
              onEnter: (_) => setState(() => _hoveredIndex = index),
              onExit: (_) => setState(() => _hoveredIndex = -1),
              child: GestureDetector(
                onTap: () => widget.onBarTap?.call(index, null),
                child: SizedBox(
                  width: barWidth,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      if (widget.showValues)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text(
                            bar.value.toStringAsFixed(0),
                            style: TextStyle(
                              color: CharlotteColors.textSecondary,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      _buildBar(
                        width: actualBarWidth,
                        heightFraction: normalizedHeight,
                        color: color,
                        isHighlighted: isSelected || isHovered,
                        constraints: constraints,
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildHorizontalBars() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final barCount = widget.data.length;
        final barHeight = constraints.maxHeight / barCount;
        final actualBarHeight = barHeight * (1 - widget.barGap);

        return Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: List.generate(barCount, (index) {
            final bar = widget.data[index];
            final normalizedWidth = _effectiveYAxis.normalize(bar.value);
            final isSelected = index == widget.selectedIndex;
            final isHovered = index == _hoveredIndex;
            final color = bar.colors?.first ??
                CharlotteCategoryColors.forCategory(bar.label);

            return MouseRegion(
              onEnter: (_) => setState(() => _hoveredIndex = index),
              onExit: (_) => setState(() => _hoveredIndex = -1),
              child: GestureDetector(
                onTap: () => widget.onBarTap?.call(index, null),
                child: SizedBox(
                  height: barHeight,
                  child: Row(
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: normalizedWidth * constraints.maxWidth * 0.9,
                        height: actualBarHeight,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              color,
                              color.withValues(alpha: 0.7),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(widget.barRadius),
                          boxShadow: isSelected || isHovered
                              ? [
                                  BoxShadow(
                                    color: color.withValues(alpha: 0.5),
                                    blurRadius: 12,
                                    spreadRadius: 2,
                                  ),
                                ]
                              : null,
                        ),
                      ),
                      if (widget.showValues)
                        Padding(
                          padding: const EdgeInsets.only(left: 8),
                          child: Text(
                            bar.value.toStringAsFixed(0),
                            style: TextStyle(
                              color: CharlotteColors.textSecondary,
                              fontSize: 10,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildStackedBars() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final barCount = widget.data.length;
        final barWidth = constraints.maxWidth / barCount;
        final actualBarWidth = barWidth * (1 - widget.barGap);

        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: List.generate(barCount, (index) {
            final bar = widget.data[index];
            final isSelected = index == widget.selectedIndex;
            final isHovered = index == _hoveredIndex;

            return MouseRegion(
              onEnter: (_) => setState(() => _hoveredIndex = index),
              onExit: (_) => setState(() => _hoveredIndex = -1),
              child: GestureDetector(
                onTap: () => widget.onBarTap?.call(index, null),
                child: SizedBox(
                  width: barWidth,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ...List.generate(bar.values.length, (seriesIndex) {
                        final segmentValue = bar.values[seriesIndex];
                        final normalizedHeight =
                            _effectiveYAxis.normalize(segmentValue) *
                                constraints.maxHeight;
                        final color = bar.colors?[seriesIndex] ??
                            widget.seriesColors?[seriesIndex] ??
                            CharlotteCategoryColors.forCategory(
                                widget.seriesLabels?[seriesIndex] ??
                                    'series$seriesIndex');

                        final isFirst = seriesIndex == 0;
                        final isLast = seriesIndex == bar.values.length - 1;

                        return Container(
                          width: actualBarWidth,
                          height: normalizedHeight,
                          decoration: BoxDecoration(
                            color: color,
                            borderRadius: BorderRadius.vertical(
                              top: isLast
                                  ? Radius.circular(widget.barRadius)
                                  : Radius.zero,
                              bottom: isFirst
                                  ? Radius.circular(widget.barRadius)
                                  : Radius.zero,
                            ),
                            boxShadow: (isSelected || isHovered) && isLast
                                ? [
                                    BoxShadow(
                                      color: color.withValues(alpha: 0.5),
                                      blurRadius: 12,
                                      spreadRadius: 2,
                                    ),
                                  ]
                                : null,
                          ),
                        );
                      }).reversed,
                    ],
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildGroupedBars() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final groupCount = widget.data.length;
        final groupWidth = constraints.maxWidth / groupCount;
        final seriesCount = widget.data.isNotEmpty ? widget.data.first.values.length : 0;
        final barWidth = (groupWidth * (1 - widget.barGap)) / seriesCount;

        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: List.generate(groupCount, (groupIndex) {
            final bar = widget.data[groupIndex];
            final isSelected = groupIndex == widget.selectedIndex;
            final isHovered = groupIndex == _hoveredIndex;

            return MouseRegion(
              onEnter: (_) => setState(() => _hoveredIndex = groupIndex),
              onExit: (_) => setState(() => _hoveredIndex = -1),
              child: GestureDetector(
                onTap: () => widget.onBarTap?.call(groupIndex, null),
                child: SizedBox(
                  width: groupWidth,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: List.generate(bar.values.length, (seriesIndex) {
                      final value = bar.values[seriesIndex];
                      final normalizedHeight = _effectiveYAxis.normalize(value);
                      final color = bar.colors?[seriesIndex] ??
                          widget.seriesColors?[seriesIndex] ??
                          CharlotteCategoryColors.forCategory(
                              widget.seriesLabels?[seriesIndex] ??
                                  'series$seriesIndex');

                      return _buildBar(
                        width: barWidth * 0.9,
                        heightFraction: normalizedHeight,
                        color: color,
                        isHighlighted: isSelected || isHovered,
                        constraints: constraints,
                      );
                    }),
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildBar({
    required double width,
    required double heightFraction,
    required Color color,
    required bool isHighlighted,
    required BoxConstraints constraints,
  }) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      width: width,
      height: heightFraction * constraints.maxHeight,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            color,
            color.withValues(alpha: 0.7),
          ],
        ),
        borderRadius: BorderRadius.circular(widget.barRadius),
        boxShadow: isHighlighted
            ? [
                BoxShadow(
                  color: color.withValues(alpha: 0.5),
                  blurRadius: 12,
                  spreadRadius: 2,
                ),
              ]
            : null,
      ),
    );
  }

  Widget _buildXLabels() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: widget.data.map((bar) {
        return Expanded(
          child: Text(
            bar.label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: CharlotteColors.textTertiary,
              fontSize: 10,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        );
      }).toList(),
    );
  }
}
