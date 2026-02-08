import 'package:flutter/material.dart';

import '../../theme.dart';

/// MetricAtom - Measurement type indicator with icon and label.
class MetricAtom extends StatelessWidget {
  final String label;
  final String valueType;
  final bool isActive;

  const MetricAtom({
    super.key,
    required this.label,
    required this.valueType,
    this.isActive = false,
  });

  IconData get _icon {
    return switch (valueType.toUpperCase()) {
      'NUMBER' => Icons.tag,
      'BOOLEAN' => Icons.check_circle_outline,
      'SCORE' => Icons.speed,
      'STATUS' => Icons.label_outline,
      'EVENT' => Icons.bolt,
      'DATE' => Icons.calendar_today,
      'CURRENCY' => Icons.attach_money,
      'TEXT' => Icons.notes,
      _ => Icons.data_usage,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isActive
            ? CharlotteColors.primary.withValues(alpha: 0.15)
            : CharlotteColors.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isActive
              ? CharlotteColors.primary
              : CharlotteColors.glassBorder,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _icon,
            size: 18,
            color: isActive
                ? CharlotteColors.primary
                : CharlotteColors.textSecondary,
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: isActive
                  ? CharlotteColors.white
                  : CharlotteColors.textSecondary,
              fontSize: 13,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
