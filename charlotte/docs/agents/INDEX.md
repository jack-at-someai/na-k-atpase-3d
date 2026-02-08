# Charlotte Agent Index

**2 Agents. Clear Boundaries. Mock-First Development.**

---

## Agent Roster

| Agent | Role | Territory |
|-------|------|-----------|
| **CHARLOTTE** | Plan/Orchestrate | docs/ |
| **FINN** | Data Access | lib/repositories/, lib/models/ |

---

## Architecture

```
                         ┌─────────────┐
                         │    USER     │
                         └──────┬──────┘
                                │
                         ┌──────▼──────┐
                         │  CHARLOTTE  │  Plan & Orchestrate
                         └──────┬──────┘
                                │
            ┌───────────────────▼───────────────────┐
            │           FactRepository              │
            │  (MockFactRepository in dev mode)     │
            └───────────────────┬───────────────────┘
                                │
                         ┌──────▼──────┐
                         │    FINN     │  Data Access
                         └─────────────┘
```

---

## What Actually Exists

```
lib/
├── main.dart                    ✓ Auth gate
├── theme.dart                   ✓ Design system
├── models/
│   └── fact.dart                ✓ All 5 FACT types
├── mock/
│   ├── personas.dart            ✓ Test data
│   └── heimer_hampshires.dart   ✓ Domain test data
└── ui/screens/
    └── design_system_screen.dart ✓ Component preview
```

Everything else gets built as needed, driven by frontend requirements.

---

## The FACT Substrate

**Read: `/docs/SUBSTRATE.md`**

All 5 types live in a single `facts` collection.

| Type | P0 | P1 | P2 | P3 |
|------|----|----|----|----|
| NODE | category | — | — | — |
| EDGE | from_node | to_node | edge_type | — |
| METRIC | node_id | value_type | label | constraints |
| SIGNAL | node_id | metric_id | value | protocol_id |
| PROTOCOL | node_id | schedule | requirements | — |

### Core Rules

1. **Everything is a FACT.** Single collection, 5 types.
2. **Attributes are SIGNALs.** Nodes have no fields.
3. **Time is graph.** DATE nodes with NEXT edges.
4. **Signals are append-only.** Never delete, supersede.

---

## Development Philosophy

### Mock-First

All frontend agents work against `MockFactRepository` until UX is proven. Only then do we implement Firestore persistence.

```dart
// Frontend code doesn't know or care about the backend
final facts = await repository.query(type: 'SIGNAL', where: {'P0': nodeId});
```

### No Speculative Infrastructure

Don't build:
- Repositories we might need
- Cloud Functions we might need
- Services we might need

Build what the frontend proves it needs. Nothing more.

### Agent Boundaries

CHARLOTTE owns documentation. FINN owns data access. Widgets and screens emerge as needed. Don't pre-plan file structures - let them grow organically.

---

## Getting Started

1. Read CHARLOTTE.md or FINN.md depending on your role
2. Use inline test data (simulating Firebase payloads) - see `design_system_screen.dart`
3. Create widgets as you need them
4. Don't build infrastructure until you need it

---

*Last updated: 2026-02-05*
