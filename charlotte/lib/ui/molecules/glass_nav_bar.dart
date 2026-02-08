import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';

/// Navigation item data
class GlassNavItem {
  final IconData icon;
  final IconData? activeIcon;
  final String label;
  final Widget? badge;

  const GlassNavItem({
    required this.icon,
    this.activeIcon,
    required this.label,
    this.badge,
  });
}

/// GlassNavBar - Bottom navigation bar with glassmorphic styling (M3 style).
class GlassNavBar extends StatelessWidget {
  final List<GlassNavItem> items;
  final int selectedIndex;
  final ValueChanged<int>? onDestinationSelected;
  final Color? indicatorColor;
  final Color? selectedColor;
  final Color? unselectedColor;
  final bool showLabels;
  final bool showSelectedLabels;
  final bool showUnselectedLabels;

  const GlassNavBar({
    super.key,
    required this.items,
    this.selectedIndex = 0,
    this.onDestinationSelected,
    this.indicatorColor,
    this.selectedColor,
    this.unselectedColor,
    this.showLabels = true,
    this.showSelectedLabels = true,
    this.showUnselectedLabels = true,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveIndicatorColor = indicatorColor ?? CharlotteColors.primary;
    final effectiveSelectedColor = selectedColor ?? CharlotteColors.primary;
    final effectiveUnselectedColor =
        unselectedColor ?? CharlotteColors.iconTertiary;

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          decoration: BoxDecoration(
            color: CharlotteColors.surface.withValues(alpha: 0.9),
            border: Border(
              top: BorderSide(
                color: CharlotteColors.glassBorder,
                width: 1,
              ),
            ),
          ),
          child: SafeArea(
            top: false,
            child: SizedBox(
              height: 80,
              child: Row(
                children: List.generate(items.length, (index) {
                  final item = items[index];
                  final isSelected = index == selectedIndex;

                  return Expanded(
                    child: _NavBarDestination(
                      item: item,
                      isSelected: isSelected,
                      indicatorColor: effectiveIndicatorColor,
                      selectedColor: effectiveSelectedColor,
                      unselectedColor: effectiveUnselectedColor,
                      showLabel: showLabels &&
                          (isSelected ? showSelectedLabels : showUnselectedLabels),
                      onTap: () => onDestinationSelected?.call(index),
                    ),
                  );
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavBarDestination extends StatefulWidget {
  final GlassNavItem item;
  final bool isSelected;
  final Color indicatorColor;
  final Color selectedColor;
  final Color unselectedColor;
  final bool showLabel;
  final VoidCallback? onTap;

  const _NavBarDestination({
    required this.item,
    required this.isSelected,
    required this.indicatorColor,
    required this.selectedColor,
    required this.unselectedColor,
    required this.showLabel,
    this.onTap,
  });

  @override
  State<_NavBarDestination> createState() => _NavBarDestinationState();
}

class _NavBarDestinationState extends State<_NavBarDestination>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.9).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final iconColor =
        widget.isSelected ? widget.selectedColor : widget.unselectedColor;
    final labelColor =
        widget.isSelected ? widget.selectedColor : widget.unselectedColor;

    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse(),
      onTapCancel: () => _controller.reverse(),
      onTap: widget.onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: child,
          );
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Indicator + Icon
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                decoration: BoxDecoration(
                  color: widget.isSelected
                      ? widget.indicatorColor.withValues(alpha: 0.15)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Icon(
                      widget.isSelected
                          ? (widget.item.activeIcon ?? widget.item.icon)
                          : widget.item.icon,
                      size: 24,
                      color: iconColor,
                    ),
                    if (widget.item.badge != null)
                      Positioned(
                        right: -8,
                        top: -4,
                        child: widget.item.badge!,
                      ),
                  ],
                ),
              ),

              // Label
              if (widget.showLabel) ...[
                const SizedBox(height: 4),
                AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 200),
                  style: TextStyle(
                    color: labelColor,
                    fontSize: 12,
                    fontWeight:
                        widget.isSelected ? FontWeight.w600 : FontWeight.w500,
                  ),
                  child: Text(
                    widget.item.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
