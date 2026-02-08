# Charlotte Atomic Design System

> FACTs rendered as atoms. Graphs assembled by rules.

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Hierarchy](#hierarchy)
3. [Atoms](#atoms)
4. [Molecules](#molecules)
5. [Organisms](#organisms)
6. [Graph Layout Rules](#graph-layout-rules)
7. [Widget Portfolio](#widget-portfolio)
8. [Implementation Path](#implementation-path)

---

## Philosophy

Charlotte's UI is a **direct visual encoding of the FACT substrate**. Every visual element maps to a FACT type:

| FACT Type | Visual Atom | Purpose |
|-----------|-------------|---------|
| NODE | `NodeAtom` | Identity marker |
| EDGE | `EdgeAtom` | Relationship line |
| METRIC | `MetricAtom` | Measurement definition |
| SIGNAL | `SignalAtom` | Observed value point |
| PROTOCOL | `ProtocolAtom` | Checkpoint/forecast marker |

The graph layout engine assembles atoms into molecules and organisms following **academic graph visualization rules** (see `docs/artifacts/IMAGE_GRAPH_VISUALIZATION_RULES.png`).

---

## Hierarchy

```
ATOMS (indivisible)
  │
  ├─ NodeAtom         ← NODE
  ├─ EdgeAtom         ← EDGE
  ├─ MetricAtom       ← METRIC
  ├─ SignalAtom       ← SIGNAL
  ├─ ProtocolAtom     ← PROTOCOL
  ├─ LabelAtom        ← Text rendering
  └─ TimeMarkerAtom   ← DATE/TIME nodes

MOLECULES (atom combinations)
  │
  ├─ NodeWithLabel    ← NodeAtom + LabelAtom
  ├─ EdgeWithArrow    ← EdgeAtom + directional indicator
  ├─ SignalOnTrack    ← SignalAtom positioned on time axis
  ├─ MetricLane       ← MetricAtom + timeline track
  ├─ ProtocolCheckpoint ← ProtocolAtom + date marker
  └─ NodeCluster      ← Multiple NodeAtoms grouped

ORGANISMS (functional units)
  │
  ├─ SubgraphView     ← Nodes + Edges with layout
  ├─ TimelineLane     ← MetricLane + SignalAtoms
  ├─ CalendarDay      ← Grid cell with signal dots
  ├─ ProtocolItinerary ← Checkpoints as journey
  ├─ LighthouseView   ← Node + radiating edges
  └─ HexRing          ← Radial node arrangement
```

---

## Atoms

### NodeAtom

The fundamental identity marker. Represents any NODE in the graph.

```dart
class NodeAtom extends StatelessWidget {
  final String id;           // NODE :ID
  final String category;     // P0 (SOW, BOAR, DATE, CITY, etc.)
  final double size;         // Diameter
  final int depth;           // Ring distance (0 = focused)
  final bool isSelected;
  final bool isFocused;
  final VoidCallback? onTap;
}
```

**Visual properties:**
- Circle or hexagon shape
- Color derived from category (`CharlotteCategoryColors.forCategory`)
- Size scales with importance/depth
- Glow when focused
- Border when selected

**Variants:**
- `NodeAtom.compact` - Dot only, no internal content
- `NodeAtom.standard` - Icon/initial inside
- `NodeAtom.hero` - Large, detailed, for lighthouse view

---

### EdgeAtom

The relationship line. Connects two NodeAtoms.

```dart
class EdgeAtom extends StatelessWidget {
  final Offset start;        // From node center
  final Offset end;          // To node center
  final String edgeType;     // P2 (OWNS, TRACKS, MEMBER_OF, etc.)
  final bool isDirected;     // Show arrow?
  final bool isSelected;
  final double curvature;    // 0 = straight, 1 = max curve
}
```

**Visual properties:**
- Color and style from edge type (see theme.dart)
- Dashed for some types (SIRED_BY, TRACKS)
- Arrow at target for directed edges
- Curved to avoid node overlap

**Edge type styles:**
| Type | Color | Style |
|------|-------|-------|
| `OWNS` | Blue | Solid |
| `MEMBER_OF` | Green | Solid |
| `TRACKS` | Teal | Dashed |
| `SIRED_BY` | Pink | Dashed |
| `DAM_OF` | Pink | Dashed |
| `NEXT` | Gray | Thin |
| `LOCATED_IN` | Orange | Solid |

---

### MetricAtom

The measurement type indicator.

```dart
class MetricAtom extends StatelessWidget {
  final String id;           // METRIC :ID
  final String label;        // P2
  final String valueType;    // P1 (NUMBER, STRING, BOOLEAN, etc.)
  final bool isActive;       // Currently being tracked
}
```

**Visual properties:**
- Icon indicating value type (📊 number, ✓ boolean, 📝 text, etc.)
- Label text
- Subtle background when active

---

### SignalAtom

The observation point. A single recorded value.

```dart
class SignalAtom extends StatelessWidget {
  final String id;           // SIGNAL :ID
  final dynamic value;       // P2
  final String valueType;    // From parent metric
  final DateTime timestamp;  // From :CREATED
  final bool isFromProtocol; // P3 present?
  final SignalState state;   // normal, highlighted, dimmed
}
```

**Visual properties by valueType:**

| Type | Atom Shape |
|------|------------|
| `NUMBER` | Filled circle, size = relative value |
| `BOOLEAN` | Filled (true) or hollow (false) circle |
| `SCORE` | Colored segment (red→yellow→green) |
| `STATUS` | Colored chip with status text |
| `EVENT` | Vertical impulse line |
| `DATE` | Flag marker |
| `CURRENCY` | Circle with $ indicator |
| `TEXT` | Note icon, reveals on hover |

---

### ProtocolAtom

The checkpoint/forecast marker.

```dart
class ProtocolAtom extends StatelessWidget {
  final String id;           // PROTOCOL :ID
  final DateTime targetDate; // From P1.target_date
  final dynamic targetValue; // Expected value
  final ProtocolState state; // pending, completed, missed
}
```

**Visual properties:**
- Diamond or flag shape
- Hollow when pending, filled when completed
- Red when missed
- Connected by thin line to related signals

---

### LabelAtom

Text rendering with consistent styling.

```dart
class LabelAtom extends StatelessWidget {
  final String text;
  final LabelStyle style;    // nodeLabel, edgeLabel, metricLabel, value
  final Color? color;
  final TextAlign align;
}
```

---

### TimeMarkerAtom

Special node for DATE and TIME references.

```dart
class TimeMarkerAtom extends StatelessWidget {
  final String dateId;       // DATE:M-d-yyyy
  final bool isToday;
  final bool hasSignals;     // Dot indicator
}
```

---

## Molecules

### NodeWithLabel

```dart
class NodeWithLabel extends StatelessWidget {
  final NodeFact node;
  final String? displayLabel; // From SIGNAL → METRIC:name
  final LabelPosition position; // below, right, inside
}
```

Combines `NodeAtom` + `LabelAtom`. The label comes from querying the most recent SIGNAL on METRIC:name for that node.

---

### SignalOnTrack

```dart
class SignalOnTrack extends StatelessWidget {
  final SignalFact signal;
  final double xPosition;     // Normalized 0-1 on track
  final double trackHeight;
}
```

Positions a `SignalAtom` within a timeline track based on its `:CREATED` date.

---

### MetricLane

```dart
class MetricLane extends StatelessWidget {
  final MetricFact metric;
  final List<SignalFact> signals;
  final DateRange visibleRange;
  final bool isExpanded;
}
```

The "swimming lane" - a `MetricAtom` label + horizontal track with `SignalAtom`s positioned by time.

---

### ProtocolCheckpoint

```dart
class ProtocolCheckpoint extends StatelessWidget {
  final Map<String, dynamic> checkpoint; // From PROTOCOL P1.checkpoints[]
  final bool isCompleted;
  final SignalFact? actualSignal;
}
```

Renders a single checkpoint from a protocol with its expected vs actual state.

---

### NodeCluster

```dart
class NodeCluster extends StatelessWidget {
  final List<NodeFact> nodes;
  final ClusterLayout layout; // grid, radial, stack
  final double maxSize;
}
```

Groups multiple nodes when they'd otherwise overlap.

---

## Organisms

### SubgraphView

The core graph visualization organism.

```dart
class SubgraphView extends StatelessWidget {
  final NodeFact focusNode;
  final List<EdgeFact> edges;
  final List<NodeFact> connectedNodes;
  final GraphLayoutRules rules;
  final int maxDepth;
}
```

Uses the `GraphLayoutEngine` to position nodes and edges following the rules.

---

### TimelineLane

```dart
class TimelineLane extends StatelessWidget {
  final NodeFact node;
  final List<MetricFact> metrics;
  final Map<String, List<SignalFact>> signalsByMetric;
  final DateRange range;
}
```

Multiple `MetricLane`s stacked vertically for a single node.

---

### CalendarDay

```dart
class CalendarDay extends StatelessWidget {
  final DateTime date;
  final List<SignalFact> signals;
  final List<ProtocolCheckpoint> expectedSignals;
  final bool isToday;
  final bool isSelected;
}
```

A single calendar cell with signal/protocol indicators.

---

### ProtocolItinerary

```dart
class ProtocolItinerary extends StatelessWidget {
  final ProtocolFact protocol;
  final List<SignalFact> recordedSignals;
}
```

Visualizes a protocol as a journey with checkpoints. Reference: `docs/artifacts/IMAGE_VISION_STORYBOARD.svg`

---

### LighthouseView

```dart
class LighthouseView extends StatelessWidget {
  final NodeFact node;
  final List<EdgeFact> edges;
  final Map<String, NodeFact> connectedNodes;
}
```

The node detail "lighthouse" - node at top, edges radiating downward.

---

### HexRing

```dart
class HexRing extends StatelessWidget {
  final int ring;           // 0 = center, 1 = first ring, etc.
  final List<NodeFact> nodes;
  final double ringRadius;
}
```

Positions nodes in a hexagonal ring for MILO's navigation.

---

## Graph Layout Rules

From `docs/artifacts/IMAGE_GRAPH_VISUALIZATION_RULES.png`, encoded as constraints for `GraphLayoutEngine`:

### Basic Rules (Hard Constraints - Must Satisfy)

| Rule | Implementation |
|------|----------------|
| **No vertex overlap** | Minimum distance between node centers |
| **No edge overlap** | Edge routing with Bezier curves |
| **No vertex-edge overlap** | Edge paths avoid node bounding boxes |

### Semantic Rules (Soft Constraints - Based on Node Properties)

| Rule | When Applied |
|------|--------------|
| **Align on straight line** | DATE nodes on timeline axis |
| **Align on curve** | Protocol checkpoints on arc |
| **Size by importance** | High-degree nodes larger |
| **Boundary placement** | CITY/STATE nodes at periphery |
| **Cluster nearby** | Same-category nodes grouped |
| **Center placement** | Focused node at origin |

### Structural Rules (Layout Algorithm Choices)

| Rule | Application |
|------|-------------|
| **Hierarchical layout** | OWNS relationships (tree) |
| **Minimize edge crossings** | Force-directed adjustment |
| **Symmetrical layout** | Sibling nodes (same parent) |
| **Minimize edge bends** | Prefer straight/single-curve |
| **Central hub placement** | High-degree nodes toward center |
| **Uniform placement** | Equal spacing where possible |
| **Minimize total edge length** | Bring connected nodes closer |

### GraphLayoutEngine

```dart
class GraphLayoutEngine {
  final GraphLayoutRules rules;

  /// Compute positions for all nodes
  Map<String, Offset> computeLayout({
    required NodeFact focus,
    required List<EdgeFact> edges,
    required List<NodeFact> nodes,
    required Size viewport,
  });

  /// Compute edge paths (avoiding overlaps)
  Map<String, Path> computeEdgePaths({
    required Map<String, Offset> nodePositions,
    required List<EdgeFact> edges,
  });
}

class GraphLayoutRules {
  final double minNodeDistance;
  final double edgeNodeMargin;
  final bool hierarchicalForOwnership;
  final bool centerHighDegreeNodes;
  final bool alignTemporalNodes;
  // ... other rule toggles
}
```

---

## Widget Portfolio

The Design System Screen becomes a **widget portfolio** for testing each atom in isolation.

### Portfolio Structure

```
lib/ui/
├── atoms/
│   ├── node_atom.dart
│   ├── edge_atom.dart
│   ├── metric_atom.dart
│   ├── signal_atom.dart
│   ├── protocol_atom.dart
│   ├── label_atom.dart
│   └── time_marker_atom.dart
│
├── molecules/
│   ├── node_with_label.dart
│   ├── signal_on_track.dart
│   ├── metric_lane.dart
│   ├── protocol_checkpoint.dart
│   └── node_cluster.dart
│
├── organisms/
│   ├── subgraph_view.dart
│   ├── timeline_lane.dart
│   ├── calendar_day.dart
│   ├── protocol_itinerary.dart
│   ├── lighthouse_view.dart
│   └── hex_ring.dart
│
└── screens/
    └── design_system_screen.dart  # Portfolio viewer
```

### Portfolio Tabs

| Tab | Contents |
|-----|----------|
| **Atoms** | All atoms with property controls |
| **Molecules** | Atom combinations with mock data |
| **Organisms** | Full functional units |
| **Graph Rules** | Layout engine demos |
| **Personas** | Full mock scenarios |

### Property Controls

Each atom/molecule should have adjustable properties:

```dart
// In design_system_screen.dart
Widget _buildNodeAtomDemo() {
  return Column(
    children: [
      // The atom
      NodeAtom(
        id: 'demo',
        category: _selectedCategory,
        size: _nodeSize,
        depth: _depth,
        isSelected: _isSelected,
        isFocused: _isFocused,
      ),
      // Property controls
      Slider(value: _nodeSize, onChanged: ...),
      DropdownButton(value: _selectedCategory, ...),
      Switch(value: _isSelected, ...),
    ],
  );
}
```

---

## Implementation Path

### Phase 1: Atoms (Week 1)

Build and test each atom in isolation:

1. **NodeAtom** - Core identity, test all category colors
2. **EdgeAtom** - Test all edge types, curves, arrows
3. **LabelAtom** - All label styles
4. **SignalAtom** - All value types (NUMBER, BOOLEAN, STATUS, etc.)
5. **MetricAtom** - All metric types
6. **ProtocolAtom** - All states (pending, completed, missed)
7. **TimeMarkerAtom** - Date display, today indicator

**Deliverable:** All atoms visible in portfolio with property controls.

### Phase 2: Molecules (Week 2)

Combine atoms into functional units:

1. **NodeWithLabel** - Node + name signal lookup
2. **SignalOnTrack** - Signal positioned on timeline
3. **MetricLane** - Full swimming lane
4. **ProtocolCheckpoint** - Checkpoint visualization
5. **NodeCluster** - Grouped nodes

**Deliverable:** All molecules visible with mock FACTs.

### Phase 3: Layout Engine (Week 3)

Implement graph layout rules:

1. **Basic constraint solver** - No overlaps
2. **Force-directed base** - Spring physics
3. **Semantic rule layer** - Category-based adjustments
4. **Edge routing** - Bezier paths avoiding nodes

**Deliverable:** Interactive layout demo in portfolio.

### Phase 4: Organisms (Week 4)

Assemble full functional units:

1. **SubgraphView** - Core graph viz with layout engine
2. **TimelineLane** - SQUIRT's swimming lanes
3. **CalendarDay** - CAL's calendar cells
4. **ProtocolItinerary** - Journey visualization
5. **LighthouseView** - DORI's node detail
6. **HexRing** - MILO's radial navigation

**Deliverable:** All organisms working with mock data.

### Phase 5: Integration (Week 5)

Connect organisms to mode screens:

1. Wire `SubgraphView` → MILO's node_mode
2. Wire `TimelineLane` → SQUIRT's timeline_mode
3. Wire `CalendarDay` → CAL's calendar_mode
4. Wire `LighthouseView` → DORI's node_detail
5. Wire protocol views → NEMO's upcoming_mode

**Deliverable:** All modes rendering with mock FACTs.

---

## Testing Checklist

For each atom/molecule/organism:

- [ ] Renders correctly with minimal props
- [ ] Handles all variants (category, type, state)
- [ ] Responds to selection/focus
- [ ] Animates state changes smoothly
- [ ] Works at different sizes
- [ ] Accessible (contrast, touch targets)
- [ ] Matches glass theme

---

*Document maintained by CHARLOTTE. Last updated: 2026-02-05*
