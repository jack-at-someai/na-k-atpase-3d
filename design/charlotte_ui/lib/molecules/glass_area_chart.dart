import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../atoms/atoms.dart';
import 'chart_data.dart';

/// GlassAreaChart - Stacked area visualization.
///
/// Renders multiple data series as stacked areas with glassmorphic styling.
/// Each area has a gradient fill from the series color to transparent.
class GlassAreaChart extends StatefulWidget {
  /// Data series to display (stacked from bottom to top)
  final List<ChartSeries> series;

  /// X axis configuration
  final ChartAxis xAxis;

  /// Y axis configuration (should accommodate stacked totals)
  final ChartAxis yAxis;

  /// Whether to show the X axis
  final bool showXAxis;

  /// Whether to show the Y axis
  final bool showYAxis;

  /// Whether to show grid lines
  final bool showGrid;

  /// Whether to show series lines on top of areas
  final bool showLines;

  /// Line stroke width
  final double strokeWidth;

  /// Whether to use smooth curves
  final bool smooth;

  /// Legend position
  final LegendPosition legendPosition;

  /// Callback when area is tapped
  final void Function(int seriesIndex)? onAreaTap;

  const GlassAreaChart({
    super.key,
    required this.series,
    required this.xAxis,
    required this.yAxis,
    this.showXAxis = true,
    this.showYAxis = true,
    this.showGrid = true,
    this.showLines = true,
    this.strokeWidth = 2,
    this.smooth = true,
    this.legendPosition = LegendPosition.bottom,
    this.onAreaTap,
  });

  @override
  State<GlassAreaChart> createState() => _GlassAreaChartState();
}

class _GlassAreaChartState extends State<GlassAreaChart> {
  int? _hoveredSeriesIndex;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
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

                                    // Stacked areas
                                    Positioned.fill(
                                      child: Padding(
                                        padding: const EdgeInsets.all(8),
                                        child: CustomPaint(
                                          painter: _AreaChartPainter(
                                            series: widget.series,
                                            strokeWidth: widget.strokeWidth,
                                            smooth: widget.smooth,
                                            showLines: widget.showLines,
                                            hoveredSeriesIndex: _hoveredSeriesIndex,
                                          ),
                                        ),
                                      ),
                                    ),

                                    // Hit detection
                                    Positioned.fill(
                                      child: Padding(
                                        padding: const EdgeInsets.all(8),
                                        child: _buildHitAreas(),
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

  Widget _buildHitAreas() {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Simple horizontal band hit detection (height determined by flex)

        return Column(
          children: List.generate(widget.series.length, (index) {
            // Reverse index for stacking order (top to bottom)
            final seriesIndex = widget.series.length - 1 - index;

            return Expanded(
              child: MouseRegion(
                onEnter: (_) => setState(() => _hoveredSeriesIndex = seriesIndex),
                onExit: (_) => setState(() => _hoveredSeriesIndex = null),
                child: GestureDetector(
                  onTap: () => widget.onAreaTap?.call(seriesIndex),
                  behavior: HitTestBehavior.translucent,
                  child: Container(),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildLegend({required bool vertical}) {
    final items = widget.series.map((s) {
      return LegendItemAtom(
        label: s.label,
        color: s.effectiveColor,
        shape: LegendShape.square,
      );
    }).toList();

    if (vertical) {
      return LegendColumn(items: items);
    } else {
      return LegendRow(items: items);
    }
  }
}

class _AreaChartPainter extends CustomPainter {
  final List<ChartSeries> series;
  final double strokeWidth;
  final bool smooth;
  final bool showLines;
  final int? hoveredSeriesIndex;

  _AreaChartPainter({
    required this.series,
    required this.strokeWidth,
    required this.smooth,
    required this.showLines,
    this.hoveredSeriesIndex,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (series.isEmpty) return;

    // Build stacked points
    final stackedSeries = _buildStackedSeries(size);

    // Draw from bottom to top (reversed for proper layering)
    for (int i = 0; i < stackedSeries.length; i++) {
      final current = stackedSeries[i];
      final previous = i > 0 ? stackedSeries[i - 1] : null;
      final color = series[i].effectiveColor;
      final isHovered = hoveredSeriesIndex == i;
      final alpha = hoveredSeriesIndex != null && !isHovered ? 0.5 : 1.0;

      // Create area path
      final areaPath = Path();

      if (previous != null) {
        // Start from previous series (bottom of this area)
        areaPath.moveTo(previous.last.dx, previous.last.dy);
        for (int j = previous.length - 1; j >= 0; j--) {
          if (smooth && j > 0) {
            _addSmoothSegmentReverse(areaPath, previous, j);
          } else {
            areaPath.lineTo(previous[j].dx, previous[j].dy);
          }
        }
      } else {
        // Start from bottom left
        areaPath.moveTo(0, size.height);
      }

      // Draw to current series (top of this area)
      for (int j = 0; j < current.length; j++) {
        if (j == 0) {
          areaPath.lineTo(current[j].dx, current[j].dy);
        } else if (smooth) {
          _addSmoothSegment(areaPath, current, j);
        } else {
          areaPath.lineTo(current[j].dx, current[j].dy);
        }
      }

      // Close path
      if (previous != null) {
        areaPath.close();
      } else {
        areaPath.lineTo(current.last.dx, size.height);
        areaPath.close();
      }

      // Draw area fill
      final areaPaint = Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            color.withValues(alpha: 0.6 * alpha),
            color.withValues(alpha: 0.2 * alpha),
          ],
        ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

      canvas.drawPath(areaPath, areaPaint);

      // Draw line on top
      if (showLines) {
        final linePath = _createLinePath(current, smooth);

        if (isHovered) {
          // Glow effect
          final glowPaint = Paint()
            ..color = color.withValues(alpha: 0.4)
            ..strokeWidth = strokeWidth * 4
            ..style = PaintingStyle.stroke
            ..strokeCap = StrokeCap.round
            ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
          canvas.drawPath(linePath, glowPaint);
        }

        final linePaint = Paint()
          ..color = color.withValues(alpha: alpha)
          ..strokeWidth = isHovered ? strokeWidth * 1.5 : strokeWidth
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round
          ..strokeJoin = StrokeJoin.round;

        canvas.drawPath(linePath, linePaint);
      }
    }
  }

  List<List<Offset>> _buildStackedSeries(Size size) {
    final result = <List<Offset>>[];

    for (int seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
      final s = series[seriesIndex];
      final points = <Offset>[];

      for (int pointIndex = 0; pointIndex < s.points.length; pointIndex++) {
        final point = s.points[pointIndex];
        var y = (1 - point.y) * size.height;

        // Add previous series values for stacking
        if (seriesIndex > 0 && result.isNotEmpty) {
          final prevPoints = result[seriesIndex - 1];
          if (pointIndex < prevPoints.length) {
            // Stack on top of previous
            final prevY = prevPoints[pointIndex].dy;
            final thisHeight = point.y * size.height;
            y = prevY - thisHeight;
          }
        }

        points.add(Offset(point.x * size.width, y.clamp(0, size.height)));
      }

      result.add(points);
    }

    return result;
  }

  Path _createLinePath(List<Offset> points, bool smooth) {
    final path = Path();
    if (points.isEmpty) return path;

    path.moveTo(points.first.dx, points.first.dy);

    for (int i = 1; i < points.length; i++) {
      if (smooth) {
        _addSmoothSegment(path, points, i);
      } else {
        path.lineTo(points[i].dx, points[i].dy);
      }
    }

    return path;
  }

  void _addSmoothSegment(Path path, List<Offset> points, int i) {
    final p0 = i > 1 ? points[i - 2] : points[i - 1];
    final p1 = points[i - 1];
    final p2 = points[i];
    final p3 = i < points.length - 1 ? points[i + 1] : points[i];

    final cp1x = p1.dx + (p2.dx - p0.dx) / 6;
    final cp1y = p1.dy + (p2.dy - p0.dy) / 6;
    final cp2x = p2.dx - (p3.dx - p1.dx) / 6;
    final cp2y = p2.dy - (p3.dy - p1.dy) / 6;

    path.cubicTo(cp1x, cp1y, cp2x, cp2y, p2.dx, p2.dy);
  }

  void _addSmoothSegmentReverse(Path path, List<Offset> points, int i) {
    final p0 = i < points.length - 1 ? points[i + 1] : points[i];
    final p1 = points[i];
    final p2 = points[i - 1];
    final p3 = i > 1 ? points[i - 2] : points[i - 1];

    final cp1x = p1.dx + (p2.dx - p0.dx) / 6;
    final cp1y = p1.dy + (p2.dy - p0.dy) / 6;
    final cp2x = p2.dx - (p3.dx - p1.dx) / 6;
    final cp2y = p2.dy - (p3.dy - p1.dy) / 6;

    path.cubicTo(cp1x, cp1y, cp2x, cp2y, p2.dx, p2.dy);
  }

  @override
  bool shouldRepaint(_AreaChartPainter oldDelegate) {
    return series != oldDelegate.series ||
        strokeWidth != oldDelegate.strokeWidth ||
        smooth != oldDelegate.smooth ||
        showLines != oldDelegate.showLines ||
        hoveredSeriesIndex != oldDelegate.hoveredSeriesIndex;
  }
}
