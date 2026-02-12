import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../molecules/molecules.dart';

/// TimeSeriesCard - Chart with date range selector.
///
/// A specialized chart card for time-series data with built-in date range
/// selection chips and time scale options.
class TimeSeriesCard extends StatefulWidget {
  /// Data series to display
  final List<ChartSeries> series;

  /// X axis configuration
  final ChartAxis xAxis;

  /// Y axis configuration
  final ChartAxis yAxis;

  /// Card title
  final String? title;

  /// Available time range options
  final List<TimeRange> timeRanges;

  /// Initial selected time range
  final TimeRange initialRange;

  /// Callback when time range changes
  final void Function(TimeRange range)? onRangeChanged;

  /// Chart type to display
  final TimeSeriesChartType chartType;

  /// Whether to show the legend
  final bool showLegend;

  /// Card height
  final double? height;

  const TimeSeriesCard({
    super.key,
    required this.series,
    required this.xAxis,
    required this.yAxis,
    this.title,
    this.timeRanges = const [
      TimeRange.day,
      TimeRange.week,
      TimeRange.month,
      TimeRange.year,
    ],
    this.initialRange = TimeRange.week,
    this.onRangeChanged,
    this.chartType = TimeSeriesChartType.line,
    this.showLegend = true,
    this.height,
  });

  @override
  State<TimeSeriesCard> createState() => _TimeSeriesCardState();
}

class _TimeSeriesCardState extends State<TimeSeriesCard> {
  late TimeRange _selectedRange;

  @override
  void initState() {
    super.initState();
    _selectedRange = widget.initialRange;
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          height: widget.height,
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
              // Header with title and range selector
              _buildHeader(),

              const SizedBox(height: 16),

              // Chart
              Expanded(child: _buildChart()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        if (widget.title != null)
          Expanded(
            child: Text(
              widget.title!,
              style: TextStyle(
                color: CharlotteColors.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          )
        else
          const Spacer(),

        // Time range chips
        _buildRangeSelector(),
      ],
    );
  }

  Widget _buildRangeSelector() {
    return Container(
      decoration: BoxDecoration(
        color: CharlotteColors.surface,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: widget.timeRanges.map((range) {
          final isSelected = range == _selectedRange;
          return GestureDetector(
            onTap: () {
              setState(() => _selectedRange = range);
              widget.onRangeChanged?.call(range);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: isSelected
                    ? CharlotteColors.primary.withValues(alpha: 0.2)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                range.label,
                style: TextStyle(
                  color: isSelected
                      ? CharlotteColors.primary
                      : CharlotteColors.textTertiary,
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildChart() {
    switch (widget.chartType) {
      case TimeSeriesChartType.line:
        return GlassLineChart(
          series: widget.series,
          xAxis: widget.xAxis,
          yAxis: widget.yAxis,
          showArea: false,
          legendPosition: widget.showLegend && widget.series.length > 1
              ? LegendPosition.bottom
              : LegendPosition.none,
        );

      case TimeSeriesChartType.area:
        return GlassLineChart(
          series: widget.series,
          xAxis: widget.xAxis,
          yAxis: widget.yAxis,
          showArea: true,
          legendPosition: widget.showLegend && widget.series.length > 1
              ? LegendPosition.bottom
              : LegendPosition.none,
        );

      case TimeSeriesChartType.bar:
        // Convert series to bar data
        final barData = <BarData>[];
        if (widget.series.isNotEmpty) {
          final firstSeries = widget.series.first;
          for (int i = 0; i < firstSeries.points.length; i++) {
            final point = firstSeries.points[i];
            final values = widget.series.map((s) {
              return i < s.points.length ? s.points[i].y * widget.yAxis.max : 0.0;
            }).toList();

            barData.add(BarData(
              label: point.label ?? 'P${i + 1}',
              values: values,
              colors: widget.series.map((s) => s.effectiveColor).toList(),
            ));
          }
        }

        return GlassBarChart(
          data: barData,
          seriesLabels: widget.series.map((s) => s.label).toList(),
          seriesColors: widget.series.map((s) => s.effectiveColor).toList(),
          variant: widget.series.length > 1
              ? BarChartVariant.grouped
              : BarChartVariant.vertical,
          yAxis: widget.yAxis,
        );

      case TimeSeriesChartType.stackedArea:
        return GlassAreaChart(
          series: widget.series,
          xAxis: widget.xAxis,
          yAxis: widget.yAxis,
          legendPosition: widget.showLegend && widget.series.length > 1
              ? LegendPosition.bottom
              : LegendPosition.none,
        );
    }
  }
}

/// Time range options for time series charts.
enum TimeRange {
  hour('1H'),
  day('1D'),
  week('1W'),
  month('1M'),
  quarter('3M'),
  year('1Y'),
  all('All');

  final String label;
  const TimeRange(this.label);
}

/// Chart type options for time series display.
enum TimeSeriesChartType {
  line,
  area,
  bar,
  stackedArea,
}
