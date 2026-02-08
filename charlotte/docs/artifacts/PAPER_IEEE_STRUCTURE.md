# IEEE Paper Structure

## FINN: A Signal-Based Temporal Graph Architecture for Observable Systems

**Target Venue:** IEEE Transactions on Knowledge and Data Engineering (TKDE) or IEEE International Conference on Data Engineering (ICDE)

**Paper Type:** Full Research Paper (10-12 pages)

---

## Title Options

1. **FINN: Signal-Based Temporal Graphs for Observable Reality**
2. **Beyond Attribute Storage: A Temporal Graph Architecture Where Metrics Emerge from Structure**
3. **Observable Systems: Eliminating Metric Drift Through Signal-Based Graph Architecture**

---

## Abstract (~200 words)

**Problem:** Traditional database architectures store computed metrics as entity attributes, creating snapshots that diverge from reality through staleness, drift, and update coupling.

**Solution:** FINN (Framework for Integrated Neural Networks), a graph-native architecture where temporal data flows through append-only signals. Metrics are computed through graph traversal at query time, never stored.

**Validation:** Cross-domain validation across four radically different systems (human behavior, biological lifecycles, mechanical equipment, cultural artifacts) plus a production implementation tracking ~60,000 breeders and ~14,400 operations.

**Results:** Elimination of metric drift, complete temporal history preservation, and emergent analytics without architectural changes across domains.

**Keywords:** temporal graphs, signal processing, knowledge graphs, append-only architecture, event sourcing, observable systems

---

## I. Introduction (1.5 pages)

### A. The Attribute-Based Metric Problem
- Staleness: Values accurate only at write time
- Drift: Accumulated counters diverge from truth
- Coupling: Every transaction must update multiple counters
- Lost history: Current state without trajectory
- Inconsistency: Distributed updates create race conditions

### B. Motivating Example
- Breeding operation tracking animal counts, pedigree depth, total sales
- Show how attribute-based approach fails over time
- Contrast with signal-based approach

### C. Contributions
1. Formal definition of signal-based temporal graph architecture
2. Five-primitive model (NODE, EDGE, METRIC, SIGNAL, PROTOCOL)
3. Cross-domain validation across four radically different systems
4. Production implementation with performance analysis

### D. Paper Organization
- Section II: Related Work
- Section III: FINN Architecture
- Section IV: Formal Model
- Section V: Cross-Domain Validation
- Section VI: Implementation
- Section VII: Evaluation
- Section VIII: Discussion
- Section IX: Conclusion

---

## II. Related Work (1 page)

### A. Temporal Databases
- Temporal relational models (TSQL2, SQL:2011)
- Bi-temporal databases (valid time vs. transaction time)
- Limitations: Still attribute-based, schema-bound

### B. Event Sourcing & CQRS
- Fowler's event sourcing pattern
- Command Query Responsibility Segregation
- Relationship to FINN: FINN generalizes beyond single aggregates

### C. Graph Databases
- Property graphs (Neo4j, Amazon Neptune)
- RDF and knowledge graphs
- Temporal extensions to property graphs
- Limitation: Metrics still stored as properties

### D. Time Series Databases
- InfluxDB, TimescaleDB, Prometheus
- Optimized for high-frequency numeric signals
- Limitation: Entity relationships not first-class

### E. Knowledge Graph Architectures
- Google Knowledge Graph, Wikidata
- Temporal knowledge graphs
- FINN contribution: Signals as first-class temporal primitives

---

## III. FINN Architecture (2 pages)

### A. Core Principle
> "All temporal data flows through signals. Metrics are computed, never stored."

### B. The Five Primitives

#### 1. NODE (Identity)
- Immutable identity
- Categories (classification)
- State (current condition flags)
- NO computed values, NO counts, NO aggregates

#### 2. EDGE (Relationship)
- Directional connections between nodes
- Edge types with semantic meaning
- Append-only (relationships have history)

#### 3. METRIC (Measurement Definition)
- Defines what can be measured on a node
- Value type constraints (NUMBER, STRING, BOOLEAN, ENUM)
- Immutable once created

#### 4. SIGNAL (Observation)
- Time-indexed observation of a metric on a node
- Append-only, never updated or deleted
- Source attribution (USER, SYSTEM, AGENT)

#### 5. PROTOCOL (Expectation)
- Agent-generated forecast of future signals
- Checkpoints with expected values at target dates
- Links expectations to reality without modifying history

### C. Graph Layer vs. Feature Layer
- Graph Layer: NODE ←EDGE→ NODE (topology)
- Feature Layer: NODE ← METRIC ← SIGNAL (feature vectors)
- Clean separation enables feature engineering without graph pollution

### D. Time as Graph
- DATE and TIME nodes as first-class entities
- Temporal spine (NEXT edges between dates)
- Events as edges to temporal nodes
- Shared temporal substrate across all users

### E. The Gravitational Model
- Entity influence derived from signal density and edge connectivity
- Computed at query time, never stored
- Emergent "neural network" from graph structure

---

## IV. Formal Model (1.5 pages)

### A. Definitions

**Definition 1 (Temporal Graph).** A temporal graph G = (V, E, M, S, P, τ) where:
- V = set of nodes (identities)
- E = set of edges (relationships)
- M = set of metrics (measurement definitions)
- S = set of signals (observations)
- P = set of protocols (expectations)
- τ: S → T maps signals to temporal nodes

**Definition 2 (Signal).** A signal s = (v, m, val, t, src) where:
- v ∈ V (target node)
- m ∈ M (metric being measured)
- val ∈ domain(m) (observed value)
- t ∈ T (temporal reference)
- src ∈ {USER, SYSTEM, AGENT} (source)

**Definition 3 (Derived Metric).** For node v and metric m, the current value is:
```
current(v, m) = val(argmax_{s ∈ S(v,m)} τ(s))
```
where S(v,m) = {s ∈ S | s.v = v ∧ s.m = m}

### B. Invariants

**Invariant 1 (Immutability).** ∀s ∈ S: s is append-only. Corrections append new signals.

**Invariant 2 (Derivability).** No node stores computed aggregates. All metrics are derived from S and E.

**Invariant 3 (Temporal Grounding).** ∀s ∈ S: τ(s) references a node in T (temporal layer).

### C. Query Algebra
- Signal aggregation: COUNT, SUM, AVG, MAX, MIN over S(v, m, [t₁, t₂])
- Graph traversal: Metrics computed via edge traversal
- Temporal windowing: Signals filtered by temporal range

### D. Complexity Analysis
- Point query: O(log n) with temporal indexing
- Aggregation: O(k) where k = signals in window
- Traversal metrics: O(d × b) where d = depth, b = branching factor

---

## V. Cross-Domain Validation (2 pages)

### A. The Convex Hull Thesis
If the same architecture models radically different domains without modification, it is infrastructure, not a vertical solution.

### B. Domain 1: Human Behavior (LineLeap)
- **Lifecycle:** 4 years (college students)
- **Signals:** Venue choice, arrival time, spend, drink selection
- **Key insight:** Prediction quality increases as trajectories lengthen
- **FINN mapping:** Students as nodes, nights out as signals

### C. Domain 2: Biological Systems (Sounder/Trogdon Showpigs)
- **Lifecycle:** Months (breeding cycles)
- **Signals:** Pairings, litter outcomes, growth curves, feeding protocols
- **Key insight:** Outcomes cannot be optimized directly—only trajectories can be shaped
- **FINN mapping:** Sows as nodes, breeding events as signals, pedigree as edges

### D. Domain 3: Mechanical Systems (Industrial Service Group)
- **Lifecycle:** Years (equipment life)
- **Signals:** Vibration, temperature, pressure, service actions
- **Key insight:** Prediction is detecting deviation early, not forecasting failure dates
- **FINN mapping:** Equipment as nodes, sensor readings and repairs as signals

### E. Domain 4: Cultural Artifacts (Prier Violins)
- **Lifecycle:** Centuries
- **Signals:** Ownership transfers, restorations, certifications, expert valuations
- **Key insight:** Value is the integrity of the story
- **FINN mapping:** Violins as nodes, provenance events as signals, expert authority as signal source weight

### F. Structural Convergence
All four domains share: identities → signals → time → expectations → drift

---

## VI. Implementation (1.5 pages)

### A. Technology Stack
- Database: Firebase Firestore (document-based)
- Single collection: `facts` containing all five primitives
- Client: Flutter (cross-platform mobile/web)
- Functions: Cloud Functions for complex validation

### B. Document Structure
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

### C. Register-Based Encoding
- Fixed positional registers (P0-P3) enable consistent querying
- Type-specific semantics (NODE.P0 = category, EDGE.P0 = from, etc.)
- Potential for fixed-width encoding (256-bit)

### D. Query Patterns
- Current value: Filter signals by node+metric, order by timestamp, limit 1
- Aggregation: Filter signals by node+metric+range, aggregate
- Traversal: BFS/DFS over edges, aggregate signals at each node

### E. Indexing Strategy
- Composite indexes on (type, P0, :CREATED)
- Temporal partitioning for archival

---

## VII. Evaluation (1.5 pages)

### A. Dataset: Unified Swine Registry
| Entity Type | Count |
|-------------|-------|
| HUMAN nodes | ~8,500 |
| OPERATION nodes | ~14,400 |
| CITY nodes | 4,236 |
| STATE nodes | 50 |
| REGISTRY nodes | 4 |
| OWNS edges | ~14,400 |
| MEMBER_OF edges | ~14,400 |
| LOCATED_IN edges | ~17,300 |
| **Total nodes** | ~27,200 |
| **Total edges** | ~46,100 |

### B. Metric Accuracy
- Compare derived metrics vs. attribute-based snapshots over time
- Measure drift in attribute-based system
- FINN: Zero drift by design (always computed from current state)

### C. Query Performance
| Query Type | Attribute-Based | FINN |
|------------|-----------------|------|
| Point lookup | O(1) | O(log n) |
| Count (stale) | O(1) | N/A |
| Count (accurate) | O(n) | O(k) |
| History | Not available | O(k) |
| Trajectory | Not available | O(k) |

### D. Storage Overhead
- Signals vs. attributes: ~10x storage for full history
- Trade-off: Storage for temporal completeness and accuracy

### E. Scalability Projections
- Future: ~2M animal nodes, ~10M+ signals/year
- Mitigation: Temporal partitioning, signal rollups, cold storage

---

## VIII. Discussion (0.5 pages)

### A. Limitations
- Query complexity for real-time dashboards
- Storage growth with high-frequency signals
- Firestore IN operator limitations (batching required)

### B. Trade-offs
- Immediate consistency vs. eventual computation
- Storage efficiency vs. temporal completeness
- Query simplicity vs. derivation overhead

### C. Future Work
- Graph neural network integration for prediction
- Signal compression and rollup strategies
- Migration to native temporal graph databases

---

## IX. Conclusion (0.5 pages)

- FINN eliminates metric drift through signal-based architecture
- Cross-domain validation proves infrastructure-level generality
- Production implementation demonstrates practical feasibility
- Open question: Optimal balance between computation and materialization

---

## References (~30 citations)

### Temporal Databases
- [1] Snodgrass, R. T. (1999). Developing Time-Oriented Database Applications in SQL.
- [2] Jensen, C. S., et al. (1994). A consensus glossary of temporal database concepts.

### Event Sourcing
- [3] Fowler, M. (2005). Event Sourcing. martinfowler.com
- [4] Young, G. (2010). CQRS Documents.

### Graph Databases
- [5] Robinson, I., et al. (2015). Graph Databases. O'Reilly.
- [6] Angles, R., & Gutierrez, C. (2008). Survey of graph database models.

### Knowledge Graphs
- [7] Hogan, A., et al. (2021). Knowledge Graphs. ACM Computing Surveys.
- [8] Leblay, J., & Chekol, M. W. (2018). Deriving validity time in knowledge graphs.

### Time Series
- [9] Jensen, S. K., et al. (2017). Time series management systems: A survey.

### Data Architecture
- [10] Kleppmann, M. (2017). Designing Data-Intensive Applications. O'Reilly.

### Graph Neural Networks
- [11] Hamilton, W. L. (2020). Graph Representation Learning. Morgan & Claypool.
- [12] Kipf, T. N., & Welling, M. (2017). Semi-Supervised Classification with GCNs.

---

## Appendices (if space permits)

### A. FINN Compliance Checklist
- Does the node store any counts? (VIOLATION)
- Does the node store any sums/averages? (VIOLATION)
- Can the metric be derived from edges? (USE TRAVERSAL)
- Can the metric be derived from signals? (USE AGGREGATION)

### B. Signal Metrics Library
Standard metrics for the swine domain with types and constraints.

### C. Migration Guide
Converting attribute-based systems to FINN.

---

## Figures

1. **Figure 1:** Attribute drift over time (staleness problem)
2. **Figure 2:** FINN architecture diagram (5 primitives)
3. **Figure 3:** Graph layer vs. feature layer
4. **Figure 4:** Time as graph (temporal spine)
5. **Figure 5:** Cross-domain convex hull visualization
6. **Figure 6:** Query performance comparison
7. **Figure 7:** Signal density correlation with prediction accuracy

---

## Tables

1. **Table I:** Five primitives and their registers
2. **Table II:** Cross-domain validation summary
3. **Table III:** Dataset statistics
4. **Table IV:** Query performance comparison
5. **Table V:** Storage overhead analysis

---

*Structure drafted: 2026-02-05*
*Target length: 10-12 pages (IEEE two-column format)*
