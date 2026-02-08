# Charlotte vs GesDate: Feature Comparison

A comprehensive analysis of how Charlotte's architecture delivers full feature parity with [GesDate](https://gesdate.com/) while adding capabilities they don't have.

---

## Pricing Comparison

| Tier | GesDate | Charlotte |
|------|---------|-----------|
| Small operation (10 sows, 1 user) | $9.99/mo | $10/mo |
| Growing operation (50 sows, 2 users) | $19.99/mo | $10/mo |
| Family operation (unlimited, 3 users) | $39.99/mo | $10/mo |
| Commercial (unlimited sows + users) | $49.99/mo | $10/mo |

**Charlotte savings for a typical show pig family: $360/year**

---

## Core Herd Management

| Feature | GesDate | Charlotte | How |
|---------|:-------:|:---------:|-----|
| Sow tracking | ✅ | ✅ | `Node` with category `SOW` |
| Breeding records | ✅ | ✅ | `Signal` with metric `breeding_event` |
| Service sire selection | ✅ | ✅ | `EVENT_DATA.sire_name` on breeding signal |
| Farrowing details | ✅ | ✅ | `Signal` with metric `farrowing_event` |
| Litter statistics | ✅ | ✅ | `LITTER` node + child signals |
| Pig sex tracking (boars/gilts) | ✅ | ✅ | Signals: `boar_count`, `gilt_count` |
| Date of birth | ✅ | ✅ | `Node.lifeStart` field |
| Heat date tracking | ✅ | ✅ | `Signal` with metric `heat_detected` |
| Last farrowed date | ✅ | ✅ | Query: latest `farrowing_event` for node |
| Stress status | ✅ | ✅ | `EVENT_DATA.sire_stress` on breeding |
| Sales tracking | ✅ | ✅ | `Signal` with metric `sale_event` |

**Score: 11/11** - Full parity

---

## Planning & Scheduling

| Feature | GesDate | Charlotte | How |
|---------|:-------:|:---------:|-----|
| Breeding calculator | ✅ | ✅ | Gestation = breeding date + 114 days |
| Gestation predictions | ✅ | ✅ | `due_date` signal auto-calculated |
| Farm summary dashboard | ✅ | ✅ | `UpcomingMode` aggregates all nodes |
| "Sows to Confirm" list | ✅ | ✅ | Query: breeding signal, no confirm signal |
| Confirmation date tracking | ✅ | ✅ | Protocol: breeding + 21 days |
| Task management | ✅ | ✅ | Protocol `ACTIVATION_GRAPH` |
| Event notifications | ✅ | ✅ | Firebase push notifications |
| Heat cycle tracking | ✅ | ✅ | 21-day protocol definition |
| Vaccination schedules | ✅ | ✅ | Protocol with injection signals |

**Score: 9/9** - Full parity

---

## Data Organization

| Feature | GesDate | Charlotte | How |
|---------|:-------:|:---------:|-----|
| Multi-farm management | ✅ | ✅ | Multiple `OPERATION` root nodes |
| Switch farms without logout | ✅ | ✅ | Query user's `OWNS` edges |
| Customer/contact management | ✅ | ✅ | `Node` with category `CUSTOMER` |
| Search past litters | ✅ | ✅ | Query `LITTER` nodes via edges |
| Search service sires | ✅ | ✅ | Query `EVENT_DATA.sire_name` |
| Search bred/farrowed sows | ✅ | ✅ | Query by signal metric type |

**Score: 6/6** - Full parity

---

## Sync & Storage

| Feature | GesDate | Charlotte | How |
|---------|:-------:|:---------:|-----|
| Cloud backup | ✅ | ✅ | Firestore automatic sync |
| Multi-device sync | ✅ | ✅ | Firestore real-time |
| Team sharing (FarmSync) | ✅ | ✅ | `AccessGrant` edges with permissions |
| Offline mode | ✅ | ✅ | Firestore offline persistence |
| QR code farrowing cards | ✅ | ✅ | QR encodes node ID for quick entry |
| Photo storage | ✅ | ✅ | `Signal.attachments` → Firebase Storage |

**Score: 6/6** - Full parity

---

## Features Charlotte Has That GesDate Doesn't

| Feature | Description |
|---------|-------------|
| **Protocol Engine** | Data-driven `ACTIVATION_GRAPH` defines expected signals per day of protocol |
| **Matrix Synchronization** | Built-in 14-day Matrix feeding protocol with resolution paths |
| **PG600 Protocols** | Injection timing + heat detection window as structured protocol |
| **Matrix + PG600 Combo** | 25-day combined protocol for difficult breeders |
| **Append-Only History** | Signals never deleted - corrections supersede, full audit trail |
| **Breeding Groups** | `BREEDING_GROUP` as first-class node for batch protocol application |
| **Lineage Graph** | `PARENT_OF` edges enable full pedigree traversal |
| **Voice Input** | Speak observations, AI converts to structured signals |
| **AI Assistant** | Natural language queries ("which sows are due this week?") |
| **Data Export** | Full JSON export of nodes, edges, signals - your data, always |
| **Custom Metrics** | Add any metric to any node category without code changes |
| **Unlimited Users** | No per-seat pricing - whole family included |
| **Domain Agnostic** | Same core works for cattle, equipment, industrial - not locked to swine |

---

## Architecture Comparison

| Aspect | GesDate | Charlotte |
|--------|---------|-----------|
| **Data Model** | Relational tables | Graph (nodes, edges, signals) |
| **Relationships** | Foreign keys | First-class edges with metadata |
| **History** | Mutable records | Append-only, supersession tracking |
| **Corrections** | Overwrite | Supersede (original preserved) |
| **Protocols** | Hard-coded date math | Data-driven activation graphs |
| **Extensibility** | Fixed schema | Seed-driven categories/metrics |
| **Multi-Industry** | Swine only | Domain-agnostic core |

---

## The Protocol Engine Advantage

GesDate tracks dates. Charlotte tracks **protocols**.

### Example: Matrix + PG600 Synchronization

```
Day 0-13:  Matrix feeding (daily oral supplement signal expected)
Day 14:    Stop Matrix
Day 15:    PG600 injection
Day 16-17: Observe appetite
Day 18-25: Heat detection window (discharge + appetite signals)
```

This is defined as data, not code:

```json
{
  "::CADENCE_ID": "CADENCE:MATRIX_PG600_SYNCHRONIZED_HEAT",
  "::DURATION_DAYS": 25,
  "::ACTIVATION_GRAPH": {
    "0": { "::PROVISIONAL:ORAL_SUPPLEMENT": 1 },
    "15": { "::PROVISIONAL:INJECTION": 1 },
    "18": { "::MEDICAL:DISCHARGE_SCORE": 1, "::MEDICAL:APPETITE_SCORE": 1 }
  },
  "::RESOLUTION_PATHS": {
    "::SUCCESS": ["ESTRUS_DETECTED", "BREED_DURING_SYNCHRONIZED_WINDOW"],
    "::FAILURE": ["VETERINARY_REVIEW"]
  }
}
```

**GesDate can't do this.** They tell you a date is coming. Charlotte tells you what to observe, what signals to record, and what the outcomes mean.

---

## Breeding Groups: A Charlotte Exclusive

GesDate tracks individual sows. Charlotte tracks **cohorts**.

When you breed 15 sows in a week:
- **GesDate**: 15 separate date calculations, no grouping
- **Charlotte**: One `BREEDING_GROUP` node with `MEMBER_OF` edges

Apply a protocol to the group, not 15 times to individuals:

```
BREEDING_GROUP "January 2025 Batch"
    ├── MEMBER_OF ← SOW "Lady 42"
    ├── MEMBER_OF ← SOW "Lady 55"
    ├── MEMBER_OF ← SOW "Lady 61"
    └── Protocol: MATRIX_PG600_SYNCHRONIZED_HEAT (Day 12 of 25)
```

---

## Data Freedom

| Scenario | GesDate | Charlotte |
|----------|---------|-----------|
| Export all my data | ❌ No API | ✅ Full JSON export |
| Switch to competitor | ❌ Start over | ✅ Take your graph |
| Build custom reports | ❌ Use their UI | ✅ Query Firestore directly |
| Integrate with other tools | ❌ Closed system | ✅ Open data model |

---

## Summary

| Category | GesDate | Charlotte |
|----------|:-------:|:---------:|
| Core herd management | 11 features | 11 features |
| Planning & scheduling | 9 features | 9 features |
| Data organization | 6 features | 6 features |
| Sync & storage | 6 features | 6 features |
| **Total parity features** | **32** | **32** |
| **Additional features** | 0 | **13** |
| **Price (family operation)** | $40/mo | $10/mo |

**Charlotte delivers 100% GesDate feature parity plus 13 exclusive features at 75% lower cost.**

---

## Sources

- [GesDate Official Site](https://gesdate.com/)
- [GesDate iOS App Store](https://apps.apple.com/us/app/gesdate-swine/id859783362)
- [GesDate Google Play](https://play.google.com/store/apps/details?id=com.gesdate.swine)
