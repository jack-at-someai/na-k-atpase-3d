# Blender Visualization — Next Session

> Dive line for tomorrow's work.

---

## 1. Dataset Ingestion

Export and visualize real datasets that strain the convex hull of Charlotte's ingestion model:

- **Livestock (Sounder)** — Trogdon test data: 1,174 nodes, 10,045 signals, 1,919 edges
- **Industrial (ISG)** — Machine lifecycles, predictive distribution across 16+ brands
- **Human (LineLeap)** — Event trajectories, spending patterns
- **Cultural (Prier Violins)** — Artifact provenance chains spanning centuries

Each dataset exercises different graph densities, temporal scales, and edge patterns.
The Big Bang visualization should absorb real FACT data and render it — category-colored
nodes, typed edges, temporal spine as a visible axis.

---

## 2. Atomic Design System → Blender Migration (1:1)

Every atom from `docs/ATOMIC_DESIGN.md` needs a Blender equivalent. The Flutter glass
design system must translate into 3D emissive materials and geometry.

### Atoms

| Flutter Atom | Blender Object | Material | Notes |
|--------------|---------------|----------|-------|
| **NodeAtom** | Ico sphere | Emissive, category-color mapped via `CharlotteCategoryColors` | Size scales with depth/importance. Variants: compact (small sphere), standard (sphere + label), hero (large, glow corona) |
| **EdgeAtom** | Bezier curve + bevel | Emissive, edge-type color (OWNS=blue, MEMBER_OF=green, TRACKS=teal dashed, SIRED_BY/DAM_OF=pink, NEXT=grey, LOCATED_IN=orange) | Dashed types need segmented geometry or shader. Directed edges get cone arrowheads |
| **MetricAtom** | Billboard plane or 3D badge | Emissive icon + label text | Type-based icons: number, boolean, score, status, event, date, currency, text |
| **SignalAtom** | Varies by value_type | See signal shapes below | Positioned on temporal spine by :CREATED date |
| **ProtocolAtom** | Diamond mesh (octahedron squished) | 3 states: pending=wireframe, completed=solid teal, missed=solid red | 32px → scaled equivalent in 3D |
| **LabelAtom** | Text object or texture billboard | Emissive text, always camera-facing | Styles: nodeLabel, edgeLabel, metricLabel, value |
| **TimeMarkerAtom** | Vertical plane/flag on temporal spine | DATE:M-d-yyyy label, glow if isToday | Dot indicator if hasSignals |

### Signal Shapes (by valueType)

| Type | 3D Shape | Behavior |
|------|----------|----------|
| NUMBER | Sphere, radius proportional to value | Size encodes magnitude |
| BOOLEAN | Sphere (filled=true) / wireframe (false) | Binary visual |
| SCORE | Arc/ring segment, colored red→yellow→green | Gauge in 3D |
| STATUS | Pill/capsule with text texture | Badge floating near node |
| EVENT | Thin vertical cylinder (impulse) | Pulse animation on appear |
| DATE | Flag mesh on temporal spine | Marker |
| CURRENCY | Sphere with $ texture/overlay | Dollar indicator |
| TEXT | Document icon mesh | Reveals on proximity/hover |

### Molecules

| Flutter Molecule | Blender Assembly |
|-----------------|-----------------|
| **NodeWithLabel** | Ico sphere + camera-facing text object |
| **SignalOnTrack** | Signal shape positioned along temporal curve |
| **MetricLane** | Horizontal glass track (translucent plane) with signal objects |
| **ProtocolCheckpoint** | Diamond + date flag + connecting wire |
| **NodeCluster** | Grouped spheres with shared bounding volume |

### Organisms

| Flutter Organism | Blender Assembly |
|-----------------|-----------------|
| **SubgraphView** | Full node+edge layout with force-directed positioning |
| **TimelineLane** | MetricLanes stacked vertically along temporal spine |
| **CalendarDay** | Grid cell plane with signal dot instances |
| **ProtocolItinerary** | Connected diamonds as 3D journey path |
| **LighthouseView** | Central hero node + radiating edges downward |
| **HexRing** | Radial ring of nodes at fixed radius |

### Color System (from theme.dart)

```
Primary (Purple):  #7200CB → emission strength 20-30
Secondary (Magenta): #F000D2 → emission strength 15-25
Tertiary (Teal):   #21D6C6 → emission strength 15-25
Error (Red):       #CE4F51 → emission strength 15-20
Background:        #232324 → world color (near black)
Surface:           #2D2B2E → translucent glass planes

Category palette: 14 colors (pink→deep orange) mapped to node categories
Status palette: 10 colors mapped to protocol/signal states
```

### Glass Morphism in 3D

| Flutter Glass Level | Blender Equivalent |
|--------------------|-------------------|
| Subtle (blur 12, fill 5%) | Principled BSDF: transmission 0.95, roughness 0.3 |
| Standard (blur 24, fill 10%) | Principled BSDF: transmission 0.90, roughness 0.2 |
| Frosted (blur 40, fill 15%) | Principled BSDF: transmission 0.85, roughness 0.15 |
| Deep (blur 60, fill 25%) | Principled BSDF: transmission 0.75, roughness 0.1 |

---

## 3. Immediate Next Steps

1. Build a `charlotte_materials.py` module — all category colors, edge type colors, glass levels as reusable Blender materials
2. Build `fact_loader.py` — reads exported FACT JSON and creates typed Blender objects
3. Build `graph_layout_3d.py` — force-directed 3D layout following GRAPH_RULES.md constraints
4. Wire real data into the Big Bang animation — nodes spawn by category, edges by type, temporal spine as Z or X axis
5. Test with each convex hull dataset at different scales
