# Graph Visualization Rules

> Constraints for the layout engine. Derived from `docs/artifacts/IMAGE_GRAPH_VISUALIZATION_RULES.png`.

---

## Rule Categories

### 1. Basic Rules (Hard Constraints)

These MUST be satisfied. Violations make the graph unreadable.

| # | Rule | Description | Implementation |
|---|------|-------------|----------------|
| B1 | **No vertex overlap** | Node circles must not intersect | `minDistance(n1, n2) >= r1 + r2 + padding` |
| B2 | **No edge overlap** | Edge lines must not cross each other | Minimize crossings, use Bezier routing |
| B3 | **No vertex-edge overlap** | Edges must not pass through nodes | Route edges around node bounding boxes |

---

### 2. Semantic Rules (Category-Based)

Applied based on node/edge properties. Soft constraints that improve clarity.

| # | Rule | When | Implementation |
|---|------|------|----------------|
| S1 | **Align on straight line** | Temporal nodes (DATE, TIME) | Place DATE nodes on horizontal axis |
| S2 | **Align on curve** | Protocol checkpoints | Arc layout for checkpoint sequence |
| S3 | **Size by importance** | High-degree nodes | `size = baseSize + log(degree) * scale` |
| S4 | **Boundary placement** | Structural nodes (CITY, STATE) | Place at graph periphery |
| S5 | **Cluster nearby** | Same category | Group SOWs together, BOARs together |
| S6 | **Center placement** | Focus node | Always at (0, 0) |

---

### 3. Structural Rules (Layout Quality)

Optimization goals that improve overall graph aesthetics.

| # | Rule | Goal | Weight |
|---|------|------|--------|
| T1 | **Hierarchical layout** | Tree-like for ownership (OWNS edges) | High |
| T2 | **Minimize edge crossings** | Fewer crossings = clearer graph | Critical |
| T3 | **Balance length and breadth** | Aspect ratio near golden ratio | Medium |
| T4 | **Symmetrical layout** | Mirror isomorphic subgraphs | Medium |
| T5 | **Minimize edge bends** | Prefer straight or single-curve | Low |
| T6 | **Convex faces** | Polygon faces should be convex | Low |
| T7 | **Symmetric children** | Siblings equidistant from parent | High |
| T8 | **Avoid outline crossings** | Cluster boundaries shouldn't intersect | Medium |
| T9 | **Uniform placement** | Equal spacing when possible | Low |
| T10 | **Minimize drawing area** | Compact layout | Medium |
| T11 | **Minimize total edge length** | Short edges when possible | Medium |
| T12 | **Uniform vertex sizes** | Similar sizes unless semantic rule applies | Low |
| T13 | **Central hub placement** | High-degree nodes toward center | High |
| T14 | **Identical isomorphic subgraphs** | Same structure = same layout | High |
| T15 | **Minimize average edge length** | Overall compactness | Medium |

---

## Rule Application by Context

### MILO (Hex Navigation)

Primary rules for radial hex layout:

| Priority | Rules |
|----------|-------|
| Must | B1, B2, B3 (no overlaps) |
| High | S6 (focus at center), T13 (hubs central) |
| Medium | S5 (category clustering), T7 (symmetric children) |
| Low | T9 (uniform spacing) |

### DORI (Lighthouse View)

Primary rules for node detail radiation:

| Priority | Rules |
|----------|-------|
| Must | B1, B3 (no overlaps) |
| High | T1 (hierarchical), T7 (symmetric children) |
| Medium | S3 (size by importance) |
| Low | T5 (minimize bends) |

### SQUIRT (Timeline)

Primary rules for signal lanes:

| Priority | Rules |
|----------|-------|
| Must | B1 (no signal overlap) |
| High | S1 (time alignment), T9 (uniform spacing) |
| Medium | S3 (size by value magnitude) |

### CAL (Calendar)

Primary rules for calendar grid:

| Priority | Rules |
|----------|-------|
| Must | B1 (no day overlap) |
| High | T9 (uniform grid), S1 (temporal alignment) |

---

## Layout Engine Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GraphLayoutEngine                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   PHASE 1   │───▶│   PHASE 2   │───▶│   PHASE 3   │     │
│  │   Initial   │    │   Force     │    │   Refine    │     │
│  │  Placement  │    │  Directed   │    │   & Route   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  Apply:            Apply:              Apply:               │
│  - S6 (focus)      - B1 (repulsion)    - B2 (edge routing) │
│  - S1 (time axis)  - T11 (attraction)  - B3 (avoid nodes)  │
│  - S5 (clusters)   - T2 (crossing min) - T5 (straighten)   │
│  - T1 (hierarchy)  - T13 (hub center)  - Edge Beziers      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1: Initial Placement

Assign starting positions based on semantic rules:

```dart
Map<String, Offset> initialPlacement(List<NodeFact> nodes, NodeFact focus) {
  final positions = <String, Offset>{};

  // S6: Focus at center
  positions[focus.id] = Offset.zero;

  // S1: DATE nodes on timeline axis
  final dateNodes = nodes.where((n) => n.category == 'DATE');
  for (final (i, node) in dateNodes.indexed) {
    positions[node.id] = Offset(i * spacing, 0);
  }

  // S5: Cluster by category
  final byCategory = groupBy(nodes, (n) => n.category);
  for (final (catIndex, category) in byCategory.keys.indexed) {
    final angle = catIndex * (2 * pi / byCategory.length);
    for (final (nodeIndex, node) in byCategory[category]!.indexed) {
      final radius = baseRadius + nodeIndex * ringSpacing;
      positions[node.id] = Offset(
        cos(angle) * radius,
        sin(angle) * radius,
      );
    }
  }

  return positions;
}
```

### Phase 2: Force-Directed Optimization

Apply physics simulation:

```dart
void forceDirectedIteration(
  Map<String, Offset> positions,
  List<EdgeFact> edges,
  List<NodeFact> nodes,
) {
  final forces = <String, Offset>{};

  // B1: Repulsion between all nodes (no overlap)
  for (final n1 in nodes) {
    for (final n2 in nodes) {
      if (n1.id == n2.id) continue;
      final delta = positions[n2.id]! - positions[n1.id]!;
      final distance = delta.distance;
      if (distance < minDistance) {
        final repulsion = delta.normalized * (minDistance - distance);
        forces[n1.id] = (forces[n1.id] ?? Offset.zero) - repulsion;
        forces[n2.id] = (forces[n2.id] ?? Offset.zero) + repulsion;
      }
    }
  }

  // T11: Attraction along edges (minimize edge length)
  for (final edge in edges) {
    final p1 = positions[edge.from]!;
    final p2 = positions[edge.to]!;
    final delta = p2 - p1;
    final distance = delta.distance;
    if (distance > idealEdgeLength) {
      final attraction = delta.normalized * (distance - idealEdgeLength) * 0.1;
      forces[edge.from] = (forces[edge.from] ?? Offset.zero) + attraction;
      forces[edge.to] = (forces[edge.to] ?? Offset.zero) - attraction;
    }
  }

  // T13: Pull high-degree nodes toward center
  for (final node in nodes) {
    final degree = edges.where((e) => e.from == node.id || e.to == node.id).length;
    if (degree > 3) {
      final pos = positions[node.id]!;
      final centerPull = -pos * 0.01 * degree;
      forces[node.id] = (forces[node.id] ?? Offset.zero) + centerPull;
    }
  }

  // Apply forces
  for (final node in nodes) {
    if (node.id == focusId) continue; // S6: Focus stays fixed
    positions[node.id] = positions[node.id]! + (forces[node.id] ?? Offset.zero);
  }
}
```

### Phase 3: Edge Routing

Compute Bezier paths avoiding nodes:

```dart
Path routeEdge(
  Offset start,
  Offset end,
  List<Rect> nodeBounds,
) {
  final path = Path()..moveTo(start.dx, start.dy);

  // Check for obstructions
  final obstructions = nodeBounds.where((r) =>
    lineIntersectsRect(start, end, r)
  ).toList();

  if (obstructions.isEmpty) {
    // B3 satisfied: direct line
    path.lineTo(end.dx, end.dy);
  } else {
    // Route around obstructions with Bezier
    final midpoint = (start + end) / 2;
    final perpendicular = Offset(
      -(end.dy - start.dy),
      end.dx - start.dx,
    ).normalized;

    // Offset control point away from obstructions
    final controlOffset = perpendicular * curveOffset;
    final control = midpoint + controlOffset;

    path.quadraticBezierTo(control.dx, control.dy, end.dx, end.dy);
  }

  return path;
}
```

---

## Edge Crossing Minimization (T2)

The most complex rule. Use layer-by-layer sweep for hierarchical layouts:

```dart
int countCrossings(List<EdgeFact> edges, Map<String, Offset> positions) {
  int crossings = 0;
  for (int i = 0; i < edges.length; i++) {
    for (int j = i + 1; j < edges.length; j++) {
      if (edgesCross(edges[i], edges[j], positions)) {
        crossings++;
      }
    }
  }
  return crossings;
}

bool edgesCross(EdgeFact e1, EdgeFact e2, Map<String, Offset> positions) {
  // Line segment intersection test
  final p1 = positions[e1.from]!;
  final p2 = positions[e1.to]!;
  final p3 = positions[e2.from]!;
  final p4 = positions[e2.to]!;

  return segmentsIntersect(p1, p2, p3, p4);
}
```

---

## Category-Specific Styling

```dart
class GraphStyle {
  // Node sizes by category
  static double nodeSizeFor(String category, int degree) {
    final base = switch (category) {
      'DATE' => 24.0,
      'TIME' => 16.0,
      'CITY' || 'STATE' || 'COUNTRY' => 32.0,
      _ => 40.0,
    };
    return base + log(degree + 1) * 4; // S3: size by importance
  }

  // Edge styles by type
  static EdgeStyle edgeStyleFor(String edgeType) {
    return switch (edgeType) {
      'OWNS' => EdgeStyle(color: blue, width: 2, dashed: false),
      'MEMBER_OF' => EdgeStyle(color: green, width: 1.5, dashed: false),
      'TRACKS' => EdgeStyle(color: teal, width: 1, dashed: true),
      'SIRED_BY' || 'DAM_OF' => EdgeStyle(color: pink, width: 1, dashed: true),
      'NEXT' => EdgeStyle(color: gray, width: 0.5, dashed: false),
      'LOCATED_IN' => EdgeStyle(color: orange, width: 1, dashed: false),
      _ => EdgeStyle(color: gray, width: 1, dashed: false),
    };
  }
}
```

---

*Document maintained by CHARLOTTE. Last updated: 2026-02-05*
