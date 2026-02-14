# SomeAI — Client Onboarding Playbook

**Purpose:** This document defines the fastest execution line for spinning up a complete client package from zero. Every new client gets the same treatment. Claude follows this playbook to generate all deliverables in parallel waves.

**Output:** 10 deliverables assembled into a client directory at `business/{client-slug}/` with a brand book at `design/brandbook/{client-slug}/`.

---

## Inputs Required

Before execution, gather these from the user (or from initial interaction notes):

| Input | Example | Required |
|-------|---------|----------|
| Company name | All State Manufacturing Co. | Yes |
| Slug (directory name) | allstate-manufacturing | Yes |
| Location (city, state) | Terre Haute, IN | Yes |
| Industry / domain | Metal fixtures for micro markets | Yes |
| Approximate revenue | ~$2.2M | Yes |
| Employee count | ~6 | Yes |
| Key people (name, role) | Rudy Stakeman (CEO), Madison Muncie (COO) | Yes |
| Known products/services | Shelving, cooler racks, kiosk fixtures | Yes |
| Known clients/partners | NAMA members, vending operators | If available |
| Pain points observed | No data strategy, manual processes | If available |
| Interaction notes | Met at trade show, toured facility | If available |
| Brand preferences | Colors, existing logo, tone | If available |

---

## Execution Waves

### Wave 1 — Research & Analysis (parallel, no dependencies)

All four documents can be generated simultaneously from the inputs above.

#### 1A. Business Analysis (`BUSINESS_ANALYSIS.md`)

The foundation document. Everything else references this.

```
# {Company Name} — Business Analysis
## Company Profile
- Legal name, founded, location, ownership history
- Revenue, employee count, facility details
- Organizational chart (key people → roles → responsibilities)

## Business Model
- What they sell, to whom, through what channels
- Revenue streams breakdown (products, services, recurring vs one-time)
- Supply chain position (where they sit in their industry's value chain)

## Current Operations
- Tools/software in use (ERP, CRM, spreadsheets, paper)
- Data maturity assessment (0-5 scale)
  - 0: No digital records
  - 1: Spreadsheets/paper
  - 2: Siloed software tools
  - 3: Integrated systems, no analytics
  - 4: Analytics but no predictive capability
  - 5: Real-time observable operations
- Key workflows (order → production → delivery → invoice)
- Bottlenecks and blind spots identified from interactions

## Industry Position
- Market segment and niche
- Competitive advantages (what they do that others don't)
- Vulnerabilities (what competitors could exploit)

## Charlotte Opportunity
- What becomes observable (specific NODEs, EDGEs, METRICs, SIGNALs)
- Transformation thesis (one sentence: "Charlotte makes X observable at the layer where Y is blind")
- Estimated complexity (number of node types, edge types, signal sources)
```

#### 1B. Competitive Analysis (`COMPETITIVE_ANALYSIS.md`)

Market positioning and competitor mapping.

```
# {Company Name} — Competitive Analysis
**Date:** {date}  **Subject:** Market Position & Competitive Landscape

## Company Position
- One paragraph: who they are, what they do, where they sit

## Direct Competitors (Tier 1)
| Company | Founded | Revenue Est. | Products | Differentiator |
|---------|---------|-------------|----------|---------------|
| ... | ... | ... | ... | ... |

## Indirect Competitors (Tier 2)
| Company | Overlap Area | Threat Level |
|---------|-------------|-------------|
| ... | ... | Low/Med/High |

## Supply Chain Map
- Upstream suppliers
- Downstream customers
- Adjacent players

## Market Size & Growth
- TAM / SAM / SOM with sources
- Growth rate (CAGR) and trajectory
- Industry trends relevant to Charlotte deployment

## Competitive Positioning
- Where {company} wins today
- Where {company} is vulnerable
- Where Charlotte creates defensible advantage
```

#### 1C. Cost Analysis (`COST_ANALYSIS.md`)

What they can afford vs what Charlotte costs to deploy.

```
# {Company Name} — Cost Analysis & Tier Recommendation

## Client Financial Profile
- Annual revenue: $X
- Estimated operating margin: X%
- Technology budget (estimated or stated): $X/yr
- Decision-maker appetite for technology investment

## SomeAI Service Tiers

### Foundation — $2,500/mo ($30K/yr)
- Charlotte substrate setup (KRF knowledge graph)
- Monthly ingestion meetings (manual observation capture)
- Quarterly before/after reports
- Basic dashboard (index.html visualization)
- **Best for:** <$5M revenue, proof-of-concept phase

### Operations — $5,000/mo ($60K/yr)
- Everything in Foundation
- Real-time signal capture (IoT sensors, API integrations)
- Automated metric tracking
- Protocol engine (workflow monitoring)
- Monthly strategy reviews
- **Best for:** $5M-$25M revenue, operational intelligence

### Charlotte OS — $10,000/mo ($120K/yr)
- Everything in Operations
- Full Charlotte OS deployment
- Custom visualization dashboards
- Predictive modeling (METRIC trend analysis)
- Dedicated SomeAI engineer
- **Best for:** $25M+ revenue, full digital twin

### Enterprise — $25,000-$100,000/mo
- Custom scope, multi-facility, multi-domain
- PE-grade reporting and analytics
- **Best for:** PE-backed portfolios, multi-site operations

## Recommendation
- Recommended tier: {tier}
- Rationale: {why this tier matches their revenue and needs}
- Stretch tier: {next tier up, what would justify it}
- ROI thesis: {how Charlotte pays for itself — cost savings, revenue enablement, risk reduction}

## Contract Structure
- **Contract 1 — Deployment & Migration:** One-time setup, substrate creation, data ingestion
  - Estimated: $X (typically 2-3x monthly rate)
- **Contract 2 — Ongoing Service:** Monthly Charlotte operation, updates, support
  - Rate: $X/mo, 2-year minimum commitment
  - Annual escalator: 3-5%
```

#### 1D. Industry Research (web search)

Parallel web research to enrich all documents:
- Company website, LinkedIn, BBB profile
- Industry reports, market size data
- Competitor websites and offerings
- Any press coverage or public filings

---

### Wave 2 — Charlotte Substrate & Brand (depends on Wave 1)

#### 2A. KRF Substrate (`substrate.krf`)

The knowledge graph that makes their domain observable through Charlotte primitives.

```lisp
;;; {Company Name} — Charlotte Substrate
;;; Domain: {industry description}
;;; Generated: {date}

(in-microtheory {CompanySlug}Mt)

;;; ============================================================
;;; NODES — Company Identity
;;; ============================================================
(isa {CompanyNode} CommercialOrganization)
(companyName {CompanyNode} "{Legal Name}")
(founded {CompanyNode} {year})
(headquarters {CompanyNode} "{City, State}")
(annualRevenue {CompanyNode} {revenue})
(employeeCount {CompanyNode} {count})
(industrySegment {CompanyNode} "{segment}")

;;; NODES — People
(isa {PersonNode} Person)
(fullName {PersonNode} "{Name}")
(hasRole {PersonNode} {CompanyNode} "{Role}")

;;; NODES — Products / Services
(isa {ProductNode} Product)
(productName {ProductNode} "{name}")
(productCategory {ProductNode} "{category}")

;;; EDGES — Relationships
(clientOf {CompanyNode} {ClientNode})
(supplierOf {SupplierNode} {CompanyNode})
(competitorOf {CompanyNode} {CompetitorNode})

;;; METRICS — Observable Measurements
(hasMetric {CompanyNode} {MetricNode})
(metricName {MetricNode} "{name}")
(metricUnit {MetricNode} "{unit}")
(metricValue {MetricNode} {value})

;;; SIGNALS — Events & State Changes
(hasSignal {CompanyNode} {SignalNode})
(signalType {SignalNode} "{type}")
(signalTimestamp {SignalNode} "{ISO-8601}")

;;; PROTOCOLS — Expected Workflows
(hasProtocol {CompanyNode} {ProtocolNode})
(protocolName {ProtocolNode} "{name}")
(protocolSteps {ProtocolNode} {count})
```

**Sizing guide:**
- Small business (< 10 employees): 200-500 lines
- Medium business (10-100): 500-2000 lines
- Large / PE-backed: 2000-5000+ lines

#### 2B. Brand Book (`design/brandbook/{client-slug}/index.html`)

Single-file HTML brand identity. Follow existing pattern:
- Dark theme (MaestroColors.background equivalent)
- CSS custom properties for palette
- Sections: Header/Logo, Color Palette, Typography, Brand Essence, Solutions Grid, Team
- Google Fonts (Inter default, customize per brand)
- Responsive grid layout
- No external dependencies except Google Fonts

**Color derivation:** If client has existing brand colors, use those. Otherwise derive from industry:
- Industrial/manufacturing: steel blue, forge orange, iron gray
- Agriculture/livestock: earth green, warm brown, gold
- Technology/SaaS: electric blue, purple, clean white
- Moving/logistics: navy, safety orange, slate
- Finance/instruments: deep burgundy, gold, cream

---

### Wave 3 — Technical Documents (depends on Wave 1 & 2A)

#### 3A. PRD — Product Requirements Document (`PRD.md`)

What Charlotte deployment looks like for this specific client.

```
# {Company Name} — Charlotte Deployment PRD

## Overview
- Client: {name}
- Deployment tier: {tier}
- Timeline: {months}
- Objective: {one sentence}

## User Personas
| Persona | Role | Needs | Charlotte Touch Points |
|---------|------|-------|----------------------|
| {Name} | {Role} | {what they need to see/do} | {dashboards, alerts, reports} |

## Functional Requirements

### Phase 1 — Foundation (Months 1-3)
- [ ] Charlotte substrate created and validated (substrate.krf)
- [ ] Initial data ingestion from {sources}
- [ ] Dashboard deployed (index.html visualization)
- [ ] Monthly ingestion meeting cadence established

### Phase 2 — Operations (Months 4-6)
- [ ] Signal sources connected ({specific integrations})
- [ ] Metric tracking automated ({specific KPIs})
- [ ] Protocol engine configured ({specific workflows})
- [ ] First before/after Charlotte report delivered

### Phase 3 — Intelligence (Months 7-12)
- [ ] Predictive models trained on signal history
- [ ] Anomaly detection active
- [ ] Quarterly strategy reviews using Charlotte data
- [ ] ROI measurement against baseline

## Data Sources
| Source | Type | Frequency | Integration Method |
|--------|------|-----------|-------------------|
| {ERP/CRM/Excel/etc} | {structured/unstructured} | {real-time/daily/monthly} | {API/CSV/manual} |

## Success Metrics
- Baseline: {current state measurements}
- 6-month target: {specific improvements}
- 12-month target: {specific improvements}
- ROI threshold: {break-even point}

## Non-Functional Requirements
- Data residency: US
- Uptime SLA: 99.5%
- Access control: Role-based (admin, editor, viewer)
- Backup: Daily snapshots
```

#### 3B. Software Design Document (`SOFTWARE_DESIGN.md`)

Technical architecture for their Charlotte instance.

```
# {Company Name} — Software Design Document

## Architecture Overview
- Charlotte substrate: KRF knowledge graph ({N} nodes, {M} edges)
- Signal sources: {list}
- Visualization: Single-page dashboard (index.html)
- Backend: Charlotte OS (Python 3.12, async WebSocket)
- Storage: Firestore (facts collection per client)

## Domain Model
- Node types: {Company, Person, Product, Equipment, Location, ...}
- Edge types: {clientOf, supplierOf, produces, operates, ...}
- Metric types: {revenue, throughput, defect_rate, ...}
- Signal types: {order_placed, shipment_sent, maintenance_due, ...}
- Protocol types: {order_fulfillment, quality_check, onboarding, ...}

## Integration Points
| System | Direction | Protocol | Data Format |
|--------|-----------|----------|-------------|
| {their ERP} | Inbound | {REST/CSV/manual} | {JSON/CSV} |
| Charlotte Dashboard | Outbound | WebSocket | KRF facts |
| Firestore | Bidirectional | SDK | JSON documents |

## Deployment
- Phase 1: Manual ingestion (meetings + Claude-assisted KRF generation)
- Phase 2: Semi-automated (scheduled imports from client data exports)
- Phase 3: Real-time (API integrations, IoT sensors where applicable)

## Security
- Authentication: Firebase Auth (email + SSO if enterprise)
- Authorization: Organization-scoped, role-based access
- Data isolation: Separate Firestore subcollection per client org
- Encryption: At rest (Firestore default), in transit (TLS)
```

---

### Wave 4 — Sales Documents (depends on all previous waves)

#### 4A. Pitch Deck (`PITCH_DECK.md`)

Markdown-structured pitch that can be rendered as slides or converted to presentation.

```
# {Company Name} × Charlotte

---

## Slide 1: What We See
{One powerful observation from their data that they didn't know about themselves.
This is the intimidation slide. Show them Charlotte already understands their business.}

## Slide 2: Your World Today
{Current state — tools, processes, blind spots. Data maturity score.
Honest but not insulting. "Here's where you are."}

## Slide 3: What Becomes Observable
{Before/after comparison. Left side: what they see today. Right side: what Charlotte reveals.
Specific to their domain — use real node/edge/metric examples from the substrate.}

## Slide 4: The Charlotte Substrate
{Visual of their knowledge graph. Node count, edge count, fact count.
"We've already modeled your operation. This is what {company} looks like as data."}

## Slide 5: What Changes
{Concrete outcomes — cost savings, time savings, risk reduction, revenue enablement.
Pull from ROI thesis in cost analysis.}

## Slide 6: How It Works
{Three phases: Foundation → Operations → Intelligence.
Timeline with milestones. Simple, not overwhelming.}

## Slide 7: Investment
{Recommended tier, monthly cost, 2-year commitment.
Frame as investment, not expense. Compare to what they're losing without it.}

## Slide 8: Let's Start
{Call to action. "Sign the deployment contract, we begin next week."
Two contracts: deployment + ongoing service.}
```

**Tone calibration:**
- Slide 1 = intimidation (we already see you)
- Slides 2-4 = cooperation (we understand your world)
- Slides 5-7 = value (this is what you get)
- Slide 8 = action (let's go)

#### 4B. Master Service Agreement (`MSA.md`)

Legal contract template. Two documents:

**Contract 1 — Deployment & Migration Agreement:**
- Parties: SomeAI LLC ("Provider") and {Company} ("Client")
- Scope: Charlotte substrate creation, initial data ingestion, dashboard deployment
- Timeline: {N} months
- Deliverables: substrate.krf, index.html dashboard, brand book, training sessions
- Payment: Fixed fee, 50% upfront / 50% on completion
- IP: SomeAI retains Charlotte OS IP; client owns their data

**Contract 2 — Ongoing Service Agreement:**
- Parties: Same
- Scope: Charlotte operation, maintenance, updates, ingestion meetings
- Term: 24 months, auto-renewing
- Monthly fee: ${amount}/mo
- Annual escalator: 3-5%
- SLA: 99.5% uptime, 24hr response time
- Termination: 90-day notice, early termination fee = remaining months × 50%

---

### Wave 5 — Visualization (depends on substrate)

#### 5A. Dashboard (`index.html`)

Interactive single-page visualization. Follow existing patterns:
- D3.js force-directed knowledge graph OR domain-specific dashboard
- Dark theme matching brand book palette
- Key stats cards (node count, edge count, fact count, signal count)
- Responsive layout
- No external dependencies beyond D3.js CDN

**Dashboard type by industry:**
- Manufacturing: Equipment status grid + production metrics + supply chain graph
- Logistics/Moving: Crew cards + job metrics + route visualization
- Agriculture: Herd/flock cards + genetic lineage + health metrics
- Services: Client portfolio + service delivery + KPI bowling chart
- Generic: Force-directed knowledge graph with filterable node types

---

## Execution Order (Critical Path)

```
INPUTS (from user)
    │
    ├──→ Wave 1A: Business Analysis ──────┐
    ├──→ Wave 1B: Competitive Analysis ───┤
    ├──→ Wave 1C: Cost Analysis ──────────┤
    └──→ Wave 1D: Industry Research ──────┘
                                          │
                                    (all complete)
                                          │
                          ┌───────────────┴───────────────┐
                          │                               │
                    Wave 2A: KRF Substrate          Wave 2B: Brand Book
                          │                               │
                          └───────────┬───────────────────┘
                                      │
                          ┌───────────┴───────────────┐
                          │                           │
                    Wave 3A: PRD              Wave 3B: Software Design
                          │                           │
                          └───────────┬───────────────┘
                                      │
                          ┌───────────┴───────────────┐
                          │                           │
                    Wave 4A: Pitch Deck         Wave 4B: MSA Contracts
                          │                           │
                          └───────────┬───────────────┘
                                      │
                                Wave 5A: Dashboard
```

**Minimum viable package (3 waves):** Business Analysis + Competitive Analysis + Cost Analysis + KRF Substrate + MSA = enough to pitch and sign.

**Full package (5 waves):** All 10 deliverables = ready to deploy.

---

## File Structure (Final)

```
business/{client-slug}/
├── BUSINESS_ANALYSIS.md
├── COMPETITIVE_ANALYSIS.md
├── COST_ANALYSIS.md
├── PRD.md
├── SOFTWARE_DESIGN.md
├── PITCH_DECK.md
├── MSA.md                    (or split: DEPLOYMENT_CONTRACT.md + SERVICE_CONTRACT.md)
├── substrate.krf
└── index.html

design/brandbook/{client-slug}/
└── index.html
```

---

## Claude Execution Instructions

When the user says "onboard {company name}" or provides initial interaction notes for a new client:

1. **Gather inputs** — ask for anything missing from the Inputs Required table
2. **Web research** — search for company website, LinkedIn, industry data, competitors
3. **Wave 1 in parallel** — generate Business Analysis, Competitive Analysis, Cost Analysis simultaneously
4. **Wave 2 in parallel** — generate KRF Substrate and Brand Book simultaneously
5. **Wave 3 in parallel** — generate PRD and Software Design Document simultaneously
6. **Wave 4 in parallel** — generate Pitch Deck and MSA contracts simultaneously
7. **Wave 5** — generate Dashboard visualization
8. **Review** — present summary to user, iterate on any documents that need adjustment

**Time estimate:** Waves 1-4 can be completed in a single session. Wave 5 (dashboard) may require a follow-up session for complex visualizations.

**Quality check:** Every document should reference the Charlotte primitives (NODE, EDGE, METRIC, SIGNAL, PROTOCOL) and connect back to the transformation thesis from the Business Analysis.
