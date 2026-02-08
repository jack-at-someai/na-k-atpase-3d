import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/glass_icon_button.dart';

/// GlassAppBar - Top app bar with glassmorphic styling.
class GlassAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final Widget? titleWidget;
  final Widget? leading;
  final List<Widget>? actions;
  final bool showBackButton;
  final VoidCallback? onBack;
  final bool centerTitle;
  final double elevation;
  final Color? backgroundColor;
  final bool floating;
  final Widget? bottom;

  const GlassAppBar({
    super.key,
    this.title,
    this.titleWidget,
    this.leading,
    this.actions,
    this.showBackButton = false,
    this.onBack,
    this.centerTitle = false,
    this.elevation = 0,
    this.backgroundColor,
    this.floating = false,
    this.bottom,
  });

  @override
  Size get preferredSize => Size.fromHeight(
        kToolbarHeight + (bottom != null ? kTextTabBarHeight : 0),
      );

  @override
  Widget build(BuildContext context) {
    final effectiveBackgroundColor =
        backgroundColor ?? CharlotteColors.surface.withValues(alpha: 0.8);

    Widget? effectiveLeading = leading;
    if (showBackButton && leading == null) {
      effectiveLeading = GlassIconButton(
        icon: Icons.arrow_back,
        onPressed: onBack ?? () => Navigator.of(context).maybePop(),
        tooltip: 'Back',
      );
    }

    Widget titleContent;
    if (titleWidget != null) {
      titleContent = titleWidget!;
    } else if (title != null) {
      titleContent = Text(
        title!,
        style: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: CharlotteColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
      );
    } else {
      titleContent = const SizedBox.shrink();
    }

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          decoration: BoxDecoration(
            color: effectiveBackgroundColor,
            border: Border(
              bottom: BorderSide(
                color: CharlotteColors.glassBorder,
                width: 1,
              ),
            ),
            boxShadow: elevation > 0
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: elevation * 2,
                      offset: Offset(0, elevation),
                    ),
                  ]
                : null,
          ),
          child: SafeArea(
            bottom: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  height: kToolbarHeight,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Row(
                      children: [
                        if (effectiveLeading != null) ...[
                          effectiveLeading,
                          const SizedBox(width: 8),
                        ],
                        if (centerTitle) const Spacer(),
                        Expanded(
                          flex: centerTitle ? 0 : 1,
                          child: titleContent,
                        ),
                        if (centerTitle) const Spacer(),
                        if (actions != null) ...actions!,
                      ],
                    ),
                  ),
                ),
                if (bottom != null) bottom!,
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Large title app bar variant
class GlassLargeAppBar extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? leading;
  final List<Widget>? actions;
  final bool showBackButton;
  final VoidCallback? onBack;
  final Widget? bottom;
  final double expandedHeight;

  const GlassLargeAppBar({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.actions,
    this.showBackButton = false,
    this.onBack,
    this.bottom,
    this.expandedHeight = 120,
  });

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      expandedHeight: expandedHeight,
      floating: false,
      pinned: true,
      backgroundColor: Colors.transparent,
      leading: showBackButton
          ? GlassIconButton(
              icon: Icons.arrow_back,
              onPressed: onBack ?? () => Navigator.of(context).maybePop(),
            )
          : leading,
      actions: actions,
      flexibleSpace: ClipRect(
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
            child: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.only(left: 16, bottom: 16),
              title: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: CharlotteColors.textPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: CharlotteColors.textTertiary,
                          ),
                    ),
                  ],
                ],
              ),
              expandedTitleScale: 1.2,
            ),
          ),
        ),
      ),
      bottom: bottom != null
          ? PreferredSize(
              preferredSize: const Size.fromHeight(kTextTabBarHeight),
              child: bottom!,
            )
          : null,
    );
  }
}
