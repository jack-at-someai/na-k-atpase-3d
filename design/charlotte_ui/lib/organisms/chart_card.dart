import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../atoms/atoms.dart';
import '../molecules/molecules.dart';

/// ChartCard - Generic wrapper for charts with header, legend, and tooltips.
///
/// Provides a consistent glassmorphic container for any chart type with
/// optional title, subtitle, action buttons, and legend placement.
class ChartCard extends StatelessWidget {
  /// The chart widget to display
  final Widget chart;

  /// Card title
  final String? title;

  /// Card subtitle
  final String? subtitle;

  /// Action buttons/widgets for header
  final List<Widget>? actions;

  /// Legend items (if not built into chart)
  final List<LegendItemAtom>? legendItems;

  /// Legend position
  final LegendPosition legendPosition;

  /// Card padding
  final EdgeInsetsGeometry padding;

  /// Card height (null for flexible)
  final double? height;

  /// Callback when card is tapped
  final VoidCallback? onTap;

  const ChartCard({
    super.key,
    required this.chart,
    this.title,
    this.subtitle,
    this.actions,
    this.legendItems,
    this.legendPosition = LegendPosition.none,
    this.padding = const EdgeInsets.all(16),
    this.height,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            height: height,
            padding: padding,
            decoration: BoxDecoration(
              color: CharlotteColors.glassFill,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: CharlotteColors.glassBorder,
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                if (title != null || subtitle != null || actions != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: _buildHeader(context),
                  ),

                // Chart with optional legend
                Expanded(
                  child: _buildChartWithLegend(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (title != null)
                Text(
                  title!,
                  style: TextStyle(
                    color: CharlotteColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              if (subtitle != null)
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Text(
                    subtitle!,
                    style: TextStyle(
                      color: CharlotteColors.textTertiary,
                      fontSize: 12,
                    ),
                  ),
                ),
            ],
          ),
        ),
        if (actions != null) ...actions!,
      ],
    );
  }

  Widget _buildChartWithLegend() {
    if (legendItems == null || legendPosition == LegendPosition.none) {
      return chart;
    }

    if (legendPosition == LegendPosition.right) {
      return Row(
        children: [
          Expanded(child: chart),
          const SizedBox(width: 16),
          LegendColumn(items: legendItems!),
        ],
      );
    } else {
      return Column(
        children: [
          Expanded(child: chart),
          const SizedBox(height: 12),
          LegendRow(items: legendItems!),
        ],
      );
    }
  }
}

/// ChartCardAction - Standard action button for chart cards.
class ChartCardAction extends StatelessWidget {
  final IconData icon;
  final String? tooltip;
  final VoidCallback? onPressed;

  const ChartCardAction({
    super.key,
    required this.icon,
    this.tooltip,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip ?? '',
      child: GlassIconButton(
        icon: icon,
        size: 32,
        iconSize: 18,
        onPressed: onPressed,
      ),
    );
  }
}

/// ChartCardDropdown - Dropdown selector for chart cards.
class ChartCardDropdown<T> extends StatelessWidget {
  final T value;
  final List<T> items;
  final String Function(T) labelBuilder;
  final void Function(T?)? onChanged;

  const ChartCardDropdown({
    super.key,
    required this.value,
    required this.items,
    required this.labelBuilder,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: CharlotteColors.surface,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: CharlotteColors.glassBorder),
      ),
      child: DropdownButton<T>(
        value: value,
        items: items.map((item) {
          return DropdownMenuItem(
            value: item,
            child: Text(
              labelBuilder(item),
              style: TextStyle(
                color: CharlotteColors.textSecondary,
                fontSize: 12,
              ),
            ),
          );
        }).toList(),
        onChanged: onChanged,
        underline: const SizedBox(),
        isDense: true,
        dropdownColor: CharlotteColors.surface,
        style: TextStyle(
          color: CharlotteColors.textSecondary,
          fontSize: 12,
        ),
        icon: Icon(
          Icons.keyboard_arrow_down,
          color: CharlotteColors.textTertiary,
          size: 16,
        ),
      ),
    );
  }
}
