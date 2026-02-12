import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import 'glass_fab.dart';

/// GlassBottomBar - Bottom bar with optional centered FAB.
class GlassBottomBar extends StatelessWidget {
  final List<Widget> children;
  final Widget? centerFab;
  final MainAxisAlignment alignment;
  final EdgeInsetsGeometry padding;
  final double? height;

  const GlassBottomBar({
    super.key,
    required this.children,
    this.centerFab,
    this.alignment = MainAxisAlignment.spaceAround,
    this.padding = const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    this.height,
  });

  /// Creates a bottom bar with a center FAB notch
  const GlassBottomBar.withFab({
    super.key,
    required this.children,
    required Widget fab,
    this.alignment = MainAxisAlignment.spaceAround,
    this.padding = const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    this.height,
  }) : centerFab = fab;

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          height: height != null ? height! + bottomPadding : null,
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
            child: Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.bottomCenter,
              children: [
                Padding(
                  padding: padding,
                  child: Row(
                    mainAxisAlignment: alignment,
                    children: _buildChildren(),
                  ),
                ),
                if (centerFab != null)
                  Positioned(
                    top: -28,
                    child: centerFab!,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _buildChildren() {
    if (centerFab == null) return children;

    // Insert spacer in the middle for FAB
    final middleIndex = children.length ~/ 2;
    final result = <Widget>[];

    for (int i = 0; i < children.length; i++) {
      if (i == middleIndex) {
        result.add(const SizedBox(width: 72)); // FAB width + padding
      }
      result.add(children[i]);
    }

    return result;
  }
}

/// Bottom bar item
class GlassBottomBarItem extends StatelessWidget {
  final IconData icon;
  final IconData? activeIcon;
  final String? label;
  final bool isSelected;
  final VoidCallback? onTap;
  final Color? color;
  final Widget? badge;

  const GlassBottomBarItem({
    super.key,
    required this.icon,
    this.activeIcon,
    this.label,
    this.isSelected = false,
    this.onTap,
    this.color,
    this.badge,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? CharlotteColors.primary;
    final iconColor = isSelected ? effectiveColor : CharlotteColors.iconTertiary;
    final labelColor =
        isSelected ? effectiveColor : CharlotteColors.textTertiary;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  child: Icon(
                    isSelected ? (activeIcon ?? icon) : icon,
                    key: ValueKey(isSelected),
                    size: 24,
                    color: iconColor,
                  ),
                ),
                if (badge != null)
                  Positioned(
                    right: -6,
                    top: -4,
                    child: badge!,
                  ),
              ],
            ),
            if (label != null) ...[
              const SizedBox(height: 4),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 200),
                style: TextStyle(
                  color: labelColor,
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                ),
                child: Text(label!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Complete bottom navigation bar
class GlassBottomNavigationBar extends StatelessWidget {
  final List<GlassBottomBarItem> items;
  final int selectedIndex;
  final ValueChanged<int>? onTap;
  final GlassFab? centerFab;

  const GlassBottomNavigationBar({
    super.key,
    required this.items,
    this.selectedIndex = 0,
    this.onTap,
    this.centerFab,
  });

  @override
  Widget build(BuildContext context) {
    return GlassBottomBar(
      centerFab: centerFab,
      children: List.generate(items.length, (index) {
        final item = items[index];
        return GlassBottomBarItem(
          icon: item.icon,
          activeIcon: item.activeIcon,
          label: item.label,
          isSelected: index == selectedIndex,
          color: item.color,
          badge: item.badge,
          onTap: () => onTap?.call(index),
        );
      }),
    );
  }
}
