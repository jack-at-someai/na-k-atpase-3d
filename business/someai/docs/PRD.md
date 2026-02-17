# Charlotte OS — Product Requirements Document

**Version:** 1.0
**Date:** February 16, 2026
**Author:** SomeAI

---

## 1. Vision

Charlotte OS is infrastructure for observable reality.

Every business generates signals — equipment vibrations, herd genetics, auction prices, crew performance, delivery timelines — but most of those signals go unobserved. The data either doesn't exist, lives in disconnected silos, or gets flattened into spreadsheets that destroy the relationships between things.

Charlotte makes operations observable. Not by changing what a business does, but by placing an observer on every metric line. What was dark becomes lit. What was fragmented becomes unified. What was manual becomes autonomous.

The system is named after the spider: an organism that builds a web, sits at the center, and senses vibrations along every thread. Charlotte builds a knowledge graph, lives on the temporal spine, and detects signals along every metric line.

---

## 2. The Problem

Knowledge graphs are supposed to solve the "data silo" problem. In practice, they fail at operational decisions for three structural reasons:

**2.1 Conflated Layers**
Conventional KG implementations encode everything as node-edge-node triples. "DXP Enterprises has revenue $1.8B" becomes a triple. "DXP is a competitive threat to ISG" becomes another triple. The fact and the judgment live in the same layer. When you traverse the graph, you cannot distinguish objective reality from observer interpretation.

**2.2 Probabilistic Reasoning**
The industry consensus is: embed everything into vector space, let the model figure it out. GNN embeddings, random walks, link prediction, attention-weighted traversal. The result is a confidence score: "73% likely." This works for open-ended question answering. It does not work when a plant manager needs to know *why* ServiceIQ is recommending 500 units of part X at location Y. The reasoning must be auditable. The path must be visible.

**2.3 No Dive Line**
In cave diving, you run a physical line from the entrance to your position. No matter how deep you go, you can trace the line back. Conventional KGs have no equivalent. The reasoning path is a statistical embedding, not a traceable chain. When the conclusion is wrong, there is no line to follow backward to find where it went wrong.

---

## 3. The Solution

Charlotte solves these problems with five primitives organized into two architecturally distinct layers.

### 3.1 The Five Primitives

| Primitive | Layer | Purpose | Knowledge Type |
|-----------|-------|---------|---------------|
| **NODE** | Ontological | Identity. Any uniquely identifiable entity. | Declarative |
| **EDGE** | Ontological | Relationship. A typed, directed connection between two NODEs. | Structural |
| **METRIC** | Valuation | Measurement. A quantitative dimension attached to a NODE. | Heuristic |
| **SIGNAL** | Valuation | Observation. A timestamped value placed on a METRIC line. | Heuristic |
| **PROTOCOL** | Valuation | Rule. Business logic that governs graph evolution. | Procedural |

### 3.2 The Two-Layer Architecture

**Ontological Layer (NODE + EDGE):** The knowledge graph. "What exists." Shared truth. Graph-traversable. A fact in this layer is objective — DXP Enterprises has 228 locations regardless of who reads it.

**Valuation Layer (METRIC → SIGNAL → PROTOCOL):** The serial reasoning pipeline. "What it means." Observer-dependent. A conclusion in this layer is perspectival — "DXP is a VERY HIGH threat" is a SIGNAL placed by an observer who measured specific METRICs against specific thresholds. A different observer would place different signals on the same facts.

### 3.3 The Serial Pipeline

The valuation layer is always serial: METRIC → SIGNAL → PROTOCOL. Not graph traversal. Signal processing.

- **METRIC** — A concrete, measurable value. Like features in a regression model.
- **SIGNAL** — A detected pattern derived from metrics. Feature engineering — the transformation that turns raw measurements into decision-relevant inputs.
- **PROTOCOL** — A prescribed action triggered by signals. The decision function. Deterministic. Traceable.

### 3.4 The Dive Line

Every PROTOCOL that fires can be traced back:
1. "This PROTOCOL fired because of SIGNAL X"
2. "SIGNAL X was detected because METRIC Y crossed THRESHOLD Z"
3. "METRIC Y is attached to NODE W via EDGE V"

The chain is unbroken. The reasoning path is never "the model predicted with 73% confidence." It is always: "this happened because this was measured and this threshold was crossed and this rule was in effect."

---

## 4. The Dual Engine

Charlotte OS is the shared substrate. Two engines drive it:

**SomeAI (Convergent)** — The engineering company. Ships Charlotte OS to clients. Builds domain-specific implementations. Revenue-generating. Client-facing. Consumes industries one at a time.

**SumAI (Divergent)** — The research arm. OASIS framework. Five senses plus brain. Hex campus vision. Pushes the boundaries of what Charlotte can perceive and reason about. Publishes. Explores.

The relationship is symbiotic: SumAI discovers capabilities, SomeAI ships them. Clients fund SumAI through SomeAI contracts. The research makes the product better. The product funds the research.

---

## 5. Target Users

Charlotte serves operations-heavy businesses — organizations where physical things happen in physical space and operational decisions have real stakes.

### Current Clients

| Client | Industry | Revenue | Contract | Charlotte Embeds As |
|--------|----------|---------|----------|-------------------|
| **ISG** | Industrial services | $241M (16 brands) | $1.4M/2yr | ServiceIQ |
| **Sounder** | Swine agriculture | — | First client/MVP | BarnOS |

### Pipeline

| Prospect | Industry | Size |
|----------|----------|------|
| CardVault | Premium retail | 12 stores, 338% growth |
| Allstate Manufacturing | Metal fixtures | $2.2M, 50yr operation |
| SC Online Sales | Livestock auctions | 40K+ auctions, 5 species |
| Wendt Group | Show livestock genetics | 12K auctions |
| Top Tier Moving | Logistics | $14.4M billed, 98 crew |
| PPP Instruments | Rare instruments | $5.3M portfolio |

### Common Pattern
Every client has the same before state: fragmented data, manual processes, invisible operations. Charlotte's transformation: invisible → observed. The business never changes what it does. Charlotte observes it.

---

## 6. Product Components

### 6.1 Boot Image (KRF)
The operating system kernel. 31 files of first-order logic written in KRF (Knowledge Representation Format), organized into:
- **Kernel** — Primitives, types, valuation layer doctrine, boot sequence
- **Knowledge** — Five knowledge types (structural, declarative, procedural, heuristic, meta)
- **Spine** — Temporal (epochs, units, lifecycle, encoding) and spatial (geospatial, topological, theoretical) planes
- **Agent** — Charlotte's identity, observer model, standing directives
- **Reference** — Knowledge primitives formalization, convex hull theorem

Charlotte boots unbound. A domain seed binds her to a specific operation.

### 6.2 Flutter Client
Cross-platform mobile/web/desktop application built with Flutter/Dart. Uses the `charlotte_ui` design system package — 47 glassmorphic components organized as atoms, molecules, and organisms. Firebase backend (Auth, Firestore, Cloud Functions, Messaging).

### 6.3 Liquid Glass Design System
Apple iOS 26-inspired glassmorphic CSS/JS component library. Token-driven: each brand has a `tokens.json` that compiles to CSS custom properties and Dart theme constants. Currently 14 branded themes.

### 6.4 Nervous System (Planned)
Raspberry Pi 5 hub + satellite IoT architecture. MQTT mesh. Real-time sensor integration for physical operations — equipment monitoring, environmental sensing, location tracking. Converts physical signals into Charlotte SIGNAL primitives.

---

## 7. Validation Domains

Charlotte proves its universality across 10 domains. The same five primitives work in every one.

| Domain | What It Proves |
|--------|---------------|
| **charlotte** | Self-reference. The OS models itself. |
| **someai** | Business operations of the engineering company. |
| **sounder** | Agriculture: herd genetics, breeding, farm operations. |
| **isg** | Industrial: equipment catalogs, service dispatch, PE portfolio unification. |
| **prier-violins** | Alternative assets: provenance chains, appreciation analytics. |
| **top-tier-moving** | Logistics: crew performance, dispatch, collection forecasting. |
| **lineleap** | Hospitality: venue management, queue optimization. |
| **gesdate** | Personal logistics: scheduling, date planning. |
| **sea-lion** | Marine/environmental: observation, tracking. |
| **hoshin-kanri** | Strategic planning: goal cascading, cross-functional alignment. |

The convex hull theorem (formalized in `reference/convex-hull.krf`) states: any knowledge artifact can be expressed as a weighted combination of the five knowledge types. Since Charlotte's five primitives encode all five knowledge types, Charlotte can represent any knowledge domain.

---

## 8. Business Model

**SomeAI ships Charlotte → clients embed it → each client consumes its industry → the graph IS the industry.**

The business model is recursive:
1. SomeAI builds Charlotte OS (the shared substrate)
2. Each client receives a Charlotte instance with a domain seed
3. The instance consumes the client's operational data
4. Cross-client pattern recognition becomes possible (with permission)
5. Each new domain makes the platform more valuable for all existing domains
6. The accumulated substrate across industries is the moat

### Revenue Structure
- **Implementation:** One-time domain binding and system build ($93K–$1.4M depending on client size)
- **Subscription:** Annual platform + support fees
- **Expansion:** Additional brands, locations, or verticals within a client

### The Moat
The moat is not code — it is the accumulated substrate across industries. A competitor would need to win 8 different industries simultaneously to match Charlotte's cross-domain intelligence. The five-primitive architecture is published. The data is not.

---

## 9. Roadmap

### Current State (Feb 2026)
- 31 KRF files in the boot image
- 2 active clients (ISG, Sounder)
- 6 prospects with complete business analysis
- 14 branded themes in the design system
- Flutter app with 47 glassmorphic components
- 401K+ KRF facts generated across domains

### Near-Term: Nervous System
- Pi 5 hub + satellite IoT mesh
- Real-time sensor → SIGNAL pipeline
- Equipment monitoring for ISG
- Environmental sensing for Sounder
- MQTT → Charlotte bridge

### Medium-Term: Campus
- Physical research facility
- Hex campus architecture (from SumAI vision)
- On-premise Charlotte instances for sensitive operations
- Hardware + software vertical integration

### Long-Term: Scale
Two paths:
1. **Self-sustaining:** Enough clients generating enough revenue to fund organic growth
2. **PE funding:** Enough traction to attract institutional investment ($100M fund target)

The end state: Charlotte OS is the operating system for operations, the way iOS is the operating system for phones. Each client is an app on the platform. The graph is the industry.
