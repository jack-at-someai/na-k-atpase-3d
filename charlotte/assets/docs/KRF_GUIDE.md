# KRF Developer Guide

**Charlotte OS — Knowledge Representation Format**
**Version:** 1.0 | **Date:** February 16, 2026

---

# Part I: Foundations

## 1. The Lineage

Charlotte OS descends from the Companions cognitive architecture built at Northwestern University by Ken Forbus and his research group. Companions used CycL — the knowledge representation language of the Cyc project — to encode commonsense knowledge in first-order logic, then reasoned over it using analogical reasoning, qualitative simulation, and natural language understanding.

Jack Richard learned KRF directly from Forbus during his Masters in AI and PhD in Swarm Intelligence at Northwestern. Charlotte (originally named Atlas) is the commercial evolution of those ideas: take the formal knowledge representation that powered academic cognitive architectures and apply it to the operational reality of businesses.

This guide is the bridge. Every future developer maintaining Charlotte OS will learn KRF from what is written here.

### What Charlotte Inherited from Companions

| Concept | Companions/CycL | Charlotte/KRF |
|---------|-----------------|---------------|
| Knowledge representation | CycL S-expressions | KRF S-expressions |
| Truth scoping | CycL microtheories | Charlotte microtheories |
| Type system | CycL collections + `isa`/`genls` | Charlotte collections + `isa`/`genls` |
| Inference | Cyc inference engine | Rule-based implications |
| Analogical reasoning | Structure Mapping Engine | Cross-domain pattern recognition |
| Context management | Microtheory inheritance | `genlMt` hierarchy |

### What Charlotte Added

- **Five primitives** (NODE, EDGE, METRIC, SIGNAL, PROTOCOL) — CycL has no valuation layer
- **Two-layer split** — Ontological vs. Valuation, enforced at the type level
- **Temporal spine** — 2048-year epoch system with blockchain encoding
- **Spatial spine** — Three interwoven planes (geospatial, topological, theoretical)
- **Observer model** — Charlotte as a perceiving agent on the temporal spine
- **Domain binding** — Boot unbound, receive a domain seed

---

## 2. Why First-Order Logic?

Predicate logic lets you write rules that *reason*, not just store data.

Consider this Charlotte rule:

```krf
(implies
  (and (isa ?P PROTOCOL)
       (hasTrigger ?P ?S))
  (isa ?S SIGNAL))
```

This says: "For any thing ?P, if ?P is a PROTOCOL and ?P has a trigger ?S, then ?S must be a SIGNAL." This is a *reasoning constraint*. The system can check any protocol against it, infer type membership, and reject invalid data — all from a single declarative statement.

In JSON, you'd write validation code. In SQL, you'd write CHECK constraints. In a graph database, you'd write application-level enforcement. In KRF, the constraint is the knowledge. It lives in the same language as the data it constrains.

### What FOL Buys You

| Capability | How KRF Does It | How JSON/SQL Can't |
|-----------|-----------------|-------------------|
| Universal quantification | `(implies (isa ?X NODE) ...)` — applies to ALL nodes | Must iterate/validate in code |
| Existential quantification | `(thereExists ?M (measures ?M ?N))` | Must query + check |
| Logical composition | `(and (or ...) (not ...))` | Custom boolean logic in app code |
| Inference | Rules derive new facts from existing facts | No native inference |
| Type constraints | `(arg1Isa measures METRIC)` | Schema validation is external |
| Truth scoping | Facts are true within a microtheory | All data is globally true or false |

### The Key Insight

KRF files are not configuration files. They are not data files. They are *knowledge* — assertions about what is true, what can be inferred, and what must hold. The boot image is not loaded like a config. It is *reasoned over* like a knowledge base.

---

## 3. Knowledge Representation Theory

Charlotte encodes five types of knowledge. Together they form the **convex hull of knowledge** — the minimal boundary that encloses every form of knowing a computational system can possess.

| Type | Description | Charlotte Primitive | Example |
|------|------------|-------------------|---------|
| **Structural** | Relationships between things | EDGE | `(competitorOf DXP ISG)` |
| **Declarative** | What things are | NODE | `(isa DXPEnterprises Competitor)` |
| **Procedural** | Rules and procedures | PROTOCOL | `(hasTrigger Protocol-Reorder ThresholdCrossed)` |
| **Heuristic** | Rules of thumb, observations | METRIC + SIGNAL | `(hasThreshold DormancyTimeout TargetValue 90)` |
| **Meta** | Knowledge about knowledge | (system-level) | `(completenessOf ?N SchemaPopulation Partial)` |

### The Convex Hull Theorem

Any knowledge artifact K can be expressed as:

```
K = w1·Structural + w2·Declarative + w3·Procedural + w4·Heuristic + w5·Meta
where w1..w5 ≥ 0 and w1 + w2 + w3 + w4 + w5 = 1
```

The five types are the vertices. All knowledge is interior. Examples:

- **Breeding decision** (Sounder): 20% structural, 25% declarative, 15% procedural, 30% heuristic, 10% meta
- **Violin authentication** (Prier): 25% structural, 30% declarative, 10% procedural, 20% heuristic, 15% meta
- **Logistics dispatch** (Top Tier): 15% structural, 20% declarative, 30% procedural, 25% heuristic, 10% meta

If a system can represent all five types, it can represent anything. Charlotte's five primitives encode all five types. Therefore Charlotte can represent any knowledge domain.

---

## 4. Microtheory Model

A microtheory is a named context in which facts are true. This is Charlotte's mechanism for scoped truth.

### Why Scoping Matters

"DXP is a VERY HIGH competitive threat" — true from ISG's perspective.
"ISG is a minor regional player" — true from DXP's perspective.

Both facts exist in the graph. They don't contradict each other because they live in different microtheories.

### Declaration and Inheritance

```krf
;; Declare a microtheory
(in-microtheory ISGCompetitiveAnalysisMt)

;; Inherit from parent
(genlMt ISGCompetitiveAnalysisMt CharlotteKernelMt)
```

All facts asserted in a parent Mt are visible in the child. A child can add facts and override defaults, but cannot delete parent facts.

### Charlotte's Core Microtheories

```
CharlotteBootMt          ← Loads first
  └── CharlotteKernelMt  ← Five primitives, type system, valuation doctrine
        ├── CharlotteStructuralMt    ← Taxonomy, mereology, relations
        ├── CharlotteDeclarativeMt   ← Entities, attributes
        ├── CharlotteProceduralMt    ← Protocols, constraints
        ├── CharlotteHeuristicMt     ← Defaults, thresholds
        ├── CharlotteMetaMt          ← Schema, provenance, completeness
        ├── CharlotteTemporalMt      ← Epochs, units, lifecycle, encoding
        ├── CharlotteSpatialMt       ← Geospatial, topological, theoretical
        └── CharlotteAgentMt         ← Identity, observer, directives
```

Domain seeds extend `CharlotteKernelMt`:
```krf
(genlMt ISGDomainMt CharlotteKernelMt)
(genlMt SounderDomainMt CharlotteKernelMt)
```

---

# Part II: The Architecture

## 5. The Five Primitives

### NODE — Identity
```krf
(isa NODE Primitive)
(genls NODE FACT)
(comment NODE "Identity. Any uniquely identifiable entity in the graph.")
(mapsToKnowledgeType NODE DeclarativeKnowledge)
```

A NODE is an entity: a person, a machine, a business, a pig, a violin, a location. Every NODE has:
- `:ID` — unique identifier (immutable)
- `:TYPE` — always "NODE" (immutable)
- `:CREATED` — epoch-relative timestamp (immutable)
- `::LABEL` — human-readable name (mutable)
- `::STATUS` — lifecycle state (mutable)
- `::CATEGORY` — domain classification (mutable)

NODE subtypes: `IndividualEntity`, `GroupEntity`, `AssetEntity`, `LocationEntity`, `EventEntity`, `DocumentEntity`.

### EDGE — Relationship
```krf
(isa EDGE Primitive)
(genls EDGE FACT)
(comment EDGE "Relationship. A typed, directed connection between two NODEs.")
(mapsToKnowledgeType EDGE StructuralKnowledge)
```

An EDGE connects two NODEs with a typed relationship. Every EDGE has:
- `:FROM` — source NODE :ID
- `:TO` — target NODE :ID
- `:EDGE_TYPE` — relationship type

Built-in edge types: `OWNS`, `MEMBER_OF`, `BELONGS_TO`, `PARENT_OF`, `CHILD_OF`, `SIRE_OF`, `DAM_OF`, `NEXT`, `PREVIOUS`, `LOCATED_AT`, `ADJACENT_TO`, `CONTAINED_IN`, `CAUSES`, `ENABLES`, `PREVENTS`, `DERIVED_FROM`, `MONITORS`, `GOVERNS`, `MEASURES`.

Edges support symmetry (`ADJACENT_TO`) and inverse declarations (`PARENT_OF` ↔ `CHILD_OF`).

### METRIC — Measurement
```krf
(isa METRIC Primitive)
(genls METRIC FACT)
(comment METRIC "Quantitative signal. A measurable dimension attached to a NODE.")
(mapsToKnowledgeType METRIC HeuristicKnowledge)
```

A METRIC defines a measurable dimension. Schema:
- `::UNIT` — unit of measurement (kg, cm, count)
- `::DIMENSION` — what is being measured
- `:::NODE` — the NODE this metric measures

Metrics carry thresholds: `LowerBound`, `UpperBound`, `TargetValue`, `ToleranceBand`. When a SIGNAL crosses a threshold, the system detects it.

In Kd-space, every METRIC defines a dimension. Metric lines run parallel to the temporal spine. SIGNALs are points on these lines.

### SIGNAL — Observation
```krf
(isa SIGNAL Primitive)
(genls SIGNAL FACT)
(comment SIGNAL "Event. A timestamped observation placed on a METRIC line.")
(mapsToKnowledgeType SIGNAL HeuristicKnowledge)
```

A SIGNAL is an immutable, timestamped observation:
- `:TIMESTAMP` — when the observation occurred
- `:METRIC_ID` — which METRIC this signal belongs to
- `:VALUE` — the observed value

Key properties:
- **Append-only:** Signals can never be modified, only superseded
- **Temporal ordering:** A superseding signal must be newer
- **Freshness:** Signals within the recency window (default 30 days) are "fresh"
- **Anomaly detection:** Values >2σ from rolling mean are flagged anomalous

### PROTOCOL — Rule
```krf
(isa PROTOCOL Primitive)
(genls PROTOCOL FACT)
(comment PROTOCOL "Rule. Business logic that governs graph evolution.")
(mapsToKnowledgeType PROTOCOL ProceduralKnowledge)
```

A PROTOCOL has three parts:
- `:TRIGGER` — what event fires it (SignalArrival, TimeElapsed, ThresholdCrossed, StateChanged, ManualInvocation)
- `:CONDITION` — what must be true for the action to execute
- `:ACTION` — what happens (CreateNode, CreateEdge, CreateSignal, UpdateAttribute, TransitionState, SendNotification, EvaluateRule, ArchiveEntity)

Protocols have priority (lower = higher priority). When two protocols fire simultaneously, higher priority executes first.

---

## 6. The Two Layers

### Ontological Layer (NODE + EDGE)

The knowledge graph. "What exists." Supports standard graph operations:
- Traversal (BFS, DFS)
- Shortest path
- Centrality (degree, betweenness)
- Clustering
- Connected components

Facts in this layer are objective and shared.

### Valuation Layer (METRIC → SIGNAL → PROTOCOL)

The serial reasoning pipeline. "What it means." This is NOT graph traversal. This is signal processing.

```
METRIC ──→ SIGNAL ──→ PROTOCOL
  ↑           ↑           ↑
"measure"  "detect"    "act"
```

The chain is strict and enforced at the type level:
- A PROTOCOL's trigger must be a SIGNAL
- A SIGNAL must derive from a METRIC
- A METRIC must attach to a NODE

This gives us the **dive line**: every conclusion traces back to specific measurements on specific entities.

### The Feature Equation Analogy

Think of ML regression: `price = f(sqft, bedrooms, bathrooms, ...)`

In Charlotte:
- METRICs = the features (sqft, bedrooms)
- SIGNALs = the feature crosses (above_median_sqft, good_schools)
- PROTOCOL = the valuation (price_in_range_X, recommend_buy)

But unlike a black-box model, every "weight" is a named SIGNAL with a named threshold on a named METRIC attached to a named NODE. The "model" is the set of PROTOCOL rules. The "prediction" is a PROTOCOL firing — and you can read exactly why.

---

## 7. The Serial Pipeline in Detail

```krf
;; Step 1: Define a METRIC on a NODE
(isa compressorTemperature METRIC)
(measures compressorTemperature Compressor-A1)
(hasThreshold compressorTemperature UpperBound 195)
(hasAttribute compressorTemperature ::UNIT "Fahrenheit")

;; Step 2: A SIGNAL arrives (observation)
(isa signal-temp-2026-02-16 SIGNAL)
(hasField signal-temp-2026-02-16 :METRIC_ID compressorTemperature)
(hasField signal-temp-2026-02-16 :TIMESTAMP (DayFn 16 (MonthFn February (YearFn 2026))))
(hasField signal-temp-2026-02-16 :VALUE 203)

;; Step 3: Threshold crossing detected → new SIGNAL
(derivedFrom overheating-detected-A1 compressorTemperature)
(thresholdViolation signal-temp-2026-02-16 AboveUpperBound)

;; Step 4: PROTOCOL fires
(isa Protocol-ServiceDispatch PROTOCOL)
(hasTrigger Protocol-ServiceDispatch overheating-detected-A1)
(hasCondition Protocol-ServiceDispatch (hasState Compressor-A1 Active))
(hasAction Protocol-ServiceDispatch (SendNotification ServiceRequired Compressor-A1))
```

The dive line for this protocol:
```
Protocol-ServiceDispatch
  ↑ triggered by SIGNAL: overheating-detected-A1
    ↑ derived from METRIC: compressorTemperature (value 203 > threshold 195)
      ↑ attached to NODE: Compressor-A1
```

---

## 8. The Dive Line

The `valuationChain` predicate captures the complete trace:

```krf
(isa valuationChain Predicate)
(arity valuationChain 4)
(arg1Isa valuationChain PROTOCOL)
(arg2Isa valuationChain SIGNAL)
(arg3Isa valuationChain METRIC)
(arg4Isa valuationChain NODE)

(implies
  (and (isa ?P PROTOCOL)
       (hasTrigger ?P ?S)
       (derivedFrom ?S ?M)
       (attachedTo ?M ?N))
  (valuationChain ?P ?S ?M ?N))
```

If you cannot produce a `valuationChain` for a PROTOCOL, it has no grounding and should not fire. This is the fundamental guarantee: no confidence scores, no approximate reasoning, no attention weights. Just the line.

---

## 9. Observer Model

Charlotte is defined in `agent/identity.krf`:

```krf
(isa Charlotte CharlotteAgent)
(hasAttribute Charlotte ::LABEL "Charlotte")
(hasAttribute Charlotte ::VERSION "1.0.0")
(formerName Charlotte "Atlas")
(originInstitution Charlotte "Northwestern University")
(domainBinding Charlotte Unbound)
```

The observer capabilities (from `agent/observer.krf`):

| Capability | Rule |
|-----------|------|
| Perceive | If observer at position T, can perceive state at T |
| PlaceSignal | If observer at T and M is a METRIC, can place signal on M at T |
| Zoom | If U1 subdivides U2, observer can zoom between them |
| Traverse | If EDGE exists from A to B, observer can traverse A→B |
| Reflect | If observer understands MetaKnowledge, can reflect |

The observation loop (`ObservationLoop`) is itself a PROTOCOL:
```krf
(isa ObservationLoop PROTOCOL)
(hasTrigger ObservationLoop TimeElapsed)
(hasCondition ObservationLoop (containerOperational ThisContainer))
(hasAction ObservationLoop
  (and (Perceive Charlotte)
       (evaluateProtocols Charlotte)
       (ingestSignals Charlotte)
       (advanceSpine Charlotte)))
```

---

# Part III: The Syntax

## 10. S-Expression Grammar

KRF uses parenthesized prefix notation (S-expressions):

```
(predicate arg1 arg2 ...)
```

Everything is a list. The first element is the predicate (function). The remaining elements are arguments. Lists nest:

```krf
(implies
  (and (isa ?X NODE)
       (hasState ?X Active))
  (isActivelyMonitored ?X))
```

### Whitespace and Comments

- Whitespace is insignificant (indent for readability)
- Comments start with `;;` (convention: `;;;` for section headers, `;;` for inline)
- Multi-line comments span multiple `;;` lines

### Strings

Strings are double-quoted: `"This is a string"`

### Numbers

Numbers are bare: `42`, `3.14`, `-1`, `0.5`

---

## 11. Core Predicates

### Type System

| Predicate | Arity | Usage | Meaning |
|-----------|-------|-------|---------|
| `isa` | 2 | `(isa Dog Animal)` | Dog is an instance of Animal |
| `genls` | 2 | `(genls Dog Mammal)` | Dog is a subtype of Mammal (all Dogs are Mammals) |
| `disjointWith` | 2 | `(disjointWith NODE EDGE)` | Nothing can be both a NODE and an EDGE |

### Microtheories

| Predicate | Usage | Meaning |
|-----------|-------|---------|
| `in-microtheory` | `(in-microtheory CharlotteKernelMt)` | All following assertions are in this Mt |
| `genlMt` | `(genlMt Child Parent)` | Child inherits all facts from Parent |

### Logic

| Predicate | Usage | Meaning |
|-----------|-------|---------|
| `implies` | `(implies Antecedent Consequent)` | If antecedent then consequent |
| `and` | `(and P Q R)` | All must be true |
| `or` | `(or P Q)` | At least one must be true |
| `not` | `(not P)` | P must be false |
| `thereExists` | `(thereExists ?X (isa ?X NODE))` | There is some X that is a NODE |
| `equals` | `(equals ?X ?Y)` | X and Y are the same thing |

### Documentation

| Predicate | Usage | Meaning |
|-----------|-------|---------|
| `comment` | `(comment NODE "Identity.")` | Human-readable description |
| `arity` | `(arity measures 2)` | measures takes 2 arguments |
| `arg1Isa` | `(arg1Isa measures METRIC)` | First arg must be a METRIC |
| `arg2Isa` | `(arg2Isa measures NODE)` | Second arg must be a NODE |

### Relations

| Predicate | Usage | Meaning |
|-----------|-------|---------|
| `inverseOf` | `(inverseOf PARENT_OF CHILD_OF)` | Symmetric edge declaration |
| `partOf` | `(partOf Wheel Car)` | Mereological containment |
| `contains` | `(contains Car Wheel)` | Inverse of partOf |

### Heuristics

| Predicate | Usage | Meaning |
|-----------|-------|---------|
| `defaultTrue` | `(defaultTrue (implies ...))` | True unless overridden |
| `defaultValue` | `(defaultValue RecencyWindow (DurationOf 30 Day))` | Default value, domain-overridable |

---

## 12. Naming Conventions

| Pattern | Meaning | Example |
|---------|---------|---------|
| `?VAR` | Variable (universally quantified) | `?X`, `?NODE`, `?SIGNAL` |
| `EntityName` | Named entity (PascalCase) | `DXPEnterprises`, `CharlotteKernelMt` |
| `predicateName` | Predicate (camelCase) | `hasTrigger`, `derivedFrom`, `measures` |
| `:FIELD` | Framework field (immutable, set at creation) | `:ID`, `:TYPE`, `:CREATED` |
| `::ATTR` | Attribute (mutable, domain-specific) | `::LABEL`, `::STATUS`, `::CATEGORY` |
| `:::REL` | Relationship (resolved to EDGE) | `:::NODE` (the NODE a METRIC measures) |
| `CollectionName` | Collection/type (PascalCase) | `NODE`, `EDGE`, `Organism`, `LifecycleState` |
| `Mt` suffix | Microtheory | `CharlotteKernelMt`, `ISGDomainMt` |

---

## 13. Register System

Every FACT has framework fields (the "registers"):

### Universal Registers (All FACTs)
| Register | Type | Mutability | Description |
|----------|------|------------|-------------|
| `:ID` | String | Immutable | Unique identifier |
| `:TYPE` | FactType | Immutable | NODE, EDGE, METRIC, SIGNAL, or PROTOCOL |
| `:CREATED` | TemporalCoordinate | Immutable | Creation timestamp |

### Payload Registers (Type-Specific)
| Register | NODE | EDGE | METRIC | SIGNAL | PROTOCOL |
|----------|------|------|--------|--------|----------|
| P0 | category | fromNode | nodeId | nodeId | nodeId |
| P1 | — | toNode | valueType | metricId | schedule |
| P2 | — | edgeType | label | value | requirements |
| P3 | — | — | constraints | protocolId | — |

### Domain Attributes vs Framework Fields

```krf
;; Framework field — immutable, colon prefix
(hasField ?N :ID "compressor-001")

;; Domain attribute — mutable, double-colon prefix
(hasAttribute ?N ::LABEL "Air Compressor A1")
(hasAttribute ?N ::STATUS Active)
(hasAttribute ?N ::CATEGORY "RotatingEquipment")
```

---

## 14. File Structure

Every KRF file follows this structure:

```krf
;;; ================================================================
;;; LAYER / SUBLAYER / NAME
;;; One-line description of what this file contains
;;; ================================================================

(in-microtheory SomeMicrotheoryMt)

;; ── Section Header ──

;; Declarations
(isa SomeThing SomeCollection)
(comment SomeThing "Description.")

;; Rules
(implies
  (and (condition1)
       (condition2))
  (consequence))

;; ── Next Section ──
...
```

Conventions:
- File header: `;;;` block with layer/name/description
- Microtheory declaration: first executable line
- Section dividers: `;; ── Name ──`
- Comments before declarations, not inline
- One blank line between logical groups

---

# Part IV: Practical Patterns

## 15. Creating a NODE Type

**Template:**
```krf
(in-microtheory YourDomainMt)

;; Declare the type
(isa YourNodeType Collection)
(genls YourNodeType NODE)         ;; or a NODE subtype like IndividualEntity
(comment YourNodeType "Description of what this entity represents.")

;; Define domain-specific attributes
(implies (isa ?X YourNodeType)
  (and (canHaveAttribute ?X ::YOUR_ATTR_1)
       (canHaveAttribute ?X ::YOUR_ATTR_2)))

(isa ::YOUR_ATTR_1 TextAttribute)
(isa ::YOUR_ATTR_2 NumericAttribute)
```

**Example — Compressor:**
```krf
(in-microtheory ISGDomainMt)

(isa Compressor Collection)
(genls Compressor AssetEntity)
(comment Compressor "A rotating equipment asset in an industrial operation.")

(implies (isa ?C Compressor)
  (and (canHaveAttribute ?C ::MODEL)
       (canHaveAttribute ?C ::HORSEPOWER)
       (canHaveAttribute ?C ::DISCHARGE_PRESSURE)
       (canHaveAttribute ?C ::SERVICE_INTERVAL_HOURS)))

(isa ::MODEL TextAttribute)
(isa ::HORSEPOWER NumericAttribute)
(isa ::DISCHARGE_PRESSURE NumericAttribute)
(isa ::SERVICE_INTERVAL_HOURS NumericAttribute)
```

---

## 16. Creating an EDGE Type

**Template:**
```krf
(isa YOUR_EDGE EdgeType)
(comment YOUR_EDGE "Description of this relationship.")

;; Optional inverse
(isa YOUR_INVERSE_EDGE EdgeType)
(inverseOf YOUR_EDGE YOUR_INVERSE_EDGE)
```

**Example:**
```krf
(isa SERVICES EdgeType)
(isa SERVICED_BY EdgeType)
(comment SERVICES "Technician A services equipment B.")
(inverseOf SERVICES SERVICED_BY)
```

---

## 17. Creating a METRIC

**Template:**
```krf
(isa yourMetric METRIC)
(measures yourMetric ?NODE_OR_COLLECTION)
(hasAttribute yourMetric ::UNIT "unit_string")
(hasAttribute yourMetric ::DIMENSION "what_is_measured")

;; Thresholds
(hasThreshold yourMetric LowerBound value)
(hasThreshold yourMetric UpperBound value)
(hasThreshold yourMetric TargetValue value)
```

**Example:**
```krf
(isa dischargeTemperature METRIC)
(measures dischargeTemperature Compressor)
(hasAttribute dischargeTemperature ::UNIT "Fahrenheit")
(hasAttribute dischargeTemperature ::DIMENSION "Discharge temperature")
(hasThreshold dischargeTemperature LowerBound 150)
(hasThreshold dischargeTemperature UpperBound 195)
(hasThreshold dischargeTemperature TargetValue 175)
```

---

## 18. Creating SIGNAL Rules

**Threshold detection pattern:**
```krf
(implies
  (and (isa ?S SIGNAL)
       (hasField ?S :METRIC_ID yourMetric)
       (hasField ?S :VALUE ?V)
       (hasThreshold yourMetric UpperBound ?MAX)
       (greaterThan ?V ?MAX))
  (thresholdViolation ?S AboveUpperBound))
```

**Anomaly detection pattern (uses default heuristic):**
```krf
;; Already defined in defaults.krf:
(defaultTrue
  (implies
    (and (isa ?S SIGNAL)
         (hasField ?S :VALUE ?V)
         (hasField ?S :METRIC_ID ?M)
         (rollingMean ?M ?MEAN)
         (rollingStdDev ?M ?SIGMA)
         (absoluteDifference ?V ?MEAN ?DIFF)
         (greaterThan ?DIFF (times 2 ?SIGMA)))
    (isAnomalous ?S)))
```

---

## 19. Creating a PROTOCOL

**Template:**
```krf
(isa YourProtocol PROTOCOL)
(hasTrigger YourProtocol TriggerType)
(hasCondition YourProtocol
  (and (condition1)
       (condition2)))
(hasAction YourProtocol
  (ActionType args))
(protocolPriority YourProtocol N)
(comment YourProtocol "Description.")
```

**Example — Service dispatch on overheating:**
```krf
(isa Protocol-CompressorOverheat PROTOCOL)
(hasTrigger Protocol-CompressorOverheat ThresholdCrossed)
(hasCondition Protocol-CompressorOverheat
  (and (isa ?C Compressor)
       (hasState ?C Active)
       (thresholdViolation ?S AboveUpperBound)
       (hasField ?S :METRIC_ID dischargeTemperature)
       (measuresNode ?S ?C)))
(hasAction Protocol-CompressorOverheat
  (and (SendNotification ServiceRequired ?C)
       (TransitionState ?C Dormant)))
(protocolPriority Protocol-CompressorOverheat 2)
(comment Protocol-CompressorOverheat
  "When a compressor's discharge temperature exceeds the upper bound,
   notify the operator and set the compressor to Dormant until serviced.")
```

**Trigger types:** `SignalArrival`, `TimeElapsed`, `ThresholdCrossed`, `StateChanged`, `ManualInvocation`

**Action types:** `CreateNode`, `CreateEdge`, `CreateSignal`, `UpdateAttribute`, `TransitionState`, `SendNotification`, `EvaluateRule`, `ArchiveEntity`

---

## 20. Creating a Domain Seed

A domain seed binds Charlotte to an operation. Complete walkthrough:

```krf
;;; ================================================================
;;; DOMAIN SEED: ISG Industrial Services
;;; ================================================================

(in-microtheory ISGDomainMt)
(genlMt ISGDomainMt CharlotteKernelMt)

;; ── Domain identity ──
(isa ISGOperation Operation)
(isa ISGOperation BusinessOperation)
(hasAttribute ISGOperation ::LABEL "Industrial Service Group")
(hasAttribute ISGOperation ::CATEGORY "IndustrialServices")

;; ── Extend NODE types ──
(isa Compressor Collection)
(genls Compressor AssetEntity)

(isa Technician Collection)
(genls Technician IndividualEntity)

(isa ServiceCall Collection)
(genls ServiceCall EventEntity)

;; ── Extend EDGE types ──
(isa SERVICES EdgeType)
(isa ASSIGNED_TO EdgeType)
(isa LOCATED_AT_FACILITY EdgeType)

;; ── Domain METRICs ──
(isa dischargeTemperature METRIC)
(measures dischargeTemperature Compressor)
(hasThreshold dischargeTemperature UpperBound 195)

(isa serviceHoursRemaining METRIC)
(measures serviceHoursRemaining Compressor)
(hasThreshold serviceHoursRemaining LowerBound 100)

;; ── Domain PROTOCOLs ──
(isa Protocol-ScheduleMaintenance PROTOCOL)
(hasTrigger Protocol-ScheduleMaintenance ThresholdCrossed)
(hasCondition Protocol-ScheduleMaintenance
  (and (isa ?C Compressor)
       (hasState ?C Active)
       (isa ?S SIGNAL)
       (hasField ?S :METRIC_ID serviceHoursRemaining)
       (hasField ?S :VALUE ?V)
       (lessThan ?V 100)))
(hasAction Protocol-ScheduleMaintenance
  (SendNotification MaintenanceDue ?C))

;; ── Seed data ──
(isa Compressor-A1 Compressor)
(hasAttribute Compressor-A1 ::LABEL "Air Compressor A1")
(hasAttribute Compressor-A1 ::MODEL "Atlas Copco GA-90")
(hasAttribute Compressor-A1 ::HORSEPOWER 125)
(hasState Compressor-A1 Active)

;; ── Bind Charlotte ──
(bindDomain Charlotte ISGOperation)
```

---

## 21. Constraint vs. Heuristic

**Constraints** are hard rules. They must always hold. Violations are errors.

```krf
;; Constraint: EDGE must reference existing NODEs
(implies
  (and (isa ?E EDGE) (hasField ?E :FROM ?A) (hasField ?E :TO ?B))
  (and (isa ?A NODE) (isa ?B NODE)))
```

**Heuristics** are soft defaults. They are true unless overridden by domain-specific knowledge.

```krf
;; Heuristic: 30-day recency window (domain can override)
(defaultValue RecencyWindow (DurationOf 30 Day))

;; Domain override:
(in-microtheory ISGDomainMt)
;; ISG monitors equipment daily — 7-day recency window
(RecencyWindow (DurationOf 7 Day))
```

Use constraints for:
- Referential integrity
- Type safety
- Signal immutability
- Protocol completeness

Use heuristics for:
- Thresholds (domain-dependent)
- Freshness windows
- Anomaly detection parameters
- Dormancy timeouts
- Confidence levels

---

# Part V: Reference

## 22. Complete Predicate Table

### Kernel Predicates

| Predicate | Arity | Arg Types | Defined In |
|-----------|-------|-----------|-----------|
| `isa` | 2 | Thing, Collection | types.krf |
| `genls` | 2 | Collection, Collection | types.krf |
| `genlMt` | 2 | Microtheory, Microtheory | boot.krf |
| `comment` | 2 | Thing, String | types.krf |
| `arity` | 2 | Predicate, Number | types.krf |
| `arg1Isa` | 2 | Predicate, Collection | types.krf |
| `arg2Isa` | 2 | Predicate, Collection | types.krf |
| `disjointWith` | 2 | Collection, Collection | types.krf |
| `mapsToKnowledgeType` | 2 | Primitive, KnowledgeType | primitives.krf |
| `valuationChain` | 4 | PROTOCOL, SIGNAL, METRIC, NODE | valuation-layer.krf |

### Structure Predicates

| Predicate | Arity | Description | Defined In |
|-----------|-------|-------------|-----------|
| `inverseOf` | 2 | Symmetric edge pair | relations.krf |
| `partOf` | 2 | Mereological containment | mereology.krf |
| `contains` | 2 | Inverse of partOf | mereology.krf |
| `componentOf` | 2 | Proper part (non-reflexive) | mereology.krf |

### Entity Predicates

| Predicate | Arity | Description | Defined In |
|-----------|-------|-------------|-----------|
| `hasField` | 3 | Framework field value | entities.krf |
| `hasAttribute` | 3 | Domain attribute value | attributes.krf |
| `canHaveAttribute` | 2 | Attribute schema declaration | attributes.krf |
| `hasState` | 2 | Current lifecycle state | entities.krf |
| `canTransition` | 2 | Valid state transition | entities.krf |

### Protocol Predicates

| Predicate | Arity | Description | Defined In |
|-----------|-------|-------------|-----------|
| `hasTrigger` | 2 | Protocol trigger | protocols.krf |
| `hasCondition` | 2 | Protocol condition | protocols.krf |
| `hasAction` | 2 | Protocol action | protocols.krf |
| `protocolPriority` | 2 | Execution priority (lower = higher) | protocols.krf |
| `fires` | 2 | Protocol fires at time T | protocols.krf |
| `executesBefore` | 3 | Priority ordering | protocols.krf |

### Heuristic Predicates

| Predicate | Arity | Description | Defined In |
|-----------|-------|-------------|-----------|
| `hasThreshold` | 3 | Metric threshold | thresholds.krf |
| `thresholdViolation` | 2 | Detected threshold crossing | thresholds.krf |
| `hasSeverity` | 2 | Violation severity | thresholds.krf |
| `isFresh` | 1 | Signal within recency window | defaults.krf |
| `isAnomalous` | 1 | Signal >2σ from mean | defaults.krf |
| `isWellDescribed` | 1 | NODE has label + category + metric | defaults.krf |
| `defaultTrue` | 1 | Overridable heuristic | defaults.krf |
| `defaultValue` | 2 | Overridable default | defaults.krf |

### Temporal Predicates

| Predicate | Arity | Description | Defined In |
|-----------|-------|-------------|-----------|
| `epochDurationYears` | 1 | Epoch = 2048 years | epochs.krf |
| `epochNumber` | 2 | Epoch ordinal | epochs.krf |
| `epochStart` / `epochEnd` | 2 | Epoch boundaries | epochs.krf |
| `subdivides` | 2 | Temporal unit nesting | units.krf |
| `canZoom` | 2 | Observer zoom capability | units.krf |
| `phaseOrder` | 2 | Lifecycle phase ordering | lifecycle.krf |
| `canTransitionLifecycle` | 2 | Valid phase transition | lifecycle.krf |
| `mapsToNodeState` | 2 | Phase → NODE state mapping | lifecycle.krf |
| `isHistoricalTeacher` | 1 | Dead entity with useful history | lifecycle.krf |
| `expectedLifecycleDuration` | 2 | Domain-specific lifespan | lifecycle.krf |
| `memoryDepth` | 2 | Epochs of accessible history | encoding.krf |

### Spatial Predicates

| Predicate | Arity | Description | Defined In |
|-----------|-------|-------------|-----------|
| `hasPosition` | 3 | Entity position on a plane | geospatial.krf |
| `distanceBetween` | 3 | Geodesic distance | geospatial.krf |
| `nearTo` | 2 | Proximity (domain-specific threshold) | geospatial.krf |
| `spatialContainment` | 2 | Region nesting | geospatial.krf |
| `graphDistance` | 3 | Shortest path in edges | topological.krf |
| `inNeighborhood` | 3 | Within k hops | topological.krf |
| `sameComponent` | 2 | Connected component membership | topological.krf |
| `degreeCentrality` | 2 | Edge count | topological.krf |
| `betweennessCentrality` | 2 | Shortest-path fraction | topological.krf |
| `dimensionDefinedBy` | 2 | Kd dimension from METRIC | theoretical.krf |
| `pointOnLine` | 4 | Signal on metric line | theoretical.krf |
| `fullSpatialPosition` | 4 | All three planes | theoretical.krf |
| `kdDistance` | 3 | Euclidean distance in Kd-space | theoretical.krf |

### Agent Predicates

| Predicate | Arity | Description | Defined In |
|-----------|-------|-------------|-----------|
| `observerPosition` | 3 | Where the observer is | observer.krf |
| `canPerceive` | 2 | Perceive at time T | observer.krf |
| `canPlaceSignal` | 3 | Place signal on metric at time | observer.krf |
| `canZoomBetween` | 3 | Zoom between temporal units | observer.krf |
| `canTraverse` | 3 | Traverse edge from A to B | observer.krf |
| `canReflect` | 1 | Meta-knowledge access | observer.krf |
| `domainBinding` | 2 | Current domain (or Unbound) | identity.krf |
| `canBind` | 2 | Can bind to domain | identity.krf |
| `directivePriority` | 2 | Standing directive priority | directives.krf |

### Meta Predicates

| Predicate | Arity | Description | Defined In |
|-----------|-------|-------------|-----------|
| `schemaFor` | 3 | Field definition for primitive | schema.krf |
| `currentSchemaVersion` | 1 | Schema version number | schema.krf |
| `createdBy` | 2 | Provenance: who created this | provenance.krf |
| `derivedFrom` | 2 | Provenance: upstream source | provenance.krf |
| `confidenceScore` | 2 | Confidence (0.0–1.0) | provenance.krf |
| `lastVerified` | 2 | Last verification timestamp | provenance.krf |
| `completenessOf` | 3 | Completeness assessment | completeness.krf |
| `unknownFact` | 3 | Explicit known unknown | completeness.krf |
| `closedWorldFor` | 2 | CWA override for collection | completeness.krf |
| `graphCoverage` | 2 | Coverage percentage | completeness.krf |
| `operatesUnder` | 1 | Open/closed world assumption | completeness.krf |

---

## 23. Microtheory Map

```
CharlotteBootMt
│
└── CharlotteKernelMt
    │
    ├── CharlotteStructuralMt
    │   (taxonomy.krf, mereology.krf, relations.krf)
    │
    ├── CharlotteDeclarativeMt
    │   (entities.krf, attributes.krf)
    │
    ├── CharlotteProceduralMt
    │   (protocols.krf, constraints.krf)
    │
    ├── CharlotteStorytellingMt
    │   (storytelling.krf)
    │   └── CharlottePitchNarrativesMt
    │       (pitch-narratives.krf)
    │
    ├── CharlotteHeuristicMt
    │   (defaults.krf, thresholds.krf)
    │
    ├── CharlotteMetaMt
    │   (schema.krf, provenance.krf, completeness.krf)
    │
    ├── CharlotteTemporalMt
    │   (epochs.krf, units.krf, lifecycle.krf, encoding.krf)
    │
    ├── CharlotteSpatialMt
    │   (geospatial.krf, topological.krf, theoretical.krf)
    │
    ├── CharlotteAgentMt
    │   (identity.krf, observer.krf, directives.krf)
    │
    ├── CharlotteReferenceMt
    │   (knowledge-primitives.krf, convex-hull.krf)
    │
    ├── ISGDomainMt           ← Domain seed
    ├── SounderDomainMt       ← Domain seed
    └── [other domains]       ← Domain seeds
```

---

## 24. File Organization Guide

```
charlotte-os/
├── kernel/                          Phase 1 — Boot first
│   ├── primitives.krf               Five primitives + knowledge type mappings
│   ├── types.krf                    Collections, register system, type constraints
│   ├── valuation-layer.krf          Architectural doctrine (two-layer split)
│   └── boot.krf                     Boot sequence definition (6 phases)
│
├── knowledge/                       Phase 4 — After spine
│   ├── structural/
│   │   ├── taxonomy.krf             Entity/Event hierarchy (Thing → Entity → Physical/Abstract)
│   │   ├── mereology.krf            Part-of relations, Operation structure
│   │   └── relations.krf            EDGE types, symmetry, inverse rules
│   ├── declarative/
│   │   ├── entities.krf             NODE lifecycle, entity categories
│   │   └── attributes.krf           Attribute types, NODE property vocabulary
│   ├── procedural/
│   │   ├── protocols.krf            Protocol structure, triggers, actions, defaults
│   │   ├── constraints.krf          Integrity constraints (referential, temporal, immutability)
│   │   ├── storytelling.krf         Pitch deck ontology (17 slide types, widgets, arcs)
│   │   └── pitch-narratives.krf     Domain-specific before/after narratives
│   ├── heuristic/
│   │   ├── defaults.krf             Heuristic rules (freshness, activity, anomaly, completeness)
│   │   └── thresholds.krf           Threshold system, severity levels
│   └── meta/
│       ├── schema.krf               Schema definitions for all five primitives
│       ├── provenance.krf           Source tracking, confidence, verification
│       └── completeness.krf         OWA, completeness levels, coverage metrics
│
├── spine/
│   ├── temporal/                    Phase 2 — After kernel
│   │   ├── epochs.krf               2048-year epoch system
│   │   ├── units.krf                Epoch → Millisecond hierarchy, zoom levels
│   │   ├── lifecycle.krf            Birth → Death phases, "dead teach the living"
│   │   └── encoding.krf             Epoch boundary encoding, chain unraveling
│   └── spatial/                     Phase 3 — After temporal
│       ├── geospatial.krf           Lat/lon/elevation, regions, movement detection
│       ├── topological.krf          Graph distance, neighborhoods, centrality, RCC-8
│       └── theoretical.krf          Kd-space, metric lines, observer on spine
│
├── agent/                           Phase 6 — Last
│   ├── identity.krf                 Charlotte definition, lineage, domain binding
│   ├── observer.krf                 Observer capabilities, observation loop
│   └── directives.krf               7 standing directives
│
└── reference/                       Phase 5 — Before agent
    ├── knowledge-primitives.krf     Atlas diagram formalization, primitive mappings
    └── convex-hull.krf              Convex hull theorem, decomposition examples
```

---

## 25. Lifecycle States and Transitions

### Node States
```
         ┌──────────┐
         │  Nascent  │ ← Created
         └────┬─────┘
              │
         ┌────▼─────┐
    ┌────►│  Active  │◄────┐
    │    └──┬──┬──┬─┘     │
    │       │  │  │        │
    │  ┌────▼┐ │ ┌▼──────┐│
    │  │Dorm-││ │Archived││
    │  │ant  ││ │        ││
    │  └──┬──┘│ └───┬────┘│
    │     │   │     │      │
    └─────┘   │  ┌──▼─────┐
              │  │Deceased │
              │  └─────────┘
              └──►
```

### Lifecycle Phases
```
Birth(0) → Growth(1) → Maturity(2) → Decay(3) → Death(4)
```

Shortcuts allowed: Birth→Death, Growth→Death, Maturity→Death, Growth→Decay.

---

## 26. Severity Levels

| Level | Order | Default Response |
|-------|-------|-----------------|
| Info | 0 | Log only |
| Warning | 1 | Notify operator |
| Critical | 2 | Immediate attention |
| Emergency | 3 | Halt and escalate |

Default: all threshold violations are Warnings unless elevated by domain rules.

---

## 27. Boot Sequence

| Phase | Order | What Loads | Prerequisite |
|-------|-------|-----------|-------------|
| Kernel | 1 | `primitives.krf`, `types.krf` | None |
| Spine (Temporal) | 2 | `epochs.krf`, `units.krf`, `lifecycle.krf`, `encoding.krf` | Kernel |
| Spine (Spatial) | 3 | `geospatial.krf`, `topological.krf`, `theoretical.krf` | Kernel |
| Knowledge | 4 | All 12 knowledge files | Kernel |
| Reference | 5 | `knowledge-primitives.krf`, `convex-hull.krf` | Kernel |
| Agent | 6 | `identity.krf`, `observer.krf`, `directives.krf` | All above |

All six phases complete → `(containerOperational ThisContainer)` → Charlotte is alive.

Domain seed loads after boot → `(domainBinding Charlotte ?DOMAIN)` → Charlotte is bound.
