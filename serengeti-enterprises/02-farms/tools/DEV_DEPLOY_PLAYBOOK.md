# Serengeti Farms — Dev & Deploy Playbook

## Charlotte-First Architecture

Every Farms portfolio app is built **Charlotte-first**. Charlotte is the graph-native substrate that provides the data layer, time-indexing, relationship management, and protocol engine. The standard stack wraps Charlotte with a UI and deployment layer.

### Layer 0: Charlotte Substrate (Shared Across All Apps)
| Component | Purpose |
|---|---|
| **Charlotte Graph Engine** | Nodes, Signals, Edges, Metrics, Protocols |
| **Firebase / Firestore** | Charlotte's persistence layer (real-time sync) |
| **Firebase Cloud Functions** | Charlotte's server-side logic (20 functions) |
| **Firebase Auth** | Identity and access control |
| **Firebase Cloud Messaging** | Push notifications via FCM topics |
| **Firebase Storage** | Signal attachments (images, files) |

### Layer 1: Frontend (Per-App)
| Tool | Purpose |
|---|---|
| **Flutter** | Mobile apps (iOS + Android — Charlotte's native client) |
| **Next.js** | Web dashboards (SSR, SEO, API routes) |
| **Tailwind CSS** | Styling (rapid prototyping, consistent design) |
| **shadcn/ui** | Web component library (accessible, customizable) |

### Layer 2: Extended Backend (When Needed)
| Tool | Purpose |
|---|---|
| **Node.js / Express** | Custom API endpoints beyond Charlotte |
| **Python / FastAPI** | ML pipelines, data processing, analytics |
| **PostgreSQL** | Supplementary relational data (if Charlotte graph is insufficient) |
| **Redis** | Caching, session store, real-time features |
| **Prisma** | ORM for supplementary relational access |

### Layer 3: Infrastructure
| Tool | Purpose |
|---|---|
| **Firebase** | Primary hosting for Charlotte-native apps |
| **Vercel** | Web dashboard hosting (Next.js native) |
| **AWS** | Heavy compute, storage (S3), queues (SQS) — for ML workloads |
| **Cloudflare** | CDN, DNS, DDoS protection |

### DevOps
| Tool | Purpose |
|---|---|
| **GitHub** | Version control, code review, CI/CD (Actions) |
| **Docker** | Containerization for backend services |
| **Terraform** | Infrastructure as code (when AWS is involved) |
| **Sentry** | Error monitoring and alerting |
| **PostHog / Mixpanel** | Product analytics |

### Payments & Compliance
| Tool | Purpose |
|---|---|
| **Stripe** | Payments, subscriptions, Connect for marketplaces |
| **Plaid** | Bank integrations (if needed) |
| **Jumio / Veriff** | Identity verification |

## Development Process

### Sprint Cadence
- **2-week sprints**
- Sprint planning Monday AM
- Daily async standups (Slack thread or Loom)
- Demo + retro every other Friday

### Branch Strategy
```
main (production)
├── staging (pre-production testing)
└── feature/FARM-{ticket}-{description}
```

### PR Rules
- All PRs require 1 review minimum
- CI must pass (tests + lint)
- No direct pushes to main or staging

### MVP Framework
Every Farms app follows this build sequence:

```
Week 1–2:  Core data model + API scaffolding
Week 3–4:  Primary user flow (the "one thing" the app does)
Week 5–6:  Auth, notifications, basic admin panel
Week 7–8:  Beta testing with 10–20 real users
Week 9–10: Iterate on feedback, polish UI
Week 11–12: Public launch prep (marketing, app store, landing page)
```

## Deployment Checklist

### Pre-Launch
- [ ] Domain registered and DNS configured
- [ ] SSL/TLS certificates active
- [ ] Environment variables secured (no secrets in code)
- [ ] Database migrations tested on staging
- [ ] Error monitoring (Sentry) connected
- [ ] Analytics (PostHog) events firing
- [ ] Stripe webhooks configured and tested
- [ ] Push notifications tested (mobile)
- [ ] Load testing passed (target: 1000 concurrent users minimum)
- [ ] Security audit completed (OWASP top 10)
- [ ] Privacy policy and ToS published
- [ ] App store listings prepared (if mobile)

### Launch Day
- [ ] Final staging → production deploy
- [ ] Smoke test all critical paths
- [ ] Monitoring dashboards open
- [ ] On-call rotation confirmed
- [ ] Launch announcement posted
- [ ] Analytics baseline captured

### Post-Launch (Week 1)
- [ ] Daily error review
- [ ] User feedback collection active
- [ ] Performance baselines established
- [ ] First iteration sprint planned

## Charlotte-Specific Development Guide

### Adding a New Vertical to Charlotte

When Farms selects a new app, the development process starts with Charlotte domain modeling:

```
1. DEFINE NODE TYPES
   What are the entities? (e.g., Venue, Patron, Event for Nightlife)
   → Add to Charlotte's node type registry

2. DEFINE SIGNAL DIMENSIONS
   What do we observe about each node? (e.g., capacity, check-ins, revenue)
   → Each dimension becomes a signal type

3. DEFINE PROTOCOLS
   What's expected behavior? (e.g., "Max capacity 200", "Age verify all patrons")
   → Protocols generate alerts when signals deviate

4. DEFINE EDGES
   How do nodes relate? (e.g., PATRON_VISITED → VENUE, EVENT_AT → VENUE)
   → Edges enable graph traversal and network intelligence

5. BUILD UI SCREENS
   Charlotte provides 5 standard views out of the box:
   - Upcoming (protocol reminders)
   - Node (identity + lifecycle)
   - Calendar (time-indexed view)
   - Timeline (signal history)
   - Agent (AI chat with context injection)

6. CUSTOMIZE & EXTEND
   Add domain-specific screens, analytics, integrations
```

### Charlotte Codebase References

| Resource | Location |
|---|---|
| Charlotte main app | `charlotte/` (Flutter + Firebase) |
| Substrate deep-dive | `charlotte/docs/SUBSTRATE.md` |
| Research papers | `charlotte/docs/artifacts/` (11-paper suite) |
| Business plan (Swine) | `charlotte/LAUNCH.md` |
| Research instruments | `jack-at-someai.github.io/` (37 projects) |

### When NOT to Use Charlotte

Charlotte is the default, but some apps may need conventional architecture:
- **Pure content/media apps** with no time-indexed signals
- **Simple CRUD tools** with no lifecycle or protocol logic
- **Third-party integrations** where the external API dictates the data model

In these cases, fall back to Layer 2 (Node.js + PostgreSQL + Prisma) with Layer 1 frontend.
