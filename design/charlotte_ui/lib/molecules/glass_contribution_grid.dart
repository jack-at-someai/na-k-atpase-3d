import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import 'chart_data.dart';

/// GlassContributionGrid - GitHub-style heatmap visualization.
///
/// Displays a grid of cells representing contribution/activity data over time.
/// Each cell's color intensity represents the value for that day.
class GlassContributionGrid extends StatefulWidget {
  /// Contribution cells to display
  final List<ContributionCell> cells;

  /// Number of weeks to show (columns)
  final int weeks;

  /// Cell size
  final double cellSize;

  /// Gap between cells
  final double cellGap;

  /// Base color for intensity gradient
  final Color? color;

  /// Whether to show month labels
  final bool showMonthLabels;

  /// Whether to show day labels (Mon, Wed, Fri)
  final bool showDayLabels;

  /// Whether to show intensity legend
  final bool showLegend;

  /// Callback when cell is tapped
  final void Function(ContributionCell cell)? onCellTap;

  const GlassContributionGrid({
    super.key,
    required this.cells,
    this.weeks = 52,
    this.cellSize = 12,
    this.cellGap = 3,
    this.color,
    this.showMonthLabels = true,
    this.showDayLabels = true,
    this.showLegend = true,
    this.onCellTap,
  });

  @override
  State<GlassContributionGrid> createState() => _GlassContributionGridState();
}

class _GlassContributionGridState extends State<GlassContributionGrid> {
  ContributionCell? _hoveredCell;

  Color get _baseColor => widget.color ?? CharlotteColors.primary;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Month labels
        if (widget.showMonthLabels)
          Padding(
            padding: EdgeInsets.only(
              left: widget.showDayLabels ? 28 : 0,
              bottom: 4,
            ),
            child: _buildMonthLabels(),
          ),

        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Day labels
            if (widget.showDayLabels)
              Padding(
                padding: const EdgeInsets.only(right: 4),
                child: _buildDayLabels(),
              ),

            // Grid
            Expanded(
              child: _buildGrid(),
            ),
          ],
        ),

        // Legend
        if (widget.showLegend)
          Padding(
            padding: EdgeInsets.only(
              left: widget.showDayLabels ? 28 : 0,
              top: 8,
            ),
            child: _buildLegend(),
          ),

        // Tooltip
        if (_hoveredCell != null)
          Padding(
            padding: EdgeInsets.only(
              left: widget.showDayLabels ? 28 : 0,
              top: 8,
            ),
            child: _buildTooltip(),
          ),
      ],
    );
  }

  Widget _buildMonthLabels() {
    // Generate month labels based on weeks
    final now = DateTime.now();
    final startDate = now.subtract(Duration(days: widget.weeks * 7));

    final months = <String>[];
    var currentMonth = -1;

    for (int week = 0; week < widget.weeks; week++) {
      final weekStart = startDate.add(Duration(days: week * 7));
      if (weekStart.month != currentMonth) {
        currentMonth = weekStart.month;
        months.add(_monthName(currentMonth));
      } else {
        months.add('');
      }
    }

    final cellWidth = widget.cellSize + widget.cellGap;

    return SizedBox(
      height: 16,
      child: Row(
        children: months.map((month) {
          return SizedBox(
            width: cellWidth,
            child: month.isNotEmpty
                ? Text(
                    month,
                    style: TextStyle(
                      color: CharlotteColors.textTertiary,
                      fontSize: 10,
                    ),
                  )
                : null,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildDayLabels() {
    final labels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    final cellHeight = widget.cellSize + widget.cellGap;

    return SizedBox(
      width: 24,
      child: Column(
        children: labels.map((label) {
          return SizedBox(
            height: cellHeight,
            child: label.isNotEmpty
                ? Align(
                    alignment: Alignment.centerRight,
                    child: Text(
                      label,
                      style: TextStyle(
                        color: CharlotteColors.textTertiary,
                        fontSize: 9,
                      ),
                    ),
                  )
                : null,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildGrid() {
    // Build lookup map for cells
    final cellMap = <String, ContributionCell>{};
    for (final cell in widget.cells) {
      final key = '${cell.date.year}-${cell.date.month}-${cell.date.day}';
      cellMap[key] = cell;
    }

    // Build grid starting from weeks ago
    final now = DateTime.now();
    final startDate = now.subtract(Duration(days: widget.weeks * 7));
    // Adjust to start on Sunday
    final adjustedStart = startDate.subtract(Duration(days: startDate.weekday % 7));

    return ClipRRect(
      borderRadius: BorderRadius.circular(4),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
        child: Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: CharlotteColors.glassFill,
            borderRadius: BorderRadius.circular(4),
            border: Border.all(
              color: CharlotteColors.glassBorder,
              width: 1,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(widget.weeks, (week) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: List.generate(7, (day) {
                  final date = adjustedStart.add(Duration(days: week * 7 + day));
                  final key = '${date.year}-${date.month}-${date.day}';
                  final cell = cellMap[key];

                  return _buildCell(date, cell);
                }),
              );
            }),
          ),
        ),
      ),
    );
  }

  Widget _buildCell(DateTime date, ContributionCell? cell) {
    final intensity = cell?.intensity ?? 0.0;
    final isHovered = _hoveredCell == cell;
    final isToday = _isToday(date);
    final isFuture = date.isAfter(DateTime.now());

    Color cellColor;
    if (isFuture) {
      cellColor = Colors.transparent;
    } else if (intensity == 0) {
      cellColor = CharlotteColors.surface;
    } else {
      cellColor = _colorForIntensity(intensity);
    }

    return Padding(
      padding: EdgeInsets.all(widget.cellGap / 2),
      child: MouseRegion(
        onEnter: (_) => setState(() => _hoveredCell = cell),
        onExit: (_) => setState(() => _hoveredCell = null),
        child: GestureDetector(
          onTap: cell != null ? () => widget.onCellTap?.call(cell) : null,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 100),
            width: widget.cellSize,
            height: widget.cellSize,
            decoration: BoxDecoration(
              color: cellColor,
              borderRadius: BorderRadius.circular(2),
              border: isToday
                  ? Border.all(color: CharlotteColors.white, width: 1)
                  : null,
              boxShadow: isHovered && cell != null
                  ? [
                      BoxShadow(
                        color: cellColor.withValues(alpha: 0.6),
                        blurRadius: 8,
                        spreadRadius: 2,
                      ),
                    ]
                  : null,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLegend() {
    final intensities = [0.0, 0.25, 0.5, 0.75, 1.0];

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          'Less',
          style: TextStyle(
            color: CharlotteColors.textTertiary,
            fontSize: 10,
          ),
        ),
        const SizedBox(width: 4),
        ...intensities.map((intensity) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 1),
            child: Container(
              width: widget.cellSize,
              height: widget.cellSize,
              decoration: BoxDecoration(
                color: intensity == 0
                    ? CharlotteColors.surface
                    : _colorForIntensity(intensity),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          );
        }),
        const SizedBox(width: 4),
        Text(
          'More',
          style: TextStyle(
            color: CharlotteColors.textTertiary,
            fontSize: 10,
          ),
        ),
      ],
    );
  }

  Widget _buildTooltip() {
    final cell = _hoveredCell!;
    final dateStr = '${_monthName(cell.date.month)} ${cell.date.day}, ${cell.date.year}';
    final countStr = cell.count != null
        ? '${cell.count} contribution${cell.count == 1 ? '' : 's'}'
        : cell.label ?? 'Activity: ${(cell.intensity * 100).toInt()}%';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: CharlotteColors.surface,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: CharlotteColors.glassBorder),
      ),
      child: Text(
        '$countStr on $dateStr',
        style: TextStyle(
          color: CharlotteColors.textSecondary,
          fontSize: 11,
        ),
      ),
    );
  }

  Color _colorForIntensity(double intensity) {
    // Gradient from surface to full color
    return Color.lerp(
      CharlotteColors.surface,
      _baseColor,
      intensity.clamp(0.0, 1.0),
    )!;
  }

  bool _isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }

  String _monthName(int month) {
    const names = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return names[month];
  }
}
