import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../atoms/types.dart';

/// GlassFab - Floating action button with glassmorphic styling.
class GlassFab extends StatefulWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final GlassFabSize size;
  final Color? color;
  final Color? iconColor;
  final bool isDisabled;
  final String? tooltip;
  final bool mini;

  const GlassFab({
    super.key,
    required this.icon,
    this.onPressed,
    this.size = GlassFabSize.regular,
    this.color,
    this.iconColor,
    this.isDisabled = false,
    this.tooltip,
    this.mini = false,
  });

  /// Creates a small FAB
  const GlassFab.small({
    super.key,
    required this.icon,
    this.onPressed,
    this.color,
    this.iconColor,
    this.isDisabled = false,
    this.tooltip,
  })  : size = GlassFabSize.small,
        mini = true;

  /// Creates a large FAB
  const GlassFab.large({
    super.key,
    required this.icon,
    this.onPressed,
    this.color,
    this.iconColor,
    this.isDisabled = false,
    this.tooltip,
  })  : size = GlassFabSize.large,
        mini = false;

  @override
  State<GlassFab> createState() => _GlassFabState();
}

class _GlassFabState extends State<GlassFab> with SingleTickerProviderStateMixin {
  bool _isHovered = false;
  bool _isPressed = false;
  late AnimationController _scaleController;
  late Animation<double> _scaleAnimation;

  double get _size {
    if (widget.mini) return 40;
    return switch (widget.size) {
      GlassFabSize.small => 40,
      GlassFabSize.regular => 56,
      GlassFabSize.large => 96,
    };
  }

  double get _iconSize {
    if (widget.mini) return 20;
    return switch (widget.size) {
      GlassFabSize.small => 20,
      GlassFabSize.regular => 24,
      GlassFabSize.large => 36,
    };
  }

  double get _borderRadius {
    return switch (widget.size) {
      GlassFabSize.small => 12,
      GlassFabSize.regular => 16,
      GlassFabSize.large => 28,
    };
  }

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final effectiveColor = widget.color ?? CharlotteColors.primary;
    final effectiveIconColor = widget.iconColor ?? CharlotteColors.white;
    final isEnabled = !widget.isDisabled && widget.onPressed != null;

    final bgColor = isEnabled
        ? (_isPressed
            ? effectiveColor.withValues(alpha: 0.85)
            : effectiveColor)
        : effectiveColor.withValues(alpha: 0.4);

    final iconColor = isEnabled
        ? effectiveIconColor
        : effectiveIconColor.withValues(alpha: 0.6);

    Widget fab = MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: isEnabled
            ? (_) {
                setState(() => _isPressed = true);
                _scaleController.forward();
              }
            : null,
        onTapUp: isEnabled
            ? (_) {
                setState(() => _isPressed = false);
                _scaleController.reverse();
              }
            : null,
        onTapCancel: isEnabled
            ? () {
                setState(() => _isPressed = false);
                _scaleController.reverse();
              }
            : null,
        onTap: isEnabled ? widget.onPressed : null,
        child: AnimatedBuilder(
          animation: _scaleAnimation,
          builder: (context, child) {
            return Transform.scale(
              scale: _scaleAnimation.value,
              child: child,
            );
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            width: _size,
            height: _size,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(_borderRadius),
              boxShadow: isEnabled
                  ? [
                      BoxShadow(
                        color: effectiveColor.withValues(alpha: 0.4),
                        blurRadius: _isHovered ? 16 : 12,
                        offset: Offset(0, _isPressed ? 4 : 6),
                      ),
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ]
                  : null,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(_borderRadius),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                child: Container(
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(_borderRadius),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.15),
                      width: 1,
                    ),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.white.withValues(alpha: 0.1),
                        Colors.transparent,
                      ],
                    ),
                  ),
                  child: Center(
                    child: Icon(
                      widget.icon,
                      size: _iconSize,
                      color: iconColor,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    if (widget.tooltip != null) {
      fab = Tooltip(
        message: widget.tooltip!,
        child: fab,
      );
    }

    return fab;
  }
}
