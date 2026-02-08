import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';

/// Drawer item data
class GlassDrawerItem {
  final IconData? icon;
  final String label;
  final VoidCallback? onTap;
  final bool isSelected;
  final Widget? trailing;

  const GlassDrawerItem({
    this.icon,
    required this.label,
    this.onTap,
    this.isSelected = false,
    this.trailing,
  });

  /// Creates a divider item
  static const GlassDrawerItem divider = GlassDrawerItem(label: '__divider__');

  /// Creates a header item
  static GlassDrawerItem header(String label) =>
      GlassDrawerItem(label: '__header__$label');

  bool get isDivider => label == '__divider__';
  bool get isHeader => label.startsWith('__header__');
  String get headerLabel => label.replaceFirst('__header__', '');
}

/// GlassDrawer - Navigation drawer with glassmorphic styling.
class GlassDrawer extends StatelessWidget {
  final Widget? header;
  final List<GlassDrawerItem> items;
  final Widget? footer;
  final double width;

  const GlassDrawer({
    super.key,
    this.header,
    required this.items,
    this.footer,
    this.width = 304,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 30, sigmaY: 30),
        child: Container(
          width: width,
          decoration: BoxDecoration(
            color: CharlotteColors.surface.withValues(alpha: 0.95),
            border: Border(
              right: BorderSide(
                color: CharlotteColors.glassBorder,
                width: 1,
              ),
            ),
          ),
          child: SafeArea(
            child: Column(
              children: [
                // Header
                if (header != null)
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: header,
                  ),

                // Items
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      final item = items[index];

                      if (item.isDivider) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          child: Container(
                            height: 1,
                            color: CharlotteColors.glassBorder,
                          ),
                        );
                      }

                      if (item.isHeader) {
                        return Padding(
                          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                          child: Text(
                            item.headerLabel,
                            style: TextStyle(
                              color: CharlotteColors.textTertiary,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
                            ),
                          ),
                        );
                      }

                      return _DrawerItemWidget(item: item);
                    },
                  ),
                ),

                // Footer
                if (footer != null)
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: footer,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _DrawerItemWidget extends StatefulWidget {
  final GlassDrawerItem item;

  const _DrawerItemWidget({required this.item});

  @override
  State<_DrawerItemWidget> createState() => _DrawerItemWidgetState();
}

class _DrawerItemWidgetState extends State<_DrawerItemWidget> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final isEnabled = item.onTap != null;

    final iconColor = item.isSelected
        ? CharlotteColors.primary
        : CharlotteColors.iconSecondary;
    final labelColor = item.isSelected
        ? CharlotteColors.primary
        : CharlotteColors.textPrimary;
    final bgColor = item.isSelected
        ? CharlotteColors.primary.withValues(alpha: 0.15)
        : (_isHovered && isEnabled
            ? CharlotteColors.primary.withValues(alpha: 0.08)
            : Colors.transparent);

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: item.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          margin: const EdgeInsets.symmetric(vertical: 2),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(28),
          ),
          child: Row(
            children: [
              if (item.icon != null) ...[
                Icon(
                  item.icon,
                  size: 24,
                  color: iconColor,
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: Text(
                  item.label,
                  style: TextStyle(
                    color: labelColor,
                    fontSize: 14,
                    fontWeight:
                        item.isSelected ? FontWeight.w600 : FontWeight.w500,
                  ),
                ),
              ),
              if (item.trailing != null) item.trailing!,
            ],
          ),
        ),
      ),
    );
  }
}

/// Drawer header with avatar and account info
class GlassDrawerHeader extends StatelessWidget {
  final Widget? avatar;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;

  const GlassDrawerHeader({
    super.key,
    this.avatar,
    required this.title,
    this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: CharlotteColors.glassFill,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: CharlotteColors.glassBorder,
            width: 1,
          ),
        ),
        child: Row(
          children: [
            if (avatar != null) ...[
              avatar!,
              const SizedBox(width: 16),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: CharlotteColors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: TextStyle(
                        color: CharlotteColors.textTertiary,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            if (onTap != null)
              Icon(
                Icons.unfold_more,
                color: CharlotteColors.iconTertiary,
                size: 20,
              ),
          ],
        ),
      ),
    );
  }
}
