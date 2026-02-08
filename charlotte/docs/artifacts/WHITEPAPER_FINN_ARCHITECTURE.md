# FINN: Framework for Integrated Neural Networks

**A Temporal Graph Architecture for Observable Reality**

---

## Abstract

Traditional database architectures store computed metrics as attributes on entities, creating stale snapshots that diverge from reality over time. This paper introduces FINN (Framework for Integrated Neural Networks), a graph-native architecture where all temporal data flows through **signals**—append-only observations indexed by time. Nodes represent entities with immutable identity; edges represent relationships; signals represent observations. Metrics are never stored as attributes but computed through graph traversal at query time. This creates an **emergent neural network** where entity influence (gravitational pull) is derived from signal density and edge connectivity rather than cached counters. We demonstrate FINN through a unified swine registry system containing ~60,000 unique breeders, ~14,400 operations, and ~4,200 geographic nodes, with pedigrees threading temporally through the spatial network. The architecture enables cross-registry pedigree traversal, real-time analytics, and a natural representation of how events propagate through interconnected systems.

**Keywords:** temporal graphs, signal processing, knowledge graphs, append-only architecture, event sourcing, neural networks, observable systems

---

## I. Introduction

### A. The Problem with Attribute-Based Metrics

Consider a breeding operation tracking animal counts:

```
// ANTI-PATTERN: Attribute-based metrics
OPERATION {
  id: "OPERATION:NSR:RJWP",
  label: "Wildung Family Hampshires",
  animal_count: 47,        // ← Stale the moment it's written
  pedigree_depth: 8,       // ← Must be manually updated
  total_sales: 125000      // ← Accumulator that can drift
}
```

This approach suffers from fundamental flaws:

1. **Staleness**: The `animal_count` is accurate only at write time
2. **Drift**: Accumulated values can diverge from truth through failed updates
3. **Coupling**: Every animal transaction must update the operation's counter
4. **Lost History**: We know the current count but not the trajectory
5. **Inconsistency**: Distributed updates create race conditions

### B. The FINN Principle

FINN inverts this model:

> **All temporal data flows through signals. Metrics are computed, never stored.**

```
// FINN: Signal-based architecture
OPERATION {
  id: "OPERATION:NSR:RJWP",
  label: "Wildung Family Hampshires",
  // No counts, no accumulators, no computed values
}

// Animal count = COUNT(edges WHERE type=BRED_BY AND to=OPERATION:NSR:RJWP)
// Pedigree depth = MAX(recursive SIRE_OF/DAM_OF traversal)
// Total sales = SUM(signals WHERE metric=SALE_PRICE AND node IN animals_here)
```

The graph becomes a **living system** where truth emerges from structure.

---

## II. Core Architecture

### A. The Three Primitives

FINN operates on exactly three primitives:

#### 1. Nodes (Entities)

Nodes represent things that exist. They have:
- **Identity**: Immutable ID (e.g., `HUMAN:PHONE:3207601810`)
- **Categories**: Classification tags (e.g., `["HUMAN"]`, `["OPERATION"]`)
- **State**: Current condition flags (e.g., `::CLAIMED: true`)
- **Attributes**: Immutable properties (e.g., `::PHONE`, `::HERD_MARK`)

```
NODE {
  :ID: "HUMAN:PHONE:3207601810",
  :TYPE: "NODE",
  :CREATED_AT: "2025-01-24T00:00:00Z",
  ::LABEL: "REID WILDUNG",
  ::CATEGORIES: ["HUMAN"],
  ::PHONE: "3207601810",
  ::CLAIMED: false,           // State, not metric
  ::CLAIMED_BY_USER_ID: null  // State, not metric
}
```

**Critical Rule**: Nodes contain NO computed values, NO counts, NO aggregates.

#### 2. Edges (Relationships)

Edges connect nodes directionally:

```
EDGE {
  :ID: "EDGE:HUMAN:PHONE:3207601810:OWNS:OPERATION:NSR:RJWP",
  :TYPE: "EDGE",
  ::EDGE_TYPE: "OWNS",
  :::FROM: "HUMAN:PHONE:3207601810",
  :::TO: "OPERATION:NSR:RJWP"
}
```

Edge types in the swine registry domain:
- `OWNS` - Human → Operation
- `MEMBER_OF` - Operation → Registry
- `LOCATED_IN` - Operation/City → Location
- `BRED_BY` - Animal → Operation
- `SIRE_OF` - Animal → Animal (paternal)
- `DAM_OF` - Animal → Animal (maternal)
- `PRODUCED` - Sow → Litter

#### 3. Signals (Observations)

Signals are append-only observations indexed by time:

```
SIGNAL {
  :ID: "SIG:20250124:ANIMAL:DUROC:12345:BODY_WEIGHT",
  :TYPE: "SIGNAL",
  :CREATED_AT: "2025-01-24T14:30:00Z",
  ::VALUE: 245.5,
  ::TIMESTAMP: "2025-01-24",
  ::SOURCE: "USER",
  :::NODE: "ANIMAL:DUROC:12345",
  :::METRIC: "BODY_WEIGHT"
}
```

**The Immutability Principle**: Signals are NEVER updated or deleted. To correct an observation, append a new signal. History is sacred.

### B. Events as Impulses

An **event** in FINN is an impulse—a signal that triggers a cascade of subsequent signals over time.

Example: **Subscription Event**

```
// The impulse: User subscribes
SIGNAL {
  ::VALUE: "pro",
  ::TIMESTAMP: "2025-01-24",
  :::NODE: "HUMAN:PHONE:3207601810",
  :::METRIC: "SUBSCRIPTION_TIER"
}

// Subsequent signals enabled by subscription:
// Day 1: User adds 5 animals
// Day 2: User records weights
// Day 7: User logs litter data
// Day 30: User adds show results
// ...

// The impulse creates DENSITY in the graph
```

This models reality: a subscription isn't a static attribute—it's an event that enables a stream of future observations. The **density** of signals following an impulse measures the event's impact.

### C. Gravitational Model

Operations have different "gravitational pull" based on their connectivity and signal density:

```
Gravitational Pull = f(
  edge_count,      // How connected is this node?
  signal_density,  // How much activity flows through it?
  pedigree_depth,  // How deep is its ancestral network?
  temporal_span    // How long has it been active?
)
```

This is NEVER stored. It's computed:

```javascript
async function getGravitationalPull(operationId) {
  const [animals, signals, depth] = await Promise.all([
    // Count animals bred here
    db.collection('edges')
      .where('::EDGE_TYPE', '==', 'BRED_BY')
      .where(':::TO', '==', operationId)
      .count().get(),

    // Count signals on those animals
    db.collection('signals')
      .where(':::NODE', 'in', animalIds)
      .count().get(),

    // Compute max pedigree depth (recursive)
    computePedigreeDepth(operationId)
  ]);

  return { animals, signals, depth };
}
```

The neural network **emerges** from the graph structure.

---

## III. Temporal Threading

### A. Pedigrees as Temporal Threads

Animals don't just exist—they thread through time via their ancestry:

```
ANIMAL:DUROC:2024-001 (born 2024-03-15)
├── BRED_BY → OPERATION:NSR:RJWP
├── SIRE_OF → ANIMAL:DUROC:2022-105 (born 2022-01-20)
│              ├── BRED_BY → OPERATION:NSR:RJWP
│              └── SIRE_OF → ANIMAL:DUROC:2019-042 (born 2019-06-10)
│                             └── BRED_BY → OPERATION:NSR:OLDER_OP
└── DAM_OF → ANIMAL:BERK:ABA-8821 (born 2021-09-01)
               ├── BRED_BY → OPERATION:ABA:1CLC  ← Cross-registry!
               └── DAM_OF → ANIMAL:BERK:ABA-7102 (born 2018-04-15)
```

The pedigree is a **temporal thread** weaving through the spatial network of operations. Cross-registry ancestry is natural—just follow the edges.

### B. Signal Timelines

Each node has a timeline of signals:

```
ANIMAL:DUROC:2024-001 Timeline:
─────────────────────────────────────────────────────────────
2024-03-15  BIRTH_DATE = 2024-03-15
2024-03-15  BIRTH_WEIGHT = 3.2 lb
2024-04-01  BODY_WEIGHT = 12.5 lb
2024-05-15  BODY_WEIGHT = 45.0 lb
2024-06-20  BODY_WEIGHT = 125.0 lb
2024-07-15  STRUCTURE_SCORE = 8
2024-08-01  SHOW_PLACING = 2 (County Fair)
2024-09-10  BODY_WEIGHT = 245.0 lb
2024-10-01  SALE_PRICE = 2500.00
─────────────────────────────────────────────────────────────
```

Visualization becomes graph traversal:
- **Growth curve**: Filter signals by `BODY_WEIGHT` metric, plot over time
- **Show career**: Filter by `SHOW_PLACING`, aggregate by event
- **Lifetime value**: Sum `SALE_PRICE` signals

---

## IV. Implementation

### A. Node ID Conventions

Consistent ID patterns enable efficient queries:

| Entity | Pattern | Example |
|--------|---------|---------|
| Human | `HUMAN:PHONE:{phone}` | `HUMAN:PHONE:3207601810` |
| Operation | `OPERATION:{registry}:{herdmark}` | `OPERATION:NSR:RJWP` |
| Animal | `ANIMAL:{breed}:{reg_number}` | `ANIMAL:DUROC:NSR-12345` |
| Registry | `REGISTRY:{abbr}` | `REGISTRY:NSR` |
| Breed | `BREED:{name}` | `BREED:DUROC` |
| Location | `LOCATION:{city}_{state}` | `LOCATION:PERRY_GA` |
| State | `LOCATION:STATE_{abbr}` | `LOCATION:STATE_GA` |
| Litter | `LITTER:{sow_id}:{date}` | `LITTER:DUROC:12345:2024-03-15` |

### B. State vs. Metric Distinction

**State** (stored on node):
- `::CLAIMED` - Boolean flag
- `::CLAIMED_BY_USER_ID` - Identity link
- `::SUBSCRIPTION_TIER` - Current tier (BUT see Section V.A)

**Metric** (computed from signals/edges):
- Animal count
- Pedigree depth
- Total sales
- Show wins
- Claim rate

The distinction: **State** is the current condition. **Metrics** are measurements over time.

### C. Query Patterns

**Count operations at a registry:**
```javascript
const ops = await db.collection('edges')
  .where('::EDGE_TYPE', '==', 'MEMBER_OF')
  .where(':::TO', '==', 'REGISTRY:NSR')
  .count().get();
```

**Get human's operations:**
```javascript
const edges = await db.collection('edges')
  .where('::EDGE_TYPE', '==', 'OWNS')
  .where(':::FROM', '==', humanId)
  .get();
const operationIds = edges.docs.map(e => e.data()[':::TO']);
```

**Compute claim rate:**
```javascript
const total = await db.collection('nodes')
  .where('::CATEGORIES', 'array-contains', 'HUMAN')
  .where('::SEED', '==', true)
  .count().get();

const claimed = await db.collection('nodes')
  .where('::CATEGORIES', 'array-contains', 'HUMAN')
  .where('::SEED', '==', true)
  .where('::CLAIMED', '==', true)
  .count().get();

const rate = claimed / total;
```

---

## V. Identified Problems & Prioritization

### A. CRITICAL: Subscription Tier as Signal

**Problem**: `::SUBSCRIPTION_TIER` is currently stored as a state attribute on nodes. This violates FINN because subscription is an **event** (impulse) that should be a signal.

**Current (Wrong)**:
```javascript
// Anti-pattern
node['::SUBSCRIPTION_TIER'] = 'pro';
```

**Correct (FINN)**:
```javascript
// Subscription as impulse signal
SIGNAL {
  :::NODE: "HUMAN:PHONE:3207601810",
  :::METRIC: "SUBSCRIPTION_TIER",
  ::VALUE: "pro",
  ::TIMESTAMP: "2025-01-24",
  ::SOURCE: "SYSTEM"
}

// Query current tier:
const latest = await db.collection('signals')
  .where(':::NODE', '==', humanId)
  .where(':::METRIC', '==', 'SUBSCRIPTION_TIER')
  .orderBy('::TIMESTAMP', 'desc')
  .limit(1)
  .get();
const currentTier = latest.docs[0]?.data()['::VALUE'] || 'unclaimed';
```

**Benefits**:
- Subscription history preserved (when did they upgrade? downgrade?)
- Churn analysis possible (how long between tiers?)
- Impulse → density correlation measurable
- LTV computation from subscription signals
- Consistent with FINN principles

**Priority**: CRITICAL - Architectural integrity + Business intelligence

**Resolution**:
1. Create `SUBSCRIPTION_TIER` metric definition (ENUM: unclaimed, free, pro, team)
2. Update claim service to emit signal instead of updating attribute
3. Remove `::SUBSCRIPTION_TIER` attribute from node schema
4. Query current tier by getting latest signal
5. Track tier changes as separate signals for upgrade/downgrade analysis

### B. HIGH: CPS Data Lacks Phone Numbers

**Problem**: CPS breeder data (66,301 records) has no phone numbers, only name/city/state. Cannot deduplicate to HUMAN nodes.

**Impact**:
- CPS breeders become OPERATION-only nodes (orphaned from HUMAN)
- Cross-registry identity linking impossible
- ~54,000 potential users unreachable

**Priority**: HIGH - Data completeness

**Resolution Options**:
1. Scrape CPS with phone numbers (preferred)
2. Create synthetic HUMAN nodes from name+location (fallback)
3. Match CPS names against NSR/ABA names with phones

### C. HIGH: Firestore Query Limitations

**Problem**: Firestore's `IN` operator limited to 10 items. Computing stats across thousands of operations requires batching or denormalization.

**Current Workaround**:
```javascript
// Only checks first 10 operations
.where(':::TO', 'in', operationIds.slice(0, 10))
```

**Priority**: HIGH - Query correctness

**Resolution Options**:
1. Batch queries in groups of 10
2. Use Cloud Functions for aggregation
3. Maintain materialized views (violates FINN purity)
4. Migrate to graph database (Neo4j, Dgraph)

### D. MEDIUM: Signal Volume Scaling

**Problem**: With ~60K humans × ~10 signals/year = 600K signals/year minimum. At scale with animals, could reach millions.

**Priority**: MEDIUM - Future scalability

**Resolution**:
1. Partition signals by time period
2. Archive old signals to cold storage
3. Implement signal rollups (aggregate signals, not attribute updates)

### E. MEDIUM: Pedigree Depth Computation

**Problem**: Computing max pedigree depth requires recursive traversal. Expensive for deep pedigrees (8+ generations).

**Priority**: MEDIUM - Performance

**Resolution**:
1. Compute at query time with depth limits
2. Cache traversal results with TTL
3. Pre-compute during import (acceptable for seed data)

### F. LOW: Edge Indexing

**Problem**: Querying edges by both `:::FROM` and `:::TO` requires composite indexes.

**Priority**: LOW - Performance optimization

**Resolution**: Ensure Firestore indexes cover common query patterns.

---

## VI. Data Model Summary

### A. Industry Seed Data

```
╔═══════════════════════════════════════════════════════════╗
║                 FINN SEED DATA PROFILE                    ║
╠═══════════════════════════════════════════════════════════╣
║  NODES                                                    ║
║  ─────────────────────────────────────────────────────    ║
║  HUMAN (phone-deduped)           ~8,500                   ║
║  OPERATION (herdmarks)          ~14,400                   ║
║  CITY                            4,236                    ║
║  STATE                              50                    ║
║  REGISTRY                            4                    ║
║  BREED                              10                    ║
║  ─────────────────────────────────────────────────────    ║
║  TOTAL NODES                   ~27,200                    ║
╠═══════════════════════════════════════════════════════════╣
║  EDGES                                                    ║
║  ─────────────────────────────────────────────────────    ║
║  OWNS (human → operation)       ~14,400                   ║
║  MEMBER_OF (operation → reg)    ~14,400                   ║
║  LOCATED_IN (operation → city)  ~13,000                   ║
║  LOCATED_IN (city → state)       4,236                    ║
║  LOCATED_IN (state → USA)           50                    ║
║  REGISTERED_UNDER (breed → reg)     10                    ║
║  HEADQUARTERED_IN (reg → city)       4                    ║
║  ─────────────────────────────────────────────────────    ║
║  TOTAL EDGES                   ~46,100                    ║
╠═══════════════════════════════════════════════════════════╣
║  SUCCESS METRIC                                           ║
║  ─────────────────────────────────────────────────────    ║
║  Human Claim Rate = Claimed / Total Humans                ║
║  (Derived from ::CLAIMED state queries, not counters)     ║
╚═══════════════════════════════════════════════════════════╝
```

### B. Future: Animal & Pedigree Data

When pedigree data is imported:

```
Estimated additions:
  ANIMAL nodes:        ~2,000,000
  SIRE_OF edges:       ~2,000,000
  DAM_OF edges:        ~2,000,000
  BRED_BY edges:       ~2,000,000
  LITTER nodes:          ~500,000
  PRODUCED edges:        ~500,000

Signals (over time):
  BIRTH_WEIGHT:        ~2,000,000
  BODY_WEIGHT:        ~10,000,000+
  SHOW_PLACING:          ~100,000
  SALE_PRICE:            ~500,000
```

---

## VII. Visualization Philosophy

### A. Charts ARE Graph Traversals

| User Question | Traversal | Visualization |
|--------------|-----------|---------------|
| "Show pedigree" | BFS up SIRE_OF/DAM_OF | Tree/hex expansion |
| "Sow production" | PRODUCED → LITTER → signals | Step function |
| "Growth curve" | Node → signals by BODY_WEIGHT | Line chart |
| "Breeders in Texas" | STATE → CITY → OPERATION | Cluster map |
| "Registry comparison" | REGISTRY → aggregate signals | Bar chart |

There is no separate charting engine. Visualization emerges from traversal.

### B. Scope Management

Zoom levels for millions of nodes:

```
ZOOMED OUT                          ZOOMED IN
───────────────────────────────────────────────
INDUSTRY (1)                        Individual Animal
  └── REGISTRY (4)                    └── Signals
        └── STATE (50)                    └── Pedigree
              └── CITY (4,236)                └── Offspring
                    └── OPERATION (14,400)
                          └── ANIMAL (2,000,000)
```

At each level, metrics are computed from children, never stored.

---

## VIII. Conclusion

FINN provides a principled approach to temporal data modeling:

1. **Nodes** have identity and state, never metrics
2. **Edges** capture relationships
3. **Signals** capture observations indexed by time
4. **Events** are impulses that create signal density
5. **Metrics** are computed through traversal, never stored

This creates an emergent neural network where influence is derived from structure. The graph becomes a living model of reality that cannot become stale because there are no cached computations to drift.

The swine registry implementation demonstrates FINN at scale: ~60,000 breeders, ~14,400 operations, millions of future animals, all connected through edges with history preserved in signals.

---

## IX. Business Intelligence Through FINN

### A. The Administrative View

FINN naturally captures the metrics administrators need without explicit tracking:

#### Customer Acquisition Cost (CAC)

```
CAC = Marketing Spend / New Claimed Humans

// Marketing spend = SUM of MARKETING_EXPENSE signals on ORGANIZATION node
// New claimed = COUNT of SUBSCRIPTION_TIER signals with value != 'unclaimed'
//               in time period, grouped by acquisition source
```

The impulse model reveals acquisition:
- User sees ad → visits site (potential future: PAGE_VIEW signal)
- User signs up → CLAIMED state change
- User subscribes → SUBSCRIPTION_TIER signal (impulse)
- User activity → subsequent signals (density)

**CAC by source** emerges from signal attribution.

#### Knowledge Scaling

The graph IS the knowledge. Scaling = growth in structure:

```
Knowledge Velocity = Δ(nodes + edges + signals) / time

// Tracked as signals on the SYSTEM node:
SIGNAL { :::NODE: "SYSTEM:CHARLOTTE", :::METRIC: "DAILY_NODES_CREATED", ::VALUE: 150 }
SIGNAL { :::NODE: "SYSTEM:CHARLOTTE", :::METRIC: "DAILY_EDGES_CREATED", ::VALUE: 340 }
SIGNAL { :::NODE: "SYSTEM:CHARLOTTE", :::METRIC: "DAILY_SIGNALS_CREATED", ::VALUE: 1200 }
```

Knowledge density at a node = signals/time. Active nodes have high density.

#### Usage Metrics

Usage IS signal creation:

```
Monthly Active Users = COUNT(DISTINCT :::NODE
                             FROM signals
                             WHERE ::SOURCE = 'USER'
                             AND ::TIMESTAMP in month)

Feature Adoption = COUNT(signals WHERE :::METRIC = 'FEATURE_X_USED')

Session Depth = COUNT(signals per user per day)
```

No tracking pixels needed. Usage creates signals. Signals ARE the tracking.

### B. Total Lifetime Value (LTV)

LTV is the ultimate FINN metric—it's the accumulated value of all signals from a human:

```
LTV(human) = Σ(value_signals) + Σ(subscription_value) + Σ(referral_value)

// Where:
// value_signals = signals that represent direct revenue
// subscription_value = duration × tier_price from SUBSCRIPTION_TIER signals
// referral_value = LTV of humans they referred × referral_weight
```

**LTV Computation in FINN:**

```javascript
async function computeLTV(humanId) {
  // Get all operations owned by this human
  const operations = await getOperationsByHuman(humanId);

  // Get all animals at those operations
  const animals = await getAnimalsByOperations(operations);

  // Sum sale prices (direct revenue)
  const saleSignals = await db.collection('signals')
    .where(':::NODE', 'in', animals)
    .where(':::METRIC', '==', 'SALE_PRICE')
    .get();
  const salesValue = saleSignals.docs.reduce((sum, s) =>
    sum + s.data()['::VALUE'], 0);

  // Compute subscription duration and value
  const subSignals = await db.collection('signals')
    .where(':::NODE', '==', humanId)
    .where(':::METRIC', '==', 'SUBSCRIPTION_TIER')
    .orderBy('::TIMESTAMP')
    .get();
  const subscriptionValue = computeSubscriptionValue(subSignals);

  // Referral value (recursive but bounded)
  const referralValue = await computeReferralValue(humanId);

  return {
    sales: salesValue,
    subscription: subscriptionValue,
    referrals: referralValue,
    total: salesValue + subscriptionValue + referralValue
  };
}
```

**LTV Trajectory:**

Because we have signals over time, we can plot LTV growth:

```
Human:Phone:3207601810 LTV Timeline:
─────────────────────────────────────────────────────────────
2025-01  Claimed profile               LTV: $0
2025-01  Subscribed (pro @ $29/mo)     LTV: $29
2025-02  Subscription continues        LTV: $58
2025-03  Sold 3 animals @ $500 each    LTV: $1,587
2025-04  Referred 2 users              LTV: $1,687 + referral bonus
2025-05  Sold champion @ $5,000        LTV: $6,716
...
─────────────────────────────────────────────────────────────
```

### C. The Impulse → Density → Value Pipeline

Every subscription is an impulse that creates density that creates value:

```
IMPULSE                    DENSITY                      VALUE
────────────────────────────────────────────────────────────────
Subscribe                  Add animals                  Sale signals
   ↓                       Record weights               Show wins
SUBSCRIPTION_TIER          Log litters                  Pedigree depth
signal created             Track shows                  Referrals
   ↓                          ↓                            ↓
Enables access             Signal accumulation          LTV grows
   ↓                          ↓                            ↓
Time passes                Density increases            Gravitational pull
                                                        increases
```

**The insight**: Subscription tier isn't just access control—it's a leading indicator of future signal density, which predicts LTV.

### D. Cohort Analysis

FINN enables cohort analysis through signal timestamps:

```javascript
// Users who subscribed in January 2025
const jan2025Cohort = await db.collection('signals')
  .where(':::METRIC', '==', 'SUBSCRIPTION_TIER')
  .where('::VALUE', '==', 'pro')
  .where('::TIMESTAMP', '>=', '2025-01-01')
  .where('::TIMESTAMP', '<', '2025-02-01')
  .get();

// Their signal density in months 1, 2, 3...
for (const sub of jan2025Cohort.docs) {
  const humanId = sub.data()[':::NODE'];
  const month1Signals = await countSignalsInPeriod(humanId, 'M1');
  const month2Signals = await countSignalsInPeriod(humanId, 'M2');
  // ...
}

// Correlate density with retention
// High density cohorts → higher retention → higher LTV
```

### E. Administrative Metrics Summary

| Metric | FINN Derivation |
|--------|-----------------|
| CAC | Marketing signals / subscription impulses |
| MAU | Distinct nodes with USER signals in period |
| DAU | Distinct nodes with USER signals in day |
| Retention | Subscription signals over time per cohort |
| Churn | Gap between subscription signals |
| LTV | Sum of value signals + subscription + referrals |
| Knowledge Growth | Δ(nodes + edges + signals) / time |
| Feature Adoption | Count of specific metric signals |
| Engagement Depth | Signals per user per session |
| Gravitational Pull | Edge count + signal density per node |

All derived. Nothing stored. Reality emerges from structure.

---

## X. References

1. Fowler, M. (2005). Event Sourcing. martinfowler.com
2. Cattuto, C., et al. (2013). Time-varying social networks. EPJ Data Science.
3. Kleppmann, M. (2017). Designing Data-Intensive Applications. O'Reilly.
4. Hamilton, W. L. (2020). Graph Representation Learning. Morgan & Claypool.
5. Kipf, T. N., & Welling, M. (2017). Semi-Supervised Classification with Graph Convolutional Networks. ICLR.

---

## XI. Future Work

### A. Real Neural Network Integration

FINN's graph structure is amenable to graph neural network (GNN) techniques:

- **Node embeddings**: Learn vector representations of operations/animals from graph structure
- **Link prediction**: Predict likely pedigree connections from partial data
- **Influence propagation**: Model how genetic traits flow through the pedigree network
- **Anomaly detection**: Identify unusual signal patterns indicating data quality issues

### B. Temporal Graph Databases

Current implementation uses Firestore. Future consideration:

- **Neo4j Temporal**: Native temporal graph support
- **Dgraph**: GraphQL-native with temporal extensions
- **Amazon Neptune**: Managed graph with time-indexed queries
- **TigerGraph**: High-performance graph analytics

### C. Signal Compression

For long-running systems with billions of signals:

- **Rollup signals**: Daily/weekly aggregates stored as meta-signals
- **Archival tiers**: Hot/warm/cold signal storage
- **Lossy compression**: Downsample older signals while preserving trends

---

## XII. Conclusion

FINN represents a fundamental shift in how we model reality in software systems:

| Traditional | FINN |
|-------------|------|
| Store computed values | Compute from structure |
| Snapshots become stale | Always current |
| History is lost | History is sacred |
| Counters drift | Truth emerges |
| Explicit tracking | Implicit measurement |

The framework transforms a database into a living model where:
- **Nodes** are entities with identity
- **Edges** are relationships that connect
- **Signals** are observations that accumulate
- **Events** are impulses that create density
- **Metrics** emerge from traversal

Business intelligence becomes graph analysis. Customer lifetime value is the accumulated weight of signals. Knowledge scaling is graph growth. Usage is signal creation.

The neural network isn't artificial—it's the actual structure of relationships and observations in the domain. FINN doesn't simulate reality; it models it directly.

---

*Document version: 1.0.0*
*Date: 2025-01-24*
*Architecture: FINN (Framework for Integrated Neural Networks)*
*Implementation: Charlotte - Infrastructure for Observable Reality*
*Authors: Human-AI Collaboration*

---

**License**: This architectural specification is provided for implementation in the Charlotte system and related projects. The FINN framework concepts are open for academic discussion and industry adoption.

---

## Appendix A: FINN Compliance Checklist

When adding features to a FINN system:

```
□ Does the node store any counts? (VIOLATION)
□ Does the node store any sums/averages? (VIOLATION)
□ Does the node store any "total_*" fields? (VIOLATION)
□ Is there a FieldValue.increment() call? (VIOLATION)
□ Can the metric be derived from edges? (USE TRAVERSAL)
□ Can the metric be derived from signals? (USE AGGREGATION)
□ Is this a state change? (OK: ::CLAIMED, ::STATUS)
□ Is this an event? (USE SIGNAL)
```

---

## Appendix B: Migration Guide

Converting attribute-based metrics to FINN:

**Before (Anti-pattern)**:
```javascript
await node.update({
  '::ANIMAL_COUNT': FieldValue.increment(1)
});
```

**After (FINN)**:
```javascript
// Just create the BRED_BY edge
await db.collection('edges').add({
  '::EDGE_TYPE': 'BRED_BY',
  ':::FROM': animalId,
  ':::TO': operationId
});

// Count is derived at query time
const count = await db.collection('edges')
  .where('::EDGE_TYPE', '==', 'BRED_BY')
  .where(':::TO', '==', operationId)
  .count().get();
```

---

## Appendix C: Signal Metrics Library

Standard metrics for the swine domain:

| Metric | Type | Unit | Description |
|--------|------|------|-------------|
| SUBSCRIPTION_TIER | ENUM | - | free, pro, team |
| BODY_WEIGHT | DOUBLE | LB | Animal weight |
| BIRTH_WEIGHT | DOUBLE | LB | Weight at birth |
| BACKFAT | DOUBLE | MM | Backfat depth |
| LOIN_DEPTH | DOUBLE | MM | Loin muscle depth |
| TOTAL_BORN | INTEGER | COUNT | Pigs born in litter |
| BORN_ALIVE | INTEGER | COUNT | Pigs born alive |
| WEANED_COUNT | INTEGER | COUNT | Pigs weaned |
| SHOW_PLACING | INTEGER | - | Competition placement |
| SALE_PRICE | DOUBLE | USD | Sale amount |

Each metric is a NODE in the graph with constraints (min, max, type).

---

*Document version: 1.0*
*Architecture: FINN (Framework for Integrated Neural Networks)*
*Implementation: Charlotte - Infrastructure for Observable Reality*
