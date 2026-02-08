import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import '../molecules/molecules.dart';
import 'types.dart';

/// LighthouseView - Node detail with radiating edges (DORI's lighthouse).
class LighthouseView extends StatelessWidget {
  final String nodeId;
  final String nodeCategory;
  final String nodeLabel;
  final List<LighthouseEdge> edges;
  final List<MetricLaneData>? metrics;

  const LighthouseView({
    super.key,
    required this.nodeId,
    required this.nodeCategory,
    required this.nodeLabel,
    required this.edges,
    this.metrics,
  });

  @override
  Widget build(BuildContext context) {
    // Group edges by type
    final edgesByType = <String, List<LighthouseEdge>>{};
    for (final edge in edges) {
      edgesByType.putIfAbsent(edge.edgeType, () => []).add(edge);
    }

    return GlassContainer(
      intensity: GlassIntensity.subtle,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Hero node at top
          NodeAtom(
            category: nodeCategory,
            size: 80,
            isFocused: true,
            depth: 0,
          ),
          const SizedBox(height: 8),
          Text(
            nodeCategory,
            style: TextStyle(
              color: CharlotteColors.textTertiary,
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            nodeLabel,
            style: TextStyle(
              color: CharlotteColors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),

          // Edge rays grouped by type
          ...edgesByType.entries.map((entry) => _buildEdgeGroup(entry.key, entry.value)),

          // Optional metrics section
          if (metrics != null && metrics!.isNotEmpty) ...[
            const SizedBox(height: 16),
            Divider(color: CharlotteColors.glassBorder),
            const SizedBox(height: 16),
            Text(
              'METRICS',
              style: TextStyle(
                color: CharlotteColors.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w500,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 12),
            ...metrics!.map((metric) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: MetricLane(
                metricLabel: metric.label,
                valueType: metric.valueType,
                signals: metric.signals,
                isExpanded: metric.isExpanded,
              ),
            )),
          ],
        ],
      ),
    );
  }

  Widget _buildEdgeGroup(String edgeType, List<LighthouseEdge> groupEdges) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            edgeType.replaceAll('_', ' '),
            style: TextStyle(
              color: CharlotteColors.textTertiary,
              fontSize: 10,
              fontWeight: FontWeight.w500,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 12,
            runSpacing: 8,
            children: groupEdges.map((edge) => _buildEdgeRay(edge, edgeType)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildEdgeRay(LighthouseEdge edge, String edgeType) {
    final edgeColor = _edgeColorFor(edgeType);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Edge line
        Container(
          width: 24,
          height: 2,
          decoration: BoxDecoration(
            color: edgeColor,
            borderRadius: BorderRadius.circular(1),
          ),
        ),
        const SizedBox(width: 4),
        // Arrow indicator
        Icon(
          edge.isIncoming ? Icons.arrow_back : Icons.arrow_forward,
          size: 12,
          color: edgeColor,
        ),
        const SizedBox(width: 4),
        // Target node
        NodeWithLabel(
          category: edge.targetCategory,
          label: edge.targetLabel,
          nodeSize: 36,
          position: LabelPosition.right,
          depth: 1,
        ),
      ],
    );
  }

  Color _edgeColorFor(String type) {
    return switch (type.toUpperCase()) {
      'OWNS' => const Color(0xFF2196F3),
      'MEMBER_OF' => const Color(0xFF4CAF50),
      'TRACKS' => const Color(0xFF009688),
      'SIRED_BY' => const Color(0xFFE91E63),
      'DAM_OF' => const Color(0xFFE91E63),
      'NEXT' => const Color(0xFF9E9E9E),
      'LOCATED_IN' => const Color(0xFFFF9800),
      _ => CharlotteColors.grey,
    };
  }
}
