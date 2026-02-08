# Paper 5: Domain Modeling
## Universal Ontology Through Register-Based Primitives

**Target Venue:** ACM/IEEE International Conference on Model-Driven Engineering (MODELS)
**Target Length:** 12-15 pages

---

## 1. Introduction (1.5 pages)

### 1.1 The Schema Proliferation Problem
Domain-specific ontologies fragment interoperability. Cost of maintaining parallel schemas.

### 1.2 The Charlotte Hypothesis
Universal substrate for observable reality. Five primitives as sufficient and necessary vocabulary.

### 1.3 Contributions
1. Formal definition of register-based primitives
2. Proof of expressiveness across four domains
3. Category-theoretic foundations for ontology unification

---

## 2. Background and Related Work (1.5 pages)

### 2.1 Traditional Ontology Engineering
OWL/RDF approaches. Class hierarchy explosion problem.

### 2.2 Event Sourcing and Temporal Databases
Fowler's pattern, temporal extensions.

### 2.3 Domain-Specific Languages vs Universal Substrates
Why DSLs create vertical silos.

---

## 3. The Five Primitives as Universal Ontology (2 pages)

### 3.1 NODE: Identity with Lifecycle
```
NODE := (id: ID, category: CAT, created: DATE)
```
OWL mapping: owl:Class instantiation without embedded hierarchy.

### 3.2 EDGE: First-Class Relationship
```
EDGE := (from: ID, to: ID, type: REL, created: DATE)
```
RDF mapping: Reified triples with temporal provenance.

### 3.3 METRIC: Measurement Definition
```
METRIC := (node: ID, dtype: TYPE, label: STRING, constraints: SPEC)
```
OWL mapping: owl:DatatypeProperty with domain restriction.

### 3.4 SIGNAL: Temporal Observation
```
SIGNAL := (node: ID, metric: ID, value: V, created: DATE)
```
RDF mapping: Temporal reification with provenance.

### 3.5 PROTOCOL: Expectation Generator
```
PROTOCOL := (node: ID, schedule: PLAN, requirements: SPEC)
```
No direct OWL equivalent: procedural expectation forecasting.

---

## 4. The Convex Hull: Four Domain Case Studies (3 pages)

### 4.1 LineLeap: Human Behavior Modeling
HUMAN→NODE, PURCHASE→SIGNAL, VENUE→NODE, VISITED→EDGE.
**Key insight:** Prediction quality increases with trajectory length.

### 4.2 Sounder: Biological Systems
SOW→NODE, BOAR→NODE, LITTER→SIGNAL, SIRED_BY→EDGE.
**Key insight:** Outcomes cannot be optimized directly, only trajectories shaped.

### 4.3 Industrial Service Group: Mechanical Systems
COMPRESSOR→NODE, VIBRATION→SIGNAL, SERVICED_BY→EDGE.
**Key insight:** Prediction is deviation detection, not failure forecasting.

### 4.4 Prier Violins: Cultural Artifacts
VIOLIN→NODE, VALUATION→SIGNAL, OWNED_BY→EDGE.
**Key insight:** Value is the integrity of the story.

### Convergence Table

| Domain | NODE | Metrics | Edges | Lifecycle |
|--------|------|---------|-------|-----------|
| LineLeap | HUMAN | spend, visits | VISITED | 4 years |
| Sounder | SOW, BOAR | weight, litter_size | SIRED_BY | 3-5 years |
| ISG | EQUIPMENT | vibration, temp | SERVICED_BY | 10-20 years |
| Prier | VIOLIN | valuation | OWNED_BY | 100-300 years |

---

## 5. Category Theory Foundations (2 pages)

### 5.1 The Charlotte Category
```
Objects: Ob(Charlotte) = {NODE, EDGE, METRIC, SIGNAL, PROTOCOL}

Morphisms:
  METRIC → NODE    (P0 attachment)
  SIGNAL → NODE    (P0 reference)
  SIGNAL → METRIC  (P1 reference)
  EDGE → NODE×NODE (P0,P1 endpoints)
  PROTOCOL → NODE  (P0 target)
```

### 5.2 Functors for Domain Mapping
- Forgetful functor F: Domain → Charlotte
- Inclusion functor I: Charlotte → Domain
- Natural transformation: Domain migration as functor composition

### 5.3 The Signal Monoid
Signals form a monoid under temporal concatenation.
- Identity: Empty signal history
- Associativity: Signal streams compose

### 5.4 Time as a Natural Transformation
DATE nodes as objects in temporal category. Protocols as natural transformations.

---

## 6. Formal Properties (1.5 pages)

### 6.1 Completeness: Expressive Power
**Theorem:** Any domain expressible in OWL-DL can be expressed in Charlotte.

### 6.2 Minimality: No Redundant Primitives
**Theorem:** Removing any primitive reduces expressiveness.
- Without NODE: Cannot distinguish identities
- Without EDGE: Cannot express relationships
- Without METRIC: Cannot type observations
- Without SIGNAL: Cannot capture temporal truth
- Without PROTOCOL: Cannot express expectations

### 6.3 Orthogonality: Non-Overlapping Concerns
**Theorem:** Primitives address disjoint modeling concerns.
Graph layer (NODE, EDGE) vs Feature layer (METRIC, SIGNAL, PROTOCOL).

---

## 7. Extensibility Patterns (1.5 pages)

### 7.1 Schema-Free Evolution
New domain = New categories (NODE P0 values).
New measurements = New METRICs.
No migration scripts.

### 7.2 The Vocabulary Layer Pattern
- Charlotte: Fixed infrastructure (5 primitives)
- Domain: Variable vocabulary (categories, metrics, edge types)
- Industry apps: Scoped views on shared substrate

### 7.3 Backward Compatibility Guarantees
Append-only signals preserve history. Category evolution via new values.

### 7.4 Cross-Domain Interoperability
Shared temporal substrate (DATE nodes). Container merging.

---

## 8. Implementation and Evaluation (1.5 pages)

### 8.1 Implementation Architecture
Single `facts` collection in Firestore. Register-based document structure.

### 8.2 Evaluation: Four-Domain Case Study

| Metric | Charlotte | Domain-Specific DB |
|--------|-----------|-------------------|
| Schema changes for new metric | 0 | 1+ migrations |
| Cross-domain query | Native | Impossible |
| New domain onboarding | Hours | Weeks |

### 8.3 Performance Characteristics
27K nodes, 46K edges, millions of signals.

---

## 9. Discussion (0.5 pages)

### 9.1 Limitations
Traversal cost, signal volume at scale, learning curve.

### 9.2 Trade-offs
Expressiveness vs performance. Universal schema vs domain optimization.

### 9.3 Implications
Move from class hierarchies to signal streams. Time as primary organizing principle.

---

## 10. Conclusion (0.5 pages)

### 10.1 Summary
Five primitives as universal domain modeling vocabulary. Category-theoretic foundations. Empirical validation across four domains.

### 10.2 Future Work
Automated domain vocabulary extraction. Ontology learning from signal patterns.

---

## Key Figures

1. Register layout diagram
2. OWL/RDF mapping diagram
3. Four-domain convex hull
4. Category theory diagram
5. Extensibility pattern flowchart

## Key Tables

1. Primitive definitions with formal semantics
2. Domain mapping patterns
3. Expressiveness comparison

---

## Page Budget

| Section | Pages |
|---------|-------|
| Introduction | 1.5 |
| Background | 1.5 |
| Five Primitives | 2.0 |
| Convex Hull | 3.0 |
| Category Theory | 2.0 |
| Formal Properties | 1.5 |
| Extensibility | 1.5 |
| Implementation | 1.5 |
| Discussion | 0.5 |
| Conclusion | 0.5 |
| **TOTAL** | **15.5** |

---

*Generated by CHARLOTTE planning agent. 2026-02-05*
