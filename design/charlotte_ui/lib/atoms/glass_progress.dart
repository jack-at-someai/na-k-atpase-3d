import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import 'types.dart';

/// GlassProgress - Loading indicator with glassmorphic styling.
/// Supports circular and linear variants, determinate and indeterminate states.
class GlassProgress extends StatelessWidget {
  final GlassProgressType type;
  final double? value;
  final double size;
  final double strokeWidth;
  final Color? color;
  final Color? backgroundColor;
  final bool showLabel;

  const GlassProgress({
    super.key,
    this.type = GlassProgressType.circular,
    this.value,
    this.size = 40,
    this.strokeWidth = 4,
    this.color,
    this.backgroundColor,
    this.showLabel = false,
  });

  /// Creates a circular progress indicator
  const GlassProgress.circular({
    super.key,
    this.value,
    this.size = 40,
    this.strokeWidth = 4,
    this.color,
    this.backgroundColor,
    this.showLabel = false,
  }) : type = GlassProgressType.circular;

  /// Creates a linear progress indicator
  const GlassProgress.linear({
    super.key,
    this.value,
    this.size = 4,
    this.color,
    this.backgroundColor,
    this.showLabel = false,
  })  : type = GlassProgressType.linear,
        strokeWidth = 4;

  bool get _isIndeterminate => value == null;

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? CharlotteColors.primary;
    final effectiveBackground =
        backgroundColor ?? CharlotteColors.glassFill;

    if (type == GlassProgressType.circular) {
      return _buildCircular(effectiveColor, effectiveBackground);
    } else {
      return _buildLinear(effectiveColor, effectiveBackground);
    }
  }

  Widget _buildCircular(Color progressColor, Color bgColor) {
    Widget indicator;

    if (_isIndeterminate) {
      indicator = SizedBox(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          strokeWidth: strokeWidth,
          color: progressColor,
          backgroundColor: bgColor,
        ),
      );
    } else {
      indicator = SizedBox(
        width: size,
        height: size,
        child: Stack(
          alignment: Alignment.center,
          children: [
            CircularProgressIndicator(
              value: value!.clamp(0.0, 1.0),
              strokeWidth: strokeWidth,
              color: progressColor,
              backgroundColor: bgColor,
              strokeCap: StrokeCap.round,
            ),
            if (showLabel)
              Text(
                '${(value! * 100).toInt()}%',
                style: TextStyle(
                  color: CharlotteColors.white,
                  fontSize: size * 0.25,
                  fontWeight: FontWeight.w600,
                ),
              ),
          ],
        ),
      );
    }

    // Add glass glow effect
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: progressColor.withValues(alpha: 0.2),
            blurRadius: size * 0.3,
            spreadRadius: 2,
          ),
        ],
      ),
      child: indicator,
    );
  }

  Widget _buildLinear(Color progressColor, Color bgColor) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (showLabel && !_isIndeterminate)
          Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Text(
              '${(value! * 100).toInt()}%',
              style: TextStyle(
                color: CharlotteColors.textSecondary,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ClipRRect(
          borderRadius: BorderRadius.circular(size / 2),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
            child: Container(
              height: size,
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(size / 2),
                border: Border.all(
                  color: CharlotteColors.glassBorder,
                  width: 0.5,
                ),
              ),
              child: _isIndeterminate
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(size / 2),
                      child: LinearProgressIndicator(
                        color: progressColor,
                        backgroundColor: Colors.transparent,
                        minHeight: size,
                      ),
                    )
                  : LayoutBuilder(
                      builder: (context, constraints) {
                        return Stack(
                          children: [
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: constraints.maxWidth * value!.clamp(0.0, 1.0),
                              height: size,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    progressColor,
                                    progressColor.withValues(alpha: 0.8),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(size / 2),
                                boxShadow: [
                                  BoxShadow(
                                    color: progressColor.withValues(alpha: 0.4),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        );
                      },
                    ),
            ),
          ),
        ),
      ],
    );
  }
}
