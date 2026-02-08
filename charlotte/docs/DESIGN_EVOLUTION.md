# Charlotte Design Evolution

> From dashboards to narratives. The journey that shaped the architecture.

---

## The Problem

Traditional farm management software fails livestock producers because:

1. **Dashboard fatigue** - Static metrics don't capture biological flow
2. **Cycle blindness** - Breeding cycles are rhythms, not snapshots
3. **Future absence** - Shows what happened, not what's coming
4. **No narrative** - Data without meaning

---

## Phase 1: Dashboard Attempts

**Files:** `previous_drafts/farm_metrics_*.svg`, `sow_metrics_2_screenshot.svg`

The first approach was conventional:

```
┌─────────────────────────────────────┐
│  FARM METRICS DASHBOARD             │
├─────────────┬─────────────┬─────────┤
│  Total Sows │  Avg Litter │  Deaths │
│     47      │    11.2     │    3    │
├─────────────┴─────────────┴─────────┤
│  [Chart: Farrowing by Month]        │
│  [Chart: Weight Distribution]       │
│  [Chart: Feed Costs]                │
└─────────────────────────────────────┘
```

**Why it failed:**
- Numbers without context
- No sense of timing or rhythm
- Couldn't answer "what should I do today?"
- Aggregates hide individual animals

---

## Phase 2: Calendar Attempts

**Files:** `previous_drafts/calendar_page_screenshot.svg`

Next attempt: put events on a calendar.

```
┌─────────────────────────────────────┐
│  << January 2026 >>                 │
├───┬───┬───┬───┬───┬───┬───┬────────┤
│ S │ M │ T │ W │ T │ F │ S │        │
├───┼───┼───┼───┼───┼───┼───┤        │
│   │   │   │ 1 │ 2 │ 3 │ 4 │        │
│   │   │   │🐷│   │   │   │ Bella  │
│   │   │   │   │   │   │   │ due    │
├───┼───┼───┼───┼───┼───┼───┤        │
│ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │        │
└───┴───┴───┴───┴───┴───┴───┴────────┘
```

**Why it failed:**
- Calendar is spatial, cycles are durational
- Hard to show overlapping cycles
- Due dates without context of the journey
- No relationship between animals

---

## Phase 3: Cycle Visualization Attempts

**Files:** `previous_drafts/image 23.svg` through `image 27.svg`

Five attempts at visualizing biological cycles:

```
Attempt 23: Linear timeline
────●────────●────────●────────●────
  Bred     21-day   Ultrasound  Due
           check

Attempt 24: Circular/radial
        ┌── Day 0: Bred
       ╱
      ○ ─── Day 21: Check
       ╲
        └── Day 114: Due

Attempt 25: Swim lanes
Bella  ═══════════════════●═══════
Ruby   ════════●══════════════════
Star   ══●════════════════════════

Attempt 26: Gantt-style
       Jan    Feb    Mar    Apr
Bella  [████████████████████░░░░]
Ruby   [░░░░████████████████████]

Attempt 27: Nested cycles
       ┌─ Lactation ─┐
[Gestation──────────][L][Gestation──]
                      ↑
                   Weaning
```

**Why they all failed:**
- Too focused on ONE cycle type
- Didn't show the cascade (breeding → gestation → farrowing → lactation → re-breed)
- Couldn't handle multiple animals cleanly
- Static—couldn't show "where am I now?"

---

## Phase 4: Subscription Model

**File:** `previous_drafts/SUB.svg`

Before AI, the business model was subscription-based software:

```
┌─────────────────────────────────────┐
│  SOUNDER PRICING                    │
├─────────────────────────────────────┤
│  FREE        BASIC       PRO        │
│  $0/mo       $9/mo       $29/mo     │
│                                     │
│  5 animals   50 animals  Unlimited  │
│  Basic       Full        AI Insights│
│  tracking    protocols   + Forecasts│
└─────────────────────────────────────┘
```

**Why it changed:**
- AI enables a fundamentally different product
- Not just tracking—predicting and advising
- Value is in the agent, not the features
- Protocol forecasting changes everything

---

## The Breakthrough: UI Inspiration

**Files:** `ui_inspiration/*.svg`

The design research that changed everything:

### Timeline Views - Three Temporal Manipulations

The three timeline files show different ways to render temporal nodes:

#### `timeline.svg` - Piano Sheet Music View

A flight booking interface with matrix layout:

```
         │ 21   22   23   24   25   26   27 │  ← Dates (X-axis)
    ─────┼─────────────────────────────────┤
    €60  │      ████                        │
    €92  │ ██        ████                   │
    €110 │      ██        ████   ██         │  ← Price/time lanes
    €168 │           ██        ████         │
    €195 │ ██                        ████   │
    ─────┴─────────────────────────────────┘
              Time flows →
```

**Charlotte UPCOMING mode should work like this:**
- X-axis = days (temporal nodes)
- Y-axis = animals/protocols (swim lanes)
- Colored bars = expected signals
- Click a bar = see signal details

```
         │ Mon  Tue  Wed  Thu  Fri  Sat  Sun │
    ─────┼────────────────────────────────────┤
    Ruby │ ████████████████████░░░░  DUE     │  Day 112-114
    Bella│           ████                    │  Ultrasound
    Star │ ██                         ██     │  Heat checks
    Litter│     ████      ████      ████     │  Weigh days
    ─────┴────────────────────────────────────┘
```

#### `timeline_2.svg` - Complex Cycle as Itinerary

A vacation day visualized as connected nodes:

```
    SAT 26
    ───●────────●────────●────────●────────●───►
       │        │        │        │        │
    Hotel    Subway   Central   Lunch   Museum
                       Park

    FRI 25
    ───●────────●────────●────────●────────●───►
       │        │        │        │        │
    LIRR    Sarabeth's  Café    Shopping  Hotel
```

**A sow's gestation IS an itinerary:**

```
    BELLA - Gestation "Trip"
    ───●────────●────────●────────●────────●───►
       │        │        │        │        │
    Bred    21-day    Ultrasound  Move to  Farrow
    Day 0   check     Day 30      crate    Day 114
            Day 21                Day 100
```

Each checkpoint is a "destination" with activities and expected observations.

#### `timeline_storytelling.svg` - The Final Form

Data journalism calendar heatmap with narrative annotations:

```
    Vehicles in Fatal Crashes 2010

         Su Mo Tu We Th Fr Sa
    JAN  ░░ ░░ ░░ ░░ ░░ ▓▓ ▓▓  ← "New Year's Day"
    FEB  ░░ ░░ ░░ ░░ ░░ ▓▓ ▓▓
    MAR  ░░ ░░ ░░ ░░ ░░ ▓▓ ▓▓  ← "Fewest: Mon Mar 22"
    ...
    OCT  ░░ ░░ ░░ ░░ ░░ ██ ██  ← "Most: Sat Oct 23"
    NOV  ░░ ░░ ░░ ░░ ░░ ▓▓ ▓▓  ← "Winter: fewer miles"
    DEC  ░░ ░░ ░░ ░░ ░░ ▓▓ ▓▓

    45,777 vehicles involved total
```

**This is Charlotte's goal** - a year of operations rendered as heatmap with agent insights:

```
    Heimer Hampshires 2026

         Su Mo Tu We Th Fr Sa
    JAN  ░░ ░░ ██ ░░ ░░ ▓▓ ░░  ← "Ruby farrowed: 11 alive"
    FEB  ░░ ░░ ░░ ░░ ░░ ░░ ░░  ← "Breeding gap - plan ahead"
    MAR  ░░ ██ ░░ ░░ ██ ░░ ░░  ← "2 ultrasounds confirmed"
    ...
    AUG  ██ ██ ██ ░░ ░░ ░░ ░░  ← "State Fair week: 3 showing"

    Insights:
    • Best farrowing month: January (avg 10.8 born alive)
    • Breeding efficiency: 87%
    • Show pig ADG: 1.92 lbs/day
```

**Temporal nodes + signal density + agent annotations = final form.**

---

### Timeline Pattern → Charlotte Mode Mapping

| Pattern | File | Charlotte Mode | Agent |
|---------|------|----------------|-------|
| Piano sheet music | `timeline.svg` | UPCOMING | NEMO |
| Itinerary/journey | `timeline_2.svg` | NODE detail (protocol view) | DORI |
| Calendar heatmap | `timeline_storytelling.svg` | CALENDAR (year view) | CAL |

These three patterns represent **three zoom levels** of temporal manipulation:

1. **Week view** (piano sheet) - NEMO's domain
   - High resolution: individual signals as notes
   - Focus: what's due, what's done

2. **Protocol view** (itinerary) - DORI's domain
   - Medium resolution: checkpoints as destinations
   - Focus: single animal's journey through a cycle

3. **Year view** (heatmap) - CAL's domain
   - Low resolution: days as colored cells
   - Focus: patterns, seasonality, insights scattered as annotations

### Data Storytelling
`data_storytelling.svg`

**Insight:** A project timeline with swim lanes and stages - narrative visualization.

```
BM TEAM    Research → Wireframes → Artwork → Coding → Dev → Launch
           ═══●═══════●══════════●════════●═══════●══════●═══►
              │        │          │        │       │      │
           ═══●═══════●══════════●════════●═══════●══════●═══►
CLIENT     Meeting  Feedback   Review   Review  Test  Review
```

**Translate to livestock protocol:**

```
BELLA      Bred → Day 21 Check → Ultrasound → Late Gest → Farrow
           ═══●════════●══════════●═══════════●══════════●═══►
              │         │          │           │          │
           ═══●════════●══════════●═══════════●══════════●═══►
FARMER     Record    Confirm    Check       Move to    Record
           breeding  no heat    pregnancy   crate      litter
```

Data becomes narrative. Checkpoints become milestones. Progress toward goal.

### Sensemaker
`sensemaker.svg`

**Insight:** This is the theoretical foundation - a knowledge graph theory diagram:

```
    INFORMATION is a node
              ●
             ╱│╲
            ╱ │ ╲
    KNOWLEDGE is a connection
          ●───●───●
         ╱│╲ ╱│╲ ╱│╲

    SENSEMAKING is a process
    of making connections

    UNDERSTANDING is an
    Emergent Property of a Network

    WAYFINDING involves social and
    environmental cues to navigate information
```

**This IS Charlotte's architecture:**
- FACTs = information nodes
- EDGEs = knowledge connections
- Charlotte (agent) = sensemaking process
- The graph = emergent understanding
- UI modes = wayfinding cues

### At-a-Glance
`at_a_glance_preview.svg`

**Insight:** Glanceability—instant understanding without analysis.

```
┌───────────────────┐
│  BELLA            │
│  ████████████░░░░ │  ← 78% through gestation
│  Day 89 of 114    │
│  Due: Feb 15      │
└───────────────────┘
```

### Upcoming Mode
`upcoming_mode_preview.svg`

**Insight:** The pattern is a medication tracking app - time-ordered expected actions.

```
┌─────────────────────────────────────┐
│  Hi Jonas                    🔔 👤  │
│  27 Jun 2020                        │
│  [April][May][June][July][Aug][Sep] │
│  [24][25][26][27●][28][29]          │
├─────────────────────────────────────┤
│  7:00AM                             │
│    💊 Osemiprazol (1 pill 40mg) ✓   │
│    🍳 Breakfast                     │
│                                     │
│  10:00                              │
│    💊 Indever (0.5 tablet 40mg) ✓   │
│                                     │
│  12:00PM                            │
│    🍴 Lunch                         │
│    💉 Insuline (1 injection 8ml)    │
│                                     │
│  03:00PM                            │
│    💊 Rocal D (1 tablet 200mg)      │
└─────────────────────────────────────┘
```

**Translate to livestock:**
- 💊 Osemiprazol → 📊 Weigh Ruby's litter (protocol)
- 💉 Insuline → 🔍 Heat check Star (day 18)
- Check marks = recorded signals
- Numbers = protocol progress

Same pattern, different domain. Protocols generate expected signals, user records actual signals.

---

## How This Shaped the Architecture

The design evolution directly influenced Charlotte's substrate:

| Design Learning | Architecture Decision |
|-----------------|----------------------|
| Time is narrative | Time-as-graph (DATE nodes) |
| Cycles are durations | Protocols with checkpoints |
| Data needs meaning | Agent mode (WILBUR) |
| Future matters | UPCOMING mode (NEMO) |
| Animals have journeys | NODE detail (DORI) |
| Relationships matter | EDGE-based connections |
| Metrics evolve | User-defined metrics via SIGNAL |

---

## The Final Insight

**Dashboards answer: "What happened?"**

**Charlotte answers: "What's happening, and what should I do about it?"**

The shift from static dashboard to narrative infrastructure required:

1. **Time as first-class citizen** - Not timestamps, but a traversable graph
2. **Protocols as forecasts** - Not just reminders, but expected signals
3. **Agent as narrator** - Not just display, but interpretation
4. **Signals over fields** - Not static attributes, but evolving observations

---

## File Archaeology

### previous_drafts/ (The Journey)

| File | What It Shows | Why It Failed |
|------|---------------|---------------|
| `farm_metrics_*.svg` | Dashboard approach | Static, no context |
| `sow_metrics_2_screenshot.svg` | Animal-level metrics | Still dashboard thinking |
| `calendar_page_screenshot.svg` | Events on calendar | Spatial, not durational |
| `image 23-27.svg` | Cycle visualizations | Single-cycle focus |
| `foot_projections.svg` | Projection attempts | Missing protocol concept |
| `SUB.svg` | Subscription pricing | Pre-AI business model |

### ui_inspiration/ (The Destination)

| File | Design Pattern | Charlotte Mode |
|------|----------------|----------------|
| `timeline*.svg` | Time-forward narrative | METRIC (SQUIRT) |
| `data_storytelling.svg` | Story over numbers | AGENT (WILBUR) |
| `sensemaker.svg` | AI interpretation | AGENT (WILBUR) |
| `at_a_glance_preview.svg` | Glanceable summary | NODE detail (DORI) |
| `upcoming_mode_preview.svg` | Near-future focus | UPCOMING (NEMO) |

---

## Summary

The design evolution from `previous_drafts/` to `ui_inspiration/` represents:

```
DASHBOARDS          →  NARRATIVES
Static metrics      →  Flowing signals
Past-focused        →  Future-focused
Display data        →  Interpret data
Features            →  Agent intelligence
Subscription        →  AI-powered forecasting
```

This journey is why Charlotte has:
- A single FACT collection (not feature-sprawl)
- Time as a graph layer (not timestamps)
- Protocols that forecast (not just remind)
- An agent that speaks (not just displays)

---

*Documentation of the road not taken, and the road that led here.*
*Maintained by CHARLOTTE. Last updated: 2026-01-30*
