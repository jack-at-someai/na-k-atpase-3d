## Conceptual Analogies & Mental Models

> 14 analogies that shaped design decisions.

The following analogies were used to reason about and validate the system architecture. Each converged independently on the same underlying structure.

---

### 1. Signal Processing / Waveforms
- Nodes emit signals over time
- Metrics are channels
- Signals are samples
- Drift is phase or amplitude error
- Derived metrics are filters, integrals, or transforms

This enabled collapsing logs, forecasts, and targets into a single signal model with append-only truth.

---

### 2. FL Studio / Ableton (Music Production)
- Node = Song / Project
- Metric = Track
- Signal = Clip / Note / Automation point
- Protocol = Automation lane / ghost clip
- Drift = automation mismatch
- Rerun protocol = regenerate automation, never edit audio

This defined the timeline-first UI and separation of observation from expectation.

---

### 3. Guitar Hero (Upcoming Mode)
- Forward-only lane
- Notes represent expected signals
- Missed notes represent drift or alerts
- No history or editing

This established a clean “what’s coming next” interaction model.

---

### 4. Calendar Projection
- Signals mapped to calendar dates
- Same data, different temporal index
- No new meaning introduced

This demonstrated that views are projections, not structures.

---

### 5. Hardware Registers / Context Slots (`P0–P5`)
- Pinned nodes act as registers
- Fast-access context
- Depth-limited (≤6)
- Cache, not truth

This provided performance without introducing hierarchy.

---

### 6. Graph Traversal vs Stored Hierarchy
- Hierarchy is a chosen path, not a stored fact
- Parents are never stored
- Meaning emerges from traversal

This removed accounts and operations as special objects.

---

### 7. Nodes as “Things People Care About”
- Nodes represent attention-worthy entities
- Signals represent everything else
- Piglets modeled as signals, not nodes
- Promotion to node is explicit and optional

This prevented node explosion and modeled human attention realistically.

---

### 8. Transfer Learning via Completed Lifecycles
- Full lifecycles become sealed trajectories
- Partial lifecycles remain useful
- Signal density determines training value

This enabled archival, blockchain sealing, and trusted ground truth.

---

### 9. Mirror / Observability (Black Box → Reflection)
- AI becomes a mirror of reality
- Cognitive dissonance is expected
- Acceptance is the bottleneck, not correctness

This reframed the system as observability infrastructure, not guidance.

---

### 10. Narrated Waveform / Explain Mode
- Nodes do not speak; signals are narrated
- Language overlays traceable data
- No agency without grounding

This enabled an explainable agent mode without rewriting history.

---

### 11. Convex Hull Across Industries
- Livestock, equipment, instruments, humans
- Survives biological, mechanical, cultural domains
- Proof of domain-agnostic substrate

This validated the architecture as bedrock.

---

### 12. First-Order Logic / Turing Tapes
- Nodes = entities
- Metrics = predicates
- Signals = time-indexed truth values
- Protocols = future constraints
- Parallel tapes aligned by time

This provided the formal underpinning and final convergence.

---

### 13. Harmonic Resonance / Sympathetic Vibration
- Nodes tuned to same metrics = same frequency
- Shared protocols = same resonant structure
- Generational knowledge = sympathetic vibration
- Past nodes enrich future nodes through harmonic coupling
- Signal patterns propagate like standing waves across time

This enabled the "folding time" phenomenon: granddam's farrowing curve influences granddaughter's forecast not through explicit edges, but through resonant coupling of similar signal patterns at similar lifecycle phases.

**Key insight:** Knowledge transfer isn't mechanical (copying data). It's harmonic (tuning to the same frequency). When two nodes share metrics, protocols, and cadence, their signals naturally reinforce each other across temporal distance.

---

### 14. CT Scan / 4D Slicing
- Same graph, different viewing planes
- X-axis: Nodes/relationships (topology)
- Y-axis: Metrics/signals (features)
- Z-axis: Time (temporal spine)
- W-axis: Space (geographic spine)
- Each UI view is a 2D slice through 4D structure

This enabled frontend serialization: the UI itself is encoded in the graph, with views as projections through the tesseract.

---

### Meta-Conclusion
All analogies converge on the same principle:

**Reality is a set of identities emitting time-aligned signals.  
Meaning is derived, not stored.**
