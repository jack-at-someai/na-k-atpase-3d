import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../atoms/types.dart';

/// Tab item data
class GlassTabItem {
  final String label;
  final IconData? icon;
  final Widget? badge;

  const GlassTabItem({
    required this.label,
    this.icon,
    this.badge,
  });
}

/// GlassTabs - Tab bar with glassmorphic styling.
class GlassTabs extends StatefulWidget {
  final List<GlassTabItem> tabs;
  final int selectedIndex;
  final ValueChanged<int>? onChanged;
  final GlassTabAlignment alignment;
  final bool scrollable;
  final Color? indicatorColor;
  final Color? selectedColor;
  final Color? unselectedColor;

  const GlassTabs({
    super.key,
    required this.tabs,
    this.selectedIndex = 0,
    this.onChanged,
    this.alignment = GlassTabAlignment.fill,
    this.scrollable = false,
    this.indicatorColor,
    this.selectedColor,
    this.unselectedColor,
  });

  @override
  State<GlassTabs> createState() => _GlassTabsState();
}

class _GlassTabsState extends State<GlassTabs> {
  final List<GlobalKey> _tabKeys = [];

  @override
  void initState() {
    super.initState();
    _tabKeys.addAll(List.generate(widget.tabs.length, (_) => GlobalKey()));
  }

  @override
  void didUpdateWidget(GlassTabs oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.tabs.length != widget.tabs.length) {
      _tabKeys.clear();
      _tabKeys.addAll(List.generate(widget.tabs.length, (_) => GlobalKey()));
    }
  }

  @override
  Widget build(BuildContext context) {
    final effectiveIndicatorColor = widget.indicatorColor ?? CharlotteColors.primary;
    final effectiveSelectedColor = widget.selectedColor ?? CharlotteColors.primary;
    final effectiveUnselectedColor =
        widget.unselectedColor ?? CharlotteColors.textTertiary;

    Widget tabBar = ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          decoration: BoxDecoration(
            color: CharlotteColors.glassFill,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: CharlotteColors.glassBorder,
              width: 1,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(4),
            child: Row(
              mainAxisSize: widget.alignment == GlassTabAlignment.fill
                  ? MainAxisSize.max
                  : MainAxisSize.min,
              children: List.generate(widget.tabs.length, (index) {
                final tab = widget.tabs[index];
                final isSelected = index == widget.selectedIndex;

                return widget.alignment == GlassTabAlignment.fill
                    ? Expanded(
                        child: _buildTab(
                          tab,
                          index,
                          isSelected,
                          effectiveIndicatorColor,
                          effectiveSelectedColor,
                          effectiveUnselectedColor,
                        ),
                      )
                    : _buildTab(
                        tab,
                        index,
                        isSelected,
                        effectiveIndicatorColor,
                        effectiveSelectedColor,
                        effectiveUnselectedColor,
                      );
              }),
            ),
          ),
        ),
      ),
    );

    if (widget.scrollable) {
      tabBar = SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: tabBar,
      );
    }

    return tabBar;
  }

  Widget _buildTab(
    GlassTabItem tab,
    int index,
    bool isSelected,
    Color indicatorColor,
    Color selectedColor,
    Color unselectedColor,
  ) {
    return GestureDetector(
      key: _tabKeys[index],
      onTap: () => widget.onChanged?.call(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(
          horizontal: tab.icon != null ? 12 : 16,
          vertical: 10,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? indicatorColor.withValues(alpha: 0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (tab.icon != null) ...[
              Icon(
                tab.icon,
                size: 18,
                color: isSelected ? selectedColor : unselectedColor,
              ),
              const SizedBox(width: 8),
            ],
            Text(
              tab.label,
              style: TextStyle(
                color: isSelected ? selectedColor : unselectedColor,
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
              ),
            ),
            if (tab.badge != null) ...[
              const SizedBox(width: 6),
              tab.badge!,
            ],
          ],
        ),
      ),
    );
  }
}

/// Underlined tab variant
class GlassUnderlineTabs extends StatelessWidget {
  final List<GlassTabItem> tabs;
  final int selectedIndex;
  final ValueChanged<int>? onChanged;
  final Color? indicatorColor;
  final Color? selectedColor;
  final Color? unselectedColor;
  final double indicatorWeight;

  const GlassUnderlineTabs({
    super.key,
    required this.tabs,
    this.selectedIndex = 0,
    this.onChanged,
    this.indicatorColor,
    this.selectedColor,
    this.unselectedColor,
    this.indicatorWeight = 3,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveIndicatorColor = indicatorColor ?? CharlotteColors.primary;
    final effectiveSelectedColor = selectedColor ?? CharlotteColors.textPrimary;
    final effectiveUnselectedColor = unselectedColor ?? CharlotteColors.textTertiary;

    return Container(
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: CharlotteColors.glassBorder,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: List.generate(tabs.length, (index) {
          final tab = tabs[index];
          final isSelected = index == selectedIndex;

          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged?.call(index),
              behavior: HitTestBehavior.opaque,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (tab.icon != null) ...[
                          Icon(
                            tab.icon,
                            size: 18,
                            color: isSelected
                                ? effectiveSelectedColor
                                : effectiveUnselectedColor,
                          ),
                          const SizedBox(width: 8),
                        ],
                        Text(
                          tab.label,
                          style: TextStyle(
                            color: isSelected
                                ? effectiveSelectedColor
                                : effectiveUnselectedColor,
                            fontSize: 14,
                            fontWeight:
                                isSelected ? FontWeight.w600 : FontWeight.w500,
                          ),
                        ),
                        if (tab.badge != null) ...[
                          const SizedBox(width: 6),
                          tab.badge!,
                        ],
                      ],
                    ),
                  ),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    height: indicatorWeight,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? effectiveIndicatorColor
                          : Colors.transparent,
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(indicatorWeight),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }
}
