# Charlotte — The Engine Under the Hood

## What Is Charlotte?

Charlotte is a **graph-native knowledge graph system** designed to be the substrate for observable reality across any domain. It was built by Jack Richard (Northwestern MSAI 2019) and represents the technological core of the entire Richard Enterprises ecosystem.

Charlotte is not a dashboard. It is not a workflow engine. It is **infrastructure for observable reality** — the same way PostgreSQL is infrastructure for relational data or Kubernetes is infrastructure for containers.

## Core Primitives

| Primitive | What It Is | Example |
|---|---|---|
| **Node** | An identity with a lifecycle | A sow, a compressor, a Pride member, a venue |
| **Signal** | A time-indexed observation on a measurable dimension | "Sow #447 weighed 310 lbs on Feb 3" |
| **Edge** | A relationship between nodes | OWNS, MEMBER_OF, PARENT_OF, GRANTS_ACCESS |
| **Metric** | What to track on a node | Weight, temperature, gestation day, revenue |
| **Protocol** | Expected behavior over time | "Heat check every 21 days", "Quarterly revenue review" |

## Foundational Principles

1. **Time is the primary axis of truth** — every observation is timestamped, nothing exists outside time
2. **History is append-only** — signals are never edited, only superseded
3. **No stored hierarchy** — structure emerges from edges and signals, not from rigid schemas
4. **Domain-agnostic** — the same primitives describe pigs, machines, people, or venues
5. **Protocols drive behavior** — expected patterns create the schedule; deviations create alerts

## The Colon Grammar

Charlotte uses a structured notation:
- `:` — Framework fields (identity, type, status)
- `::` — Attributes (measurable dimensions)
- `:::` — Relationships (edges between nodes)

## How Charlotte Powers Each Serengeti Division

### Farms — Portfolio App Substrate
Every app built by Serengeti Farms can run on Charlotte as its data layer. Instead of building bespoke backends for each app, the Charlotte substrate provides:
- **Nodes** for every entity in the app's domain
- **Signals** for every user action, sensor reading, or state change
- **Protocols** for expected behaviors and automated alerts
- **Edges** for relationships and permissions

This means: **shared infrastructure, faster builds, lower cost, consistent data model across the portfolio.**

| Portfolio App | Charlotte Mapping |
|---|---|
| **Sounder** (show pigs) | Nodes = sows, boars, litters. Signals = weight, heat detection, breeding events. Protocols = Matrix, PG600 gestation schedules. |
| **Nightlife** (bar passes) | Nodes = venues, patrons, events. Signals = check-ins, capacity readings, transactions. Protocols = capacity limits, age verification, VIP thresholds. |
| **ServiceIQ** (industrial) | Nodes = compressors, technicians, sites. Signals = maintenance events, part orders, performance readings. Protocols = preventive maintenance schedules. |

### Prides — Member Development Tracking
- **Nodes** = Pride members, mentors, cohorts
- **Signals** = assessment scores (MBTI, EQ, 360 feedback), session attendance, Hot Seat participation
- **Protocols** = Bi-weekly meeting cadence, quarterly assessment cycle, annual Summit attendance
- **Edges** = MEMBER_OF (cohort), MENTORED_BY (Founder), CONTRIBUTED_TO (Farms idea)

### Summit — Event Intelligence
- **Nodes** = attendees, speakers, sessions, venues
- **Signals** = registrations, feedback scores, connection requests, NPS responses
- **Protocols** = Pre-event comms schedule, post-event survey cadence
- **Edges** = ATTENDED (session), CONNECTED_WITH (attendee), SPOKE_AT (session)

### Oasis — Property Portfolio Management
- **Nodes** = properties, investors, bookings, service providers
- **Signals** = occupancy events, maintenance requests, appraisal values, guest reviews
- **Protocols** = Annual appraisal cycle, quarterly financial reporting, booking window rules
- **Edges** = OWNS_SHARE (investor → property), BOOKED_BY (investor → property), MANAGED_BY (property → manager)

### Founders — Governance & Deal Flow
- **Nodes** = Founders, candidates, deal opportunities, votes
- **Signals** = capital contributions, meeting attendance, vote records, mentorship hours
- **Protocols** = Annual meeting, monthly capital call schedule, quarterly reporting
- **Edges** = INVESTED_IN (Founder → Farms tranche), MENTORS (Founder → Pride member), VOTED_ON (Founder → deal)

## Current Charlotte Status

| Metric | Value |
|---|---|
| Models | 14 |
| Repositories | 6 |
| Services | 6 |
| Screens | 10 (85% complete) |
| Cloud Functions | 20 |
| Firebase Rules | 3 |
| First vertical | Swine (Sounder) |
| Test deployment | Trogdon Showpigs |
| Test data | 1,174 nodes, 10,045 signals, 1,919 edges |

## Charlotte vs. Alternatives

| | Charlotte | Neo4j | Amazon Neptune | Power BI |
|---|---|---|---|---|
| Time-native | Yes (core primitive) | No (bolted on) | No | No |
| Append-only signals | Yes | No | No | No |
| Protocol engine | Yes | No | No | No |
| Domain-agnostic | Yes | Yes | Yes | No |
| Mobile-first | Yes (Flutter) | No | No | No |
| Built for operators | Yes | Built for devs | Built for devs | Built for analysts |

## Why This Matters

Charlotte is the **unfair advantage** of Serengeti Farms. While other incubators build each app from scratch, Serengeti Farms builds on a shared substrate that:
- Reduces development time by 40–60% (shared data model, shared auth, shared protocols)
- Enables cross-portfolio intelligence (signals from one app inform patterns in another)
- Creates defensible IP (the substrate itself is proprietary)
- Scales horizontally (add a new vertical by defining new node types and protocols, not new infrastructure)

Every dollar invested in Charlotte benefits every portfolio company simultaneously. This is the compounding advantage that drives toward **Singularity**.

## Technical References

- `charlotte/` — Flutter app + Firebase backend (main codebase)
- `charlotte/docs/artifacts/` — 11-paper research suite
- `charlotte/docs/SUBSTRATE.md` — Technical deep-dive
- `charlotte/LAUNCH.md` — Swine vertical business plan
- `jack-at-someai.github.io/` — 37 research instruments calibrating the substrate
