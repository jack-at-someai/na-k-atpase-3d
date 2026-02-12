import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';

/// GlassExtendedFab - Extended floating action button with label.
class GlassExtendedFab extends StatefulWidget {
  final String label;
  final IconData? icon;
  final VoidCallback? onPressed;
  final Color? color;
  final Color? contentColor;
  final bool isDisabled;
  final bool isLoading;
  final bool expanded;
  final String? tooltip;

  const GlassExtendedFab({
    super.key,
    required this.label,
    this.icon,
    this.onPressed,
    this.color,
    this.contentColor,
    this.isDisabled = false,
    this.isLoading = false,
    this.expanded = true,
    this.tooltip,
  });

  @override
  State<GlassExtendedFab> createState() => _GlassExtendedFabState();
}

class _GlassExtendedFabState extends State<GlassExtendedFab>
    with SingleTickerProviderStateMixin {
  bool _isHovered = false;
  bool _isPressed = false;
  late AnimationController _scaleController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.97).animate(
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
    final effectiveContentColor = widget.contentColor ?? CharlotteColors.white;
    final isEnabled = !widget.isDisabled && !widget.isLoading && widget.onPressed != null;

    final bgColor = isEnabled
        ? (_isPressed
            ? effectiveColor.withValues(alpha: 0.85)
            : effectiveColor)
        : effectiveColor.withValues(alpha: 0.4);

    final contentColor = isEnabled
        ? effectiveContentColor
        : effectiveContentColor.withValues(alpha: 0.6);

    Widget fabContent = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.isLoading) ...[
          SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: contentColor,
            ),
          ),
        ] else if (widget.icon != null) ...[
          Icon(
            widget.icon,
            size: 24,
            color: contentColor,
          ),
        ],
        if (widget.expanded) ...[
          if (widget.icon != null || widget.isLoading) const SizedBox(width: 12),
          Text(
            widget.label,
            style: TextStyle(
              color: contentColor,
              fontSize: 14,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.1,
            ),
          ),
        ],
      ],
    );

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
            duration: const Duration(milliseconds: 200),
            height: 56,
            padding: EdgeInsets.symmetric(
              horizontal: widget.expanded ? 20 : 16,
            ),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
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
              borderRadius: BorderRadius.circular(16),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                child: Container(
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(16),
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
                  child: Center(child: fabContent),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    if (widget.tooltip != null && !widget.expanded) {
      fab = Tooltip(
        message: widget.tooltip ?? widget.label,
        child: fab,
      );
    }

    return fab;
  }
}

/// Animated FAB that can expand/collapse
class GlassAnimatedFab extends StatefulWidget {
  final String label;
  final IconData icon;
  final VoidCallback? onPressed;
  final Color? color;
  final bool initiallyExpanded;

  const GlassAnimatedFab({
    super.key,
    required this.label,
    required this.icon,
    this.onPressed,
    this.color,
    this.initiallyExpanded = true,
  });

  @override
  State<GlassAnimatedFab> createState() => _GlassAnimatedFabState();
}

class _GlassAnimatedFabState extends State<GlassAnimatedFab>
    with SingleTickerProviderStateMixin {
  late bool _isExpanded;
  late AnimationController _controller;
  late Animation<double> _expandAnimation;

  @override
  void initState() {
    super.initState();
    _isExpanded = widget.initiallyExpanded;
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
      value: _isExpanded ? 1.0 : 0.0,
    );
    _expandAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void toggle() {
    setState(() {
      _isExpanded = !_isExpanded;
      if (_isExpanded) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _expandAnimation,
      builder: (context, child) {
        return GlassExtendedFab(
          label: widget.label,
          icon: widget.icon,
          onPressed: widget.onPressed,
          color: widget.color,
          expanded: _expandAnimation.value > 0.5,
          tooltip: widget.label,
        );
      },
    );
  }
}
