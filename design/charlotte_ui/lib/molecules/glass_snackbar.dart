import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../atoms/types.dart';

/// GlassSnackbar - Toast notification with glassmorphic styling.
class GlassSnackbar extends StatelessWidget {
  final String message;
  final String? actionLabel;
  final VoidCallback? onAction;
  final VoidCallback? onDismiss;
  final IconData? leadingIcon;
  final Color? iconColor;
  final Duration duration;
  final bool showCloseButton;

  const GlassSnackbar({
    super.key,
    required this.message,
    this.actionLabel,
    this.onAction,
    this.onDismiss,
    this.leadingIcon,
    this.iconColor,
    this.duration = const Duration(seconds: 4),
    this.showCloseButton = false,
  });

  /// Creates a success snackbar
  factory GlassSnackbar.success({
    Key? key,
    required String message,
    String? actionLabel,
    VoidCallback? onAction,
    VoidCallback? onDismiss,
  }) {
    return GlassSnackbar(
      key: key,
      message: message,
      actionLabel: actionLabel,
      onAction: onAction,
      onDismiss: onDismiss,
      leadingIcon: Icons.check_circle_outline,
      iconColor: CharlotteColors.success,
    );
  }

  /// Creates an error snackbar
  factory GlassSnackbar.error({
    Key? key,
    required String message,
    String? actionLabel,
    VoidCallback? onAction,
    VoidCallback? onDismiss,
  }) {
    return GlassSnackbar(
      key: key,
      message: message,
      actionLabel: actionLabel,
      onAction: onAction,
      onDismiss: onDismiss,
      leadingIcon: Icons.error_outline,
      iconColor: CharlotteColors.error,
    );
  }

  /// Creates a warning snackbar
  factory GlassSnackbar.warning({
    Key? key,
    required String message,
    String? actionLabel,
    VoidCallback? onAction,
    VoidCallback? onDismiss,
  }) {
    return GlassSnackbar(
      key: key,
      message: message,
      actionLabel: actionLabel,
      onAction: onAction,
      onDismiss: onDismiss,
      leadingIcon: Icons.warning_amber_outlined,
      iconColor: CharlotteColors.highlight,
    );
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: CharlotteColors.surface.withValues(alpha: 0.9),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: CharlotteColors.glassBorder,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (leadingIcon != null) ...[
                Icon(
                  leadingIcon,
                  size: 20,
                  color: iconColor ?? CharlotteColors.iconPrimary,
                ),
                const SizedBox(width: 12),
              ],
              Flexible(
                child: Text(
                  message,
                  style: TextStyle(
                    color: CharlotteColors.textPrimary,
                    fontSize: 14,
                  ),
                ),
              ),
              if (actionLabel != null) ...[
                const SizedBox(width: 12),
                GestureDetector(
                  onTap: onAction,
                  child: Text(
                    actionLabel!,
                    style: TextStyle(
                      color: CharlotteColors.primary,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
              if (showCloseButton) ...[
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: onDismiss,
                  child: Icon(
                    Icons.close,
                    size: 18,
                    color: CharlotteColors.iconTertiary,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  /// Shows the snackbar using a scaffold messenger
  static void show(
    BuildContext context, {
    required String message,
    String? actionLabel,
    VoidCallback? onAction,
    IconData? leadingIcon,
    Color? iconColor,
    Duration duration = const Duration(seconds: 4),
    GlassSnackbarPosition position = GlassSnackbarPosition.bottom,
  }) {
    final snackBar = SnackBar(
      content: GlassSnackbar(
        message: message,
        actionLabel: actionLabel,
        onAction: () {
          ScaffoldMessenger.of(context).hideCurrentSnackBar();
          onAction?.call();
        },
        leadingIcon: leadingIcon,
        iconColor: iconColor,
      ),
      backgroundColor: Colors.transparent,
      elevation: 0,
      behavior: SnackBarBehavior.floating,
      duration: duration,
      margin: EdgeInsets.only(
        bottom: position == GlassSnackbarPosition.top
            ? MediaQuery.of(context).size.height - 120
            : 16,
        left: 16,
        right: 16,
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  /// Shows a success snackbar
  static void showSuccess(BuildContext context, String message) {
    show(
      context,
      message: message,
      leadingIcon: Icons.check_circle_outline,
      iconColor: CharlotteColors.success,
    );
  }

  /// Shows an error snackbar
  static void showError(BuildContext context, String message) {
    show(
      context,
      message: message,
      leadingIcon: Icons.error_outline,
      iconColor: CharlotteColors.error,
    );
  }
}
