# Charlotte Documentation Index

> Everything an agent needs to understand Charlotte.

---

## Vision & Philosophy

| Document | Purpose |
|----------|---------|
| [VISION.md](./VISION.md) | Core thesis: infrastructure for observable reality |
| [CONVEX_HULL.md](./CONVEX_HULL.md) | The 4 origins that validated the architecture |
| [MENTAL_MODELS.md](./MENTAL_MODELS.md) | 14 analogies that shaped design decisions |

---

## Required Reading (In Order)

| Document | Purpose | Read When |
|----------|---------|-----------|
| [SUBSTRATE.md](./SUBSTRATE.md) | Core architecture: FACTs, 5 types, registers | First. Always. |
| [ASSETS.md](./ASSETS.md) | Industry data, what the assets convey | Before building features |
| [DOMAIN_GLOSSARY.md](./DOMAIN_GLOSSARY.md) | Livestock terminology | When seeing unfamiliar terms |
| [DESIGN_EVOLUTION.md](./DESIGN_EVOLUTION.md) | Why the architecture exists | To understand design decisions |
| [FLO_MAPPING.md](./FLO_MAPPING.md) | Flo app → Charlotte feature mapping | When building features |
| [CORRUPT_DATA.md](./CORRUPT_DATA.md) | Real user data from failed implementations | To validate architecture |
| [ATOMIC_DESIGN.md](./ATOMIC_DESIGN.md) | Widget hierarchy: atoms → molecules → organisms | Before building UI |
| [GRAPH_RULES.md](./GRAPH_RULES.md) | Layout engine constraints from graph theory | When implementing visualization |

---

## Agent Documentation

| Document | Agent | Purpose |
|----------|-------|---------|
| [agents/INDEX.md](./agents/INDEX.md) | All | Agent roster and territory map |
| [agents/CHARLOTTE.md](./agents/CHARLOTTE.md) | CHARLOTTE | Plan agent persona |
| [agents/FINN.md](./agents/FINN.md) | FINN | Backend agent persona |

---

## Examples

| File | Content |
|------|---------|
| [examples/fact_types.json](./examples/fact_types.json) | Reference examples for all 5 FACT types |
| [examples/breeding_operation.json](./examples/breeding_operation.json) | Complete Heimer Hampshires operation |
| [examples/temporal_week.json](./examples/temporal_week.json) | A week in the temporal plane |
| [examples/protocol_weight_correction.json](./examples/protocol_weight_correction.json) | Course-correction protocol with checkpoints |

---

## Quick Reference

### The Five Types

| Type | P0 | P1 | P2 | P3 |
|------|----|----|----|----|
| NODE | category | — | — | — |
| EDGE | from_node | to_node | edge_type | — |
| METRIC | node_id | value_type | label | constraints |
| SIGNAL | node_id | metric_id | value | protocol_id |
| PROTOCOL | node_id | schedule | requirements | — |

### Key Principles

1. **Everything is a FACT** - Single `facts` collection
2. **Attributes are signals** - No fields on nodes
3. **Time is graph** - DATE nodes with NEXT edges
4. **Space is graph** - CITY/STATE nodes with LOCATED_IN edges
5. **Chat is graph** - MESSAGE nodes with REFERENCES edges
6. **Protocols forecast signals** - Checkpoints with target dates

### Agent Territories

```
CHARLOTTE → docs/
FINN      → lib/repositories/, lib/models/
```

Files emerge as agents build them. No speculative paths.

---

## Asset & Artifact Folders

| Folder | Content |
|--------|---------|
| `assets/` | App branding only (logo, icons, background) |
| `docs/artifacts/` | Research artifacts for documentation |

### Artifacts Naming Convention

| Prefix | Content |
|--------|---------|
| `WHITEPAPER_*` | Academic papers (FINN architecture) |
| `DATA_SUBSTRATE_SPATIAL_*` | Breeder registries, cities |
| `DATA_NODE_IMPORT_*` | Operation import examples |
| `IMAGE_VISION_*` | Vision concepts, Flo onboarding |
| `IMAGE_DRAFT_*` | UI draft iterations (A-J) |
| `IMAGE_*_PROTOCOL` | Biological protocol diagrams |
| `IMAGE_INDUSTRY_*` | Industry KPIs, resources |
| `IMAGE_GRAPH_*` | Graph visualization rules |

### Research Papers

| File | Purpose |
|------|---------|
| [PAPER_SUITE_OVERVIEW.md](./artifacts/PAPER_SUITE_OVERVIEW.md) | **Master plan**: 6-paper suite (Synthesis + 5 domain papers) |
| [WHITEPAPER_FINN_ARCHITECTURE.md](./artifacts/WHITEPAPER_FINN_ARCHITECTURE.md) | FINN whitepaper: temporal graphs, business intelligence, LTV/CAC |
| [PAPER_IEEE_STRUCTURE.md](./artifacts/PAPER_IEEE_STRUCTURE.md) | Paper 1 outline: FINN data model (IEEE TKDE) |

**Paper Suite (12 papers):**

| # | Paper | Venue | Focus |
|---|-------|-------|-------|
| 0 | Synthesis | Nature/Science | Unified thesis |
| 1 | FINN Data Model | IEEE TKDE | Signal-based temporal graphs |
| 2 | Business Strategy | Management Science | Operational infrastructure |
| 3 | Swarm Intelligence | Swarm Intel Journal | Recursive flocking |
| 4 | Substrate Architecture | IEEE Software | Containerized neural networks |
| 5 | Domain Modeling | ACM MODELS | Universal ontology |
| 6 | Spatial Perception | ACM SIGSPATIAL | How Charlotte perceives space |
| 7 | Temporal Perception | ACM TODS | How Charlotte perceives time |
| 8 | Frontend as Graph | ACM CHI/UIST | UI encoded in the knowledge graph |
| 9 | Tesseract Topology | ACM SoCG | 4D navigation, torus-wrapped time |
| 10 | Lifecycle Ensemble | NeurIPS/ICML | The dead teach the living |
| 11 | **Harmonic Resonance** | Cognitive Science | Folding time across generations |

---

*Index maintained by CHARLOTTE. Last updated: 2026-02-05*
