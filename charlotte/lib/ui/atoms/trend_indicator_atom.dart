import 'package:flutter/material.dart';

import '../../theme.dart';
import '../molecules/chart_data.dart';

/// TrendIndicatorAtom - Up/down arrow with percentage change.
///
/// Visual indicator for metric trends, using semantic colors:
/// - Green for up/positive
/// - Red for down/negative
/// - Grey for flat/neutral
class TrendIndicatorAtom extends StatelessWidget {
  /// Trend direction
  final TrendDirection direction;

  /// Change value (displayed as percentage)
  final double? change;

  /// Size of the indicator
  final double size;

  /// Whether to show the percentage label
  final bool showLabel;

  /// Custom colors override
  final Color? upColor;
  final Color? downColor;
  final Color? flatColor;

  const TrendIndicatorAtom({
    super.key,
    required this.direction,
    this.change,
    this.size = 16,
    this.showLabel = true,
    this.upColor,
    this.downColor,
    this.flatColor,
  });

  /// Create from change value (auto-detects direction)
  factory TrendIndicatorAtom.fromChange(
    double change, {
    double size = 16,
    bool showLabel = true,
  }) {
    TrendDirection direction;
    if (change > 0) {
      direction = TrendDirection.up;
    } else if (change < 0) {
      direction = TrendDirection.down;
    } else {
      direction = TrendDirection.flat;
    }

    return TrendIndicatorAtom(
      direction: direction,
      change: change,
      size: size,
      showLabel: showLabel,
    );
  }

  Color get _color {
    return switch (direction) {
      TrendDirection.up => upColor ?? CharlotteVisualizationColors.scoreHigh,
      TrendDirection.down => downColor ?? CharlotteVisualizationColors.scoreLow,
      TrendDirection.flat => flatColor ?? CharlotteColors.textTertiary,
    };
  }

  IconData get _icon {
    return switch (direction) {
      TrendDirection.up => Icons.trending_up,
      TrendDirection.down => Icons.trending_down,
      TrendDirection.flat => Icons.trending_flat,
    };
  }

  String get _label {
    if (change == null) return '';
    final absChange = change!.abs();
    final sign = change! > 0 ? '+' : '';
    return '$sign${absChange.toStringAsFixed(1)}%';
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          _icon,
          size: size,
          color: _color,
        ),
        if (showLabel && change != null) ...[
          const SizedBox(width: 4),
          Text(
            _label,
            style: TextStyle(
              color: _color,
              fontSize: size * 0.75,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ],
    );
  }
}

/// Compact trend badge with background
class TrendBadge extends StatelessWidget {
  final TrendDirection direction;
  final double? change;
  final bool compact;

  const TrendBadge({
    super.key,
    required this.direction,
    this.change,
    this.compact = false,
  });

  factory TrendBadge.fromChange(double change, {bool compact = false}) {
    TrendDirection direction;
    if (change > 0) {
      direction = TrendDirection.up;
    } else if (change < 0) {
      direction = TrendDirection.down;
    } else {
      direction = TrendDirection.flat;
    }

    return TrendBadge(
      direction: direction,
      change: change,
      compact: compact,
    );
  }

  Color get _color {
    return switch (direction) {
      TrendDirection.up => CharlotteVisualizationColors.scoreHigh,
      TrendDirection.down => CharlotteVisualizationColors.scoreLow,
      TrendDirection.flat => CharlotteColors.textTertiary,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 6 : 8,
        vertical: compact ? 2 : 4,
      ),
      decoration: BoxDecoration(
        color: _color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(compact ? 4 : 6),
        border: Border.all(
          color: _color.withValues(alpha: 0.3),
          width: 1,
        ),
      ),
      child: TrendIndicatorAtom(
        direction: direction,
        change: change,
        size: compact ? 12 : 14,
        showLabel: change != null,
      ),
    );
  }
}
