# Corrupt Data Analysis

> Data from failed implementations that clients gave us. Shows what real users want to track.

**Location:** `docs/artifacts/DATA_NODE_IMPORT_OPERATION_*.json`

**Purpose:** These files represent real-world data exports from previous implementations that failed. They show the scope of what individual users want to track but should NOT impose changes to the architecture. All this data should be expressible through the FACT substrate.

---

## Files Overview

| File | Records | Source | Tracks |
|------|---------|--------|--------|
| `tsp_sows.jsonl` | ~150 | Trogdon Show Pigs | Sow inventory & status |
| `TROGDON_SHOWPIGS.jsonl` | ~500 | Trogdon Show Pigs | Pedigree/registration |
| `cycles.json` | ~700 | Legacy app | Breeding cycles |
| `lots.json` | ~1000 | Auction scrape | Sale lots |

---

## 1. Animal Inventory (`tsp_sows.jsonl`)

What a showpig operation tracks for each sow:

```json
{
  "name": "ABLES",
  "stress": "NEGATIVE",
  "breed": "CROSS",
  "ear": "20-3",
  "status": "CULLED",
  "dob": "2021-07-24",
  "location": "North Lot",
  "rno": "375851001",
  "notes": null,
  "isArchived": false,
  "deletedDate": null
}
```

### Fields Observed

| Field | Description | Charlotte Mapping |
|-------|-------------|-------------------|
| `name` | Animal name | SIGNAL → METRIC:name |
| `breed` | Breed type | SIGNAL → METRIC:breed (DUROC, CROSS, BERKSHIRE, etc.) |
| `stress` | PSS gene status | SIGNAL → METRIC:stress_status (NEGATIVE, CARRIER, UNTESTED) |
| `ear` | Ear notch ID | SIGNAL → METRIC:ear_notch |
| `rno` | Registration number | SIGNAL → METRIC:registration_number |
| `status` | Current status | SIGNAL → METRIC:status |
| `dob` | Date of birth | EDGE (BORN_ON) → DATE node |
| `location` | Current facility | EDGE (HOUSED_IN) → FACILITY node |

### Status Values (Real World)

Formal statuses:
- `CULLED` - Removed from herd
- `RETIRED` - No longer breeding
- `DECEASED` - Dead
- `SOLD` - Transferred ownership
- `INJURY` - Health issue

Informal statuses (user-defined):
- `"not good enough"` - Quality decision
- `"doesnt make cut"` - Selection decision
- `"got to big"` - Size issue
- `"crippled"` - Mobility issue
- `"CANNIBAL"` - Behavioral issue (ate piglets)

**Insight:** Users need free-text status values. The METRIC for status should allow STRING type with optional enum suggestions, not a fixed enum.

---

## 2. Pedigree Data (`TROGDON_SHOWPIGS.jsonl`)

Full registration records from National Swine Registry:

```json
{
  "REGISTRATION_GROUP": "NATIONAL_SWINE_REGISTRY",
  "REGISTRATION_NUMBER": "192292002",
  "BREEDER_MARK": "TSP5",
  "EAR_NOTCH": "24-2",
  "SWINE_BREED": "BERKSHIRE",
  "SHORT_NAME": "ABBY",
  "SIRE_REGISTRATION_NUMBER": "188967003",
  "SIRE_BREEDER_MARK": "WTX3",
  "SIRE_EAR_NOTCH": "230-3",
  "SIRE_SHORT_NAME": "WTX_230",
  "DAM_REGISTRATION_NUMBER": "166242001",
  "DAM_BREEDER_MARK": "MWCW0",
  "DAM_EAR_NOTCH": "17-1",
  "DATE_OF_REGISTRATION": "1-1-2025",
  "PEDIGREE_CATEGORY": "GILT",
  "DATE_OF_BIRTH": "1-1-2025"
}
```

### Charlotte Mapping

```
NODE (GILT:ABBY:24-2)
  │
  ├── SIGNAL → METRIC:registration_number = "192292002"
  ├── SIGNAL → METRIC:breed = "BERKSHIRE"
  ├── SIGNAL → METRIC:breeder_mark = "TSP5"
  │
  ├── EDGE (SIRED_BY) → NODE (BOAR:WTX_230:230-3)
  │     └── SIGNAL → METRIC:registration_number = "188967003"
  │
  └── EDGE (DAM_OF) ← NODE (SOW:??:17-1)
        └── SIGNAL → METRIC:registration_number = "166242001"
```

**Insight:** Pedigree is EDGES. Sire and dam are relationships, not embedded fields. This enables querying "all offspring of WTX_230" by traversing edges.

---

## 3. Breeding Cycles (`cycles.json`)

Complete gestation records:

```json
{
  "id": "8DFE36F1-58A1-42D0-91B8-D561DDF47E20",
  "sowName": "Lulu",
  "sowID": "AA5D17BF-1EB2-46DB-A816-3B573D56F7E0",
  "serviceSireName": "IT'S ALL GOOD",
  "serviceSireStressStatus": "CARRIER",
  "dateBred": "2014-07-26T15:44:39.000Z",
  "dueDate": "2014-11-17T06:00:00.000Z",
  "dateFarrowed": "2014-11-20T00:22:03.275Z",
  "dateWeaned": "2014-12-30T06:00:00.000Z",
  "hasFarrowed": true,
  "litterNumber": 1,
  "parityNumber": 4,
  "crateNumber": 2,
  "aliveCount": 4,
  "stillbornCount": 2,
  "mummyCount": 3,
  "maleCount": 2,
  "femaleCount": 2,
  "weanedCount": 0
}
```

### Charlotte Mapping

This is a **PROTOCOL instance** with SIGNALs at each checkpoint:

```
PROTOCOL (GESTATION:lulu_2014_07)
  │
  ├── P0: "SOW:lulu"
  ├── P1: { type: "GESTATION", duration: 114 }
  │
  ├── EDGE (APPLIES_TO) → NODE (SOW:lulu)
  ├── EDGE (SIRED_BY) → NODE (BOAR:its_all_good)
  │
  └── SIGNALs generated:
      │
      ├── SIGNAL (dateBred)
      │   └── :CREATED = DATE:7-26-2014
      │   └── P1 = METRIC:bred_status
      │   └── P2 = true
      │
      ├── SIGNAL (dateFarrowed)
      │   └── :CREATED = DATE:11-20-2014
      │   └── P1 = METRIC:born_alive, P2 = 4
      │   └── P1 = METRIC:stillborn, P2 = 2
      │   └── P1 = METRIC:mummies, P2 = 3
      │   └── P1 = METRIC:male_count, P2 = 2
      │   └── P1 = METRIC:female_count, P2 = 2
      │
      └── SIGNAL (dateWeaned)
          └── :CREATED = DATE:12-30-2014
          └── P1 = METRIC:weaned_count, P2 = 0
```

**Insight:** A breeding cycle IS a protocol. The dates are EDGEs to DATE nodes. The counts are SIGNALs recorded at those dates.

---

## 4. Auction Lots (`lots.json`)

Sale/auction tracking with hierarchical IDs:

```json
{
  "::OPERATION": "2172753521",
  "::AUCTION": "SCONLINE",
  "::OPCODE": "45246",
  "::LOT": "1",
  "::EAR_NOTCH": "1-1",
  "::PRICE": 1500,
  "::BIDS": 29,
  ":ID": "::OPERATION:2172753521::AUCTION:SCONLINE::OPCODE:45246::LOT:1",
  ":TYPE": "LOT",
  ":TOKENS": [
    "::SIRE:PERSPECTIVE",
    "::DAM:WIDE_AWAKE",
    "::SEX:GILT",
    "::BREED:DARK_CROSSBRED"
  ]
}
```

### Charlotte Mapping

```
NODE (SALE:SCONLINE:45246)
  │
  ├── EDGE (OCCURRED_ON) → DATE node
  │
  └── NODE (LOT:1)
      │
      ├── SIGNAL → METRIC:price = 1500
      ├── SIGNAL → METRIC:bids = 29
      │
      ├── EDGE (SIRED_BY) → NODE (BOAR:PERSPECTIVE)
      ├── EDGE (DAM_OF) ← NODE (SOW:WIDE_AWAKE)
      │
      └── EDGE (SOLD_TO) → NODE (BUYER:???)
```

**Insight:** Sales are events (NODEs) with lots as sub-nodes. Price and bids are SIGNALs. Buyer/seller are EDGEs.

---

## Summary: User Needs → FACT Mapping

| What Users Track | Charlotte Primitive |
|------------------|---------------------|
| Animal identity | NODE + SIGNAL (name) |
| Breed, genetics | SIGNAL → METRIC |
| Status changes | SIGNAL → METRIC:status (over time) |
| Locations | EDGE (HOUSED_IN) → FACILITY NODE |
| Pedigree (sire/dam) | EDGE (SIRED_BY, DAM_OF) |
| Breeding cycles | PROTOCOL + SIGNALs at dates |
| Farrowing stats | SIGNALs on farrowing DATE |
| Sales | NODE (SALE) + EDGE (SOLD_TO) |
| Prices | SIGNAL → METRIC:price |

---

## Design Implications

### 1. Status Should Be Flexible
Users write informal statuses ("not good enough", "got too big"). METRIC:status should be STRING type with suggested values, not a fixed enum.

### 2. Pedigree Is Graph
Sire and dam are relationships (EDGEs), not embedded fields. This enables lineage queries.

### 3. Cycles Are Protocols
A breeding cycle IS a protocol instance with signals at temporal checkpoints. Don't create a separate "cycle" entity.

### 4. Everything Has History
Status changes over time (RETIRED → SOLD). Weight changes over time. Location changes over time. All attributes are SIGNALs, not fields.

### 5. User-Defined Metrics
Users track operation-specific things:
- `crateNumber` - facility detail
- `mummyCount` - farrowing metric
- `serviceSireStressStatus` - genetic metric

The METRIC primitive must allow users to define new metrics on the fly.

---

## What This Data Validates

The corrupt data confirms that Charlotte's architecture is correct:

1. **Single collection** ✓ - All this data fits in FACTs
2. **Attributes as signals** ✓ - Status, breed, weight all change over time
3. **Relationships as edges** ✓ - Pedigree is graph traversal
4. **Time as graph** ✓ - All dates are EDGEs to DATE nodes
5. **Protocols as forecasts** ✓ - Breeding cycles have expected checkpoints

**The architecture doesn't need to change. The data fits.**

---

*This document analyzes failed implementations to validate architectural decisions.*
*Maintained by CHARLOTTE. Last updated: 2026-02-05*
