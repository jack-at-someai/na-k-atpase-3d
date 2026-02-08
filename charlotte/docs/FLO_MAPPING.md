# Flo → Charlotte Feature Mapping

> Every feature of Flo should be emergent from Charlotte's knowledge graph.

**Reference:** `docs/artifacts/IMAGE_VISION_FLO_ONBOARDING_*.svg` (Flo onboarding screenshots)

---

## The Insight

Flo is a women's health app for period and pregnancy tracking. Charlotte is livestock management. **Same problem domain:**

| Flo (Human) | Charlotte (Livestock) |
|-------------|----------------------|
| Menstrual cycle (28 days) | Estrous cycle (21 days) |
| Pregnancy (280 days) | Gestation (114 days for pigs) |
| Period prediction | Heat detection prediction |
| Symptom logging | Health signal logging |
| Fertility window | Breeding window |
| Due date tracking | Farrowing date tracking |

If Flo can do it for one human, Charlotte can do it for hundreds of animals.

---

## Feature-by-Feature Mapping

### 1. Cycle Tracking

**Flo:** "Log your periods to get accurate predictions"

```
┌─────────────────────────────────────┐
│  Calendar with highlighted days     │
│  "NEXT PERIOD" badge on day 25      │
│  90% prediction accuracy claim      │
└─────────────────────────────────────┘
```

**Charlotte:** Log heat detection to predict next estrous

```json
{":ID": "SIG:heat1", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-15-2026",
 "P0": "SOW:bella", "P1": "METRIC:heat_detected", "P2": true}

// System computes: Next heat expected DATE:2-5-2026 (21 days later)
// Creates forecast SIGNAL linked to implicit estrous PROTOCOL
```

**Charlotte Mode:** CALENDAR (CAL) + UPCOMING (NEMO)

---

### 2. Cycle Wheel Visualization

**Flo:** Circular diagram showing cycle phases

```
        ┌─── Period (red) ───┐
       ╱                      ╲
      ╱     CYCLE WHEEL        ╲
     │                          │
     │    Sticky → Creamy →     │
     │    Egg white             │
      ╲                        ╱
       ╲   Fertile (cyan)     ╱
        └────────────────────┘
```

**Charlotte:** Circular protocol visualization on NODE detail

```
        ┌─── Farrowing ───┐
       ╱     (Day 114)     ╲
      ╱                     ╲
     │    SOW PROTOCOL       │
     │                       │
     │  Late Gest (80+)      │
      ╲                     ╱
       ╲   Breeding (0)    ╱
        └─────────────────┘
```

**Charlotte Mode:** NODE detail (DORI)

---

### 3. Symptom Logging

**Flo:** "How do you feel today?" with icon grid

```
┌─────────────────────────────────────┐
│  Select your symptoms               │
│  [Cramps] [Fatigue] [Bloating]     │
│  [Tender] [Backache] [None]        │
│                                     │
│  [Apply the symptoms]               │
└─────────────────────────────────────┘
```

**Charlotte:** Quick signal recording with metric icons

```
┌─────────────────────────────────────┐
│  Log observation for Bella          │
│  [🦶 Lameness] [😴 Lethargy] [🍽️ Off feed] │
│  [🤒 Fever] [💧 Discharge] [✓ Normal]    │
│                                     │
│  [Record signals]                   │
└─────────────────────────────────────┘
```

**Charlotte Mode:** NODE detail (DORI) quick-log widget

---

### 4. Pattern Analysis

**Flo:** "Get to know your cycle patterns"

```
┌─────────────────────────────────────┐
│  Previous cycle length: 31 days  ✓ NORMAL    │
│  Previous period length: 5 days  ✓ NORMAL    │
│  Cycle length variation: 26-37   ⚠️ IRREGULAR │
└─────────────────────────────────────┘
```

**Charlotte:** Computed metrics from signal history

```
┌─────────────────────────────────────┐
│  Bella - Breeding Performance              │
│  Avg cycle length: 21.3 days    ✓ NORMAL   │
│  Avg litter size: 11.2 born     ✓ ABOVE AVG │
│  Wean-to-breed interval: 8 days ⚠️ SLOW     │
└─────────────────────────────────────┘
```

**Charlotte Mode:** NODE detail (DORI) computed stats + METRIC mode (SQUIRT) trends

---

### 5. Predictions / Forecasting

**Flo:** "How you might feel tomorrow"

```
┌─────────────────────────────────────┐
│  Tomorrow's symptoms                │
│  😐 😟 😣                            │
│                                     │
│  "Always be ready for what's coming"│
└─────────────────────────────────────┘
```

**Charlotte:** Protocol-generated forecast signals

```
┌─────────────────────────────────────┐
│  Tomorrow's expected signals        │
│  🐷 Ruby - Day 113 (due tomorrow!)  │
│  📊 Bella litter - weigh day        │
│  🔍 Star - heat check (day 20)      │
│                                     │
│  "Plan your day around the signals" │
└─────────────────────────────────────┘
```

**Charlotte Mode:** UPCOMING (NEMO)

---

### 6. Daily Insights

**Flo:** "My daily insights" cards

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Log your │ │ Let's    │ │ Spotting │
│ symptoms │ │ talk     │ │ vs       │
│    +     │ │ backache │ │ period   │
└──────────┘ └──────────┘ └──────────┘
```

**Charlotte:** Agent-generated insight cards

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Ruby     │ │ Bella's  │ │ Weight   │
│ overdue  │ │ ADG is   │ │ target   │
│ 2 days   │ │ lagging  │ │ at risk  │
└──────────┘ └──────────┘ └──────────┘
```

**Charlotte Mode:** AGENT (WILBUR) insight generation

---

### 7. Multi-Metric Integration

**Flo:** "Your cycle and health data in one place"

```
✓ Optimize fitness around your cycle
✓ See how your cycle impacts stress, sleep, energy
✓ Improve your work and sex life
```

**Charlotte:** Feature layer - any metric on any node

```
✓ Optimize feed around gestation stage
✓ See how breeding impacts weight gain, litter size
✓ Improve show performance by understanding growth curves
```

**Charlotte Mode:** All modes - METRIC layer is universal

---

## The Substrate Makes It Possible

Flo's features emerge from simple primitives:
- **Log period** = Create SIGNAL with value
- **Predict next** = PROTOCOL generates forecast SIGNAL
- **Show patterns** = Query SIGNAL history, compute stats
- **Daily insights** = Agent reads graph, generates MESSAGE

Charlotte uses the same primitives:
- **Log heat** = Create SIGNAL with value
- **Predict farrowing** = PROTOCOL generates forecast SIGNAL
- **Show performance** = Query SIGNAL history, compute stats
- **Daily insights** = Agent reads graph, generates MESSAGE

**The graph IS the product. Features are just views.**

---

## Implementation Priority

Based on Flo's onboarding flow, Charlotte should prioritize:

| Priority | Feature | Mode | Agent |
|----------|---------|------|-------|
| 1 | Quick signal logging | NODE detail | DORI |
| 2 | Calendar with predictions | CALENDAR | CAL |
| 3 | Upcoming signals view | UPCOMING | NEMO |
| 4 | Pattern analysis | METRIC | SQUIRT |
| 5 | Daily insights | AGENT | WILBUR |
| 6 | Cycle visualization | NODE detail | DORI |

---

## Key Differences

| Aspect | Flo | Charlotte |
|--------|-----|-----------|
| **Scale** | 1 user | 1 user, many animals |
| **Entity** | Self | NODEs (sows, boars, piglets) |
| **Cycle type** | Monthly | Varies by protocol |
| **Logging** | Self-report | Observed by user |
| **Predictions** | Personal | Per-node |
| **Graph** | Implicit | Explicit (EDGE-connected) |

Charlotte's advantage: **The graph is explicit.** Relationships between animals, metrics, and time are first-class EDGEs, enabling queries Flo can't do:

- "Show me all sows due in the next 7 days"
- "Which boar has the best litter sizes?"
- "Compare Ruby's growth curve to her littermates"

---

*Every Flo feature is a scoped query on the Charlotte substrate.*

*Maintained by CHARLOTTE. Last updated: 2026-02-05*
