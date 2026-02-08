import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';

/// GlassRadio - Single selection from group with glassmorphic styling.
class GlassRadio<T> extends StatelessWidget {
  final T value;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final double size;
  final Color? activeColor;
  final bool isDisabled;

  const GlassRadio({
    super.key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.size = 24,
    this.activeColor,
    this.isDisabled = false,
  });

  bool get _isSelected => value == groupValue;

  @override
  Widget build(BuildContext context) {
    final effectiveActiveColor = activeColor ?? CharlotteColors.primary;

    return GestureDetector(
      onTap: isDisabled ? null : () => onChanged?.call(value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: _isSelected
                ? effectiveActiveColor.withValues(alpha: isDisabled ? 0.3 : 1.0)
                : (isDisabled
                    ? CharlotteColors.glassBorder.withValues(alpha: 0.3)
                    : CharlotteColors.glassBorder),
            width: 2,
          ),
          boxShadow: _isSelected && !isDisabled
              ? [
                  BoxShadow(
                    color: effectiveActiveColor.withValues(alpha: 0.3),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ]
              : null,
        ),
        child: ClipOval(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
            child: Center(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                width: _isSelected ? size * 0.5 : 0,
                height: _isSelected ? size * 0.5 : 0,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: effectiveActiveColor.withValues(
                      alpha: isDisabled ? 0.3 : 1.0),
                  boxShadow: _isSelected && !isDisabled
                      ? [
                          BoxShadow(
                            color: effectiveActiveColor.withValues(alpha: 0.5),
                            blurRadius: 4,
                          ),
                        ]
                      : null,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// GlassRadio with label
class GlassRadioTile<T> extends StatelessWidget {
  final T value;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final String label;
  final String? subtitle;
  final double radioSize;
  final Color? activeColor;
  final bool isDisabled;
  final bool dense;

  const GlassRadioTile({
    super.key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    required this.label,
    this.subtitle,
    this.radioSize = 24,
    this.activeColor,
    this.isDisabled = false,
    this.dense = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isDisabled ? null : () => onChanged?.call(value),
      child: Padding(
        padding: EdgeInsets.symmetric(
          vertical: dense ? 4 : 8,
          horizontal: 4,
        ),
        child: Row(
          children: [
            GlassRadio<T>(
              value: value,
              groupValue: groupValue,
              onChanged: onChanged,
              size: radioSize,
              activeColor: activeColor,
              isDisabled: isDisabled,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      color: isDisabled
                          ? CharlotteColors.textDisabled
                          : CharlotteColors.textPrimary,
                      fontSize: dense ? 13 : 14,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: TextStyle(
                        color: isDisabled
                            ? CharlotteColors.textDisabled
                            : CharlotteColors.textTertiary,
                        fontSize: dense ? 11 : 12,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Helper to create a group of radio buttons
class GlassRadioGroup<T> extends StatelessWidget {
  final List<T> values;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final String Function(T) labelBuilder;
  final String Function(T)? subtitleBuilder;
  final Color? activeColor;
  final bool isDisabled;
  final bool dense;
  final Axis direction;

  const GlassRadioGroup({
    super.key,
    required this.values,
    required this.groupValue,
    this.onChanged,
    required this.labelBuilder,
    this.subtitleBuilder,
    this.activeColor,
    this.isDisabled = false,
    this.dense = false,
    this.direction = Axis.vertical,
  });

  @override
  Widget build(BuildContext context) {
    final tiles = values.map((value) {
      return GlassRadioTile<T>(
        value: value,
        groupValue: groupValue,
        onChanged: onChanged,
        label: labelBuilder(value),
        subtitle: subtitleBuilder?.call(value),
        activeColor: activeColor,
        isDisabled: isDisabled,
        dense: dense,
      );
    }).toList();

    if (direction == Axis.horizontal) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: tiles
            .map((tile) => Padding(
                  padding: const EdgeInsets.only(right: 16),
                  child: tile,
                ))
            .toList(),
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: tiles,
    );
  }
}
