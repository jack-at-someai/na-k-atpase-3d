import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';
import 'glass_nav_bar.dart';
import 'glass_fab.dart';

/// GlassNavRail - Side navigation rail with glassmorphic styling.
class GlassNavRail extends StatelessWidget {
  final List<GlassNavItem> destinations;
  final int selectedIndex;
  final ValueChanged<int>? onDestinationSelected;
  final Widget? leading;
  final Widget? trailing;
  final bool extended;
  final double minWidth;
  final double minExtendedWidth;
  final Color? indicatorColor;
  final Color? selectedColor;
  final Color? unselectedColor;
  final GlassFab? fab;

  const GlassNavRail({
    super.key,
    required this.destinations,
    this.selectedIndex = 0,
    this.onDestinationSelected,
    this.leading,
    this.trailing,
    this.extended = false,
    this.minWidth = 72,
    this.minExtendedWidth = 256,
    this.indicatorColor,
    this.selectedColor,
    this.unselectedColor,
    this.fab,
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
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: extended ? minExtendedWidth : minWidth,
          decoration: BoxDecoration(
            color: CharlotteColors.surface.withValues(alpha: 0.9),
            border: Border(
              right: BorderSide(
                color: CharlotteColors.glassBorder,
                width: 1,
              ),
            ),
          ),
          child: SafeArea(
            right: false,
            bottom: false,
            child: Column(
              children: [
                // Leading widget (e.g., menu button or logo)
                if (leading != null)
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: leading,
                  ),

                // FAB
                if (fab != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: fab,
                  ),

                const SizedBox(height: 8),

                // Destinations
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: destinations.length,
                    itemBuilder: (context, index) {
                      final destination = destinations[index];
                      final isSelected = index == selectedIndex;

                      return _NavRailDestination(
                        item: destination,
                        isSelected: isSelected,
                        extended: extended,
                        indicatorColor: effectiveIndicatorColor,
                        selectedColor: effectiveSelectedColor,
                        unselectedColor: effectiveUnselectedColor,
                        onTap: () => onDestinationSelected?.call(index),
                      );
                    },
                  ),
                ),

                // Trailing widget
                if (trailing != null)
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: trailing,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavRailDestination extends StatefulWidget {
  final GlassNavItem item;
  final bool isSelected;
  final bool extended;
  final Color indicatorColor;
  final Color selectedColor;
  final Color unselectedColor;
  final VoidCallback? onTap;

  const _NavRailDestination({
    required this.item,
    required this.isSelected,
    required this.extended,
    required this.indicatorColor,
    required this.selectedColor,
    required this.unselectedColor,
    this.onTap,
  });

  @override
  State<_NavRailDestination> createState() => _NavRailDestinationState();
}

class _NavRailDestinationState extends State<_NavRailDestination> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final iconColor =
        widget.isSelected ? widget.selectedColor : widget.unselectedColor;
    final labelColor =
        widget.isSelected ? widget.selectedColor : widget.unselectedColor;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        behavior: HitTestBehavior.opaque,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            padding: EdgeInsets.symmetric(
              horizontal: widget.extended ? 16 : 0,
              vertical: 12,
            ),
            decoration: BoxDecoration(
              color: widget.isSelected
                  ? widget.indicatorColor.withValues(alpha: 0.15)
                  : (_isHovered
                      ? widget.indicatorColor.withValues(alpha: 0.08)
                      : Colors.transparent),
              borderRadius: BorderRadius.circular(widget.extended ? 28 : 16),
            ),
            child: widget.extended
                ? Row(
                    children: [
                      Stack(
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
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          widget.item.label,
                          style: TextStyle(
                            color: labelColor,
                            fontSize: 14,
                            fontWeight: widget.isSelected
                                ? FontWeight.w600
                                : FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  )
                : Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Stack(
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
                      const SizedBox(height: 4),
                      Text(
                        widget.item.label,
                        style: TextStyle(
                          color: labelColor,
                          fontSize: 12,
                          fontWeight: widget.isSelected
                              ? FontWeight.w600
                              : FontWeight.w500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
