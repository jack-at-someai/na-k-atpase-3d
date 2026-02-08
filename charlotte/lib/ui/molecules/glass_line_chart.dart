import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import 'chart_data.dart';

/// GlassLineChart - Single/multi-line chart with optional area fill.
///
/// Renders smooth or stepped line charts with glassmorphic styling.
/// Supports multiple series, data point markers, and area fills.
class GlassLineChart extends StatefulWidget {
  /// Data series to display
  final List<ChartSeries> series;

  /// X axis configuration
  final ChartAxis xAxis;

  /// Y axis configuration
  final ChartAxis yAxis;

  /// Whether to show the X axis
  final bool showXAxis;

  /// Whether to show the Y axis
  final bool showYAxis;

  /// Whether to show grid lines
  final bool showGrid;

  /// Whether to show data point markers
  final bool showPoints;

  /// Line stroke width
  final double strokeWidth;

  /// Whether to use smooth curves
  final bool smooth;

  /// Whether to show area fill under lines
  final bool showArea;

  /// Legend position
  final LegendPosition legendPosition;

  /// Selected point callback
  final void Function(int seriesIndex, int pointIndex)? onPointTap;

  const GlassLineChart({
    super.key,
    required this.series,
    required this.xAxis,
    required this.yAxis,
    this.showXAxis = true,
    this.showYAxis = true,
    this.showGrid = true,
    this.showPoints = true,
    this.strokeWidth = 2,
    this.smooth = true,
    this.showArea = false,
    this.legendPosition = LegendPosition.bottom,
    this.onPointTap,
  });

  @override
  State<GlassLineChart> createState() => _GlassLineChartState();
}

class _GlassLineChartState extends State<GlassLineChart> {
  int? _hoveredSeriesIndex;
  int? _hoveredPointIndex;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Layout calculations handled by widgets themselves

        return Column(
          children: [
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Y Axis
                  if (widget.showYAxis)
                    SizedBox(
                      width: 40,
                      child: AxisAtom(
                        axis: widget.yAxis,
                        isHorizontal: false,
                        showAxisLine: false,
                      ),
                    ),

                  // Chart area
                  Expanded(
                    child: Column(
                      children: [
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
                                          xAxis: widget.xAxis,
                                          yAxis: widget.yAxis,
                                        ),
                                      ),

                                    // Lines
                                    Positioned.fill(
                                      child: Padding(
                                        padding: const EdgeInsets.all(8),
                                        child: CustomPaint(
                                          painter: _LineChartPainter(
                                            series: widget.series,
                                            strokeWidth: widget.strokeWidth,
                                            smooth: widget.smooth,
                                            showArea: widget.showArea,
                                            hoveredSeriesIndex: _hoveredSeriesIndex,
                                          ),
                                        ),
                                      ),
                                    ),

                                    // Data points
                                    if (widget.showPoints)
                                      Positioned.fill(
                                        child: Padding(
                                          padding: const EdgeInsets.all(8),
                                          child: _buildDataPoints(),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),

                        // X Axis
                        if (widget.showXAxis)
                          SizedBox(
                            height: 24,
                            child: AxisAtom(
                              axis: widget.xAxis,
                              isHorizontal: true,
                              showAxisLine: false,
                            ),
                          ),
                      ],
                    ),
                  ),

                  // Right legend
                  if (widget.legendPosition == LegendPosition.right)
                    Padding(
                      padding: const EdgeInsets.only(left: 16),
                      child: _buildLegend(vertical: true),
                    ),
                ],
              ),
            ),

            // Bottom legend
            if (widget.legendPosition == LegendPosition.bottom)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: _buildLegend(vertical: false),
              ),
          ],
        );
      },
    );
  }

  Widget _buildDataPoints() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final points = <Widget>[];

        for (int seriesIndex = 0; seriesIndex < widget.series.length; seriesIndex++) {
          final series = widget.series[seriesIndex];
          final color = series.effectiveColor;

          for (int pointIndex = 0; pointIndex < series.points.length; pointIndex++) {
            final point = series.points[pointIndex];
            final x = point.x * constraints.maxWidth;
            final y = (1 - point.y) * constraints.maxHeight;
            final isHovered = _hoveredSeriesIndex == seriesIndex &&
                _hoveredPointIndex == pointIndex;

            points.add(
              Positioned(
                left: x - (isHovered ? 6 : 4),
                top: y - (isHovered ? 6 : 4),
                child: MouseRegion(
                  onEnter: (_) => setState(() {
                    _hoveredSeriesIndex = seriesIndex;
                    _hoveredPointIndex = pointIndex;
                  }),
                  onExit: (_) => setState(() {
                    _hoveredSeriesIndex = null;
                    _hoveredPointIndex = null;
                  }),
                  child: GestureDetector(
                    onTap: () => widget.onPointTap?.call(seriesIndex, pointIndex),
                    child: DataPointAtom(
                      size: isHovered ? 12 : 8,
                      color: color,
                      isHighlighted: isHovered,
                      showGlow: isHovered,
                    ),
                  ),
                ),
              ),
            );
          }
        }

        return Stack(children: points);
      },
    );
  }

  Widget _buildLegend({required bool vertical}) {
    final items = widget.series.map((s) {
      return LegendItemAtom(
        label: s.label,
        color: s.effectiveColor,
        shape: LegendShape.line,
      );
    }).toList();

    if (vertical) {
      return LegendColumn(items: items);
    } else {
      return LegendRow(items: items);
    }
  }
}

class _LineChartPainter extends CustomPainter {
  final List<ChartSeries> series;
  final double strokeWidth;
  final bool smooth;
  final bool showArea;
  final int? hoveredSeriesIndex;

  _LineChartPainter({
    required this.series,
    required this.strokeWidth,
    required this.smooth,
    required this.showArea,
    this.hoveredSeriesIndex,
  });

  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < series.length; i++) {
      final s = series[i];
      final color = s.effectiveColor;
      final isHovered = hoveredSeriesIndex == i;
      final alpha = hoveredSeriesIndex != null && !isHovered ? 0.3 : 1.0;

      final points = s.points
          .map((p) => Offset(p.x * size.width, (1 - p.y) * size.height))
          .toList();

      if (points.isEmpty) continue;

      // Draw area fill
      if (showArea || s.showArea) {
        final areaPath = _createPath(points, smooth);
        areaPath.lineTo(points.last.dx, size.height);
        areaPath.lineTo(points.first.dx, size.height);
        areaPath.close();

        final areaPaint = Paint()
          ..shader = LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              color.withValues(alpha: 0.4 * alpha),
              color.withValues(alpha: 0.0),
            ],
          ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

        canvas.drawPath(areaPath, areaPaint);
      }

      // Draw line
      final linePath = _createPath(points, smooth);
      final linePaint = Paint()
        ..color = color.withValues(alpha: alpha)
        ..strokeWidth = isHovered ? strokeWidth * 1.5 : strokeWidth
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      // Glow effect for hovered series
      if (isHovered) {
        final glowPaint = Paint()
          ..color = color.withValues(alpha: 0.3)
          ..strokeWidth = strokeWidth * 4
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
        canvas.drawPath(linePath, glowPaint);
      }

      canvas.drawPath(linePath, linePaint);
    }
  }

  Path _createPath(List<Offset> points, bool smooth) {
    final path = Path();
    if (points.isEmpty) return path;

    path.moveTo(points.first.dx, points.first.dy);

    if (!smooth || points.length < 3) {
      for (int i = 1; i < points.length; i++) {
        path.lineTo(points[i].dx, points[i].dy);
      }
    } else {
      // Catmull-Rom spline for smooth curves
      for (int i = 0; i < points.length - 1; i++) {
        final p0 = i > 0 ? points[i - 1] : points[i];
        final p1 = points[i];
        final p2 = points[i + 1];
        final p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];

        final cp1x = p1.dx + (p2.dx - p0.dx) / 6;
        final cp1y = p1.dy + (p2.dy - p0.dy) / 6;
        final cp2x = p2.dx - (p3.dx - p1.dx) / 6;
        final cp2y = p2.dy - (p3.dy - p1.dy) / 6;

        path.cubicTo(cp1x, cp1y, cp2x, cp2y, p2.dx, p2.dy);
      }
    }

    return path;
  }

  @override
  bool shouldRepaint(_LineChartPainter oldDelegate) {
    return series != oldDelegate.series ||
        strokeWidth != oldDelegate.strokeWidth ||
        smooth != oldDelegate.smooth ||
        showArea != oldDelegate.showArea ||
        hoveredSeriesIndex != oldDelegate.hoveredSeriesIndex;
  }
}
