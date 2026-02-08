import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import '../layout/graph_layout_engine.dart';

/// SubgraphView - Core graph visualization organism using the layout engine.
/// Renders nodes and edges with interactive pan, zoom, and selection.
class SubgraphView extends StatefulWidget {
  final String focusNodeId;
  final List<LayoutNode> nodes;
  final List<LayoutEdge> edges;
  final GraphLayoutRules rules;
  final void Function(String nodeId)? onNodeTap;
  final void Function(String nodeId)? onNodeDoubleTap;

  const SubgraphView({
    super.key,
    required this.focusNodeId,
    required this.nodes,
    required this.edges,
    this.rules = const GraphLayoutRules(),
    this.onNodeTap,
    this.onNodeDoubleTap,
  });

  @override
  State<SubgraphView> createState() => _SubgraphViewState();
}

class _SubgraphViewState extends State<SubgraphView> {
  String? _selectedNodeId;
  GraphLayoutResult? _layoutResult;
  final TransformationController _transformationController = TransformationController();

  @override
  void initState() {
    super.initState();
    _computeLayout();
  }

  @override
  void didUpdateWidget(SubgraphView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.focusNodeId != widget.focusNodeId ||
        oldWidget.nodes != widget.nodes ||
        oldWidget.edges != widget.edges ||
        oldWidget.rules != widget.rules) {
      _computeLayout();
    }
  }

  void _computeLayout() {
    final engine = GraphLayoutEngine(rules: widget.rules);
    final result = engine.computeLayout(
      focusNodeId: widget.focusNodeId,
      nodes: widget.nodes,
      edges: widget.edges,
      viewport: const Size(400, 350),
    );
    setState(() {
      _layoutResult = result;
    });
  }

  @override
  void dispose() {
    _transformationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_layoutResult == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return Container(
      decoration: BoxDecoration(
        color: CharlotteColors.surface.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: CharlotteColors.glassBorder),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: InteractiveViewer(
          transformationController: _transformationController,
          boundaryMargin: const EdgeInsets.all(100),
          minScale: 0.5,
          maxScale: 3.0,
          child: SizedBox(
            width: 400,
            height: 350,
            child: Stack(
              children: [
                // Edges layer
                CustomPaint(
                  size: const Size(400, 350),
                  painter: SubgraphEdgePainter(
                    edges: widget.edges,
                    positions: _layoutResult!.nodePositions,
                    edgePaths: _layoutResult!.edgePaths,
                    selectedNodeId: _selectedNodeId,
                  ),
                ),
                // Nodes layer
                ..._buildNodes(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _buildNodes() {
    final widgets = <Widget>[];

    for (final node in widget.nodes) {
      final pos = _layoutResult!.nodePositions[node.id];
      if (pos == null) continue;

      final isSelected = _selectedNodeId == node.id;
      final isFocused = widget.focusNodeId == node.id;

      widgets.add(
        Positioned(
          left: pos.dx - node.radius,
          top: pos.dy - node.radius,
          child: GestureDetector(
            onTap: () {
              setState(() {
                _selectedNodeId = node.id;
              });
              widget.onNodeTap?.call(node.id);
            },
            onDoubleTap: () {
              widget.onNodeDoubleTap?.call(node.id);
            },
            child: NodeAtom(
              category: node.category,
              size: node.radius * 2,
              isSelected: isSelected,
              isFocused: isFocused,
              depth: isFocused ? 0 : 1,
            ),
          ),
        ),
      );
    }

    return widgets;
  }
}

/// Edge painter for SubgraphView
class SubgraphEdgePainter extends CustomPainter {
  final List<LayoutEdge> edges;
  final Map<String, Offset> positions;
  final Map<String, Path> edgePaths;
  final String? selectedNodeId;

  SubgraphEdgePainter({
    required this.edges,
    required this.positions,
    required this.edgePaths,
    this.selectedNodeId,
  });

  @override
  void paint(Canvas canvas, Size size) {
    for (final edge in edges) {
      final edgeKey = '${edge.from}->${edge.to}';
      final path = edgePaths[edgeKey];
      if (path == null) continue;

      final isConnectedToSelected =
          selectedNodeId != null &&
          (edge.from == selectedNodeId || edge.to == selectedNodeId);

      final paint = Paint()
        ..color = _edgeColor(edge.edgeType).withValues(
          alpha: isConnectedToSelected ? 1.0 : 0.6,
        )
        ..strokeWidth = isConnectedToSelected ? 3.0 : 2.0
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round;

      if (_isDashed(edge.edgeType)) {
        _drawDashedPath(canvas, path, paint);
      } else {
        canvas.drawPath(path, paint);
      }
    }
  }

  void _drawDashedPath(Canvas canvas, Path path, Paint paint) {
    const dashLength = 6.0;
    const gapLength = 4.0;

    final metrics = path.computeMetrics();
    for (final metric in metrics) {
      double distance = 0;
      bool draw = true;

      while (distance < metric.length) {
        final segmentLength = draw ? dashLength : gapLength;
        final nextDistance = (distance + segmentLength).clamp(0.0, metric.length);

        if (draw) {
          final extractedPath = metric.extractPath(distance, nextDistance);
          canvas.drawPath(extractedPath, paint);
        }

        distance = nextDistance;
        draw = !draw;
      }
    }
  }

  Color _edgeColor(String type) {
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

  bool _isDashed(String type) {
    return switch (type.toUpperCase()) {
      'TRACKS' || 'SIRED_BY' || 'DAM_OF' => true,
      _ => false,
    };
  }

  @override
  bool shouldRepaint(SubgraphEdgePainter oldDelegate) {
    return positions != oldDelegate.positions ||
        edgePaths != oldDelegate.edgePaths ||
        selectedNodeId != oldDelegate.selectedNodeId;
  }
}
