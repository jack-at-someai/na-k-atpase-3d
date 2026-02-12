import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import 'types.dart';

/// GlassCheckbox - Binary/tristate selection with glassmorphic styling.
class GlassCheckbox extends StatelessWidget {
  final bool? value;
  final ValueChanged<bool?>? onChanged;
  final bool tristate;
  final double size;
  final Color? activeColor;
  final Color? checkColor;
  final bool isDisabled;

  const GlassCheckbox({
    super.key,
    required this.value,
    this.onChanged,
    this.tristate = false,
    this.size = 24,
    this.activeColor,
    this.checkColor,
    this.isDisabled = false,
  });

  GlassCheckboxState get _state {
    if (value == null) return GlassCheckboxState.indeterminate;
    return value! ? GlassCheckboxState.checked : GlassCheckboxState.unchecked;
  }

  @override
  Widget build(BuildContext context) {
    final effectiveActiveColor = activeColor ?? CharlotteColors.primary;
    final effectiveCheckColor = checkColor ?? CharlotteColors.white;
    final isChecked = _state == GlassCheckboxState.checked;
    final isIndeterminate = _state == GlassCheckboxState.indeterminate;

    return GestureDetector(
      onTap: isDisabled
          ? null
          : () {
              if (onChanged == null) return;
              if (tristate) {
                // unchecked -> checked -> indeterminate -> unchecked
                if (_state == GlassCheckboxState.unchecked) {
                  onChanged!(true);
                } else if (_state == GlassCheckboxState.checked) {
                  onChanged!(null);
                } else {
                  onChanged!(false);
                }
              } else {
                onChanged!(!value!);
              }
            },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: isChecked || isIndeterminate
              ? effectiveActiveColor.withValues(alpha: isDisabled ? 0.3 : 1.0)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(size * 0.2),
          border: Border.all(
            color: isChecked || isIndeterminate
                ? effectiveActiveColor.withValues(alpha: isDisabled ? 0.3 : 1.0)
                : (isDisabled
                    ? CharlotteColors.glassBorder.withValues(alpha: 0.3)
                    : CharlotteColors.glassBorder),
            width: 2,
          ),
          boxShadow: (isChecked || isIndeterminate) && !isDisabled
              ? [
                  BoxShadow(
                    color: effectiveActiveColor.withValues(alpha: 0.3),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ]
              : null,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(size * 0.2),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
            child: Center(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 150),
                child: isChecked
                    ? Icon(
                        Icons.check_rounded,
                        key: const ValueKey('check'),
                        size: size * 0.7,
                        color: effectiveCheckColor.withValues(
                            alpha: isDisabled ? 0.5 : 1.0),
                      )
                    : isIndeterminate
                        ? Icon(
                            Icons.remove_rounded,
                            key: const ValueKey('indeterminate'),
                            size: size * 0.7,
                            color: effectiveCheckColor.withValues(
                                alpha: isDisabled ? 0.5 : 1.0),
                          )
                        : const SizedBox.shrink(key: ValueKey('empty')),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// GlassCheckbox with label
class GlassCheckboxTile extends StatelessWidget {
  final bool? value;
  final ValueChanged<bool?>? onChanged;
  final String label;
  final String? subtitle;
  final bool tristate;
  final double checkboxSize;
  final Color? activeColor;
  final bool isDisabled;
  final bool dense;

  const GlassCheckboxTile({
    super.key,
    required this.value,
    this.onChanged,
    required this.label,
    this.subtitle,
    this.tristate = false,
    this.checkboxSize = 24,
    this.activeColor,
    this.isDisabled = false,
    this.dense = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isDisabled
          ? null
          : () {
              if (onChanged == null) return;
              if (tristate) {
                if (value == false) {
                  onChanged!(true);
                } else if (value == true) {
                  onChanged!(null);
                } else {
                  onChanged!(false);
                }
              } else {
                onChanged!(!(value ?? false));
              }
            },
      child: Padding(
        padding: EdgeInsets.symmetric(
          vertical: dense ? 4 : 8,
          horizontal: 4,
        ),
        child: Row(
          children: [
            GlassCheckbox(
              value: value,
              onChanged: onChanged,
              tristate: tristate,
              size: checkboxSize,
              activeColor: activeColor,
              isDisabled: isDisabled,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      color: isDisabled
                          ? CharlotteColors.textDisabled
                          : CharlotteColors.textPrimary,
                      fontSize: dense ? 13 : 14,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: TextStyle(
                        color: isDisabled
                            ? CharlotteColors.textDisabled
                            : CharlotteColors.textTertiary,
                        fontSize: dense ? 11 : 12,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
