# Top Tier Moving — Competitive Analysis
## Interstate Moving & Relocation Logistics

**Prepared:** February 2026
**Subject:** Top Tier Moving LLC
**Purpose:** SomeAI partnership assessment — competitive landscape, market positioning, and revenue estimation

---

## Company Position

Top Tier Moving LLC operates as a nationwide interstate moving company with a distributed crew network spanning **52 states and territories** and **3,675 cities**. Since launching in November 2021, the company has completed **10,606 jobs**, billed **$14.4M**, and moved **24.2 million pounds** of freight across the country.

The operating model is **crew-based dispatch** — 98 crew members operate independently on assigned routes, handling pickup, transit, and delivery. The company functions as both carrier and coordinator, managing the full lifecycle from booking through settlement. Revenue concentration is healthy: the top 5 MVPs account for ~$6M of the $14.4M total, while 18 Starters and 63 Rookies form a long tail.

The key operational challenge is **collection rate** — currently 75.7% overall ($10.9M collected on $14.4M billed). Top performers like Brandon Brandon (95.1%) and Tony Anthony (89.8%) demonstrate that near-complete collection is achievable, while others like Courtney B (49.1%) and Leroy Smith (23.5%) represent significant revenue leakage.

---

## Revenue Analysis

### Actual Revenue (From Data)

| Year | Jobs | Billed | Collected | Collection Rate |
|------|------|--------|-----------|-----------------|
| 2021 | 2,991 | $1.35M | $166K | 12.3% (ramp-up) |
| 2022 | 1,523 | $3.71M | $2.31M | 62.2% |
| 2023 | 1,803 | $4.35M | $3.45M | 79.1% |
| 2024 | 2,121 | $3.61M | $3.41M | 94.3% |
| 2025 | 2,168 | $1.41M | $1.60M | 113.8% (collections from prior) |

**Trajectory:** 2023 was peak billing ($4.35M). Collection rates have improved dramatically from 12.3% (startup year) to 94.3% (2024). The company is maturing operationally — fewer billing-collection gaps, better crew accountability.

### Projected Annual Run Rate

| Scenario | Annual Revenue | Basis |
|----------|---------------|-------|
| Conservative | $3.5M | 2024 actual collected |
| Base Case | $5.0M | 2023-level billing at 2024 collection rate |
| Growth | $7.5M | 2,500+ jobs at $3,000 avg with 90%+ collection |

---

## Direct Competitors

### Tier 1: National Van Lines

| Company | Est. | Scale | Revenue | vs Top Tier |
|---------|------|-------|---------|-------------|
| **United Van Lines** | 1928 | 400+ agents, #1 market share | $1B+ | Infrastructure incumbent; TTM more agile |
| **Atlas Van Lines** | 1948 | 400+ agents nationwide | $500M+ | Legacy network; TTM lower overhead |
| **Allied Van Lines** | 1928 | Part of SIRVA group | $400M+ | Corporate relocation focus |
| **Mayflower** | 1927 | Part of UniGroup (with United) | $400M+ | Brand recognition; TTM price-competitive |
| **North American Van Lines** | 1933 | Part of SIRVA group | $300M+ | Military/government focus |

### Tier 2: Tech-Enabled & On-Demand

| Company | Founded | Funding | Model | vs Top Tier |
|---------|---------|---------|-------|-------------|
| **Bellhops** | 2011 | $140M+ | Tech-enabled local moving, 27 markets | Local only; TTM does interstate |
| **PODS** | 1998 | Public (PODS/WillScot) | Container moving & storage | Different model; TTM full-service |
| **Dolly** | 2013 | $20M+ | On-demand gig-economy delivery | Last-mile only; TTM long-haul |
| **HireAHelper** | 2007 | Bootstrapped | Marketplace for local labor | Labor only; TTM end-to-end |
| **Moved** | 2020 | $2M seed | AI-powered moving coordination | Emerging; similar tech thesis |

### Tier 3: Broker Platforms

| Company | Role | vs Top Tier |
|---------|------|-------------|
| **Moving.com** | Lead generation for van lines | Broker; TTM is the carrier |
| **iMoving** | Price comparison marketplace | Aggregator; TTM is an operator |
| **Updater** | Relocation management platform | Enterprise focus; different layer |

---

## Industry Structure

### How Interstate Moving Works

1. **Customer books a move** — typically 4-8 weeks ahead, gets binding or non-binding estimate
2. **Broker or carrier assigns crew** — dispatches based on origin, destination, timing
3. **Crew picks up** — inventories items, weighs load, packs if contracted
4. **Transit** — driver handles long-haul, typically 3-14 days depending on distance
5. **Delivery** — unload at destination, customer signs off
6. **Settlement** — customer pays balance, carrier settles with crew, handles claims

### Regulation

- **DOT/FMCSA** — all interstate movers must register with the Department of Transportation
- **Binding estimates** — legally binding price quotes (protect customers from overcharges)
- **Non-binding estimates** — can increase up to 10% at delivery
- **Tariff-based pricing** — rates filed with FMCSA, weight-based for interstate
- **Claims** — 9-month filing window, carrier must acknowledge within 30 days

### Key Industry Metrics

| Metric | Value |
|--------|-------|
| US moving industry revenue | $20B+ annually |
| Americans who move per year | ~28 million (8.4% of population) |
| Average local move cost | $1,500 - $3,500 |
| Average interstate move cost | $4,000 - $12,000 |
| Industry gross margin | 30-45% |
| Average claim rate | 15-25% of moves result in claims |
| Peak season | May - September (70% of annual volume) |

---

## Technology Gaps (SomeAI Opportunity)

### What Doesn't Exist in Moving

- **Crew performance analytics** — no system tracks individual crew member revenue, collection rates, route efficiency, and tier progression over time
- **Collection intelligence** — no predictive model for which jobs will have payment issues based on crew, route, estimate type, and customer profile
- **Route optimization** — most dispatch is manual (phone calls, spreadsheets). No system optimizes crew assignment based on current location, availability, and historical route performance
- **Real-time job lifecycle tracking** — booking through delivery through settlement as a unified signal stream, not siloed spreadsheets
- **Cross-crew benchmarking** — no way to compare crew performance on equivalent routes and job types
- **Seasonal demand forecasting** — predictive staffing based on historical booking patterns by region and month
- **Customer experience scoring** — no unified NPS/satisfaction tracking linked to crew and route performance

### What Top Tier Has That Others Don't

Top Tier's data — 10,606 jobs across 98 crew members over 3.5 years — is a Charlotte substrate waiting to be activated. The baseball card visualization already demonstrates crew-level analytics. Charlotte takes this further:

- **Every crew member is a NODE** with performance metrics, state coverage, and revenue trajectory
- **Every job is a SIGNAL** emitted by the crew node, carrying weight, volume, billing, and collection data
- **Every route is an EDGE** between city nodes, with frequency, revenue density, and seasonal patterns
- **Collection targets are PROTOCOLs** — expected 90%+ collection rate, with drift alerts when crew members fall below threshold

---

## SomeAI Thesis for Top Tier Moving

**"Top Tier Moving has 10,606 jobs of operational data and zero analytics infrastructure. The baseball cards prove Charlotte can model crew performance. The next step is making that intelligence operational."**

The moving industry runs on phone calls, spreadsheets, and intuition. Every major van line has more trucks and agents than Top Tier — but none have crew-level performance intelligence at this granularity. Charlotte gives Top Tier what United Van Lines can't build:

- **Crew tier system** — automated classification (MVP/All-Star/Starter/Rookie) with promotion/demotion signals
- **Collection forecasting** — predict payment risk at booking time based on crew, route, and estimate type
- **Route intelligence** — which origin-destination pairs generate the most revenue per pound moved
- **Dispatch optimization** — assign the right crew to the right job based on historical performance
- **Drift alerts** — notification when a crew member's collection rate drops below threshold, or when seasonal demand diverges from forecast

The strategic angle: Charlotte transforms Top Tier from a moving company that tracks jobs in spreadsheets into a moving company that operates on real-time intelligence. The 98-crew, 52-state dataset is the training ground.
