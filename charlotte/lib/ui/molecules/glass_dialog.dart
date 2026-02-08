import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/types.dart';
import 'glass_filled_button.dart';
import 'glass_text_button.dart';

/// GlassDialog - Modal dialog with glassmorphic styling.
class GlassDialog extends StatelessWidget {
  final String? title;
  final Widget? content;
  final String? contentText;
  final List<Widget>? actions;
  final IconData? icon;
  final Color? iconColor;
  final GlassDialogSize size;
  final bool dismissible;

  const GlassDialog({
    super.key,
    this.title,
    this.content,
    this.contentText,
    this.actions,
    this.icon,
    this.iconColor,
    this.size = GlassDialogSize.medium,
    this.dismissible = true,
  });

  double get _maxWidth {
    return switch (size) {
      GlassDialogSize.small => 280,
      GlassDialogSize.medium => 360,
      GlassDialogSize.large => 480,
      GlassDialogSize.fullscreen => double.infinity,
    };
  }

  @override
  Widget build(BuildContext context) {
    final effectiveIconColor = iconColor ?? CharlotteColors.primary;

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: size == GlassDialogSize.fullscreen
          ? EdgeInsets.zero
          : const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: ClipRRect(
        borderRadius: size == GlassDialogSize.fullscreen
            ? BorderRadius.zero
            : BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 30, sigmaY: 30),
          child: Container(
            constraints: BoxConstraints(
              maxWidth: _maxWidth,
            ),
            decoration: BoxDecoration(
              color: CharlotteColors.surface.withValues(alpha: 0.92),
              borderRadius: size == GlassDialogSize.fullscreen
                  ? BorderRadius.zero
                  : BorderRadius.circular(20),
              border: Border.all(
                color: CharlotteColors.glassBorder,
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.3),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: size == GlassDialogSize.fullscreen
                  ? MainAxisSize.max
                  : MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header
                if (icon != null || title != null)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                    child: Column(
                      children: [
                        if (icon != null) ...[
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: effectiveIconColor.withValues(alpha: 0.15),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              icon,
                              size: 24,
                              color: effectiveIconColor,
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],
                        if (title != null)
                          Text(
                            title!,
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  color: CharlotteColors.textPrimary,
                                  fontWeight: FontWeight.w600,
                                ),
                            textAlign: TextAlign.center,
                          ),
                      ],
                    ),
                  ),

                // Content
                if (content != null || contentText != null)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
                    child: content ??
                        Text(
                          contentText!,
                          style: TextStyle(
                            color: CharlotteColors.textSecondary,
                            fontSize: 14,
                            height: 1.5,
                          ),
                          textAlign: TextAlign.center,
                        ),
                  ),

                // Actions
                if (actions != null && actions!.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        for (int i = 0; i < actions!.length; i++) ...[
                          if (i > 0) const SizedBox(width: 8),
                          actions![i],
                        ],
                      ],
                    ),
                  )
                else
                  const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Shows a simple alert dialog
  static Future<void> showAlert(
    BuildContext context, {
    required String title,
    required String message,
    String confirmLabel = 'OK',
    IconData? icon,
    Color? iconColor,
  }) {
    return showDialog(
      context: context,
      builder: (context) => GlassDialog(
        title: title,
        contentText: message,
        icon: icon,
        iconColor: iconColor,
        actions: [
          GlassFilledButton(
            label: confirmLabel,
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  /// Shows a confirmation dialog
  static Future<bool?> showConfirm(
    BuildContext context, {
    required String title,
    required String message,
    String confirmLabel = 'Confirm',
    String cancelLabel = 'Cancel',
    IconData? icon,
    Color? iconColor,
    bool destructive = false,
  }) {
    return showDialog<bool>(
      context: context,
      builder: (context) => GlassDialog(
        title: title,
        contentText: message,
        icon: icon,
        iconColor: iconColor ?? (destructive ? CharlotteColors.error : null),
        actions: [
          GlassTextButton(
            label: cancelLabel,
            onPressed: () => Navigator.of(context).pop(false),
          ),
          GlassFilledButton(
            label: confirmLabel,
            color: destructive ? CharlotteColors.error : null,
            onPressed: () => Navigator.of(context).pop(true),
          ),
        ],
      ),
    );
  }

  /// Shows a dialog with custom content
  static Future<T?> showCustom<T>(
    BuildContext context, {
    String? title,
    required Widget content,
    List<Widget>? actions,
    IconData? icon,
    Color? iconColor,
    GlassDialogSize size = GlassDialogSize.medium,
    bool dismissible = true,
  }) {
    return showDialog<T>(
      context: context,
      barrierDismissible: dismissible,
      builder: (context) => GlassDialog(
        title: title,
        content: content,
        icon: icon,
        iconColor: iconColor,
        actions: actions,
        size: size,
        dismissible: dismissible,
      ),
    );
  }
}

/// Bottom sheet variant with glassmorphic styling
class GlassBottomSheet extends StatelessWidget {
  final Widget child;
  final String? title;
  final bool showDragHandle;
  final double? height;

  const GlassBottomSheet({
    super.key,
    required this.child,
    this.title,
    this.showDragHandle = true,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 30, sigmaY: 30),
        child: Container(
          height: height,
          decoration: BoxDecoration(
            color: CharlotteColors.surface.withValues(alpha: 0.95),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            border: Border.all(
              color: CharlotteColors.glassBorder,
              width: 1,
            ),
          ),
          child: Column(
            mainAxisSize: height == null ? MainAxisSize.min : MainAxisSize.max,
            children: [
              if (showDragHandle)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: CharlotteColors.glassBorder,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              if (title != null)
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
                  child: Text(
                    title!,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: CharlotteColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                ),
              Flexible(child: child),
            ],
          ),
        ),
      ),
    );
  }

  /// Shows a bottom sheet
  static Future<T?> show<T>(
    BuildContext context, {
    required Widget child,
    String? title,
    bool showDragHandle = true,
    double? height,
    bool isDismissible = true,
    bool enableDrag = true,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      backgroundColor: Colors.transparent,
      isDismissible: isDismissible,
      enableDrag: enableDrag,
      isScrollControlled: height != null,
      builder: (context) => GlassBottomSheet(
        title: title,
        showDragHandle: showDragHandle,
        height: height,
        child: child,
      ),
    );
  }
}
