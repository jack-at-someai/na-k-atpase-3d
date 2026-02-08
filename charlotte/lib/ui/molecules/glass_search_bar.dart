import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/glass_icon_button.dart';
import 'glass_search_field.dart';

/// GlassSearchBar - Expandable search bar with glassmorphic styling.
/// Starts as a button, expands to full search field on tap.
class GlassSearchBar extends StatefulWidget {
  final TextEditingController? controller;
  final String hintText;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onClear;
  final VoidCallback? onExpanded;
  final VoidCallback? onCollapsed;
  final bool initiallyExpanded;
  final double collapsedWidth;
  final double expandedWidth;
  final Duration animationDuration;
  final Widget? leading;
  final List<Widget>? actions;

  const GlassSearchBar({
    super.key,
    this.controller,
    this.hintText = 'Search...',
    this.onChanged,
    this.onSubmitted,
    this.onClear,
    this.onExpanded,
    this.onCollapsed,
    this.initiallyExpanded = false,
    this.collapsedWidth = 48,
    this.expandedWidth = 300,
    this.animationDuration = const Duration(milliseconds: 250),
    this.leading,
    this.actions,
  });

  @override
  State<GlassSearchBar> createState() => _GlassSearchBarState();
}

class _GlassSearchBarState extends State<GlassSearchBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _widthAnimation;
  late TextEditingController _textController;
  late FocusNode _focusNode;
  bool _isExpanded = false;

  @override
  void initState() {
    super.initState();
    _isExpanded = widget.initiallyExpanded;
    _controller = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
      value: _isExpanded ? 1.0 : 0.0,
    );
    _widthAnimation = Tween<double>(
      begin: widget.collapsedWidth,
      end: widget.expandedWidth,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
    _textController = widget.controller ?? TextEditingController();
    _focusNode = FocusNode();
  }

  @override
  void dispose() {
    _controller.dispose();
    if (widget.controller == null) {
      _textController.dispose();
    }
    _focusNode.dispose();
    super.dispose();
  }

  void _expand() {
    setState(() => _isExpanded = true);
    _controller.forward();
    _focusNode.requestFocus();
    widget.onExpanded?.call();
  }

  void _collapse() {
    setState(() => _isExpanded = false);
    _controller.reverse();
    _textController.clear();
    _focusNode.unfocus();
    widget.onCollapsed?.call();
    widget.onClear?.call();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _widthAnimation,
      builder: (context, child) {
        return ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
            child: Container(
              width: _widthAnimation.value,
              height: 48,
              decoration: BoxDecoration(
                color: CharlotteColors.glassFill,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: _isExpanded
                      ? CharlotteColors.primary.withValues(alpha: 0.5)
                      : CharlotteColors.glassBorder,
                  width: 1,
                ),
              ),
              child: _isExpanded ? _buildExpanded() : _buildCollapsed(),
            ),
          ),
        );
      },
    );
  }

  Widget _buildCollapsed() {
    return GestureDetector(
      onTap: _expand,
      behavior: HitTestBehavior.opaque,
      child: Center(
        child: Icon(
          Icons.search,
          size: 24,
          color: CharlotteColors.iconSecondary,
        ),
      ),
    );
  }

  Widget _buildExpanded() {
    return Row(
      children: [
        // Leading / Back button
        GestureDetector(
          onTap: _collapse,
          child: Padding(
            padding: const EdgeInsets.only(left: 12),
            child: Icon(
              Icons.arrow_back,
              size: 20,
              color: CharlotteColors.iconSecondary,
            ),
          ),
        ),

        // Search field
        Expanded(
          child: TextField(
            controller: _textController,
            focusNode: _focusNode,
            onChanged: widget.onChanged,
            onSubmitted: (value) {
              widget.onSubmitted?.call(value);
              if (value.isEmpty) {
                _collapse();
              }
            },
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
        if (_textController.text.isNotEmpty)
          GestureDetector(
            onTap: () {
              _textController.clear();
              widget.onClear?.call();
            },
            child: Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Icon(
                Icons.close,
                size: 20,
                color: CharlotteColors.iconSecondary,
              ),
            ),
          ),
      ],
    );
  }
}

/// Full-width search bar for app bars
class GlassAppBarSearch extends StatelessWidget implements PreferredSizeWidget {
  final TextEditingController? controller;
  final String hintText;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onBack;
  final List<Widget>? actions;
  final bool autofocus;

  const GlassAppBarSearch({
    super.key,
    this.controller,
    this.hintText = 'Search...',
    this.onChanged,
    this.onSubmitted,
    this.onBack,
    this.actions,
    this.autofocus = true,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          decoration: BoxDecoration(
            color: CharlotteColors.surface.withValues(alpha: 0.8),
            border: Border(
              bottom: BorderSide(
                color: CharlotteColors.glassBorder,
                width: 1,
              ),
            ),
          ),
          child: SafeArea(
            bottom: false,
            child: SizedBox(
              height: kToolbarHeight,
              child: Row(
                children: [
                  // Back button
                  GlassIconButton(
                    icon: Icons.arrow_back,
                    onPressed: onBack ?? () => Navigator.of(context).maybePop(),
                  ),

                  // Search field
                  Expanded(
                    child: GlassSearchField(
                      controller: controller,
                      hintText: hintText,
                      onChanged: onChanged,
                      onSubmitted: onSubmitted,
                      autofocus: autofocus,
                      showClearButton: true,
                    ),
                  ),

                  // Actions
                  if (actions != null) ...actions!,

                  const SizedBox(width: 8),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
