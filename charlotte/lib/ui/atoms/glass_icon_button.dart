import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';

/// GlassIconButton - Compact action button with icon.
/// Glassmorphic styling with multiple variants.
class GlassIconButton extends StatefulWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final double size;
  final double iconSize;
  final Color? color;
  final Color? backgroundColor;
  final bool isSelected;
  final bool isDisabled;
  final String? tooltip;
  final bool filled;
  final bool outlined;

  const GlassIconButton({
    super.key,
    required this.icon,
    this.onPressed,
    this.size = 40,
    this.iconSize = 24,
    this.color,
    this.backgroundColor,
    this.isSelected = false,
    this.isDisabled = false,
    this.tooltip,
    this.filled = false,
    this.outlined = false,
  });

  /// Creates a filled icon button
  const GlassIconButton.filled({
    super.key,
    required this.icon,
    this.onPressed,
    this.size = 40,
    this.iconSize = 24,
    this.color,
    this.backgroundColor,
    this.isSelected = false,
    this.isDisabled = false,
    this.tooltip,
  })  : filled = true,
        outlined = false;

  /// Creates an outlined icon button
  const GlassIconButton.outlined({
    super.key,
    required this.icon,
    this.onPressed,
    this.size = 40,
    this.iconSize = 24,
    this.color,
    this.backgroundColor,
    this.isSelected = false,
    this.isDisabled = false,
    this.tooltip,
  })  : filled = false,
        outlined = true;

  /// Creates a standard (tonal) icon button
  const GlassIconButton.tonal({
    super.key,
    required this.icon,
    this.onPressed,
    this.size = 40,
    this.iconSize = 24,
    this.color,
    this.backgroundColor,
    this.isSelected = false,
    this.isDisabled = false,
    this.tooltip,
  })  : filled = false,
        outlined = false;

  @override
  State<GlassIconButton> createState() => _GlassIconButtonState();
}

class _GlassIconButtonState extends State<GlassIconButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final effectiveColor = widget.color ?? CharlotteColors.primary;
    final isEnabled = !widget.isDisabled && widget.onPressed != null;

    Color iconColor;
    Color bgColor;
    Color borderColor;

    if (widget.filled) {
      bgColor = widget.isSelected
          ? effectiveColor
          : (widget.backgroundColor ?? effectiveColor);
      iconColor = CharlotteColors.white;
      borderColor = Colors.transparent;
    } else if (widget.outlined) {
      bgColor = widget.isSelected
          ? effectiveColor.withValues(alpha: 0.2)
          : Colors.transparent;
      iconColor = effectiveColor;
      borderColor = effectiveColor;
    } else {
      // Tonal/standard
      bgColor = widget.isSelected
          ? effectiveColor.withValues(alpha: 0.3)
          : (widget.backgroundColor ?? CharlotteColors.glassFill);
      iconColor = widget.isSelected ? effectiveColor : CharlotteColors.iconPrimary;
      borderColor = widget.isSelected
          ? effectiveColor.withValues(alpha: 0.5)
          : CharlotteColors.glassBorder;
    }

    // Apply disabled state
    if (!isEnabled) {
      iconColor = iconColor.withValues(alpha: 0.4);
      bgColor = bgColor.withValues(alpha: 0.3);
      borderColor = borderColor.withValues(alpha: 0.3);
    }

    // Apply pressed state
    if (_isPressed && isEnabled) {
      bgColor = widget.filled
          ? effectiveColor.withValues(alpha: 0.8)
          : effectiveColor.withValues(alpha: 0.15);
    }

    Widget button = GestureDetector(
      onTapDown: isEnabled ? (_) => setState(() => _isPressed = true) : null,
      onTapUp: isEnabled ? (_) => setState(() => _isPressed = false) : null,
      onTapCancel: isEnabled ? () => setState(() => _isPressed = false) : null,
      onTap: isEnabled ? widget.onPressed : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 100),
        width: widget.size,
        height: widget.size,
        decoration: BoxDecoration(
          color: bgColor,
          shape: BoxShape.circle,
          border: Border.all(
            color: borderColor,
            width: widget.outlined ? 1.5 : 1,
          ),
          boxShadow: widget.isSelected && isEnabled
              ? [
                  BoxShadow(
                    color: effectiveColor.withValues(alpha: 0.3),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ]
              : null,
        ),
        child: ClipOval(
          child: BackdropFilter(
            filter: ImageFilter.blur(
              sigmaX: widget.filled ? 0 : 8,
              sigmaY: widget.filled ? 0 : 8,
            ),
            child: Center(
              child: Icon(
                widget.icon,
                size: widget.iconSize,
                color: iconColor,
              ),
            ),
          ),
        ),
      ),
    );

    if (widget.tooltip != null) {
      button = Tooltip(
        message: widget.tooltip!,
        child: button,
      );
    }

    return button;
  }
}

/// Group of icon buttons with optional single/multi selection
class GlassIconButtonGroup extends StatelessWidget {
  final List<IconData> icons;
  final List<String>? tooltips;
  final int? selectedIndex;
  final Set<int>? selectedIndices;
  final ValueChanged<int>? onSelected;
  final double size;
  final double iconSize;
  final Color? color;
  final double spacing;
  final bool allowMultiple;

  const GlassIconButtonGroup({
    super.key,
    required this.icons,
    this.tooltips,
    this.selectedIndex,
    this.selectedIndices,
    this.onSelected,
    this.size = 40,
    this.iconSize = 24,
    this.color,
    this.spacing = 4,
    this.allowMultiple = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(icons.length, (index) {
        final isSelected = allowMultiple
            ? selectedIndices?.contains(index) ?? false
            : selectedIndex == index;

        return Padding(
          padding: EdgeInsets.only(left: index > 0 ? spacing : 0),
          child: GlassIconButton(
            icon: icons[index],
            tooltip: tooltips?[index],
            size: size,
            iconSize: iconSize,
            color: color,
            isSelected: isSelected,
            onPressed: onSelected != null ? () => onSelected!(index) : null,
          ),
        );
      }),
    );
  }
}
