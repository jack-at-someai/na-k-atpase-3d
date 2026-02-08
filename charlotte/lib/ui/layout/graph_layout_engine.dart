import 'dart:math' as math;
import 'dart:ui';

/// Configuration rules for the graph layout engine.
/// Based on GRAPH_RULES.md specification.
class GraphLayoutRules {
  /// B1: Minimum gap between nodes (no vertex overlap)
  final double minNodeDistance;

  /// T11: Target edge length for attraction forces
  final double idealEdgeLength;

  /// B3: Edge clearance from nodes (no vertex-edge overlap)
  final double edgeNodeMargin;

  /// T1: Use hierarchical layout for OWNS relationships
  final bool hierarchicalForOwnership;

  /// T13: Pull high-degree nodes toward center
  final bool centerHighDegreeNodes;

  /// S1: Align temporal nodes (DATE, TIME) on horizontal axis
  final bool alignTemporalNodes;

  /// S5: Cluster nodes by category (radial arrangement)
  final bool clusterByCategory;

  /// Number of force simulation iterations
  final int iterations;

  const GraphLayoutRules({
    this.minNodeDistance = 80,
    this.idealEdgeLength = 120,
    this.edgeNodeMargin = 20,
    this.hierarchicalForOwnership = true,
    this.centerHighDegreeNodes = true,
    this.alignTemporalNodes = true,
    this.clusterByCategory = true,
    this.iterations = 50,
  });

  GraphLayoutRules copyWith({
    double? minNodeDistance,
    double? idealEdgeLength,
    double? edgeNodeMargin,
    bool? hierarchicalForOwnership,
    bool? centerHighDegreeNodes,
    bool? alignTemporalNodes,
    bool? clusterByCategory,
    int? iterations,
  }) {
    return GraphLayoutRules(
      minNodeDistance: minNodeDistance ?? this.minNodeDistance,
      idealEdgeLength: idealEdgeLength ?? this.idealEdgeLength,
      edgeNodeMargin: edgeNodeMargin ?? this.edgeNodeMargin,
      hierarchicalForOwnership: hierarchicalForOwnership ?? this.hierarchicalForOwnership,
      centerHighDegreeNodes: centerHighDegreeNodes ?? this.centerHighDegreeNodes,
      alignTemporalNodes: alignTemporalNodes ?? this.alignTemporalNodes,
      clusterByCategory: clusterByCategory ?? this.clusterByCategory,
      iterations: iterations ?? this.iterations,
    );
  }
}

/// Node data for layout computation
class LayoutNode {
  final String id;
  final String category;
  final double radius;

  const LayoutNode({
    required this.id,
    required this.category,
    this.radius = 32,
  });
}

/// Edge data for layout computation
class LayoutEdge {
  final String from;
  final String to;
  final String edgeType;

  const LayoutEdge({
    required this.from,
    required this.to,
    required this.edgeType,
  });
}

/// Result of layout computation
class GraphLayoutResult {
  final Map<String, Offset> nodePositions;
  final Map<String, Path> edgePaths;

  const GraphLayoutResult({
    required this.nodePositions,
    required this.edgePaths,
  });
}

/// Graph Layout Engine implementing 3-phase layout algorithm.
///
/// Phase 1: Initial Placement (semantic rules S1, S5, S6, T1)
/// Phase 2: Force-Directed Optimization (B1, T11, T13)
/// Phase 3: Edge Routing (B2, B3, T5)
class GraphLayoutEngine {
  final GraphLayoutRules rules;

  const GraphLayoutEngine({this.rules = const GraphLayoutRules()});

  /// Main layout computation
  GraphLayoutResult computeLayout({
    required String focusNodeId,
    required List<LayoutNode> nodes,
    required List<LayoutEdge> edges,
    required Size viewport,
  }) {
    // Phase 1: Initial Placement
    final positions = _initialPlacement(focusNodeId, nodes, edges, viewport);

    // Phase 2: Force-Directed Optimization
    _applyForces(positions, nodes, edges, focusNodeId);

    // Phase 3: Edge Routing
    final edgePaths = _routeEdges(positions, nodes, edges);

    return GraphLayoutResult(
      nodePositions: positions,
      edgePaths: edgePaths,
    );
  }

  /// Phase 1: Initial Placement
  /// Assigns starting positions based on semantic rules.
  Map<String, Offset> _initialPlacement(
    String focusId,
    List<LayoutNode> nodes,
    List<LayoutEdge> edges,
    Size viewport,
  ) {
    final positions = <String, Offset>{};
    final center = Offset(viewport.width / 2, viewport.height / 2);

    // S6: Focus at center
    positions[focusId] = center;

    // S1: DATE nodes on horizontal timeline axis
    if (rules.alignTemporalNodes) {
      final dateNodes = nodes.where((n) =>
        n.category.toUpperCase() == 'DATE' ||
        n.category.toUpperCase() == 'TIME'
      ).toList();

      for (var i = 0; i < dateNodes.length; i++) {
        if (dateNodes[i].id == focusId) continue;
        final x = center.dx + (i - dateNodes.length / 2) * rules.idealEdgeLength;
        positions[dateNodes[i].id] = Offset(x, center.dy);
      }
    }

    // S5: Cluster by category (radial arrangement)
    if (rules.clusterByCategory) {
      final byCategory = <String, List<LayoutNode>>{};
      for (final node in nodes) {
        if (positions.containsKey(node.id)) continue;
        byCategory.putIfAbsent(node.category, () => []).add(node);
      }

      var categoryIndex = 0;
      final categoryCount = byCategory.keys.length;
      if (categoryCount > 0) {
        for (final category in byCategory.keys) {
          final angle = categoryIndex * (2 * math.pi / categoryCount) - math.pi / 2;
          final categoryNodes = byCategory[category]!;

          for (var i = 0; i < categoryNodes.length; i++) {
            final radius = rules.idealEdgeLength * (1 + i * 0.5);
            positions[categoryNodes[i].id] = Offset(
              center.dx + math.cos(angle) * radius,
              center.dy + math.sin(angle) * radius,
            );
          }
          categoryIndex++;
        }
      }
    } else {
      // Simple radial placement for remaining nodes
      final remainingNodes = nodes.where((n) => !positions.containsKey(n.id)).toList();
      for (var i = 0; i < remainingNodes.length; i++) {
        final angle = i * (2 * math.pi / remainingNodes.length) - math.pi / 2;
        positions[remainingNodes[i].id] = Offset(
          center.dx + math.cos(angle) * rules.idealEdgeLength,
          center.dy + math.sin(angle) * rules.idealEdgeLength,
        );
      }
    }

    // T1: Hierarchical layout for OWNS relationships
    if (rules.hierarchicalForOwnership) {
      final ownsEdges = edges.where((e) => e.edgeType.toUpperCase() == 'OWNS').toList();
      for (final edge in ownsEdges) {
        if (positions.containsKey(edge.from) && positions.containsKey(edge.to)) {
          final parentPos = positions[edge.from]!;
          final childPos = positions[edge.to]!;
          // Push child down (positive Y direction) from parent
          final direction = (childPos - parentPos);
          if (direction.distance > 0) {
            // Ensure vertical hierarchy bias
            final adjustedY = childPos.dy < parentPos.dy
                ? parentPos.dy + rules.idealEdgeLength * 0.5
                : childPos.dy;
            positions[edge.to] = Offset(childPos.dx, adjustedY);
          }
        }
      }
    }

    return positions;
  }

  /// Phase 2: Force-Directed Optimization
  /// Applies physics simulation iteratively.
  void _applyForces(
    Map<String, Offset> positions,
    List<LayoutNode> nodes,
    List<LayoutEdge> edges,
    String focusId,
  ) {
    for (var iter = 0; iter < rules.iterations; iter++) {
      final forces = <String, Offset>{};

      // Initialize forces to zero
      for (final node in nodes) {
        forces[node.id] = Offset.zero;
      }

      // B1: Repulsion between all node pairs (no vertex overlap)
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          final n1 = nodes[i];
          final n2 = nodes[j];
          final p1 = positions[n1.id];
          final p2 = positions[n2.id];

          if (p1 == null || p2 == null) continue;

          final delta = p2 - p1;
          final distance = delta.distance;
          final minDist = n1.radius + n2.radius + rules.minNodeDistance;

          if (distance < minDist && distance > 0.1) {
            final repulsion = delta / distance * (minDist - distance) * 0.5;
            forces[n1.id] = forces[n1.id]! - repulsion;
            forces[n2.id] = forces[n2.id]! + repulsion;
          }
        }
      }

      // T11: Attraction along edges (minimize edge length)
      for (final edge in edges) {
        final p1 = positions[edge.from];
        final p2 = positions[edge.to];
        if (p1 == null || p2 == null) continue;

        final delta = p2 - p1;
        final distance = delta.distance;

        if (distance > rules.idealEdgeLength && distance > 0.1) {
          final attraction = delta / distance * (distance - rules.idealEdgeLength) * 0.1;
          forces[edge.from] = forces[edge.from]! + attraction;
          forces[edge.to] = forces[edge.to]! - attraction;
        }
      }

      // T13: Pull high-degree nodes toward center
      if (rules.centerHighDegreeNodes) {
        final focusPos = positions[focusId];
        if (focusPos != null) {
          for (final node in nodes) {
            final degree = edges.where((e) => e.from == node.id || e.to == node.id).length;
            if (degree > 3) {
              final pos = positions[node.id];
              if (pos != null) {
                final toCenter = focusPos - pos;
                forces[node.id] = forces[node.id]! + toCenter * 0.01 * degree.toDouble();
              }
            }
          }
        }
      }

      // Apply forces (but keep focus fixed per S6)
      for (final node in nodes) {
        if (node.id == focusId) continue;
        final currentPos = positions[node.id];
        final force = forces[node.id];
        if (currentPos != null && force != null) {
          positions[node.id] = currentPos + force;
        }
      }
    }
  }

  /// Phase 3: Edge Routing
  /// Computes Bezier paths avoiding nodes.
  Map<String, Path> _routeEdges(
    Map<String, Offset> positions,
    List<LayoutNode> nodes,
    List<LayoutEdge> edges,
  ) {
    final paths = <String, Path>{};

    for (final edge in edges) {
      final start = positions[edge.from];
      final end = positions[edge.to];
      if (start == null || end == null) continue;

      final edgeKey = '${edge.from}->${edge.to}';

      // Check for obstructions (B2, B3)
      final obstructions = nodes.where((n) {
        if (n.id == edge.from || n.id == edge.to) return false;
        final nodePos = positions[n.id];
        if (nodePos == null) return false;
        return _lineIntersectsCircle(
          start,
          end,
          nodePos,
          n.radius + rules.edgeNodeMargin,
        );
      }).toList();

      final path = Path()..moveTo(start.dx, start.dy);

      if (obstructions.isEmpty) {
        // T5: Direct line (prefer straight paths)
        path.lineTo(end.dx, end.dy);
      } else {
        // Route around with quadratic Bezier curve
        final midpoint = (start + end) / 2;
        final perpendicular = Offset(
          -(end.dy - start.dy),
          end.dx - start.dx,
        );

        if (perpendicular.distance > 0.1) {
          final perpNorm = perpendicular / perpendicular.distance;

          // Offset away from first obstruction
          final obstruction = obstructions.first;
          final obstructionPos = positions[obstruction.id]!;
          final toObstruction = obstructionPos - midpoint;
          final dotProduct = toObstruction.dx * perpNorm.dx + toObstruction.dy * perpNorm.dy;
          final sign = dotProduct > 0 ? -1.0 : 1.0;

          final controlPoint = midpoint + perpNorm * sign * (obstruction.radius + rules.edgeNodeMargin + 20);
          path.quadraticBezierTo(controlPoint.dx, controlPoint.dy, end.dx, end.dy);
        } else {
          path.lineTo(end.dx, end.dy);
        }
      }

      paths[edgeKey] = path;
    }

    return paths;
  }

  /// Check if a line segment intersects a circle
  bool _lineIntersectsCircle(Offset lineStart, Offset lineEnd, Offset circleCenter, double radius) {
    final d = lineEnd - lineStart;
    final f = lineStart - circleCenter;

    final a = d.dx * d.dx + d.dy * d.dy;
    final b = 2 * (f.dx * d.dx + f.dy * d.dy);
    final c = f.dx * f.dx + f.dy * f.dy - radius * radius;

    var discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return false;

    discriminant = math.sqrt(discriminant);
    final t1 = (-b - discriminant) / (2 * a);
    final t2 = (-b + discriminant) / (2 * a);

    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
  }
}
