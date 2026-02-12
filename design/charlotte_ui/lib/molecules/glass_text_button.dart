import 'package:flutter/material.dart';

import '../theme.dart';
import '../atoms/types.dart';

/// GlassTextButton - Minimal text-only button with glassmorphic hover effects.
class GlassTextButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? leadingIcon;
  final IconData? trailingIcon;
  final GlassButtonSize size;
  final Color? color;
  final bool isDisabled;

  const GlassTextButton({
    super.key,
    required this.label,
    this.onPressed,
    this.leadingIcon,
    this.trailingIcon,
    this.size = GlassButtonSize.medium,
    this.color,
    this.isDisabled = false,
  });

  @override
  State<GlassTextButton> createState() => _GlassTextButtonState();
}

class _GlassTextButtonState extends State<GlassTextButton> {
  bool _isHovered = false;
  bool _isPressed = false;

  EdgeInsets get _padding {
    return switch (widget.size) {
      GlassButtonSize.small => const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      GlassButtonSize.medium => const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      GlassButtonSize.large => const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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

  @override
  Widget build(BuildContext context) {
    final effectiveColor = widget.color ?? CharlotteColors.primary;
    final isEnabled = !widget.isDisabled && widget.onPressed != null;

    final textColor = isEnabled
        ? (_isPressed
            ? effectiveColor.withValues(alpha: 0.7)
            : effectiveColor)
        : effectiveColor.withValues(alpha: 0.4);

    final bgColor = _isHovered && isEnabled
        ? effectiveColor.withValues(alpha: 0.08)
        : Colors.transparent;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: isEnabled ? (_) => setState(() => _isPressed = true) : null,
        onTapUp: isEnabled ? (_) => setState(() => _isPressed = false) : null,
        onTapCancel: isEnabled ? () => setState(() => _isPressed = false) : null,
        onTap: isEnabled ? widget.onPressed : null,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 100),
          padding: _padding,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.leadingIcon != null) ...[
                Icon(
                  widget.leadingIcon,
                  size: _iconSize,
                  color: textColor,
                ),
                SizedBox(width: widget.size == GlassButtonSize.small ? 4 : 8),
              ],
              Text(
                widget.label,
                style: TextStyle(
                  color: textColor,
                  fontSize: _fontSize,
                  fontWeight: FontWeight.w500,
                ),
              ),
              if (widget.trailingIcon != null) ...[
                SizedBox(width: widget.size == GlassButtonSize.small ? 4 : 8),
                Icon(
                  widget.trailingIcon,
                  size: _iconSize,
                  color: textColor,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
