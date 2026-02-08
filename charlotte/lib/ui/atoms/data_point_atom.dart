import 'package:flutter/material.dart';

/// DataPointAtom - Marker for scatter/line chart data points.
///
/// Renders a single data point with various shapes and states.
/// Supports hover/selection highlighting with glow effects.
class DataPointAtom extends StatelessWidget {
  /// Size of the data point marker
  final double size;

  /// Point color
  final Color color;

  /// Shape of the marker
  final DataPointShape shape;

  /// Whether this point is highlighted (hovered/selected)
  final bool isHighlighted;

  /// Whether to show a glow effect
  final bool showGlow;

  /// Border width for hollow shapes
  final double borderWidth;

  /// Callback when tapped
  final VoidCallback? onTap;

  const DataPointAtom({
    super.key,
    this.size = 8,
    required this.color,
    this.shape = DataPointShape.circle,
    this.isHighlighted = false,
    this.showGlow = false,
    this.borderWidth = 2,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveSize = isHighlighted ? size * 1.5 : size;

    Widget point = CustomPaint(
      size: Size(effectiveSize, effectiveSize),
      painter: _DataPointPainter(
        color: color,
        shape: shape,
        isHighlighted: isHighlighted,
        borderWidth: borderWidth,
      ),
    );

    if (showGlow || isHighlighted) {
      point = Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: isHighlighted ? 0.6 : 0.3),
              blurRadius: isHighlighted ? 12 : 6,
              spreadRadius: isHighlighted ? 2 : 1,
            ),
          ],
        ),
        child: point,
      );
    }

    if (onTap != null) {
      point = GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Padding(
          padding: EdgeInsets.all(effectiveSize / 2),
          child: point,
        ),
      );
    }

    return point;
  }
}

/// Shape options for data point markers
enum DataPointShape {
  circle,
  circleHollow,
  square,
  squareHollow,
  diamond,
  diamondHollow,
  triangle,
  triangleHollow,
  cross,
  plus,
}

class _DataPointPainter extends CustomPainter {
  final Color color;
  final DataPointShape shape;
  final bool isHighlighted;
  final double borderWidth;

  _DataPointPainter({
    required this.color,
    required this.shape,
    required this.isHighlighted,
    required this.borderWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    final fillPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final strokePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = borderWidth
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    switch (shape) {
      case DataPointShape.circle:
        canvas.drawCircle(center, radius, fillPaint);

      case DataPointShape.circleHollow:
        canvas.drawCircle(center, radius - borderWidth / 2, strokePaint);

      case DataPointShape.square:
        canvas.drawRect(
          Rect.fromCenter(
            center: center,
            width: size.width * 0.85,
            height: size.height * 0.85,
          ),
          fillPaint,
        );

      case DataPointShape.squareHollow:
        canvas.drawRect(
          Rect.fromCenter(
            center: center,
            width: size.width * 0.85 - borderWidth,
            height: size.height * 0.85 - borderWidth,
          ),
          strokePaint,
        );

      case DataPointShape.diamond:
        final path = Path()
          ..moveTo(center.dx, center.dy - radius)
          ..lineTo(center.dx + radius, center.dy)
          ..lineTo(center.dx, center.dy + radius)
          ..lineTo(center.dx - radius, center.dy)
          ..close();
        canvas.drawPath(path, fillPaint);

      case DataPointShape.diamondHollow:
        final r = radius - borderWidth / 2;
        final path = Path()
          ..moveTo(center.dx, center.dy - r)
          ..lineTo(center.dx + r, center.dy)
          ..lineTo(center.dx, center.dy + r)
          ..lineTo(center.dx - r, center.dy)
          ..close();
        canvas.drawPath(path, strokePaint);

      case DataPointShape.triangle:
        final path = Path()
          ..moveTo(center.dx, center.dy - radius)
          ..lineTo(center.dx + radius, center.dy + radius * 0.7)
          ..lineTo(center.dx - radius, center.dy + radius * 0.7)
          ..close();
        canvas.drawPath(path, fillPaint);

      case DataPointShape.triangleHollow:
        final r = radius - borderWidth / 2;
        final path = Path()
          ..moveTo(center.dx, center.dy - r)
          ..lineTo(center.dx + r, center.dy + r * 0.7)
          ..lineTo(center.dx - r, center.dy + r * 0.7)
          ..close();
        canvas.drawPath(path, strokePaint);

      case DataPointShape.cross:
        final r = radius * 0.8;
        canvas.drawLine(
          Offset(center.dx - r, center.dy - r),
          Offset(center.dx + r, center.dy + r),
          strokePaint,
        );
        canvas.drawLine(
          Offset(center.dx + r, center.dy - r),
          Offset(center.dx - r, center.dy + r),
          strokePaint,
        );

      case DataPointShape.plus:
        final r = radius * 0.8;
        canvas.drawLine(
          Offset(center.dx, center.dy - r),
          Offset(center.dx, center.dy + r),
          strokePaint,
        );
        canvas.drawLine(
          Offset(center.dx - r, center.dy),
          Offset(center.dx + r, center.dy),
          strokePaint,
        );
    }
  }

  @override
  bool shouldRepaint(_DataPointPainter oldDelegate) {
    return color != oldDelegate.color ||
        shape != oldDelegate.shape ||
        isHighlighted != oldDelegate.isHighlighted ||
        borderWidth != oldDelegate.borderWidth;
  }
}

/// Animated data point that pulses on highlight
class AnimatedDataPoint extends StatefulWidget {
  final double size;
  final Color color;
  final DataPointShape shape;
  final bool isHighlighted;
  final VoidCallback? onTap;

  const AnimatedDataPoint({
    super.key,
    this.size = 8,
    required this.color,
    this.shape = DataPointShape.circle,
    this.isHighlighted = false,
    this.onTap,
  });

  @override
  State<AnimatedDataPoint> createState() => _AnimatedDataPointState();
}

class _AnimatedDataPointState extends State<AnimatedDataPoint>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.3).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
  }

  @override
  void didUpdateWidget(AnimatedDataPoint oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isHighlighted != oldWidget.isHighlighted) {
      if (widget.isHighlighted) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: DataPointAtom(
            size: widget.size,
            color: widget.color,
            shape: widget.shape,
            isHighlighted: widget.isHighlighted,
            showGlow: widget.isHighlighted,
            onTap: widget.onTap,
          ),
        );
      },
    );
  }
}
