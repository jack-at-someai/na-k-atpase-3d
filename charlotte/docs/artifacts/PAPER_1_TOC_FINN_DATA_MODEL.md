# Paper 1: FINN Data Model
## Signal-Based Temporal Graph Architecture

**Target Venue:** IEEE Transactions on Knowledge and Data Engineering (TKDE)
**Target Length:** 12-14 pages (IEEE double-column format)

---

## I. Introduction (1.5 pages)

### I-A. The Attribute-Based Metric Problem
Five failure modes: staleness, drift, coupling, lost history, inconsistency.

### I-B. The FINN Principle
"All temporal data flows through signals. Metrics are computed, never stored."

### I-C. Contributions
1. Formal definition of signal-based temporal graph architecture
2. Five-primitive model (NODE, EDGE, METRIC, SIGNAL, PROTOCOL)
3. Query algebra for traversal-based metric computation
4. Cross-domain validation
5. Production implementation with performance analysis

---

## II. Related Work (1.5 pages)

### II-A. Temporal Databases
TSQL2, SQL:2011 temporal extensions, bi-temporal models.

### II-B. Event Sourcing and CQRS
Fowler's pattern, key distinctions from FINN.

### II-C. Graph Databases
Neo4j, Neptune, TigerGraph - metrics stored as properties limitation.

### II-D. Time Series Databases
InfluxDB, TimescaleDB - entity relationships not first-class.

### II-E. Knowledge Graph Temporal Extensions
Temporal knowledge graph completion, dynamic knowledge graphs.

---

## III. FINN Architecture (2.5 pages)

### III-A. The Five FACT Primitives

**NODE:** Identity with lifecycle. NO computed values, NO counts, NO aggregates.

**EDGE:** Directional connections. Semantic types (OWNS, MEMBER_OF, SIRE_OF).

**METRIC:** Measurement definition. Value type constraints.

**SIGNAL:** Time-indexed observation. Append-only, never updated.

**PROTOCOL:** Expectation generator. Checkpoints with expected values.

### III-B. Graph Layer vs Feature Layer
- Graph Layer: NODE ←EDGE→ NODE
- Feature Layer: NODE ← METRIC ← SIGNAL

### III-C. Time as Graph (Temporal Substrate)
DATE nodes, TIME nodes, NEXT edges, event anchoring.

### III-D. Space as Graph (Spatial Substrate)
COUNTRY → STATE → CITY hierarchy with LOCATED_IN edges.

### III-E. The Gravitational Model
Entity influence derived from signal density and edge connectivity.

---

## IV. Formal Model (2 pages)

### IV-A. Definitions

**Definition 1 (Temporal Graph):**
```
G = (V, E, M, S, P, T, τ)
```

**Definition 2 (Signal):**
```
s = (v, m, val, t, src)
```

**Definition 3 (Derived Metric - Point Query):**
```
current(v, m) = val(argmax_{s∈S(v,m)} τ(s))
```

**Definition 4 (Temporal Aggregation):**
```
aggregate(v, m, [t₁, t₂], op) = op({val(s) | s∈S(v,m), t₁≤τ(s)≤t₂})
```

**Definition 5 (Traversal Metric):**
```
traversal_metric(v, edge_pattern, signal_filter, agg)
```

### IV-B. Invariants

**Invariant 1:** Signals are append-only.
**Invariant 2:** Nodes store no computed aggregates.
**Invariant 3:** All signals temporally grounded.
**Invariant 4:** Edges only connect nodes to nodes.

### IV-C. Query Algebra

| Operator | Symbol | Definition |
|----------|--------|------------|
| Select | σ | σ_φ(S) = {s∈S \| φ(s)} |
| Project | π | π_attr(S) = {s.attr \| s∈S} |
| Temporal Window | ω | ω_{[t1,t2]}(S) |
| Aggregate | γ | γ_{v,m,op}(S) |
| Traverse | ρ | ρ_{pattern}(v) |
| Join | ⋈ | S ⋈_θ E |

### IV-D. Complexity Analysis

| Operation | Complexity |
|-----------|------------|
| Point query | O(log n) |
| Temporal aggregation | O(k) |
| Traversal metric | O(d × b) |
| Signal insertion | O(1) |

---

## V. Algorithms (2 pages)

### V-A. Algorithm 1: Signal-Based Current Value Query
```
CurrentValue(v, m) → Most recent signal value
Complexity: O(log n)
```

### V-B. Algorithm 2: Temporal Aggregation
```
TemporalAggregate(v, m, t1, t2, op) → Aggregated value
Complexity: O(k)
```

### V-C. Algorithm 3: Traversal-Based Metric Computation
```
TraversalMetric(v, edge_pattern, metric, depth, agg)
```

### V-D. Algorithm 4: Pedigree Depth Computation
```
PedigreeDepth(animal) → Maximum ancestral depth
Complexity: O(2^d), O(n) with memoization
```

### V-E. Algorithm 5: Signal Density Computation
```
SignalDensity(v, time_window) → Signals per unit time
```

### V-F. Algorithm 6: Protocol Checkpoint Evaluation
```
EvaluateProtocol(protocol_id) → [(checkpoint, status, deviation)]
```

---

## VI. Implementation (1.5 pages)

### VI-A. Technology Stack
Firebase Firestore, single `facts` collection, Flutter client.

### VI-B. Register-Based Document Structure
```json
{
  ":ID": "unique-identifier",
  ":TYPE": "NODE | EDGE | METRIC | SIGNAL | PROTOCOL",
  ":CREATED": "DATE:M-d-yyyy",
  "P0": "primary register",
  "P1": "secondary register",
  "P2": "tertiary register",
  "P3": "quaternary register"
}
```

### VI-C. Indexing Strategy
Composite indexes on (:TYPE, P0, :CREATED).

### VI-D. Query Pattern Examples

---

## VII. Experimental Evaluation (2 pages)

### VII-A. Dataset Description

| Entity Type | Count |
|-------------|-------|
| HUMAN nodes | ~8,500 |
| OPERATION nodes | ~14,400 |
| CITY nodes | 4,236 |
| **Total Nodes** | ~27,200 |
| **Total Edges** | ~46,100 |

### VII-B. Experiment 1: Metric Accuracy
Attribute-based shows increasing drift; FINN shows zero drift.

### VII-C. Experiment 2: Query Performance

| Query Type | Attribute-Based | FINN |
|------------|-----------------|------|
| Point lookup (cached) | O(1) | O(log n) |
| Count (accurate) | O(n) | O(k) |
| History query | N/A | O(k) |

### VII-D. Experiment 3: Storage Overhead
Signal-based: ~10x storage for full history. Trade-off for accuracy.

### VII-E. Experiment 4: Cross-Domain Structural Convergence
Four domains (LineLeap, Showpigs, ISG, Violins) share identical structure.

---

## VIII. Discussion (1 page)

### VIII-A. Limitations
Query complexity, storage growth, Firestore-specific constraints.

### VIII-B. Trade-offs
Consistency vs. computation overhead.

### VIII-C. When to Use FINN
Historical accuracy critical, complex relationships, audit trails required.

### VIII-D. Future Work
GNN integration, signal compression, native temporal graph databases.

---

## IX. Conclusion (0.5 pages)

FINN transforms databases from "snapshots that drift" to "living models that compute truth from structure."

---

## Figures

1. Attribute drift over time
2. Five-primitive architecture
3. Graph layer vs feature layer
4. Time as graph (temporal spine)
5. Signal-based vs attribute-based comparison
6. Query performance comparison
7. Cross-domain convex hull
8. Register-based document structure

---

## Page Budget

| Section | Pages |
|---------|-------|
| Introduction | 1.5 |
| Related Work | 1.5 |
| Architecture | 2.5 |
| Formal Model | 2.0 |
| Algorithms | 2.0 |
| Implementation | 1.5 |
| Evaluation | 2.0 |
| Discussion | 1.0 |
| Conclusion | 0.5 |
| **TOTAL** | **14.0** |

---

*Generated by CHARLOTTE planning agent. 2026-02-05*
