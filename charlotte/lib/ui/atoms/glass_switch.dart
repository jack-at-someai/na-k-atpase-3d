import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';

/// GlassSwitch - Toggle on/off with glassmorphic styling.
class GlassSwitch extends StatelessWidget {
  final bool value;
  final ValueChanged<bool>? onChanged;
  final double width;
  final double height;
  final Color? activeColor;
  final Color? inactiveColor;
  final Color? thumbColor;
  final bool isDisabled;
  final IconData? activeIcon;
  final IconData? inactiveIcon;

  const GlassSwitch({
    super.key,
    required this.value,
    this.onChanged,
    this.width = 52,
    this.height = 28,
    this.activeColor,
    this.inactiveColor,
    this.thumbColor,
    this.isDisabled = false,
    this.activeIcon,
    this.inactiveIcon,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveActiveColor = activeColor ?? CharlotteColors.primary;
    final effectiveInactiveColor =
        inactiveColor ?? CharlotteColors.surface.withValues(alpha: 0.5);
    final effectiveThumbColor = thumbColor ?? CharlotteColors.white;

    final thumbSize = height - 8;
    final thumbPosition = value ? width - thumbSize - 4 : 4.0;

    return GestureDetector(
      onTap: isDisabled ? null : () => onChanged?.call(!value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        width: width,
        height: height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(height / 2),
          color: value
              ? effectiveActiveColor.withValues(alpha: isDisabled ? 0.3 : 1.0)
              : effectiveInactiveColor.withValues(alpha: isDisabled ? 0.3 : 1.0),
          border: Border.all(
            color: value
                ? effectiveActiveColor.withValues(alpha: isDisabled ? 0.3 : 0.8)
                : CharlotteColors.glassBorder.withValues(
                    alpha: isDisabled ? 0.3 : 1.0),
            width: 1,
          ),
          boxShadow: value && !isDisabled
              ? [
                  BoxShadow(
                    color: effectiveActiveColor.withValues(alpha: 0.3),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ]
              : null,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(height / 2),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
            child: Stack(
              children: [
                // Thumb
                AnimatedPositioned(
                  duration: const Duration(milliseconds: 200),
                  curve: Curves.easeInOut,
                  left: thumbPosition,
                  top: 4,
                  child: Container(
                    width: thumbSize,
                    height: thumbSize,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: effectiveThumbColor.withValues(
                          alpha: isDisabled ? 0.5 : 1.0),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: _buildThumbIcon(thumbSize),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget? _buildThumbIcon(double thumbSize) {
    final icon = value ? activeIcon : inactiveIcon;
    if (icon == null) return null;

    return Center(
      child: Icon(
        icon,
        size: thumbSize * 0.6,
        color: value
            ? (activeColor ?? CharlotteColors.primary)
            : CharlotteColors.textTertiary,
      ),
    );
  }
}

/// GlassSwitch with label
class GlassSwitchTile extends StatelessWidget {
  final bool value;
  final ValueChanged<bool>? onChanged;
  final String label;
  final String? subtitle;
  final Color? activeColor;
  final bool isDisabled;
  final bool dense;
  final IconData? activeIcon;
  final IconData? inactiveIcon;

  const GlassSwitchTile({
    super.key,
    required this.value,
    this.onChanged,
    required this.label,
    this.subtitle,
    this.activeColor,
    this.isDisabled = false,
    this.dense = false,
    this.activeIcon,
    this.inactiveIcon,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isDisabled ? null : () => onChanged?.call(!value),
      child: Padding(
        padding: EdgeInsets.symmetric(
          vertical: dense ? 4 : 8,
          horizontal: 4,
        ),
        child: Row(
          children: [
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
            const SizedBox(width: 12),
            GlassSwitch(
              value: value,
              onChanged: onChanged,
              activeColor: activeColor,
              isDisabled: isDisabled,
              activeIcon: activeIcon,
              inactiveIcon: inactiveIcon,
            ),
          ],
        ),
      ),
    );
  }
}
