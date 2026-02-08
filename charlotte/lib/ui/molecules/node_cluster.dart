import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';

/// NodeCluster - Groups multiple nodes with different layout options.
class NodeCluster extends StatelessWidget {
  final List<String> categories;
  final ClusterLayout layout;
  final double maxSize;
  final int depth;
  final VoidCallback? onTap;

  const NodeCluster({
    super.key,
    required this.categories,
    this.layout = ClusterLayout.stack,
    this.maxSize = 80,
    this.depth = 0,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final count = categories.length;
    if (count == 0) return const SizedBox();

    return GestureDetector(
      onTap: onTap,
      child: switch (layout) {
        ClusterLayout.stack => _buildStack(count),
        ClusterLayout.grid => _buildGrid(count),
        ClusterLayout.radial => _buildRadial(count),
      },
    );
  }

  Widget _buildStack(int count) {
    final nodeSize = maxSize * 0.6;
    final offset = nodeSize * 0.25;

    return SizedBox(
      width: maxSize + offset * (count - 1).clamp(0, 3),
      height: maxSize,
      child: Stack(
        alignment: Alignment.center,
        children: [
          for (int i = 0; i < count.clamp(0, 4); i++)
            Positioned(
              left: i * offset,
              child: NodeAtom(
                category: categories[i],
                size: nodeSize,
                depth: depth + i,
              ),
            ),
          // Count badge
          if (count > 1)
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: CharlotteColors.primary,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: CharlotteColors.background, width: 2),
                ),
                child: Text(
                  '$count',
                  style: TextStyle(
                    color: CharlotteColors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildGrid(int count) {
    final nodeSize = maxSize * 0.45;
    final displayCount = count.clamp(0, 4);

    return SizedBox(
      width: maxSize,
      height: maxSize,
      child: Stack(
        children: [
          // 2x2 grid
          for (int i = 0; i < displayCount; i++)
            Positioned(
              left: (i % 2) * (maxSize - nodeSize),
              top: (i ~/ 2) * (maxSize - nodeSize),
              child: NodeAtom(
                category: categories[i],
                size: nodeSize,
                depth: depth,
              ),
            ),
          // Count badge
          if (count > 1)
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: CharlotteColors.primary,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: CharlotteColors.background, width: 2),
                ),
                child: Text(
                  '$count',
                  style: TextStyle(
                    color: CharlotteColors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildRadial(int count) {
    final centerSize = maxSize * 0.4;
    final orbitSize = maxSize * 0.28;
    final orbitRadius = maxSize * 0.35;
    final displayCount = count.clamp(0, 6);

    return SizedBox(
      width: maxSize,
      height: maxSize,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Center node (first category or primary)
          NodeAtom(
            category: categories.isNotEmpty ? categories[0] : 'NODE',
            size: centerSize,
            depth: depth,
          ),
          // Orbiting nodes
          for (int i = 1; i < displayCount; i++)
            Builder(
              builder: (context) {
                final angle = (i - 1) * (2 * math.pi / (displayCount - 1)) - math.pi / 2;
                final x = orbitRadius * math.cos(angle);
                final y = orbitRadius * math.sin(angle);
                return Transform.translate(
                  offset: Offset(x, y),
                  child: NodeAtom(
                    category: categories[i],
                    size: orbitSize,
                    depth: depth + 1,
                  ),
                );
              },
            ),
          // Count badge
          if (count > 1)
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: CharlotteColors.primary,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: CharlotteColors.background, width: 2),
                ),
                child: Text(
                  '$count',
                  style: TextStyle(
                    color: CharlotteColors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
