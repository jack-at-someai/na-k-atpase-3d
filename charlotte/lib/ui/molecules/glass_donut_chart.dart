import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import 'chart_data.dart';

/// GlassDonutChart - Ring/pie/progress visualization.
///
/// Supports full donut, pie, and progress arc variants with glassmorphic
/// styling including glow effects on segments.
class GlassDonutChart extends StatefulWidget {
  /// Segments to display
  final List<DonutSegment> segments;

  /// Inner radius as fraction of outer radius (0 = pie, 0.5 = donut)
  final double innerRadius;

  /// Start angle in radians (default: -pi/2 = top)
  final double startAngle;

  /// Total sweep angle (default: 2*pi = full circle)
  final double sweepAngle;

  /// Gap between segments in radians
  final double segmentGap;

  /// Whether to show labels on segments
  final bool showLabels;

  /// Whether to show percentage values
  final bool showPercentages;

  /// Whether to show center content
  final bool showCenter;

  /// Center content widget
  final Widget? centerWidget;

  /// Legend position
  final LegendPosition legendPosition;

  /// Selected segment index (-1 for none)
  final int selectedIndex;

  /// Callback when segment is tapped
  final void Function(int index)? onSegmentTap;

  const GlassDonutChart({
    super.key,
    required this.segments,
    this.innerRadius = 0.6,
    this.startAngle = -math.pi / 2,
    this.sweepAngle = math.pi * 2,
    this.segmentGap = 0.02,
    this.showLabels = false,
    this.showPercentages = false,
    this.showCenter = true,
    this.centerWidget,
    this.legendPosition = LegendPosition.right,
    this.selectedIndex = -1,
    this.onSegmentTap,
  });

  /// Creates a progress-style donut (single value, 0-1)
  factory GlassDonutChart.progress({
    Key? key,
    required double value,
    Color? color,
    Color? backgroundColor,
    double innerRadius = 0.75,
    Widget? centerWidget,
    bool showPercentage = true,
  }) {
    final effectiveColor = color ?? CharlotteColors.primary;
    final effectiveBg = backgroundColor ?? CharlotteColors.glassBorder;

    return GlassDonutChart(
      key: key,
      segments: [
        DonutSegment(label: 'Progress', value: value, color: effectiveColor),
        DonutSegment(label: 'Remaining', value: 1 - value, color: effectiveBg),
      ],
      innerRadius: innerRadius,
      segmentGap: 0,
      showCenter: true,
      centerWidget: centerWidget ??
          (showPercentage
              ? Text(
                  '${(value * 100).toInt()}%',
                  style: TextStyle(
                    color: CharlotteColors.textPrimary,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                )
              : null),
      legendPosition: LegendPosition.none,
    );
  }

  @override
  State<GlassDonutChart> createState() => _GlassDonutChartState();
}

class _GlassDonutChartState extends State<GlassDonutChart>
    with SingleTickerProviderStateMixin {
  int _hoveredIndex = -1;
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _animation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  double get _total => widget.segments.fold(0.0, (sum, s) => sum + s.value);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final hasLegend = widget.legendPosition != LegendPosition.none;
        final isRightLegend = widget.legendPosition == LegendPosition.right;

        if (!hasLegend) {
          return _buildChart(constraints);
        }

        if (isRightLegend) {
          return Row(
            children: [
              Expanded(child: _buildChart(constraints)),
              const SizedBox(width: 16),
              _buildLegend(vertical: true),
            ],
          );
        } else {
          return Column(
            children: [
              Expanded(child: _buildChart(constraints)),
              const SizedBox(height: 8),
              _buildLegend(vertical: false),
            ],
          );
        }
      },
    );
  }

  Widget _buildChart(BoxConstraints constraints) {
    final size = math.min(constraints.maxWidth, constraints.maxHeight);

    return Center(
      child: SizedBox(
        width: size,
        height: size,
        child: AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return Stack(
              children: [
                // Segments
                CustomPaint(
                  size: Size(size, size),
                  painter: _DonutPainter(
                    segments: widget.segments,
                    innerRadius: widget.innerRadius,
                    startAngle: widget.startAngle,
                    sweepAngle: widget.sweepAngle * _animation.value,
                    segmentGap: widget.segmentGap,
                    hoveredIndex: _hoveredIndex,
                    selectedIndex: widget.selectedIndex,
                  ),
                ),

                // Hit detection overlay
                ...List.generate(widget.segments.length, (index) {
                  return _buildSegmentHitArea(index, size);
                }),

                // Center content
                if (widget.showCenter && widget.centerWidget != null)
                  Positioned.fill(
                    child: Center(child: widget.centerWidget),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildSegmentHitArea(int index, double size) {
    final total = _total;
    if (total == 0) return const SizedBox();

    double startAngle = widget.startAngle;
    for (int i = 0; i < index; i++) {
      startAngle += (widget.segments[i].value / total) * widget.sweepAngle;
    }
    final sweep = (widget.segments[index].value / total) * widget.sweepAngle;

    return Positioned.fill(
      child: MouseRegion(
        onEnter: (_) => setState(() => _hoveredIndex = index),
        onExit: (_) => setState(() => _hoveredIndex = -1),
        child: GestureDetector(
          onTap: () => widget.onSegmentTap?.call(index),
          child: CustomPaint(
            painter: _HitAreaPainter(
              startAngle: startAngle,
              sweepAngle: sweep,
              innerRadius: widget.innerRadius,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLegend({required bool vertical}) {
    final total = _total;
    final items = widget.segments.map((s) {
      final percentage = total > 0 ? (s.value / total * 100).toStringAsFixed(1) : '0';
      return LegendItemAtom(
        label: s.label,
        color: s.effectiveColor,
        shape: LegendShape.circle,
        value: widget.showPercentages ? '$percentage%' : null,
      );
    }).toList();

    if (vertical) {
      return LegendColumn(items: items);
    } else {
      return LegendRow(items: items);
    }
  }
}

class _DonutPainter extends CustomPainter {
  final List<DonutSegment> segments;
  final double innerRadius;
  final double startAngle;
  final double sweepAngle;
  final double segmentGap;
  final int hoveredIndex;
  final int selectedIndex;

  _DonutPainter({
    required this.segments,
    required this.innerRadius,
    required this.startAngle,
    required this.sweepAngle,
    required this.segmentGap,
    required this.hoveredIndex,
    required this.selectedIndex,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = math.min(size.width, size.height) / 2;
    final innerR = radius * innerRadius;
    final strokeWidth = radius - innerR;

    final total = segments.fold(0.0, (sum, s) => sum + s.value);
    if (total == 0) return;

    double currentAngle = startAngle;

    for (int i = 0; i < segments.length; i++) {
      final segment = segments[i];
      final segmentSweep = (segment.value / total) * sweepAngle - segmentGap;
      final isHovered = i == hoveredIndex;
      final isSelected = i == selectedIndex;
      final color = segment.effectiveColor;

      // Draw glow for hovered/selected
      if (isHovered || isSelected) {
        final glowPaint = Paint()
          ..color = color.withValues(alpha: 0.4)
          ..style = PaintingStyle.stroke
          ..strokeWidth = strokeWidth + 8
          ..strokeCap = StrokeCap.round
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12);

        canvas.drawArc(
          Rect.fromCircle(center: center, radius: innerR + strokeWidth / 2),
          currentAngle,
          segmentSweep,
          false,
          glowPaint,
        );
      }

      // Draw segment
      final paint = Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = isHovered ? strokeWidth + 4 : strokeWidth
        ..strokeCap = StrokeCap.butt;

      canvas.drawArc(
        Rect.fromCircle(
          center: center,
          radius: innerR + strokeWidth / 2,
        ),
        currentAngle,
        segmentSweep,
        false,
        paint,
      );

      currentAngle += segmentSweep + segmentGap;
    }
  }

  @override
  bool shouldRepaint(_DonutPainter oldDelegate) {
    return segments != oldDelegate.segments ||
        innerRadius != oldDelegate.innerRadius ||
        startAngle != oldDelegate.startAngle ||
        sweepAngle != oldDelegate.sweepAngle ||
        segmentGap != oldDelegate.segmentGap ||
        hoveredIndex != oldDelegate.hoveredIndex ||
        selectedIndex != oldDelegate.selectedIndex;
  }
}

class _HitAreaPainter extends CustomPainter {
  final double startAngle;
  final double sweepAngle;
  final double innerRadius;

  _HitAreaPainter({
    required this.startAngle,
    required this.sweepAngle,
    required this.innerRadius,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Transparent - just for hit testing
  }

  @override
  bool shouldRepaint(_HitAreaPainter oldDelegate) => false;

  @override
  bool hitTest(Offset position) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = math.min(size.width, size.height) / 2;
    final innerR = radius * innerRadius;

    // Check if point is in the ring
    final dx = position.dx - center.dx;
    final dy = position.dy - center.dy;
    final distance = math.sqrt(dx * dx + dy * dy);

    if (distance < innerR || distance > radius) return false;

    // Check if point is in the angle range
    var angle = math.atan2(dy, dx);
    if (angle < startAngle) angle += math.pi * 2;

    return angle >= startAngle && angle <= startAngle + sweepAngle;
  }

  Size get size => Size.infinite;
}
