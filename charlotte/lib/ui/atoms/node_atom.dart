import 'package:flutter/material.dart';

import '../../theme.dart';

/// NodeAtom - Circle representing any NODE in the graph.
/// Color derived from category, visual states for selection/focus.
class NodeAtom extends StatelessWidget {
  final String category;
  final double size;
  final int depth;
  final bool isSelected;
  final bool isFocused;
  final VoidCallback? onTap;

  const NodeAtom({
    super.key,
    required this.category,
    this.size = 64,
    this.depth = 0,
    this.isSelected = false,
    this.isFocused = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = CharlotteCategoryColors.forCategory(category);
    final label = category.length > 4 ? category.substring(0, 4) : category;

    return GlassCell(
      size: size,
      borderRadius: BorderRadius.circular(size / 2),
      accentColor: color,
      isHighlighted: isSelected,
      isFocused: isFocused,
      depth: depth.toDouble(),
      onTap: onTap,
      child: Center(
        child: Text(
          label.toUpperCase(),
          style: TextStyle(
            color: CharlotteColors.white,
            fontSize: size * 0.18,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
