# Charlotte Assets & Artifacts

> App assets live in `assets/`. Documentation artifacts live in `docs/artifacts/`.

**REQUIRED READING FOR ALL AGENTS.**

---

## Table of Contents

1. [Overview](#overview)
2. [App Assets](#app-assets)
3. [Documentation Artifacts](#documentation-artifacts)
4. [Artifact Naming Convention](#artifact-naming-convention)
5. [Data Artifacts](#data-artifacts)
6. [Image Artifacts](#image-artifacts)
7. [Mapping Artifacts to FACTs](#mapping-artifacts-to-facts)

---

## Overview

Charlotte is **precision livestock management software for the purebred show industry**. Assets are split:

- **`assets/`** - App branding only (logo, icons, backgrounds). Included in pubspec.yaml.
- **`docs/artifacts/`** - Research artifacts for documentation and publishable paper. NOT in app bundle.

This separation keeps the app lean while preserving domain knowledge for research purposes.

---

## App Assets

Located in `assets/`, these are bundled with the app:

| File | Purpose |
|------|---------|
| `appicon.png` | App icon |
| `brand.png` | Brand imagery |
| `logo.svg` | Minimal logo |
| `white_10_logo.png` | White variant |
| `illustration.svg` | Decorative illustration |
| `background.png` | Full background |

---

## Documentation Artifacts

Located in `docs/artifacts/`, organized by prefix for research and paper publication:

```
docs/artifacts/
├── WHITEPAPER_*.md                   # Academic papers
├── DATA_SUBSTRATE_SPATIAL_*.jsonl    # Geographic/industry data
├── DATA_NODE_IMPORT_*.json           # Operation import examples
├── IMAGE_VISION_*.svg                # Vision concepts
├── IMAGE_DRAFT_*.svg                 # UI drafts (A-J)
├── IMAGE_*_PROTOCOL.svg              # Biological protocols
├── IMAGE_INDUSTRY_*.svg              # Industry reference
├── IMAGE_PUREBRED_SIRES_*.svg        # Breed documentation
└── IMAGE_GRAPH_*.png                 # Graph visualization rules
```

---

## Artifact Naming Convention

All artifacts follow `{TYPE}_{CATEGORY}_{NAME}.{ext}`:

| Prefix | Type | Purpose |
|--------|------|---------|
| `PAPER_` | Document | Research paper outlines and structures |
| `WHITEPAPER_` | Document | Draft academic papers |
| `DATA_` | Data | JSON/JSONL data files |
| `IMAGE_` | Image | SVG/PNG visual assets |

### Data Categories

| Category | Purpose |
|----------|---------|
| `SUBSTRATE_SPATIAL_` | Geographic substrate (breeders, cities) |
| `NODE_IMPORT_` | Example node import operations |

### Image Categories

| Category | Purpose |
|----------|---------|
| `VISION_` | Vision concepts, Flo mapping, storyboards |
| `DRAFT_` | UI draft iterations |
| `*_PROTOCOL` | Biological cycle protocols |
| `INDUSTRY_` | Industry KPIs, resources |
| `PUREBRED_SIRES_` | Breed documentation |
| `GRAPH_` | Graph visualization rules |

---

## Data Artifacts

### Breeder Registries

| File | Association | Records |
|------|-------------|---------|
| `DATA_SUBSTRATE_SPATIAL_BREEDERS_NSR.jsonl` | National Swine Registry | Yorkshire, Duroc, Hampshire, Landrace |
| `DATA_SUBSTRATE_SPATIAL_BREEDERS_ABA.jsonl` | American Berkshire Association | Berkshire |
| `DATA_SUBSTRATE_SPATIAL_BREEDERS_TSA.jsonl` | Texas Swine Association | Multiple |

### Geographic Data

| File | Content |
|------|---------|
| `DATA_SUBSTRATE_SPATIAL_CITIES.jsonl` | Agricultural communities |

### Operation Import Examples

| File | Content |
|------|---------|
| `DATA_NODE_IMPORT_OPERATION_1.json` | Example operation import |
| `DATA_NODE_IMPORT_OPERATION_2.json` | Example operation import |
| `DATA_NODE_IMPORT_OPERATION_3.jsonl` | Example operation import |
| `DATA_NODE_IMPORT_OPERATION_4.jsonl` | Example operation import |

---

## Image Artifacts

### Vision & Concept

| File | Purpose |
|------|---------|
| `IMAGE_VISION_KNOWLEDGE_GRAPH.svg` | Knowledge graph theory |
| `IMAGE_VISION_PIANO_MUSIC.svg` | Timeline as piano sheet analogy |
| `IMAGE_VISION_COHESIVE_STORYLINE.svg` | Storyline concept |
| `IMAGE_VISION_NODE_STORYTELLING.svg` | Node storytelling pattern |
| `IMAGE_VISION_STORYBOARD.svg` | Storyboard layout |
| `IMAGE_VISION_UPCOMING_PROTOCOLS.svg` | Upcoming protocols view |
| `IMAGE_VISION_EFFICIENT_TIME_BLOCK.svg` | Time block efficiency |
| `IMAGE_VISION_TRACK_ANYTHING.svg` | Track anything concept |
| `IMAGE_VISION_FEED_PROTOCOL.svg` | Feed protocol visualization |
| `IMAGE_VISION_FLO_ONBOARDING_1-7.svg` | Flo app feature mapping |

### UI Drafts

| File | Iteration |
|------|-----------|
| `IMAGE_DRAFT_A.svg` through `IMAGE_DRAFT_J.svg` | UI draft iterations |
| `IMAGE_DRAFT_SUBSCRIPTIONS.svg` | Subscription UI draft |

### Biological Protocols

| File | Domain |
|------|--------|
| `IMAGE_GESTATION_PROTOCOL.svg` | 114-day pregnancy tracking |
| `IMAGE_ESTROUS_PROTOCOL.svg` | 21-day heat detection |
| `IMAGE_WEIGHT_PROTOCOL.svg` | Weight tracking protocol |
| `IMAGE_VETERINARY_PROTOCOL.svg` | Veterinary care protocol |
| `IMAGE_MATRIX_PROTOCOL.svg` | Breeding matrix strategy |

### Industry Reference

| File | Content |
|------|---------|
| `IMAGE_INDUSTRY_KPIS.svg` | Industry KPIs by stage |
| `IMAGE_INDUSTRY_RESOURCE.svg` | Industry resource reference |
| `IMAGE_PUREBRED_SIRES_1.svg` | Purebred sire documentation |
| `IMAGE_PUREBRED_SIRES_2.svg` | Purebred sire documentation |

### Graph Visualization

| File | Content |
|------|---------|
| `IMAGE_GRAPH_VISUALIZATION_RULES.png` | Academic graph layout rules |

---

## Mapping Artifacts to FACTs

### Breeders to Operations (NODEs)

```json
{":ID": "OP:heimer_hamps", ":TYPE": "NODE", "P0": "OPERATION"}
{":ID": "HUMAN:jheimer", ":TYPE": "NODE", "P0": "HUMAN"}
{":ID": "E:owns", ":TYPE": "EDGE", "P0": "HUMAN:jheimer", "P1": "OP:heimer_hamps", "P2": "OWNS"}
```

### Cities to Location Layer (NODEs + EDGEs)

```json
{":ID": "CITY:TAYLOR_MO", ":TYPE": "NODE", "P0": "CITY"}
{":ID": "E:loc", ":TYPE": "EDGE", "P0": "OP:heimer_hamps", "P1": "CITY:TAYLOR_MO", "P2": "LOCATED_IN"}
```

### Biological Cycles to Protocols

```json
{
  ":ID": "PROTOCOL:gestation_114",
  ":TYPE": "PROTOCOL",
  "P0": "SOW:bella",
  "P1": {
    "type": "BIOLOGICAL_CYCLE",
    "duration_days": 114,
    "checkpoints": [
      {"day": 21, "metric": "METRIC:heat_check", "expected": false},
      {"day": 30, "metric": "METRIC:ultrasound", "expected": true},
      {"day": 100, "action": "move_to_farrowing"},
      {"day": 114, "event": "FARROWING"}
    ]
  }
}
```

---

## Summary

| Location | Content | In App? |
|----------|---------|---------|
| `assets/` | App branding (logo, icons) | Yes |
| `docs/artifacts/` | Research data & images | No |

**Charlotte exists to serve multi-generational family farms raising purebred livestock for competition.** The artifacts preserve domain knowledge for documentation and publishable research.

---

*This documentation maintained by CHARLOTTE. Last updated: 2026-02-05*
