import 'package:flutter/material.dart';

import '../theme.dart';

// =============================================================================
// CHART DATA MODELS
// Normalized data structures for Charlotte visualization components
// =============================================================================

/// Direction indicator for trends
enum TrendDirection { up, down, flat }

/// Bar chart layout variants
enum BarChartVariant { vertical, horizontal, stacked, grouped }

/// Legend placement options
enum LegendPosition { bottom, right, none }

/// Line chart variants
enum LineChartVariant { line, area, stepped }

// -----------------------------------------------------------------------------
// CHART DATA POINT
// -----------------------------------------------------------------------------

/// Normalized data point for chart positioning (0-1 coordinate space).
///
/// Follows Charlotte's pattern of 0-1 normalized positioning for consistent
/// layouts across different viewport sizes.
class ChartDataPoint {
  /// Normalized x position (0.0-1.0)
  final double x;

  /// Normalized y position (0.0-1.0)
  final double y;

  /// Original value for labels and tooltips
  final dynamic value;

  /// Optional label for this point
  final String? label;

  /// Optional color override for this point
  final Color? color;

  const ChartDataPoint({
    required this.x,
    required this.y,
    this.value,
    this.label,
    this.color,
  });

  /// Create from raw value with axis normalization
  factory ChartDataPoint.fromValue({
    required double rawX,
    required double rawY,
    required ChartAxis xAxis,
    required ChartAxis yAxis,
    String? label,
    Color? color,
  }) {
    return ChartDataPoint(
      x: xAxis.normalize(rawX),
      y: yAxis.normalize(rawY),
      value: rawY,
      label: label,
      color: color,
    );
  }

  ChartDataPoint copyWith({
    double? x,
    double? y,
    dynamic value,
    String? label,
    Color? color,
  }) {
    return ChartDataPoint(
      x: x ?? this.x,
      y: y ?? this.y,
      value: value ?? this.value,
      label: label ?? this.label,
      color: color ?? this.color,
    );
  }
}

// -----------------------------------------------------------------------------
// CHART SERIES
// -----------------------------------------------------------------------------

/// A data series for multi-line/bar charts.
///
/// Each series gets a consistent color from [CharlotteCategoryColors] if no
/// color is explicitly provided.
class ChartSeries {
  /// Unique identifier for this series
  final String id;

  /// Display label for legend
  final String label;

  /// Data points in this series
  final List<ChartDataPoint> points;

  /// Series color (defaults to [CharlotteCategoryColors.forCategory(id)])
  final Color? color;

  /// Whether this series should show as an area fill
  final bool showArea;

  /// Whether to show data point markers
  final bool showMarkers;

  const ChartSeries({
    required this.id,
    required this.label,
    required this.points,
    this.color,
    this.showArea = false,
    this.showMarkers = true,
  });

  /// Get effective color, using category color system as fallback
  Color get effectiveColor => color ?? CharlotteCategoryColors.forCategory(id);

  ChartSeries copyWith({
    String? id,
    String? label,
    List<ChartDataPoint>? points,
    Color? color,
    bool? showArea,
    bool? showMarkers,
  }) {
    return ChartSeries(
      id: id ?? this.id,
      label: label ?? this.label,
      points: points ?? this.points,
      color: color ?? this.color,
      showArea: showArea ?? this.showArea,
      showMarkers: showMarkers ?? this.showMarkers,
    );
  }
}

// -----------------------------------------------------------------------------
// CHART AXIS
// -----------------------------------------------------------------------------

/// Configuration for a chart axis.
///
/// Handles normalization of raw values to 0-1 space and provides tick labels.
class ChartAxis {
  /// Axis label (e.g., "Time", "Weight")
  final String? label;

  /// Minimum value on this axis
  final double min;

  /// Maximum value on this axis
  final double max;

  /// Custom tick labels (if null, generates from min/max)
  final List<String>? tickLabels;

  /// Number of grid lines to show
  final int tickCount;

  /// Whether to show grid lines for this axis
  final bool showGridLines;

  /// Format function for auto-generated labels
  final String Function(double value)? formatter;

  const ChartAxis({
    this.label,
    required this.min,
    required this.max,
    this.tickLabels,
    this.tickCount = 5,
    this.showGridLines = true,
    this.formatter,
  });

  /// Normalize a value to 0-1 range
  double normalize(double value) {
    if (max <= min) return 0.5;
    return ((value - min) / (max - min)).clamp(0.0, 1.0);
  }

  /// Denormalize from 0-1 back to actual value
  double denormalize(double normalized) {
    return min + (normalized * (max - min));
  }

  /// Get labels for tick marks
  List<String> getTickLabels() {
    if (tickLabels != null) return tickLabels!;

    final labels = <String>[];
    for (int i = 0; i < tickCount; i++) {
      final value = min + (i / (tickCount - 1)) * (max - min);
      labels.add(formatter?.call(value) ?? value.toStringAsFixed(0));
    }
    return labels;
  }

  /// Get normalized positions for tick marks (0-1)
  List<double> getTickPositions() {
    return List.generate(
      tickCount,
      (i) => i / (tickCount - 1),
    );
  }

  ChartAxis copyWith({
    String? label,
    double? min,
    double? max,
    List<String>? tickLabels,
    int? tickCount,
    bool? showGridLines,
    String Function(double value)? formatter,
  }) {
    return ChartAxis(
      label: label ?? this.label,
      min: min ?? this.min,
      max: max ?? this.max,
      tickLabels: tickLabels ?? this.tickLabels,
      tickCount: tickCount ?? this.tickCount,
      showGridLines: showGridLines ?? this.showGridLines,
      formatter: formatter ?? this.formatter,
    );
  }
}

// -----------------------------------------------------------------------------
// DONUT SEGMENT
// -----------------------------------------------------------------------------

/// A segment of a donut/pie chart.
class DonutSegment {
  /// Display label for this segment
  final String label;

  /// Raw value (will be normalized to percentage)
  final double value;

  /// Segment color (defaults to category color)
  final Color? color;

  const DonutSegment({
    required this.label,
    required this.value,
    this.color,
  });

  /// Get effective color using category color system
  Color get effectiveColor => color ?? CharlotteCategoryColors.forCategory(label);

  DonutSegment copyWith({
    String? label,
    double? value,
    Color? color,
  }) {
    return DonutSegment(
      label: label ?? this.label,
      value: value ?? this.value,
      color: color ?? this.color,
    );
  }
}

// -----------------------------------------------------------------------------
// CONTRIBUTION CELL
// -----------------------------------------------------------------------------

/// A cell in a contribution/heatmap grid.
class ContributionCell {
  /// Date for this cell
  final DateTime date;

  /// Intensity value (0.0-1.0)
  final double intensity;

  /// Optional raw count for tooltip
  final int? count;

  /// Optional label override
  final String? label;

  const ContributionCell({
    required this.date,
    required this.intensity,
    this.count,
    this.label,
  });

  ContributionCell copyWith({
    DateTime? date,
    double? intensity,
    int? count,
    String? label,
  }) {
    return ContributionCell(
      date: date ?? this.date,
      intensity: intensity ?? this.intensity,
      count: count ?? this.count,
      label: label ?? this.label,
    );
  }
}

// -----------------------------------------------------------------------------
// BAR DATA
// -----------------------------------------------------------------------------

/// Data for a single bar or bar group.
class BarData {
  /// Label for this bar/group
  final String label;

  /// Values (single for simple, multiple for stacked/grouped)
  final List<double> values;

  /// Optional colors per value segment
  final List<Color>? colors;

  const BarData({
    required this.label,
    required this.values,
    this.colors,
  });

  /// Total value (sum of all segments)
  double get total => values.fold(0.0, (sum, v) => sum + v);

  /// Single value accessor (for simple bar charts)
  double get value => values.isNotEmpty ? values.first : 0;

  BarData copyWith({
    String? label,
    List<double>? values,
    List<Color>? colors,
  }) {
    return BarData(
      label: label ?? this.label,
      values: values ?? this.values,
      colors: colors ?? this.colors,
    );
  }
}

// -----------------------------------------------------------------------------
// STAT DATA
// -----------------------------------------------------------------------------

/// Data for a stat card display.
class StatData {
  /// Main metric label
  final String label;

  /// Current value (displayed large)
  final String value;

  /// Unit suffix (e.g., "kg", "%", "$")
  final String? unit;

  /// Change from previous period
  final double? change;

  /// Trend direction
  final TrendDirection? trend;

  /// Sparkline data points (normalized 0-1)
  final List<double>? sparkline;

  /// Optional accent color
  final Color? color;

  const StatData({
    required this.label,
    required this.value,
    this.unit,
    this.change,
    this.trend,
    this.sparkline,
    this.color,
  });

  /// Determine trend from change value
  TrendDirection get effectiveTrend {
    if (trend != null) return trend!;
    if (change == null) return TrendDirection.flat;
    if (change! > 0) return TrendDirection.up;
    if (change! < 0) return TrendDirection.down;
    return TrendDirection.flat;
  }

  StatData copyWith({
    String? label,
    String? value,
    String? unit,
    double? change,
    TrendDirection? trend,
    List<double>? sparkline,
    Color? color,
  }) {
    return StatData(
      label: label ?? this.label,
      value: value ?? this.value,
      unit: unit ?? this.unit,
      change: change ?? this.change,
      trend: trend ?? this.trend,
      sparkline: sparkline ?? this.sparkline,
      color: color ?? this.color,
    );
  }
}
