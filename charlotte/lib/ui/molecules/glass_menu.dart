import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';

/// Menu item data
class GlassMenuItem {
  final String label;
  final IconData? icon;
  final VoidCallback? onTap;
  final bool isDestructive;
  final bool isDisabled;
  final Widget? trailing;

  const GlassMenuItem({
    required this.label,
    this.icon,
    this.onTap,
    this.isDestructive = false,
    this.isDisabled = false,
    this.trailing,
  });

  /// Creates a divider item
  static const GlassMenuItem divider = GlassMenuItem(label: '__divider__');

  bool get isDivider => label == '__divider__';
}

/// GlassMenu - Dropdown menu with glassmorphic styling.
class GlassMenu extends StatelessWidget {
  final List<GlassMenuItem> items;
  final double minWidth;

  const GlassMenu({
    super.key,
    required this.items,
    this.minWidth = 200,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          constraints: BoxConstraints(minWidth: minWidth),
          decoration: BoxDecoration(
            color: CharlotteColors.surface.withValues(alpha: 0.95),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: CharlotteColors.glassBorder,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.25),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: items.map((item) {
                if (item.isDivider) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Container(
                      height: 1,
                      color: CharlotteColors.glassBorder,
                    ),
                  );
                }
                return _GlassMenuItemWidget(item: item);
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }

  /// Shows a popup menu at anchor position
  static Future<T?> showMenu<T>({
    required BuildContext context,
    required RelativeRect position,
    required List<GlassMenuItem> items,
    double minWidth = 200,
  }) {
    return showDialog<T>(
      context: context,
      barrierColor: Colors.transparent,
      builder: (context) => Stack(
        children: [
          GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            behavior: HitTestBehavior.opaque,
            child: const SizedBox.expand(),
          ),
          Positioned(
            left: position.left,
            top: position.top,
            child: GlassMenu(items: items, minWidth: minWidth),
          ),
        ],
      ),
    );
  }
}

class _GlassMenuItemWidget extends StatefulWidget {
  final GlassMenuItem item;

  const _GlassMenuItemWidget({required this.item});

  @override
  State<_GlassMenuItemWidget> createState() => _GlassMenuItemWidgetState();
}

class _GlassMenuItemWidgetState extends State<_GlassMenuItemWidget> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final isEnabled = !item.isDisabled && item.onTap != null;

    final textColor = item.isDisabled
        ? CharlotteColors.textDisabled
        : (item.isDestructive ? CharlotteColors.error : CharlotteColors.textPrimary);

    final iconColor = item.isDisabled
        ? CharlotteColors.textDisabled
        : (item.isDestructive ? CharlotteColors.error : CharlotteColors.iconSecondary);

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: isEnabled
            ? () {
                Navigator.of(context).pop();
                item.onTap?.call();
              }
            : null,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 100),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          color: _isHovered && isEnabled
              ? CharlotteColors.primary.withValues(alpha: 0.1)
              : Colors.transparent,
          child: Row(
            children: [
              if (item.icon != null) ...[
                Icon(
                  item.icon,
                  size: 20,
                  color: iconColor,
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: Text(
                  item.label,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 14,
                  ),
                ),
              ),
              if (item.trailing != null) ...[
                const SizedBox(width: 12),
                item.trailing!,
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Menu button that shows a menu on tap
class GlassMenuButton extends StatelessWidget {
  final Widget child;
  final List<GlassMenuItem> items;
  final double minWidth;

  const GlassMenuButton({
    super.key,
    required this.child,
    required this.items,
    this.minWidth = 200,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (details) {
        final RenderBox button = context.findRenderObject() as RenderBox;
        final RenderBox overlay =
            Navigator.of(context).overlay!.context.findRenderObject() as RenderBox;
        final RelativeRect position = RelativeRect.fromRect(
          Rect.fromPoints(
            button.localToGlobal(
              Offset(0, button.size.height),
              ancestor: overlay,
            ),
            button.localToGlobal(
              button.size.bottomRight(Offset.zero),
              ancestor: overlay,
            ),
          ),
          Offset.zero & overlay.size,
        );
        GlassMenu.showMenu(
          context: context,
          position: position,
          items: items,
          minWidth: minWidth,
        );
      },
      child: child,
    );
  }
}
