import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import '../molecules/molecules.dart';
import 'types.dart';

/// HexRing - Radial node arrangement for MILO's hex navigation.
class HexRing extends StatelessWidget {
  final int ring;
  final List<HexNode> nodes;
  final double ringRadius;
  final String? focusNodeId;
  final void Function(String nodeId)? onNodeTap;

  const HexRing({
    super.key,
    required this.ring,
    required this.nodes,
    this.ringRadius = 100,
    this.focusNodeId,
    this.onNodeTap,
  });

  @override
  Widget build(BuildContext context) {
    // Ring 0: single node at center
    // Ring 1: 6 nodes
    // Ring 2: 12 nodes
    // etc.

    final size = ring == 0 ? ringRadius : ringRadius * (ring + 1) * 2;

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: _buildNodes(size),
      ),
    );
  }

  List<Widget> _buildNodes(double containerSize) {
    final widgets = <Widget>[];
    final center = Offset(containerSize / 2, containerSize / 2);

    if (ring == 0) {
      // Center node
      if (nodes.isNotEmpty) {
        final node = nodes.first;
        final isFocused = focusNodeId == node.id;
        widgets.add(
          Positioned(
            left: center.dx - 32,
            top: center.dy - 32,
            child: GestureDetector(
              onTap: () => onNodeTap?.call(node.id),
              child: Container(
                decoration: isFocused
                    ? BoxDecoration(
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: CharlotteCategoryColors.forCategory(node.category)
                                .withValues(alpha: 0.5),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      )
                    : null,
                child: NodeWithLabel(
                  category: node.category,
                  label: node.label ?? node.id,
                  nodeSize: 64,
                  position: LabelPosition.below,
                  isFocused: isFocused,
                ),
              ),
            ),
          ),
        );
      }
    } else {
      // Nodes in ring - positioned using hex grid math
      final nodesInRing = ring == 1 ? 6 : ring * 6;
      final angleStep = 2 * math.pi / nodesInRing;
      final actualRadius = ringRadius * ring;

      for (var i = 0; i < nodes.length && i < nodesInRing; i++) {
        final node = nodes[i];
        final angle = (node.position * angleStep) - math.pi / 2;
        final x = center.dx + math.cos(angle) * actualRadius - 24;
        final y = center.dy + math.sin(angle) * actualRadius - 24;
        final isFocused = focusNodeId == node.id;

        widgets.add(
          Positioned(
            left: x,
            top: y,
            child: GestureDetector(
              onTap: () => onNodeTap?.call(node.id),
              child: Container(
                decoration: isFocused
                    ? BoxDecoration(
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: CharlotteCategoryColors.forCategory(node.category)
                                .withValues(alpha: 0.5),
                            blurRadius: 16,
                            spreadRadius: 4,
                          ),
                        ],
                      )
                    : null,
                child: NodeWithLabel(
                  category: node.category,
                  label: node.label ?? '',
                  nodeSize: 48,
                  position: LabelPosition.below,
                  isFocused: isFocused,
                  depth: ring,
                ),
              ),
            ),
          ),
        );
      }
    }

    return widgets;
  }
}
