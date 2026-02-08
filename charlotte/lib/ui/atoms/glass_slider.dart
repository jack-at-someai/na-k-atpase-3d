import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';

/// GlassSlider - Range value selection with glassmorphic styling.
class GlassSlider extends StatefulWidget {
  final double value;
  final ValueChanged<double>? onChanged;
  final ValueChanged<double>? onChangeStart;
  final ValueChanged<double>? onChangeEnd;
  final double min;
  final double max;
  final int? divisions;
  final Color? activeColor;
  final Color? inactiveColor;
  final bool showLabel;
  final String Function(double)? labelBuilder;
  final bool isDisabled;
  final double trackHeight;
  final double thumbRadius;

  const GlassSlider({
    super.key,
    required this.value,
    this.onChanged,
    this.onChangeStart,
    this.onChangeEnd,
    this.min = 0.0,
    this.max = 1.0,
    this.divisions,
    this.activeColor,
    this.inactiveColor,
    this.showLabel = false,
    this.labelBuilder,
    this.isDisabled = false,
    this.trackHeight = 6,
    this.thumbRadius = 12,
  });

  @override
  State<GlassSlider> createState() => _GlassSliderState();
}

class _GlassSliderState extends State<GlassSlider> {
  bool _isDragging = false;

  double get _normalizedValue =>
      ((widget.value - widget.min) / (widget.max - widget.min)).clamp(0.0, 1.0);

  @override
  Widget build(BuildContext context) {
    final effectiveActiveColor = widget.activeColor ?? CharlotteColors.primary;
    final effectiveInactiveColor =
        widget.inactiveColor ?? CharlotteColors.glassFill;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.showLabel)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(
              widget.labelBuilder?.call(widget.value) ??
                  widget.value.toStringAsFixed(1),
              style: TextStyle(
                color: widget.isDisabled
                    ? CharlotteColors.textDisabled
                    : CharlotteColors.textPrimary,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        LayoutBuilder(
          builder: (context, constraints) {
            final trackWidth = constraints.maxWidth;
            final thumbPosition =
                _normalizedValue * (trackWidth - widget.thumbRadius * 2);

            return GestureDetector(
              onHorizontalDragStart: widget.isDisabled
                  ? null
                  : (details) {
                      setState(() => _isDragging = true);
                      _updateValue(details.localPosition.dx, trackWidth);
                      widget.onChangeStart?.call(widget.value);
                    },
              onHorizontalDragUpdate: widget.isDisabled
                  ? null
                  : (details) {
                      _updateValue(details.localPosition.dx, trackWidth);
                    },
              onHorizontalDragEnd: widget.isDisabled
                  ? null
                  : (details) {
                      setState(() => _isDragging = false);
                      widget.onChangeEnd?.call(widget.value);
                    },
              onTapDown: widget.isDisabled
                  ? null
                  : (details) {
                      _updateValue(details.localPosition.dx, trackWidth);
                    },
              child: SizedBox(
                height: widget.thumbRadius * 2 + 8,
                child: Stack(
                  clipBehavior: Clip.none,
                  alignment: Alignment.centerLeft,
                  children: [
                    // Track background
                    Positioned(
                      left: widget.thumbRadius,
                      right: widget.thumbRadius,
                      child: ClipRRect(
                        borderRadius:
                            BorderRadius.circular(widget.trackHeight / 2),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                          child: Container(
                            height: widget.trackHeight,
                            decoration: BoxDecoration(
                              color: effectiveInactiveColor.withValues(
                                  alpha: widget.isDisabled ? 0.3 : 1.0),
                              borderRadius:
                                  BorderRadius.circular(widget.trackHeight / 2),
                              border: Border.all(
                                color: CharlotteColors.glassBorder.withValues(
                                    alpha: widget.isDisabled ? 0.3 : 0.5),
                                width: 0.5,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),

                    // Active track
                    Positioned(
                      left: widget.thumbRadius,
                      child: AnimatedContainer(
                        duration: _isDragging
                            ? Duration.zero
                            : const Duration(milliseconds: 100),
                        width: thumbPosition,
                        height: widget.trackHeight,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              effectiveActiveColor.withValues(
                                  alpha: widget.isDisabled ? 0.3 : 1.0),
                              effectiveActiveColor.withValues(
                                  alpha: widget.isDisabled ? 0.2 : 0.8),
                            ],
                          ),
                          borderRadius:
                              BorderRadius.circular(widget.trackHeight / 2),
                          boxShadow: widget.isDisabled
                              ? null
                              : [
                                  BoxShadow(
                                    color: effectiveActiveColor
                                        .withValues(alpha: 0.3),
                                    blurRadius: 4,
                                  ),
                                ],
                        ),
                      ),
                    ),

                    // Division marks
                    if (widget.divisions != null && widget.divisions! > 0)
                      Positioned(
                        left: widget.thumbRadius,
                        right: widget.thumbRadius,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: List.generate(
                            widget.divisions! + 1,
                            (i) => Container(
                              width: 2,
                              height: widget.trackHeight,
                              color: CharlotteColors.glassBorder.withValues(
                                  alpha: widget.isDisabled ? 0.2 : 0.5),
                            ),
                          ),
                        ),
                      ),

                    // Thumb
                    AnimatedPositioned(
                      duration: _isDragging
                          ? Duration.zero
                          : const Duration(milliseconds: 100),
                      left: thumbPosition,
                      child: _buildThumb(effectiveActiveColor),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildThumb(Color activeColor) {
    return Container(
      width: widget.thumbRadius * 2,
      height: widget.thumbRadius * 2,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: CharlotteColors.white
            .withValues(alpha: widget.isDisabled ? 0.5 : 1.0),
        border: Border.all(
          color: activeColor.withValues(alpha: widget.isDisabled ? 0.3 : 1.0),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
          if (_isDragging && !widget.isDisabled)
            BoxShadow(
              color: activeColor.withValues(alpha: 0.4),
              blurRadius: 12,
              spreadRadius: 2,
            ),
        ],
      ),
      child: _isDragging
          ? Center(
              child: Container(
                width: widget.thumbRadius * 0.6,
                height: widget.thumbRadius * 0.6,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: activeColor,
                ),
              ),
            )
          : null,
    );
  }

  void _updateValue(double localX, double trackWidth) {
    if (widget.onChanged == null) return;

    final effectiveWidth = trackWidth - widget.thumbRadius * 2;
    final normalizedX =
        ((localX - widget.thumbRadius) / effectiveWidth).clamp(0.0, 1.0);

    double newValue = widget.min + normalizedX * (widget.max - widget.min);

    // Snap to divisions
    if (widget.divisions != null && widget.divisions! > 0) {
      final step = (widget.max - widget.min) / widget.divisions!;
      newValue = (newValue / step).round() * step;
    }

    newValue = newValue.clamp(widget.min, widget.max);
    widget.onChanged!(newValue);
  }
}

/// Range slider variant
class GlassRangeSlider extends StatefulWidget {
  final RangeValues values;
  final ValueChanged<RangeValues>? onChanged;
  final double min;
  final double max;
  final int? divisions;
  final Color? activeColor;
  final bool showLabels;
  final String Function(double)? labelBuilder;
  final bool isDisabled;

  const GlassRangeSlider({
    super.key,
    required this.values,
    this.onChanged,
    this.min = 0.0,
    this.max = 1.0,
    this.divisions,
    this.activeColor,
    this.showLabels = false,
    this.labelBuilder,
    this.isDisabled = false,
  });

  @override
  State<GlassRangeSlider> createState() => _GlassRangeSliderState();
}

class _GlassRangeSliderState extends State<GlassRangeSlider> {
  @override
  Widget build(BuildContext context) {
    final effectiveActiveColor = widget.activeColor ?? CharlotteColors.primary;

    return SliderTheme(
      data: SliderThemeData(
        activeTrackColor: effectiveActiveColor,
        inactiveTrackColor: CharlotteColors.glassFill,
        thumbColor: CharlotteColors.white,
        overlayColor: effectiveActiveColor.withValues(alpha: 0.2),
        trackHeight: 6,
        rangeThumbShape: const RoundRangeSliderThumbShape(
          enabledThumbRadius: 12,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.showLabels)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.labelBuilder?.call(widget.values.start) ??
                        widget.values.start.toStringAsFixed(1),
                    style: TextStyle(
                      color: CharlotteColors.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    widget.labelBuilder?.call(widget.values.end) ??
                        widget.values.end.toStringAsFixed(1),
                    style: TextStyle(
                      color: CharlotteColors.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          RangeSlider(
            values: widget.values,
            min: widget.min,
            max: widget.max,
            divisions: widget.divisions,
            onChanged: widget.isDisabled ? null : widget.onChanged,
          ),
        ],
      ),
    );
  }
}
