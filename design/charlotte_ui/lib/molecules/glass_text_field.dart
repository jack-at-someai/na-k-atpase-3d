import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme.dart';
import '../atoms/types.dart';

/// GlassTextField - Text input field with glassmorphic styling.
class GlassTextField extends StatefulWidget {
  final TextEditingController? controller;
  final String? initialValue;
  final String? labelText;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final IconData? prefixIconData;
  final IconData? suffixIconData;
  final VoidCallback? onSuffixTap;
  final bool obscureText;
  final bool enabled;
  final bool readOnly;
  final int? maxLines;
  final int? minLines;
  final int? maxLength;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final TextCapitalization textCapitalization;
  final List<TextInputFormatter>? inputFormatters;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onTap;
  final FocusNode? focusNode;
  final bool autofocus;
  final bool filled;
  final Color? fillColor;
  final Color? focusColor;
  final Color? errorColor;

  const GlassTextField({
    super.key,
    this.controller,
    this.initialValue,
    this.labelText,
    this.hintText,
    this.helperText,
    this.errorText,
    this.prefixIcon,
    this.suffixIcon,
    this.prefixIconData,
    this.suffixIconData,
    this.onSuffixTap,
    this.obscureText = false,
    this.enabled = true,
    this.readOnly = false,
    this.maxLines = 1,
    this.minLines,
    this.maxLength,
    this.keyboardType,
    this.textInputAction,
    this.textCapitalization = TextCapitalization.none,
    this.inputFormatters,
    this.onChanged,
    this.onSubmitted,
    this.onTap,
    this.focusNode,
    this.autofocus = false,
    this.filled = true,
    this.fillColor,
    this.focusColor,
    this.errorColor,
  });

  @override
  State<GlassTextField> createState() => _GlassTextFieldState();
}

class _GlassTextFieldState extends State<GlassTextField> {
  late FocusNode _focusNode;
  late TextEditingController _controller;
  bool _isFocused = false;

  GlassTextFieldState get _state {
    if (!widget.enabled) return GlassTextFieldState.disabled;
    if (widget.errorText != null) return GlassTextFieldState.error;
    if (_isFocused) return GlassTextFieldState.focused;
    return GlassTextFieldState.normal;
  }

  @override
  void initState() {
    super.initState();
    _focusNode = widget.focusNode ?? FocusNode();
    _focusNode.addListener(_onFocusChange);
    _controller = widget.controller ?? TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChange);
    if (widget.focusNode == null) {
      _focusNode.dispose();
    }
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  void _onFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
  }

  @override
  Widget build(BuildContext context) {
    final effectiveFocusColor = widget.focusColor ?? CharlotteColors.primary;
    final effectiveErrorColor = widget.errorColor ?? CharlotteColors.error;
    final effectiveFillColor = widget.fillColor ?? CharlotteColors.glassFill;

    Color borderColor;
    Color labelColor;

    switch (_state) {
      case GlassTextFieldState.focused:
        borderColor = effectiveFocusColor;
        labelColor = effectiveFocusColor;
        break;
      case GlassTextFieldState.error:
        borderColor = effectiveErrorColor;
        labelColor = effectiveErrorColor;
        break;
      case GlassTextFieldState.disabled:
        borderColor = CharlotteColors.glassBorder.withValues(alpha: 0.3);
        labelColor = CharlotteColors.textDisabled;
        break;
      case GlassTextFieldState.normal:
        borderColor = CharlotteColors.glassBorder;
        labelColor = CharlotteColors.textSecondary;
        break;
    }

    Widget? effectivePrefixIcon = widget.prefixIcon;
    if (effectivePrefixIcon == null && widget.prefixIconData != null) {
      effectivePrefixIcon = Padding(
        padding: const EdgeInsets.only(left: 12, right: 8),
        child: Icon(
          widget.prefixIconData,
          size: 20,
          color: _state == GlassTextFieldState.disabled
              ? CharlotteColors.iconTertiary.withValues(alpha: 0.5)
              : CharlotteColors.iconSecondary,
        ),
      );
    }

    Widget? effectiveSuffixIcon = widget.suffixIcon;
    if (effectiveSuffixIcon == null && widget.suffixIconData != null) {
      effectiveSuffixIcon = GestureDetector(
        onTap: widget.onSuffixTap,
        child: Padding(
          padding: const EdgeInsets.only(right: 12, left: 8),
          child: Icon(
            widget.suffixIconData,
            size: 20,
            color: _state == GlassTextFieldState.disabled
                ? CharlotteColors.iconTertiary.withValues(alpha: 0.5)
                : CharlotteColors.iconSecondary,
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        // Label
        if (widget.labelText != null) ...[
          Text(
            widget.labelText!,
            style: TextStyle(
              color: labelColor,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 6),
        ],

        // Text field
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              decoration: BoxDecoration(
                color: widget.filled
                    ? effectiveFillColor.withValues(
                        alpha: _state == GlassTextFieldState.disabled ? 0.3 : 1.0)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: borderColor,
                  width: _state == GlassTextFieldState.focused ? 2 : 1,
                ),
                boxShadow: _state == GlassTextFieldState.focused
                    ? [
                        BoxShadow(
                          color: effectiveFocusColor.withValues(alpha: 0.1),
                          blurRadius: 8,
                          spreadRadius: 1,
                        ),
                      ]
                    : null,
              ),
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                obscureText: widget.obscureText,
                enabled: widget.enabled,
                readOnly: widget.readOnly,
                maxLines: widget.maxLines,
                minLines: widget.minLines,
                maxLength: widget.maxLength,
                keyboardType: widget.keyboardType,
                textInputAction: widget.textInputAction,
                textCapitalization: widget.textCapitalization,
                inputFormatters: widget.inputFormatters,
                onChanged: widget.onChanged,
                onSubmitted: widget.onSubmitted,
                onTap: widget.onTap,
                autofocus: widget.autofocus,
                style: TextStyle(
                  color: _state == GlassTextFieldState.disabled
                      ? CharlotteColors.textDisabled
                      : CharlotteColors.textPrimary,
                  fontSize: 14,
                ),
                cursorColor: effectiveFocusColor,
                decoration: InputDecoration(
                  hintText: widget.hintText,
                  hintStyle: TextStyle(
                    color: CharlotteColors.textTertiary,
                    fontSize: 14,
                  ),
                  prefixIcon: effectivePrefixIcon,
                  prefixIconConstraints: const BoxConstraints(
                    minWidth: 40,
                    minHeight: 40,
                  ),
                  suffixIcon: effectiveSuffixIcon,
                  suffixIconConstraints: const BoxConstraints(
                    minWidth: 40,
                    minHeight: 40,
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  border: InputBorder.none,
                  counterText: '',
                ),
              ),
            ),
          ),
        ),

        // Helper/Error text
        if (widget.errorText != null || widget.helperText != null) ...[
          const SizedBox(height: 4),
          Text(
            widget.errorText ?? widget.helperText!,
            style: TextStyle(
              color: widget.errorText != null
                  ? effectiveErrorColor
                  : CharlotteColors.textTertiary,
              fontSize: 12,
            ),
          ),
        ],
      ],
    );
  }
}

/// Multiline text area variant
class GlassTextArea extends StatelessWidget {
  final TextEditingController? controller;
  final String? labelText;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final int minLines;
  final int maxLines;
  final int? maxLength;
  final bool enabled;
  final ValueChanged<String>? onChanged;

  const GlassTextArea({
    super.key,
    this.controller,
    this.labelText,
    this.hintText,
    this.helperText,
    this.errorText,
    this.minLines = 3,
    this.maxLines = 6,
    this.maxLength,
    this.enabled = true,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return GlassTextField(
      controller: controller,
      labelText: labelText,
      hintText: hintText,
      helperText: helperText,
      errorText: errorText,
      minLines: minLines,
      maxLines: maxLines,
      maxLength: maxLength,
      enabled: enabled,
      onChanged: onChanged,
      keyboardType: TextInputType.multiline,
    );
  }
}
