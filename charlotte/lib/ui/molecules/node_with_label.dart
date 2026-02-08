import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';

/// NodeWithLabel - Combines NodeAtom with a text label.
class NodeWithLabel extends StatelessWidget {
  final String category;
  final String label;
  final double nodeSize;
  final LabelPosition position;
  final int depth;
  final bool isSelected;
  final bool isFocused;
  final VoidCallback? onTap;

  const NodeWithLabel({
    super.key,
    required this.category,
    required this.label,
    this.nodeSize = 64,
    this.position = LabelPosition.below,
    this.depth = 0,
    this.isSelected = false,
    this.isFocused = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final node = NodeAtom(
      category: category,
      size: nodeSize,
      depth: depth,
      isSelected: isSelected,
      isFocused: isFocused,
      onTap: onTap,
    );

    final labelWidget = Text(
      label,
      style: TextStyle(
        color: CharlotteColors.textSecondary,
        fontSize: nodeSize * 0.18,
        fontWeight: FontWeight.w500,
      ),
      textAlign: TextAlign.center,
      overflow: TextOverflow.ellipsis,
    );

    return switch (position) {
      LabelPosition.below => Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            node,
            const SizedBox(height: 8),
            SizedBox(
              width: nodeSize * 1.5,
              child: labelWidget,
            ),
          ],
        ),
      LabelPosition.right => Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            node,
            const SizedBox(width: 12),
            Flexible(child: labelWidget),
          ],
        ),
      LabelPosition.inside => SizedBox(
          width: nodeSize,
          height: nodeSize,
          child: Stack(
            alignment: Alignment.center,
            children: [
              GlassCell(
                size: nodeSize,
                borderRadius: BorderRadius.circular(nodeSize / 2),
                accentColor: CharlotteCategoryColors.forCategory(category),
                isHighlighted: isSelected,
                isFocused: isFocused,
                depth: depth.toDouble(),
                onTap: onTap,
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(8),
                    child: Text(
                      label,
                      style: TextStyle(
                        color: CharlotteColors.white,
                        fontSize: nodeSize * 0.14,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
    };
  }
}
