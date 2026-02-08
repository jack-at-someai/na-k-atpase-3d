# Charlotte Substrate Architecture

> A knowledge graph encoded as a memory stack.

**REQUIRED READING FOR ALL AGENTS.**

---

## Table of Contents

1. [Core Principle](#core-principle)
2. [The FACT Document](#the-fact-document)
3. [The Five Types](#the-five-types)
4. [Graph Layer vs Feature Layer](#graph-layer-vs-feature-layer)
5. [Attributes Are Signals](#attributes-are-signals)
6. [Time As Graph](#time-as-graph)
7. [Space As Graph](#space-as-graph)
8. [Chat Is Graph](#chat-is-graph)
9. [Protocols: Signal Forecasting](#protocols-signal-forecasting)
10. [Register Reference](#register-reference)
11. [Examples](#examples)
12. [Mental Model](#mental-model)

---

## Core Principle

**Everything is a FACT.**

Charlotte stores all data in a single Firestore collection called `facts`. There are no separate collections for nodes, edges, signals, metrics, or protocols. Every piece of information is a FACT document with a register-based structure, similar to CPU instructions or opcodes.

This design ensures:
- **Clean exports** - dump one collection, get everything
- **Consistent structure** - every document follows the same pattern
- **No collection sprawl** - no ad-hoc collections for new features
- **Transactional integrity** - all CRUD operations adjust a single stack

---

## The FACT Document

Each FACT is a small document with positional registers. Think of it as an instruction in a virtual machine:

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

**Core registers (all facts):**
- `:ID` → Unique identifier
- `:TYPE` → One of the five types
- `:CREATED` → Temporal node reference (NOT a timestamp - a node ID like `DATE:1-30-2026`)

**Positional registers (type-specific):**
- `P0`, `P1`, `P2`, `P3`... → Meaning depends on `:TYPE`

FACTs are designed to be:
- **Minimal** - only a few values per document
- **Fixed-structure** - predictable register positions
- **Encodable** - could theoretically encode to 256-bit or similar fixed-size format

---

## The Five Types

| Type | Purpose | Key Registers |
|------|---------|---------------|
| `NODE` | Declares an entity exists | P0: category |
| `EDGE` | Connects two nodes | P0: from, P1: to, P2: edge_type |
| `METRIC` | Defines what can be measured | P0: node_id, P1: value_type, P2: label |
| `SIGNAL` | Records a measurement | P0: node_id, P1: metric_id, P2: value |
| `PROTOCOL` | Agent-generated signal forecast | P0: node_id, P1: schedule, P2: requirements |

---

## Graph Layer vs Feature Layer

### Graph Layer (Explicit Connections)

`NODE` and `EDGE` form the explicit graph structure:

```
NODE ←——EDGE——→ NODE
```

**EDGEs only connect NODEs to NODEs.** This is the topological structure of the knowledge graph.

### Feature Layer (Implicit Connections)

`METRIC` and `SIGNAL` sit "on top of" nodes without requiring EDGEs:

```
NODE ← METRIC    (metric's P0 points to node)
NODE ← SIGNAL → METRIC    (signal's P0→node, P1→metric)
```

This allows any node to accumulate a **feature vector** - arbitrary metrics producing signals over time. Each node becomes a point in feature space defined by its signal history.

**Why no EDGEs for metrics/signals?**
- Keeps the graph layer clean (only entity relationships)
- The connection is structural, not relational
- Enables feature engineering without graph pollution

---

## Attributes Are Signals

**There are no "fields" on nodes.** Everything is a signal.

| What you might think | What it actually is |
|---------------------|---------------------|
| Node's name field | SIGNAL → METRIC:name with STRING value |
| Node's weight field | SIGNAL → METRIC:weight with NUMBER value |
| Node's status field | SIGNAL → METRIC:status with STRING value |
| Message content | SIGNAL → METRIC:name with STRING value |

This means:
- All attributes have **history** (signals over time)
- All attributes have **type definitions** (metrics)
- All attributes are **queryable the same way**

```json
{":ID": "SIG:1", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-30-2026", "P0": "SOW:bella", "P1": "METRIC:name", "P2": "Bella"}
{":ID": "SIG:2", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-30-2026", "P0": "SOW:bella", "P1": "METRIC:weight", "P2": 285}
{":ID": "SIG:3", ":TYPE": "SIGNAL", ":CREATED": "DATE:2-15-2026", "P0": "SOW:bella", "P1": "METRIC:weight", "P2": 290}
```

---

## Time As Graph

**Time is not stored as timestamps on documents. Time is a layer of pre-built nodes.**

### DATE Nodes
Format: `DATE:M-d-yyyy`

```json
{":ID": "DATE:1-30-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-30-2026", "P0": "DATE"}
```

### TIME Nodes
Format: `TIME:0-1440` (minutes after midnight)

```json
{":ID": "TIME:720", ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "TIME"}
```

### Temporal Spine (Double-Linked List)

```json
{":ID": "T:1", ":TYPE": "EDGE", ":CREATED": "DATE:1-29-2026", "P0": "DATE:1-29-2026", "P1": "DATE:1-30-2026", "P2": "NEXT"}
{":ID": "T:2", ":TYPE": "EDGE", ":CREATED": "DATE:1-30-2026", "P0": "DATE:1-30-2026", "P1": "DATE:1-31-2026", "P2": "NEXT"}
```

### Temporal Event Edges

When something happens at a time, create an EDGE to the DATE node:

```json
{":ID": "E:born", ":TYPE": "EDGE", ":CREATED": "DATE:1-30-2026", "P0": "LITTER:ruby_jan26", "P1": "DATE:1-30-2026", "P2": "BORN_ON"}
{":ID": "E:due", ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "MATING:bella_jan", "P1": "DATE:4-25-2026", "P2": "DUE_ON"}
```

### Why Graph-Based Time?

1. **Shared substrate** - All users reference the same temporal nodes
2. **Cave diver's guide line** - Time is the neural thread that grounds everything
3. **No local timestamps** - Temporal references are EDGEs to TIME/DATE nodes
4. **Clean visualization** - The graph literally shows time as a traversable structure

---

## Space As Graph

Geographic locations are constant node layers, pre-built and shared:

```json
{":ID": "COUNTRY:USA", ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "COUNTRY"}
{":ID": "STATE:MO", ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "STATE"}
{":ID": "CITY:TAYLOR_MO", ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "CITY"}

{":ID": "S:1", ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "STATE:MO", "P1": "COUNTRY:USA", "P2": "LOCATED_IN"}
{":ID": "S:2", ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "CITY:TAYLOR_MO", "P1": "STATE:MO", "P2": "LOCATED_IN"}
```

When a node is "located" somewhere:

```json
{":ID": "E:loc", ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "OP:heimer_hamps", "P1": "CITY:TAYLOR_MO", "P2": "LOCATED_IN"}
```

---

## Chat Is Graph

**Chats and messages are not special constructs. They are nodes.**

```json
{":ID": "CHAT:main", ":TYPE": "NODE", ":CREATED": "DATE:1-30-2026", "P0": "CHAT"}
{":ID": "MSG:1", ":TYPE": "NODE", ":CREATED": "DATE:1-30-2026", "P0": "MESSAGE"}
{":ID": "MSG:2", ":TYPE": "NODE", ":CREATED": "DATE:1-30-2026", "P0": "MESSAGE"}
```

Message sequence (linked list):

```json
{":ID": "C:1", ":TYPE": "EDGE", ":CREATED": "DATE:1-30-2026", "P0": "MSG:1", "P1": "CHAT:main", "P2": "BELONGS_TO"}
{":ID": "C:2", ":TYPE": "EDGE", ":CREATED": "DATE:1-30-2026", "P0": "MSG:1", "P1": "MSG:2", "P2": "NEXT"}
```

Message content (as signal):

```json
{":ID": "SIG:m1", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-30-2026", "P0": "MSG:1", "P1": "METRIC:name", "P2": "Ruby farrowed this morning - 11 alive, 1 stillborn"}
```

Messages can **REFERENCE** other nodes in the graph:

```json
{":ID": "C:ref", ":TYPE": "EDGE", ":CREATED": "DATE:1-30-2026", "P0": "MSG:1", "P1": "LITTER:ruby_jan26", "P2": "REFERENCES"}
```

This means agent messages aren't just text - they're woven into the knowledge graph.

---

## Protocols: Signal Forecasting

**PROTOCOLs provide on-the-fly signal forecasts for K metrics on a node.**

When a user needs to course-correct a metric (e.g., hit a target weight by a show date), the agent creates a PROTOCOL that:

1. Defines the **target value** and **target date**
2. Sets **checkpoints** with expected values along the way
3. Proposes **new metrics** to track (e.g., daily feed, ADG)
4. Links to the **node** being managed
5. Generates **signals** that reference back to the protocol

```json
{
  ":ID": "PROTOCOL:ruby1_weight",
  ":TYPE": "PROTOCOL",
  ":CREATED": "DATE:1-30-2026",
  "P0": "PIGLET:ruby_1",
  "P1": {
    "type": "COURSE_CORRECTION",
    "metric": "METRIC:weight",
    "current": 3.2,
    "target": 260,
    "target_date": "DATE:6-15-2026",
    "checkpoints": [
      {"date": "DATE:2-15-2026", "target": 25},
      {"date": "DATE:3-15-2026", "target": 75},
      {"date": "DATE:4-15-2026", "target": 140},
      {"date": "DATE:5-15-2026", "target": 205}
    ],
    "frequency": "weekly"
  },
  "P2": {
    "proposed_metrics": ["METRIC:daily_feed", "METRIC:adg"],
    "actions_if_behind": ["increase_feed", "check_health"]
  }
}
```

Protocol edges:

```json
{":ID": "PR:1", ":TYPE": "EDGE", ":CREATED": "DATE:1-30-2026", "P0": "PROTOCOL:ruby1_weight", "P1": "PIGLET:ruby_1", "P2": "APPLIES_TO"}
{":ID": "PR:2", ":TYPE": "EDGE", ":CREATED": "DATE:1-30-2026", "P0": "PROTOCOL:ruby1_weight", "P1": "DATE:6-15-2026", "P2": "TARGET_DATE"}
{":ID": "PR:3", ":TYPE": "EDGE", ":CREATED": "DATE:1-30-2026", "P0": "PROTOCOL:ruby1_weight", "P1": "DATE:2-15-2026", "P2": "CHECKPOINT"}
```

Signals generated by protocol:

```json
{":ID": "SIG:w1", ":TYPE": "SIGNAL", ":CREATED": "DATE:2-6-2026", "P0": "PIGLET:ruby_1", "P1": "METRIC:weight", "P2": 8.1, "P3": "PROTOCOL:ruby1_weight"}
```

The `P3` register links the signal back to the protocol that requested it.

---

## Register Reference

### NODE
| Register | Purpose | Required |
|----------|---------|----------|
| :ID | Unique identifier | Yes |
| :TYPE | "NODE" | Yes |
| :CREATED | DATE node reference | Yes |
| P0 | Category | Yes |

### EDGE
| Register | Purpose | Required |
|----------|---------|----------|
| :ID | Unique identifier | Yes |
| :TYPE | "EDGE" | Yes |
| :CREATED | DATE node reference | Yes |
| P0 | From node ID | Yes |
| P1 | To node ID | Yes |
| P2 | Edge type | Yes |

### METRIC
| Register | Purpose | Required |
|----------|---------|----------|
| :ID | Unique identifier | Yes |
| :TYPE | "METRIC" | Yes |
| :CREATED | DATE node reference | Yes |
| P0 | Node ID this metric belongs to | Yes |
| P1 | Value type (STRING, NUMBER, BOOLEAN) | Yes |
| P2 | Label/name | Yes |
| P3 | Constraints (min, max, enum) | No |

### SIGNAL
| Register | Purpose | Required |
|----------|---------|----------|
| :ID | Unique identifier | Yes |
| :TYPE | "SIGNAL" | Yes |
| :CREATED | DATE node reference | Yes |
| P0 | Node ID | Yes |
| P1 | Metric ID | Yes |
| P2 | Value | Yes |
| P3 | Protocol ID | No |

### PROTOCOL
| Register | Purpose | Required |
|----------|---------|----------|
| :ID | Unique identifier | Yes |
| :TYPE | "PROTOCOL" | Yes |
| :CREATED | DATE node reference | Yes |
| P0 | Node ID this applies to | Yes |
| P1 | Schedule/plan definition | Yes |
| P2 | Requirements/proposals | No |

---

## Examples

See `docs/artifacts/DATA_NODE_IMPORT_*.json` for operation import examples.

For complete conceptual examples, see the paper suite in `docs/artifacts/PAPER_SUITE_OVERVIEW.md`.

---

## Mental Model

Think of Charlotte as:

1. **A virtual machine** where FACTs are instructions
2. **A memory stack** where the knowledge graph is encoded
3. **An operating system** with registers and opcodes
4. **A neural substrate** where time is the guide line and facts are synaptic connections

### Views Are Scopes

Every view in the application is just a scoped query on the FACT stack:

| View | Scope |
|------|-------|
| Graph | NODE and EDGE facts visualized |
| Calendar | Facts with edges to DATE nodes in range |
| Timeline | Facts ordered by :CREATED temporal references |
| Chat | MESSAGE nodes filtered, laid out as conversation |
| Node detail | Single node + its immediate neighborhood |

All the same graph. Different camera angles. Different layout constraints. Different filters.

### The Conversation IS The Graph

When an agent responds, it's not just text in a chat. The message is a NODE. Its content is a SIGNAL. It can REFERENCE other nodes. Protocols it creates link to target dates and checkpoints.

The conversation is literally woven into the knowledge graph.

---

## Summary

| Principle | Implementation |
|-----------|----------------|
| Everything is a FACT | Single `facts` collection |
| Five types | NODE, EDGE, METRIC, SIGNAL, PROTOCOL |
| Register-based | :ID, :TYPE, :CREATED, P0, P1, P2, P3 |
| Time is graph | DATE/TIME nodes with NEXT edges |
| Space is graph | COUNTRY/STATE/CITY nodes |
| Attributes are signals | No fields, just SIGNAL → METRIC |
| Chat is graph | MESSAGE nodes with NEXT edges |
| Protocols forecast signals | Agent plans with checkpoints |

**Charlotte is infrastructure for observable reality, encoded as a stack of facts.**
