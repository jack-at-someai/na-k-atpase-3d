import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../atoms/types.dart';

/// GlassTonalButton - Tinted secondary button with glassmorphic styling.
class GlassTonalButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? leadingIcon;
  final IconData? trailingIcon;
  final GlassButtonSize size;
  final Color? color;
  final bool isDisabled;
  final bool isLoading;
  final bool fullWidth;

  const GlassTonalButton({
    super.key,
    required this.label,
    this.onPressed,
    this.leadingIcon,
    this.trailingIcon,
    this.size = GlassButtonSize.medium,
    this.color,
    this.isDisabled = false,
    this.isLoading = false,
    this.fullWidth = false,
  });

  @override
  State<GlassTonalButton> createState() => _GlassTonalButtonState();
}

class _GlassTonalButtonState extends State<GlassTonalButton> {
  bool _isHovered = false;
  bool _isPressed = false;

  EdgeInsets get _padding {
    return switch (widget.size) {
      GlassButtonSize.small => const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      GlassButtonSize.medium => const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      GlassButtonSize.large => const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
    };
  }

  double get _fontSize {
    return switch (widget.size) {
      GlassButtonSize.small => 12,
      GlassButtonSize.medium => 14,
      GlassButtonSize.large => 16,
    };
  }

  double get _iconSize {
    return switch (widget.size) {
      GlassButtonSize.small => 16,
      GlassButtonSize.medium => 18,
      GlassButtonSize.large => 20,
    };
  }

  double get _borderRadius {
    return switch (widget.size) {
      GlassButtonSize.small => 8,
      GlassButtonSize.medium => 12,
      GlassButtonSize.large => 16,
    };
  }

  @override
  Widget build(BuildContext context) {
    final effectiveColor = widget.color ?? CharlotteColors.primary;
    final isEnabled = !widget.isDisabled && !widget.isLoading && widget.onPressed != null;

    final bgColor = isEnabled
        ? (_isPressed
            ? effectiveColor.withValues(alpha: 0.25)
            : (_isHovered
                ? effectiveColor.withValues(alpha: 0.2)
                : effectiveColor.withValues(alpha: 0.15)))
        : effectiveColor.withValues(alpha: 0.08);

    final contentColor = isEnabled
        ? effectiveColor
        : effectiveColor.withValues(alpha: 0.5);

    final borderColor = isEnabled
        ? effectiveColor.withValues(alpha: _isPressed ? 0.4 : 0.2)
        : effectiveColor.withValues(alpha: 0.1);

    Widget buttonContent = Row(
      mainAxisSize: widget.fullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (widget.isLoading) ...[
          SizedBox(
            width: _iconSize,
            height: _iconSize,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: contentColor,
            ),
          ),
          const SizedBox(width: 8),
        ] else if (widget.leadingIcon != null) ...[
          Icon(
            widget.leadingIcon,
            size: _iconSize,
            color: contentColor,
          ),
          const SizedBox(width: 8),
        ],
        Text(
          widget.label,
          style: TextStyle(
            color: contentColor,
            fontSize: _fontSize,
            fontWeight: FontWeight.w600,
          ),
        ),
        if (widget.trailingIcon != null && !widget.isLoading) ...[
          const SizedBox(width: 8),
          Icon(
            widget.trailingIcon,
            size: _iconSize,
            color: contentColor,
          ),
        ],
      ],
    );

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: isEnabled ? (_) => setState(() => _isPressed = true) : null,
        onTapUp: isEnabled ? (_) => setState(() => _isPressed = false) : null,
        onTapCancel: isEnabled ? () => setState(() => _isPressed = false) : null,
        onTap: isEnabled ? widget.onPressed : null,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(_borderRadius),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 100),
              padding: _padding,
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(_borderRadius),
                border: Border.all(
                  color: borderColor,
                  width: 1,
                ),
              ),
              child: buttonContent,
            ),
          ),
        ),
      ),
    );
  }
}
