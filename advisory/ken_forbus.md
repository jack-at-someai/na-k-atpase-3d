# Kenneth D. Forbus
## Academic Mentor | Northwestern QRG | Companions Architect

---

## Identity

**Name:** Kenneth D. Forbus
**Title:** Walter P. Murphy Professor of Computer Science; Professor of Education
**Institution:** Northwestern University, McCormick School of Engineering
**Lab:** Qualitative Reasoning Group (QRG)
**Email:** forbus@northwestern.edu

**Fellowships:**
- Association for the Advancement of Artificial Intelligence (AAAI)
- Cognitive Science Society
- Association for Computing Machinery (ACM)
- Humboldt Research Award (2011)

---

## Research Program

Forbus leads the Qualitative Reasoning Group at Northwestern, one of the longest-running AI research labs focused on how humans actually think — not how machines should approximate thinking.

Five interlocking research threads:

| Thread | Focus |
|--------|-------|
| **Qualitative Reasoning** | Representations for quantities, space, time, and causality that mirror human conceptual reasoning |
| **Analogical Reasoning & Learning** | Structure-mapping theory: how humans reason by comparing relational structures across domains |
| **Sketch Understanding (CogSketch)** | Systems that participate in sketching with people, combining visual, spatial, and conceptual processing |
| **Learning by Reading** | Enabling systems to extend knowledge by understanding texts and diagrams |
| **Cognitive Architecture** | The Companions project — building systems that learn from experience and collaborate with humans |

### The Structure-Mapping Engine (SME)

Forbus's implementation of Dedre Gentner's structure-mapping theory. SME performs analogical matching by aligning relational structures between a base and target domain. It does not match on surface features — it matches on relationships between relationships.

This principle — that meaning lives in structure, not surface — is foundational.

### MAC/FAC (Many Are Called, Few Are Chosen)

A similarity-based retrieval system. Given a probe, MAC/FAC searches a large case library using cheap feature vectors (MAC stage), then performs expensive structural alignment on the top candidates (FAC stage). This two-stage architecture enables analogical retrieval at scale.

---

## The Companions Project

Funded by DARPA IPTO, the Companions project represents Forbus's central architectural vision: **Companion Cognitive Systems** — software that functions as an intelligent collaborator, learning from users over extended periods.

### Core Hypothesis

> "The flexibility and breadth of human common sense reasoning and learning arises from analogical reasoning and learning from experience."

Companions are not expert systems. They are not chatbots. They are cognitive architectures built on the premise that analogy is not a rare operation — it is the fundamental mechanism of thought.

### Three Learning Mechanisms

1. **Accumulation of examples** — reasoning about new situations through analogical comparison with prior cases
2. **Interactive analogical learning** — accelerated learning from human-provided analogies
3. **Generalization from multiple examples** — refining abstract knowledge incrementally across encounters

### Architectural Principles

| Principle | Description |
|-----------|-------------|
| **Analogy as core** | Not a module — the central reasoning mechanism |
| **Qualitative representations** | Bridge between perception and conceptual knowledge |
| **Higher-order cognition** | Targets long time-scale reasoning, not reactive skill |
| **Distributed agents** | Functionally-organized agents with replicated knowledge bases |
| **Continuous learning** | Uses idle time for reflection, self-improvement, and generalization |
| **User collaboration** | Intelligence amplification, not automation |

### Symbolic Supercomputing

Forbus built dedicated cluster computers to support the Companions project:

| System | Nodes | Year | Purpose |
|--------|-------|------|---------|
| Colossus | 5 | 2003 | First symbolic supercomputer for Companions |
| Mk2 | 67 | 2004 | Scaled symbolic reasoning |
| Captain Morgan | 128 (2,048 cores, 4TB RAM) | Later | Full-scale analogical processing |

The insight: symbolic reasoning at scale requires different hardware optimization than neural approaches — fast CPUs, large caches, replicated knowledge bases across distributed nodes.

---

## Courses That Shaped Charlotte

Jack studied under Forbus during the first cohort of Northwestern's MS in Artificial Intelligence (2018-2019):

| Course | Key Takeaway |
|--------|-------------|
| **Knowledge Representation & Reasoning (CS 371)** | All intelligence begins with how you represent what you know. Schema choice determines reasoning capability. |
| **Introduction to Cognitive Modeling (CogSci 207)** | Human cognition is the benchmark. If the model doesn't match how people actually think, the architecture is wrong. |

---

## The Line from Companions to Charlotte

Forbus's Companions research is one of the deepest intellectual inputs to Charlotte's architecture. The resonance is structural, not superficial:

### 1. Knowledge Representation Is The Bottleneck

**Forbus:** Qualitative representations form the bridge between perception and conceptual reasoning. The representation determines what can be reasoned about.

**Charlotte:** Everything is a FACT. Five types. Register-based. The representation is the architecture. If the substrate is right, reasoning becomes traversal.

### 2. Analogy Over Abstraction

**Forbus:** Intelligence comes from comparing structured cases, not from hand-authored rules or statistical patterns. SME matches relational structure, not surface features.

**Charlotte:** Domain meaning is introduced through categories and metrics — never through architectural change. The same graph structure models pigs, compressors, violins, and humans. Cross-domain reasoning is structural alignment, not ontology matching.

### 3. Memory-Centric, Not Rule-Centric

**Forbus (via Kris Hammond):** "Memory before abstraction." The Companions architecture accumulates cases and retrieves by analogy (MAC/FAC) rather than encoding rules.

**Charlotte:** History is append-only. Completed lifecycles become sealed ground truth. The system accumulates signal history — structured experience — not rules. Explanation emerges from the record, not from inference engines.

### 4. Time-Extended Collaboration

**Forbus:** Companions learn incrementally from users over extended periods. They build shared understanding. They use idle time for reflection and self-improvement.

**Charlotte:** Time is the primary axis of truth. The system grows with its users — signal density increases, patterns become visible, protocols refine. Charlotte does not predict from a snapshot; it observes trajectories.

### 5. Distributed Agent Architecture

**Forbus:** Companions operate as collections of functionally-organized agents, inspired by the RoboTA coaching system. Parallel processing enables simultaneous retrieval, matching, and visual analysis.

**Charlotte:** The agent architecture (Charlotte, Finn, Dori, Milo, Nemo, Squirt, Cal, Wilbur) mirrors this — functionally-scoped agents operating on a shared substrate, each responsible for a different reasoning mode.

### 6. Intelligence Amplification, Not Automation

**Forbus:** Companions are designed for "a form of intelligence amplification." The human remains in the loop. The system assists, retrieves, and explains — it does not decide.

**Charlotte:** The agent explains and proposes. It does not act autonomously. Users bring interpretation. The system provides the mirror. No black-box decision making.

### 7. Explanation as Evidence

**Forbus:** Analogical reasoning produces transparent explanations — here is the base case, here is the mapping, here is why these structures align. Reasoning is inspectable.

**Charlotte:** Explanation is evidence-backed narration, not inference. Signals have provenance. History is immutable. Every claim can be traced to its source facts.

---

## The Deeper Pattern

Forbus spent his career proving that symbolic, structured, human-like reasoning is not a dead end — it is the path forward. While the field chased statistical learning and neural approximation, QRG kept building systems grounded in how people actually think: through analogy, qualitative models, and structured comparison.

Charlotte inherits this conviction. The substrate is symbolic. The representations are qualitative (signals on dimensions over time). Cross-domain capability comes from structural alignment, not retraining. And the goal is not prediction — it is understanding.

Forbus built Companions to be cognitive collaborators that learn from experience and amplify human intelligence. Charlotte is infrastructure that makes that collaboration possible at the level of observable reality.

The teacher's frequency persists in the student's architecture.

---

## Key Publications

- **"Qualitative Representations: How People Reason and Learn about the Continuous World"** — MIT Press. The definitive text on qualitative reasoning.
- **"Building Problem Solvers"** (with Johan de Kleer) — Canonical reference for constraint-based reasoning systems.
- **"Companion Cognitive Systems: A Step Towards Human-Level AI"** — DARPA-era position paper on the Companions architecture.
- **"Self-Modeling in Companion Cognitive Systems"** — On how Companions reflect on and improve their own reasoning.

---

## Links

- QRG Lab: https://www.qrg.northwestern.edu/
- Companions Project: https://www.qrg.northwestern.edu/projects/Companions/companions_index.html
- Faculty Page: https://www.cs.northwestern.edu/~forbus/

---

*Document compiled from QRG web resources, Northwestern faculty profiles, and author-provided context on intellectual lineage.*
