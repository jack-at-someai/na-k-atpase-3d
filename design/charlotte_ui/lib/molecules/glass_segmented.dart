import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';

/// Segment item data
class GlassSegment {
  final String label;
  final IconData? icon;
  final bool enabled;

  const GlassSegment({
    required this.label,
    this.icon,
    this.enabled = true,
  });
}

/// GlassSegmented - Segmented button group with glassmorphic styling.
class GlassSegmented<T> extends StatelessWidget {
  final List<GlassSegment> segments;
  final List<T> values;
  final T? selected;
  final Set<T>? multiSelected;
  final ValueChanged<T>? onSelected;
  final ValueChanged<Set<T>>? onMultiSelected;
  final bool multiSelectionEnabled;
  final bool showSelectedIcon;
  final Color? selectedColor;

  const GlassSegmented({
    super.key,
    required this.segments,
    required this.values,
    this.selected,
    this.onSelected,
    this.selectedColor,
    this.showSelectedIcon = false,
  })  : multiSelectionEnabled = false,
        multiSelected = null,
        onMultiSelected = null;

  const GlassSegmented.multi({
    super.key,
    required this.segments,
    required this.values,
    required Set<T> selected,
    required ValueChanged<Set<T>> onSelected,
    this.selectedColor,
    this.showSelectedIcon = true,
  })  : multiSelectionEnabled = true,
        multiSelected = selected,
        onMultiSelected = onSelected,
        selected = null,
        onSelected = null;

  @override
  Widget build(BuildContext context) {
    final effectiveSelectedColor = selectedColor ?? CharlotteColors.primary;

    return ClipRRect(
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
              mainAxisSize: MainAxisSize.min,
              children: List.generate(segments.length, (index) {
                final segment = segments[index];
                final value = values[index];
                final isSelected = multiSelectionEnabled
                    ? multiSelected?.contains(value) ?? false
                    : selected == value;

                return _SegmentButton(
                  segment: segment,
                  isSelected: isSelected,
                  selectedColor: effectiveSelectedColor,
                  showSelectedIcon: showSelectedIcon && isSelected,
                  isFirst: index == 0,
                  isLast: index == segments.length - 1,
                  onTap: segment.enabled
                      ? () {
                          if (multiSelectionEnabled) {
                            final newSelection = Set<T>.from(multiSelected ?? {});
                            if (isSelected) {
                              newSelection.remove(value);
                            } else {
                              newSelection.add(value);
                            }
                            onMultiSelected?.call(newSelection);
                          } else {
                            onSelected?.call(value);
                          }
                        }
                      : null,
                );
              }),
            ),
          ),
        ),
      ),
    );
  }
}

class _SegmentButton extends StatefulWidget {
  final GlassSegment segment;
  final bool isSelected;
  final Color selectedColor;
  final bool showSelectedIcon;
  final bool isFirst;
  final bool isLast;
  final VoidCallback? onTap;

  const _SegmentButton({
    required this.segment,
    required this.isSelected,
    required this.selectedColor,
    required this.showSelectedIcon,
    required this.isFirst,
    required this.isLast,
    this.onTap,
  });

  @override
  State<_SegmentButton> createState() => _SegmentButtonState();
}

class _SegmentButtonState extends State<_SegmentButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final isEnabled = widget.segment.enabled;
    final textColor = widget.isSelected
        ? widget.selectedColor
        : (isEnabled ? CharlotteColors.textPrimary : CharlotteColors.textDisabled);
    final iconColor = widget.isSelected
        ? widget.selectedColor
        : (isEnabled
            ? CharlotteColors.iconSecondary
            : CharlotteColors.textDisabled);

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: EdgeInsets.symmetric(
            horizontal: widget.segment.icon != null ? 12 : 16,
            vertical: 10,
          ),
          decoration: BoxDecoration(
            color: widget.isSelected
                ? widget.selectedColor.withValues(alpha: 0.15)
                : (_isHovered && isEnabled
                    ? widget.selectedColor.withValues(alpha: 0.08)
                    : Colors.transparent),
            borderRadius: BorderRadius.horizontal(
              left: widget.isFirst ? const Radius.circular(8) : Radius.zero,
              right: widget.isLast ? const Radius.circular(8) : Radius.zero,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.showSelectedIcon) ...[
                Icon(
                  Icons.check,
                  size: 18,
                  color: widget.selectedColor,
                ),
                const SizedBox(width: 8),
              ],
              if (widget.segment.icon != null) ...[
                Icon(
                  widget.segment.icon,
                  size: 18,
                  color: iconColor,
                ),
                const SizedBox(width: 8),
              ],
              Text(
                widget.segment.label,
                style: TextStyle(
                  color: textColor,
                  fontSize: 14,
                  fontWeight:
                      widget.isSelected ? FontWeight.w600 : FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Simpler segmented control (iOS style)
class GlassSegmentedControl<T> extends StatelessWidget {
  final Map<T, Widget> children;
  final T? groupValue;
  final ValueChanged<T>? onValueChanged;
  final Color? selectedColor;
  final Color? unselectedColor;

  const GlassSegmentedControl({
    super.key,
    required this.children,
    this.groupValue,
    this.onValueChanged,
    this.selectedColor,
    this.unselectedColor,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveSelectedColor = selectedColor ?? CharlotteColors.primary;
    final effectiveUnselectedColor =
        unselectedColor ?? CharlotteColors.textTertiary;
    final entries = children.entries.toList();

    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          decoration: BoxDecoration(
            color: CharlotteColors.glassFill,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: CharlotteColors.glassBorder,
              width: 1,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(2),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(entries.length, (index) {
                final entry = entries[index];
                final isSelected = groupValue == entry.key;

                return GestureDetector(
                  onTap: () => onValueChanged?.call(entry.key),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? effectiveSelectedColor.withValues(alpha: 0.15)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: DefaultTextStyle(
                      style: TextStyle(
                        color: isSelected
                            ? effectiveSelectedColor
                            : effectiveUnselectedColor,
                        fontSize: 13,
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w500,
                      ),
                      child: entry.value,
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }
}
