# Paper 4: Substrate Architecture
## Containerized Neural Networks with Register-Based Primitives

**Target Venue:** IEEE Software
**Target Length:** 10-12 pages

---

## I. Introduction (1.5 pages)

### A. The Collection Sprawl Problem
Traditional systems create separate collections per entity type → schema explosion, migration complexity, fragmented queries.

### B. The Runtime Context Problem
Traditional systems compute temporal/spatial context at query time → repeated work, timezone bugs, validation gaps.

### C. The Substrate Solution
Single collection with register-based documents. Pre-built temporal/spatial planes as shared bottomsoil.

### D. Contributions
1. Register-based document design
2. Pre-built substrate planes with container isolation
3. Time-as-graph pattern
4. Firestore implementation with performance characteristics

---

## II. Background and Related Work (1 page)

### A. Multi-Tenant Database Architectures
Shared-database approaches. Limitation: no shared semantic layer.

### B. Knowledge Graph Architectures
Property graphs, document stores. Limitation: each deployment isolated.

### C. Event Sourcing and CQRS
Fowler's pattern. Limitation: events are system-specific.

### D. Temporal and Spatial Databases
Bi-temporal models, PostGIS. Limitation: time/space as attributes, not entities.

---

## III. The Register-Based Document Model (2 pages)

### A. The FACT as Universal Primitive
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

### B. The Five Types and Their Register Semantics

| Type | P0 | P1 | P2 | P3 |
|------|----|----|----|----|
| NODE | category | — | — | — |
| EDGE | from_node | to_node | edge_type | — |
| METRIC | node_id | value_type | label | constraints |
| SIGNAL | node_id | metric_id | value | protocol_id |
| PROTOCOL | node_id | schedule | requirements | — |

### C. Graph Layer vs. Feature Layer
- Graph Layer: NODE and EDGE (explicit topology)
- Feature Layer: METRIC and SIGNAL (implicit feature vectors)

### D. Benefits of Single-Collection Design
- Clean exports (dump one collection)
- Consistent indexing
- No collection sprawl
- Transactional integrity

---

## IV. Substrate Planes as Shared Infrastructure (2 pages)

### A. The Temporal Substrate

#### DATE Nodes
```json
{":ID": "DATE:1-30-2026", ":TYPE": "NODE", "P0": "DATE"}
```

#### Temporal Spine (NEXT Edges)
```json
{":ID": "T:1", ":TYPE": "EDGE", "P0": "DATE:1-29-2026", "P1": "DATE:1-30-2026", "P2": "NEXT"}
```

#### Hierarchical Planes
YEAR > QUARTER > MONTH > WEEK > DATE

### B. The Spatial Substrate
COUNTRY > STATE > CITY with LOCATED_IN edges.

### C. Industry-Specific Planes
REGISTRY > BREED for livestock. EQUIPMENT_TYPE > MODEL for industrial.

### D. The Seed/Soil Metaphor
- **Seeds:** Operation-specific NODEs, EDGEs, SIGNALs
- **Roots:** LOCATED_IN edges to CITY, :CREATED references to DATE
- **Soil:** Pre-built, immutable temporal and spatial planes

---

## V. Container Architecture and Isolation (1.5 pages)

### A. Container Deployment Parameters
```
TEMPORAL BOUNDS: start_date, end_date
SPATIAL FOCUS: center_lat, center_lon, radius_km
OPERATION IDENTITY: name, industry
```

### B. Substrate Generation on Deploy
Charlotte generates the slice of reality for this container.

### C. Tenant Isolation Patterns
- Operation-specific nodes: unique ID prefixes
- Shared substrate nodes: universal IDs (DATE:1-30-2026)
- Query routing: filter by prefix + traverse shared substrate

### D. Container Merging
Containers share substrate structure → merge is overlay on shared spacetime grid.

---

## VI. Implementation Patterns (1.5 pages)

### A. Substrate Pre-Seeding
```dart
for (date in dateRange) {
  await facts.add(NodeFact(id: dateNodeId(date), category: 'DATE'));
  await facts.add(EdgeFact(from: prev, to: dateNodeId(date), type: 'NEXT'));
}
```

### B. Lazy Spatial Expansion
Core regions pre-built at deploy, new CITY nodes added on first reference.

### C. Temporal Reference Pattern
```dart
// Traditional: { "created_at": "2026-01-30T14:30:00Z" }
// Substrate:   { ":CREATED": "DATE:1-30-2026" }
```

### D. Query Patterns
- Point query: FILTER + ORDER BY :CREATED DESC + LIMIT 1
- Temporal range: TRAVERSE via NEXT edges
- Spatial query: TRAVERSE via LOCATED_IN edges

### E. Indexing Strategy
Composite indexes on (:TYPE, P0, :CREATED).

---

## VII. Comparison with Traditional Architectures (1 page)

### A. Schema Design Comparison

| Aspect | Traditional | Substrate |
|--------|-------------|-----------|
| Collections | N (per entity) | 1 (facts) |
| Schema changes | Migration | Add new type |
| Temporal data | Timestamp | DATE node ref |

### B. Multi-Tenancy Comparison

| Aspect | Traditional | Substrate |
|--------|-------------|-----------|
| Isolation | Database per tenant | ID prefix |
| Shared infra | None | Temporal + spatial |
| Merge ops | Migration | Overlay |

### C. Temporal Handling Comparison

| Operation | Traditional | Substrate |
|-----------|-------------|-----------|
| "Last 7 days" | Date arithmetic | 7 NEXT hops |
| "This quarter" | Complex logic | Pre-indexed subgraph |
| AI dates | Can hallucinate | Constrained to nodes |

---

## VIII. Performance Characteristics (1 page)

### A. Substrate Pre-Building Cost
5-year spine: ~1,826 DATE nodes + ~1,825 NEXT edges. One-time cost.

### B. Query Performance

| Query Type | Traditional | Substrate |
|------------|-------------|-----------|
| Temporal context | O(n) per query | O(1) pre-built |
| Spatial radius | O(n) with calc | O(k) traversal |
| Cross-tenant | O(t×n) | O(k) on shared |

### C. The Edge Density Insight
"The edge density of the substrate IS the speedup."

### D. Storage Trade-offs
~10,000 nodes/edges per container. Trade storage for O(1) context.

---

## IX. Discussion (0.5 pages)

### A. Limitations
Initial generation cost, Firestore batching limits, not optimal for high-frequency signals.

### B. When to Use Substrate Architecture
Multi-tenant with shared semantics, cross-domain queries, AI validation requirements.

### C. Future Work
GNN integration, substrate versioning, federation.

---

## X. Conclusion (0.5 pages)

1. Single collection with register-based documents can model any domain
2. Pre-built substrate amortizes context-building across all queries
3. Containerized operations share infrastructure while maintaining isolation
4. Time-as-graph eliminates client-side bugs and AI hallucinations

---

## Figures

1. Traditional vs. Substrate Architecture
2. Register-Based Document Structure
3. Seed/Soil Metaphor
4. Temporal Spine Structure
5. Container Merging

## Tables

1. Register Semantics
2. Architecture Comparison Matrix
3. Query Performance Benchmarks

---

## Page Budget

| Section | Pages |
|---------|-------|
| Introduction | 1.5 |
| Background | 1.0 |
| Register-Based Model | 2.0 |
| Substrate Planes | 2.0 |
| Container Architecture | 1.5 |
| Implementation | 1.5 |
| Comparison | 1.0 |
| Performance | 1.0 |
| Discussion | 0.5 |
| Conclusion | 0.5 |
| **TOTAL** | **12.5** |

---

*Generated by CHARLOTTE planning agent. 2026-02-05*
