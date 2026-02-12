import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';

/// GlassSearchField - Search input field with glassmorphic styling.
class GlassSearchField extends StatefulWidget {
  final TextEditingController? controller;
  final String hintText;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onClear;
  final bool autofocus;
  final bool showClearButton;
  final Widget? leading;
  final Widget? trailing;
  final FocusNode? focusNode;
  final bool enabled;

  const GlassSearchField({
    super.key,
    this.controller,
    this.hintText = 'Search...',
    this.onChanged,
    this.onSubmitted,
    this.onClear,
    this.autofocus = false,
    this.showClearButton = true,
    this.leading,
    this.trailing,
    this.focusNode,
    this.enabled = true,
  });

  @override
  State<GlassSearchField> createState() => _GlassSearchFieldState();
}

class _GlassSearchFieldState extends State<GlassSearchField> {
  late TextEditingController _controller;
  late FocusNode _focusNode;
  bool _isFocused = false;
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TextEditingController();
    _controller.addListener(_onTextChanged);
    _focusNode = widget.focusNode ?? FocusNode();
    _focusNode.addListener(_onFocusChanged);
    _hasText = _controller.text.isNotEmpty;
  }

  @override
  void dispose() {
    _controller.removeListener(_onTextChanged);
    if (widget.controller == null) {
      _controller.dispose();
    }
    _focusNode.removeListener(_onFocusChanged);
    if (widget.focusNode == null) {
      _focusNode.dispose();
    }
    super.dispose();
  }

  void _onTextChanged() {
    final hasText = _controller.text.isNotEmpty;
    if (hasText != _hasText) {
      setState(() => _hasText = hasText);
    }
    widget.onChanged?.call(_controller.text);
  }

  void _onFocusChanged() {
    setState(() => _isFocused = _focusNode.hasFocus);
  }

  void _onClear() {
    _controller.clear();
    widget.onClear?.call();
    _focusNode.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    final borderColor = _isFocused
        ? CharlotteColors.primary
        : CharlotteColors.glassBorder;

    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          decoration: BoxDecoration(
            color: CharlotteColors.glassFill,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: borderColor,
              width: _isFocused ? 2 : 1,
            ),
            boxShadow: _isFocused
                ? [
                    BoxShadow(
                      color: CharlotteColors.primary.withValues(alpha: 0.15),
                      blurRadius: 12,
                      spreadRadius: 1,
                    ),
                  ]
                : null,
          ),
          child: Row(
            children: [
              // Leading icon
              Padding(
                padding: const EdgeInsets.only(left: 16),
                child: widget.leading ??
                    Icon(
                      Icons.search,
                      size: 20,
                      color: _isFocused
                          ? CharlotteColors.primary
                          : CharlotteColors.iconSecondary,
                    ),
              ),

              // Text field
              Expanded(
                child: TextField(
                  controller: _controller,
                  focusNode: _focusNode,
                  autofocus: widget.autofocus,
                  enabled: widget.enabled,
                  onSubmitted: widget.onSubmitted,
                  style: TextStyle(
                    color: CharlotteColors.textPrimary,
                    fontSize: 14,
                  ),
                  cursorColor: CharlotteColors.primary,
                  decoration: InputDecoration(
                    hintText: widget.hintText,
                    hintStyle: TextStyle(
                      color: CharlotteColors.textTertiary,
                      fontSize: 14,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 14,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),

              // Clear button
              if (widget.showClearButton && _hasText)
                GestureDetector(
                  onTap: _onClear,
                  child: Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: CharlotteColors.glassFill,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.close,
                        size: 16,
                        color: CharlotteColors.iconSecondary,
                      ),
                    ),
                  ),
                ),

              // Trailing widget
              if (widget.trailing != null)
                Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: widget.trailing,
                ),

              if (widget.trailing == null && !_hasText)
                const SizedBox(width: 16),
            ],
          ),
        ),
      ),
    );
  }
}

/// Search field with loading state
class GlassSearchFieldWithLoading extends StatelessWidget {
  final TextEditingController? controller;
  final String hintText;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onClear;
  final bool isLoading;
  final bool autofocus;

  const GlassSearchFieldWithLoading({
    super.key,
    this.controller,
    this.hintText = 'Search...',
    this.onChanged,
    this.onSubmitted,
    this.onClear,
    this.isLoading = false,
    this.autofocus = false,
  });

  @override
  Widget build(BuildContext context) {
    return GlassSearchField(
      controller: controller,
      hintText: hintText,
      onChanged: onChanged,
      onSubmitted: onSubmitted,
      onClear: onClear,
      autofocus: autofocus,
      trailing: isLoading
          ? SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: CharlotteColors.primary,
              ),
            )
          : null,
    );
  }
}
