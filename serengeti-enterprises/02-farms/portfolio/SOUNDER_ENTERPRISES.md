# Sounder Enterprises, LLC — Portfolio Company Profile

## Overview

| Field | Value |
|---|---|
| **Company** | Sounder Enterprises, LLC |
| **Product** | SounderApp.com — Show pig herd management platform |
| **Entity** | Delaware Limited Liability Company |
| **Projected Valuation** | $5–10 Million+ |
| **Investor Ownership** | 5% per Farms #1 investor + 2% bonus for Farms #1 participants |
| **Status** | In Development |

## What Is Sounder?

An all-in-one herd management platform designed specifically for show pig breeders. It offers comprehensive tools to streamline operations and enhance productivity.

### Core Features
- **Health tracking**: Per-sow health information and history
- **Breeding cycle management**: Gestation tracking, heat detection, breeding schedules
- **Lineage records**: Full pedigree and genetic lineage per animal
- **Performance metrics**: Per-sow productivity, farrowing rates, show performance
- **Push notifications**: Alerts for breeding windows, health events, due dates
- **Sales tracking**: Manage pig sales, buyer records, revenue
- **Multi-user**: Team access so everyone stays on the same page

### Problem Solved
Before Sounder, show pig producers relied on messy Excel files or pen-and-paper record keeping. The technology for herd management in this niche simply wasn't up to par.

### Value Proposition
- More informed breeding decisions
- Savings on semen and resource costs
- More pigs bred and farrowed in time for target shows
- Elimination of manual record-keeping errors

## Market Context

The show animal industry:
- Annual revenues exceeding **billions of dollars** from sales, events, and supporting products
- Supports a diverse ecosystem: breeders, trainers, feed suppliers, vets, event organizers
- Engages both rural and urban participants
- Rich heritage with strong community loyalty

## Tech Stack (ACTUAL — Charlotte-Native)

Sounder is the **first vertical built on the Charlotte substrate**. It does not use a conventional backend.

| Layer | Technology |
|---|---|
| **Substrate** | Charlotte graph engine (Nodes, Signals, Edges, Protocols) |
| **Mobile** | Flutter (iOS + Android) — Charlotte's native client |
| **Backend** | Firebase Cloud Functions (20 functions) |
| **Database** | Firestore (Charlotte's persistence layer) |
| **Auth** | Firebase Authentication |
| **Notifications** | Firebase Cloud Messaging (FCM topics) |
| **Storage** | Firebase Storage (signal attachments — images, files) |
| **Voice** | Speech-to-text for field input |
| **AI** | Agent mode with context injection |
| **Web Dashboard** | Next.js (planned) |

### Charlotte Mapping for Sounder

| Charlotte Primitive | Sounder Implementation |
|---|---|
| **Node** | Sows, boars, litters, breeding groups |
| **Signal** | Weight, heat detection, breeding events, health observations |
| **Edge** | PARENT_OF, MEMBER_OF (breeding group), OWNS |
| **Protocol** | Matrix schedule, PG600 gestation protocol, heat check cadence |
| **Metric** | Farrowing rate, litter size, days to market weight |

### Live Test Data (Trogdon Showpigs)

| Metric | Value |
|---|---|
| Nodes | 1,174 (277 sows, 134 breeding groups, 762 litters) |
| Signals | 10,045 |
| Edges | 1,919 |

## Roadmap

| Phase | Milestone | Timeline | Status |
|---|---|---|---|
| MVP | Charlotte substrate + core breeding tracker | Months 1–3 | COMPLETE |
| Beta | Multi-user, notifications, sales tracking | Months 4–5 | IN PROGRESS |
| Launch | Public release, marketing push | Month 6 | PLANNED |
| Growth | Expand to cattle/goat/sheep show animals | Months 7–12 | PLANNED |
| Scale | Genetics marketplace, AI breeding recommendations | Year 2 | PLANNED |

## Competitive Advantage vs. GesDate (Incumbent)

| | Sounder | GesDate |
|---|---|---|
| Price | Target < $10/mo | $9.99–$49.99/mo |
| Sow limit | Unlimited | Hard limits per tier |
| Architecture | Charlotte graph (time-native, append-only) | Traditional database |
| AI features | Agent mode, voice input, predictive insights | None |
| Multi-user | Built-in (Charlotte permissions model) | Limited |
| Protocol engine | Automated breeding schedules + alerts | Manual tracking |

## Connection to Existing Work

| Resource | Location | Relevance |
|---|---|---|
| Charlotte main app | `charlotte/` | Sounder IS Charlotte's first vertical |
| PorkPal / Pig Breeder | `maplestory/` | Breeding genetics simulator — ancestor to Sounder |
| Show Animal Tree | `jack-at-someai.github.io/` | Skill tree for livestock genetics — research instrument |
| Charlotte LAUNCH plan | `charlotte/LAUNCH.md` | Full swine vertical business plan |
