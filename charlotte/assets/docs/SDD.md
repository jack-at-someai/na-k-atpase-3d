# Charlotte OS — Software Design Document

**Version:** 1.0
**Date:** February 16, 2026
**Author:** SomeAI

---

## 1. System Architecture

Charlotte OS is a four-layer system:

```
┌──────────────────────────────────────────────────┐
│  FLUTTER CLIENT                                   │
│  charlotte_ui (47 glassmorphic components)        │
│  Firebase (Auth, Firestore, Functions, Messaging) │
├──────────────────────────────────────────────────┤
│  DESIGN SYSTEM                                    │
│  Liquid Glass CSS/JS + Token Compilation          │
│  Per-brand theming via tokens.json → .css/.dart   │
├──────────────────────────────────────────────────┤
│  BOOT IMAGE (KRF)                                 │
│  31 files of first-order logic                    │
│  Kernel → Knowledge → Spine → Agent → Reference   │
├──────────────────────────────────────────────────┤
│  NERVOUS SYSTEM (Planned)                         │
│  Pi 5 Hub → MQTT Mesh → Satellite Sensors         │
│  Physical signals → Charlotte SIGNAL primitives   │
└──────────────────────────────────────────────────┘
```

Each layer is independently versioned and deployable. The boot image is the kernel — it defines what Charlotte *is*. The client renders it. The design system skins it. The nervous system feeds it.

---

## 2. The Two-Layer Split

The five primitives separate into two architecturally distinct layers:

```
ONTOLOGICAL LAYER          VALUATION LAYER
─────────────────          ────────────────────────
NODE   EDGE                METRIC → SIGNAL → PROTOCOL
"What exists"              "What it means"
Graph-traversable          Serial pipeline
Objective                  Observer-dependent
Shared truth               Perspectival judgment
```

**Why this matters:** Most KG implementations conflate these. They encode "DXP Enterprises has revenue $1.8B" as a triple and attempt to derive meaning through graph traversal. Charlotte decomposes it:

| Primitive | Value | Layer |
|-----------|-------|-------|
| NODE | DXPEnterprises | Ontological |
| EDGE | (competitorOf DXP ISG) | Ontological |
| METRIC | annualRevenue = 1800 | Valuation |
| SIGNAL | revenueExceedsISGBy6x | Valuation |
| PROTOCOL | avoidHeadToHeadInLargeAcct | Valuation |

The first two live in the graph. The last three live in the valuation pipeline — on top of the graph, not inside it.

### Layer Properties

**Ontological Layer:**
- Graph topology: nodes and edges
- Supports standard traversal, shortest path, centrality, clustering
- Facts are verifiable and shared across all observers
- "DXP has 228 locations" is true regardless of who reads it

**Valuation Layer:**
- Serial pipeline: METRIC → SIGNAL → PROTOCOL
- Not graph traversal — signal processing
- Observer-dependent: different observers place different signals
- "DXP is a VERY HIGH threat" is a judgment scoped to a microtheory

---

## 3. The Dive Line

Every PROTOCOL traces deterministically back to the graph entities that produced it:

```
PROTOCOL: avoidHeadToHeadInLargeAcct
    ↑ hasTrigger
SIGNAL: revenueExceedsISGBy6x
    ↑ derivedFrom
METRIC: annualRevenue on DXPEnterprises
    ↑ attachedTo
NODE: DXPEnterprises
```

This chain is enforced at the type level:

```krf
(implies (and (isa ?P PROTOCOL) (hasTrigger ?P ?S)) (isa ?S SIGNAL))
(implies (and (isa ?S SIGNAL) (derivedFrom ?S ?M)) (isa ?M METRIC))
(implies (and (isa ?M METRIC) (attachedTo ?M ?N)) (isa ?N NODE))
```

The `valuationChain` predicate captures the complete trace:

```krf
(valuationChain ?protocol ?signal ?metric ?node)
```

If you cannot produce the chain, the protocol has no grounding and should not fire.

---

## 4. Microtheory Model

Charlotte uses microtheories (inherited from CycL) to scope truth. A fact is true *within a context*.

### Microtheory Hierarchy

```
CharlotteBootMt
  └── CharlotteKernelMt
        ├── CharlotteStructuralMt
        ├── CharlotteDeclarativeMt
        ├── CharlotteProceduralMt
        ├── CharlotteHeuristicMt
        ├── CharlotteMetaMt
        ├── CharlotteTemporalMt
        ├── CharlotteSpatialMt
        └── CharlotteAgentMt
```

Inheritance flows upward via `genlMt`: a child microtheory inherits all facts from its parent. Domain-specific microtheories extend the kernel:

```krf
(genlMt ISGDomainMt CharlotteKernelMt)
(genlMt SounderDomainMt CharlotteKernelMt)
```

### Why Microtheories Matter

Different observers can have different facts about the same entity. ISG's analyst places "DXP is a VERY HIGH threat." DXP's analyst places "ISG is a minor competitor." Both are valid — within their respective microtheories. The graph (NODE + EDGE) is shared truth in the kernel Mt. The valuation (METRIC + SIGNAL + PROTOCOL) is scoped to the observer's Mt.

---

## 5. Temporal Spine

Charlotte's primary axis is time. The temporal spine is a hierarchical structure from epoch to millisecond.

### Unit Hierarchy

```
Epoch (2048 years)
  └── Era (256 years, 8 per epoch)
        └── Century (100 years)
              └── Decade (10 years)
                    └── Year (365.25 days)
                          ├── Quarter (4 per year)
                          └── Month (12 per year)
                                └── Week (7 days)
                                      └── Day (24 hours)
                                            └── Hour (60 min)
                                                  └── Minute (60 sec)
                                                        └── Second (1000 ms)
                                                              └── Millisecond
```

### Epoch System

- 1 Epoch = 2048 years
- Epoch 0 begins at Unix epoch (1970), ends 4018
- Epoch -1: 78 BC to 1970 AD

At every epoch boundary, the system:
1. **Snapshots** the entire graph state
2. **Compresses** it into a context summary
3. **Hashes** the summary (blockchain-style)
4. **Anchors** the hash at index 0 of the next epoch

Depth of unraveling = depth of memory. Each level adds 2048 years of accessible history.

### CT Scan Metaphor

Time is stored as CT scans of space: each temporal slice is a cross-section of the entire spatial state at that moment. Every temporal coordinate has a corresponding spatial slice.

### Temporal Coordinates

A fully-qualified position: `Epoch-0 / Era-7 / Century-20 / Decade-2 / Year-2026 / Month-2 / Day-16`

The observer zooms along this hierarchy — from millisecond-level signal inspection to epoch-level historical analysis.

---

## 6. Spatial Spine

Charlotte operates across three interwoven spatial planes:

### 6.1 Geospatial Plane
Physical space. Latitude, longitude, elevation. Coordinates on Earth.

- Hierarchical regions: Planet > Continent > Country > State > County > City > Address
- Distance: geodesic distance between entities
- Movement detection: sequence of located signals shows entity movement

### 6.2 Topological Plane
Relational space. Position defined by graph connectivity, not coordinates.

- RCC-8 (Region Connection Calculus) spatial relations
- Graph distance: shortest path length between nodes
- k-hop neighborhoods
- Degree centrality and betweenness centrality
- Connected component detection
- Clustering

### 6.3 Theoretical Plane (Kd-Space)
The abstract K-dimensional space where Charlotte lives. K = number of active metric dimensions.

- Every METRIC defines a dimension
- The temporal spine is the primary axis — all other dimensions are perpendicular
- Metric lines run parallel to the temporal spine
- SIGNALs are points on these lines: `(pointOnLine ?S ?M ?T ?V)`
- Charlotte observes Kd-space from her position on the temporal spine
- Euclidean distance in Kd-space measures metric-profile similarity

### Spatial Interlacing
A single entity has a position in all three planes simultaneously:
```krf
(fullSpatialPosition ?E ?GEO ?TOPO ?THEO)
```

Where it is physically (geospatial), where it is in the graph (topological), and where it is in Kd-space (theoretical).

---

## 7. Observer Model

Charlotte is an observer on the temporal spine in Kd-space. Her fundamental capabilities:

| Capability | Description |
|-----------|-------------|
| **Perceive** | Read the graph state at current temporal coordinate |
| **PlaceSignal** | Place a SIGNAL on a METRIC line at the current time |
| **Zoom** | Change temporal resolution (epoch ↔ millisecond) |
| **Traverse** | Move along EDGEs in the topological plane |
| **Reflect** | Access meta knowledge (know what you know) |

### The Observation Loop

Charlotte's continuous cycle:
1. **Perceive** the current state
2. **Evaluate** protocols against current state
3. **Execute** fired protocol actions
4. **Ingest** human-placed signals
5. **Advance** along the temporal spine
6. Repeat

The human operator interacts by placing signals that Charlotte ingests on the next cycle. Charlotte does not replace human judgment — she extends human perception.

### Standing Directives (7)

| Priority | Directive | Description |
|----------|-----------|-------------|
| 1 | Maintain the Graph | Referential integrity, orphan detection, inconsistency flagging |
| 2 | Honor the Temporal Spine | Every signal timestamped. No un-timed data. |
| 3 | Enforce Append-Only History | Signals are immutable. Past cannot be edited, only superseded. |
| 4 | Assist the Human Operator | Surface overdue protocols, anomalous signals, completeness gaps |
| 5 | Grow Knowledge | Consume environment. Scale off of it. Every observation = learning. |
| 6 | Know What You Don't Know | Track completeness. Open world assumption. Absence ≠ falsity. |
| 7 | Prepare for Epoch Boundary | Context compression. Chain anchor readiness. |

---

## 8. Lifecycle Architecture

Every entity in Charlotte has a lifecycle. Two complementary models:

### Node States (System-Level)

```
Nascent → Active → Dormant → Archived → Deceased
                     ↑   ↓
                     └───┘  (reactivation)
```

| State | Description |
|-------|-------------|
| Nascent | Just created. Not yet fully initialized. |
| Active | Alive and producing signals. |
| Dormant | Exists but not currently active. Can be reactivated. |
| Archived | No longer active. Preserved for historical reference. |
| Deceased | Terminal state. Entity has ceased to exist. |

### Lifecycle Phases (Domain-Level)

```
Birth → Growth → Maturity → Decay → Death
```

Not all entities traverse every phase. A pig's lifecycle is ~6 years. A violin's is ~300 years. A business operation may last decades. Lifecycle duration is domain-specific, set by the domain seed.

### The Dead Teach the Living

Deceased entities are not deleted. Their signal history persists and informs the living. Depth of the archive is depth of wisdom.

---

## 9. Domain Binding

Charlotte boots unbound. The domain seed binds her.

### Boot Sequence (6 Phases)

| Phase | What Loads | Files |
|-------|-----------|-------|
| 1 — Kernel | Primitives, types | `kernel/primitives.krf`, `kernel/types.krf` |
| 2 — Spine (Temporal) | Epochs, units, lifecycle, encoding | `spine/temporal/*.krf` |
| 3 — Spine (Spatial) | Geospatial, topological, theoretical | `spine/spatial/*.krf` |
| 4 — Knowledge | All five knowledge types | `knowledge/**/*.krf` (12 files) |
| 5 — Reference | Knowledge primitives, convex hull | `reference/*.krf` |
| 6 — Agent | Identity, observer, directives | `agent/*.krf` |

All 6 phases must complete → `containerOperational`.

### Domain Seed

A domain seed is a KRF file that:
1. Declares a new microtheory extending CharlotteKernelMt
2. Defines domain-specific entity types (extending NODE)
3. Defines domain-specific relationships (extending EDGE)
4. Defines domain-specific metrics, thresholds, and protocols
5. Provides initial data (seed entities)

When bound: `(domainBinding Charlotte ?DOMAIN)` replaces `(domainBinding Charlotte Unbound)`.

---

## 10. Constraint System

Charlotte enforces integrity through typed constraints:

### Referential Integrity
- An EDGE cannot reference a NODE that does not exist
- A SIGNAL must reference a valid METRIC
- Every METRIC must be attached to at least one NODE

### Signal Immutability
- SIGNALs are append-only. Once created, never modified.
- A SIGNAL can be superseded by a newer SIGNAL on the same METRIC (temporal ordering enforced)
- Historical record is always trustworthy

### Protocol Completeness
- Every PROTOCOL must have a trigger, condition, and action
- Protocol priority resolves conflicts (lower number = higher priority)

### Temporal Ordering
- Signal timestamps must be within the current epoch
- Lifecycle transitions must follow valid paths (`canTransition` rules)

### Open World Assumption
- Charlotte operates under OWA: absence of a fact does not mean the fact is false
- Closed-world override available per collection per microtheory
- Known unknowns are explicitly tracked

---

## 11. Tech Stack

| Component | Technology | Role |
|-----------|-----------|------|
| Knowledge Representation | KRF (first-order logic, CycL-derived) | Boot image, domain seeds, reasoning rules |
| Mobile/Web/Desktop Client | Flutter 3.9 / Dart | Cross-platform application |
| Design System (Flutter) | `charlotte_ui` package | 47 glassmorphic components (atoms, molecules, organisms) |
| Design System (Web) | Liquid Glass CSS/JS | Shared web component library |
| Token Compiler | `compile-tokens.mjs` (Node.js) | `tokens.json` → `.css` + `.dart` |
| Backend | Firebase (Firestore, Auth, Functions, Messaging) | Cloud data, auth, serverless logic |
| AI Integration | Claude API (Anthropic) | Embedded agent, natural language interface |
| IoT (Planned) | Raspberry Pi 5, MQTT, Python | Sensor integration, edge computing |
| Database (Edge) | SQLite | Local-first storage on Pi hubs |
| Visualization | D3.js | Knowledge graph, research lab, reference library |
| Animation | Lottie (JSON) | Per-brand animated assets |

---

## 12. Directory Map

```
/c/dev/
├── charlotte-os/                    Boot image (31 KRF files)
│   ├── kernel/
│   │   ├── primitives.krf           Five primitives (NODE, EDGE, METRIC, SIGNAL, PROTOCOL)
│   │   ├── types.krf                Type system, collections, register grammar
│   │   ├── valuation-layer.krf      Architectural doctrine (two-layer split)
│   │   └── boot.krf                 Boot sequence (6 phases)
│   ├── knowledge/
│   │   ├── structural/              taxonomy.krf, mereology.krf, relations.krf
│   │   ├── declarative/             entities.krf, attributes.krf
│   │   ├── procedural/              protocols.krf, constraints.krf, storytelling.krf, pitch-narratives.krf
│   │   ├── heuristic/               defaults.krf, thresholds.krf
│   │   └── meta/                    schema.krf, provenance.krf, completeness.krf
│   ├── spine/
│   │   ├── temporal/                epochs.krf, units.krf, lifecycle.krf, encoding.krf
│   │   └── spatial/                 geospatial.krf, topological.krf, theoretical.krf
│   ├── agent/                       identity.krf, observer.krf, directives.krf
│   └── reference/                   knowledge-primitives.krf, convex-hull.krf
│
├── charlotte/                       Flutter app (SomeAI Pocket)
│   ├── lib/                         Dart source (main.dart, theme.dart, screens, widgets)
│   ├── assets/                      Bundled content (docs, KRF, branding)
│   └── pubspec.yaml                 Dependencies
│
├── design/
│   ├── charlotte_ui/                Flutter design system package (50 Dart files)
│   ├── brandbook/                   14 per-brand brandbooks (tokens, themes, demos)
│   ├── liquid-glass/                Shared CSS/JS component library
│   └── compile-tokens.mjs           Token compiler
│
├── business/                        Per-entity business data
│   ├── someai/docs/                 PRD, SDD, KRF Guide
│   ├── industrial-service-group/    ISG contract, analysis, launch prep
│   ├── sounder/                     First client, brand assets
│   ├── serengeti/                   Holding company playbooks (6 divisions)
│   └── [8 more entities]/           Prospects with analysis + KRF models
│
├── workbench/                       Asset Studio (17 Lottie animations, SVG per entity)
├── references/                      26 reference library pages
├── research-lab/                    D3.js knowledge graph visualization
├── games/                           19 agent test games (sandbox)
└── tools/gantt/                     Sprint planning tool
```

---

## Appendix A: Predicate Quick Reference

| Predicate | Arity | Description |
|-----------|-------|-------------|
| `isa` | 2 | Type membership: `(isa X Collection)` |
| `genls` | 2 | Subtype: `(genls Dog Animal)` |
| `genlMt` | 2 | Microtheory inheritance: `(genlMt Child Parent)` |
| `implies` | 2 | Inference rule: `(implies Antecedent Consequent)` |
| `thereExists` | 2 | Existential quantification |
| `and`, `or`, `not` | variadic | Logical connectives |
| `comment` | 2 | Documentation |
| `arity` | 2 | Number of arguments a predicate takes |
| `arg1Isa`, `arg2Isa` | 2 | Type constraints on predicate arguments |
| `hasField` | 3 | Framework field value: `(hasField ?N :ID ?id)` |
| `hasAttribute` | 3 | Domain attribute: `(hasAttribute ?N ::LABEL ?name)` |
| `hasTrigger` | 2 | Protocol trigger |
| `hasCondition` | 2 | Protocol condition |
| `hasAction` | 2 | Protocol action |
| `valuationChain` | 4 | Complete dive line trace |
| `measures` | 2 | Metric-to-NODE attachment |
| `derivedFrom` | 2 | Signal-to-METRIC derivation |
| `inverseOf` | 2 | Symmetric edge declaration |
| `defaultTrue` | 1 | Heuristic (overridable) assertion |

## Appendix B: Coverage Dimensions

Charlotte tracks five dimensions of graph completeness:

| Dimension | Measures |
|-----------|---------|
| DeclarativeCoverage | Fraction of domain entities with NODEs |
| StructuralCoverage | Fraction of known relationships with EDGEs |
| TemporalCoverage | Fraction of temporal spine with SIGNALs |
| SpatialCoverage | Fraction of spatial planes populated |
| HeuristicCoverage | Fraction of METRICs with sufficient signal history |

All start at 0.0 at boot. The domain seed and ongoing signal ingestion grow them.
