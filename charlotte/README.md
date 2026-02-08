# Charlotte

**Charlotte** is a minimal, graph-native system for tracking reality as it unfolds over time.

It models operations, assets, and living systems as **nodes** with **signals** on measurable dimensions, evolving under **protocols** that describe expected behavior. There is no stored hierarchy, no mutable history, and no predefined workflows. Meaning is produced through traversal, projection, and explanation — not schema.

Charlotte is designed to support:

- biological lifecycles (livestock, health, breeding)
- mechanical lifecycles (equipment, maintenance, service)
- human and organizational lifecycles (work, stress, performance)
- any domain where truth emerges from time-aligned signals

At its core, Charlotte treats **time as the primary axis of truth**. Observations, expectations, and outcomes are all represented as signals with provenance. History is append-only. Future intent is layered, never rewritten. Completed lifecycles can be sealed and archived as trusted ground truth for learning.

Charlotte is **domain-agnostic by design**. Industry meaning is introduced through categories, metrics, and UI modes — never through rigid data structures. This allows the same system to support pigs, compressors, violins, or people without architectural change.

**It is infrastructure for observable reality.**

---

## Current Status: MVP Ready

| Layer | Files | Status |
|-------|-------|--------|
| Models | 14 | Complete |
| Repositories | 6 | Complete |
| Services | 6 | Complete |
| Screens | 10 | 85% |
| Cloud Functions | 20 | Deployed |
| Firebase Rules | 3 | Deployed |

### Implemented Features

- **Node/Signal/Edge** graph primitives with colon grammar
- **Append-only signals** with supersession tracking
- **Protocol engine** with activation graphs (Matrix, PG600, custom)
- **Push notifications** via FCM topics (node updates, protocol reminders, due dates)
- **Signal attachments** (images/files to Firebase Storage)
- **Voice input** with speech-to-text
- **AI agent** chat with context injection
- **5 UI modes**: Upcoming, Node, Calendar, Timeline, Agent

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Flutter App                          │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│  Upcoming   │    Node     │  Timeline   │      Agent       │
│    Mode     │    Mode     │    Mode     │      Mode        │
├─────────────┴─────────────┴─────────────┴──────────────────┤
│                     Repositories                            │
│  NodeRepo │ SignalRepo │ ChatRepo │ SocialRepo │ NotifyRepo │
├─────────────────────────────────────────────────────────────┤
│                      Firebase                               │
│  Firestore │ Storage │ Auth │ Functions │ Messaging        │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

```
NODE (identity with lifecycle)
  ├── SIGNAL (time-indexed observation)
  ├── EDGE (relationship to other nodes)
  └── METRIC_CONFIG (what to track)

SIGNAL (append-only fact)
  ├── value, timestamp, source
  ├── attachments (images/files)
  └── supersession tracking

EDGE (first-class relationship)
  ├── OWNS, MEMBER_OF, PARENT_OF
  └── GRANTS_ACCESS (with permissions)
```

### Colon Grammar

- `:` → framework fields (`:ID`, `:TYPE`, `:CREATED_AT`)
- `::` → attributes (`::LABEL`, `::VALUE`, `::CATEGORIES`)
- `:::` → relationships (`:::NODE`, `:::FROM`, `:::TO`)

---

## First Vertical: Swine

The first deployment is for **show pig breeders** and small-scale swine operations.

See [LAUNCH.md](LAUNCH.md) for business plan and pricing.
See [GESDATE_COMPARISON.md](GESDATE_COMPARISON.md) for competitive analysis.
See [sounder/README.md](sounder/README.md) for the Trogdon Showpigs test data.

### Test Data Loaded

- 1,174 nodes (277 sows, 134 breeding groups, 762 litters)
- 10,045 signals (breeding events, farrowing, litter metrics)
- 1,919 edges (OWNS, MEMBER_OF, PARENT_OF)

---

## Cloud Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `onMessageCreated` | Firestore | Agent response streaming |
| `onSignalCreated` | Firestore | Push notification on signal |
| `sendProtocolReminders` | Scheduled 6 AM | Daily protocol checks |
| `sendDueDateReminders` | Scheduled 7 AM | 7-day due date alerts |
| `initializeHumanNode` | Callable | Create user's HUMAN node |
| `createSignal` | Callable | Validated signal creation |
| `seedSwineMetrics` | Callable | Seed swine metric library |
| `seedIndustrialMetrics` | Callable | Seed industrial metrics |

---

## Push Notification Topics

Users are automatically subscribed to FCM topics based on graph ownership:

| Topic Pattern | When Subscribed | Notifications |
|---------------|-----------------|---------------|
| `node_{nodeId}` | User OWNS node | Signal recorded |
| `operation_{opId}` | User OWNS operation | Any child node signal |
| `protocol_{nodeId}` | User OWNS node | Daily protocol reminders |

---

## Getting Started

### Prerequisites

- Flutter 3.9+
- Firebase CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Setup

```bash
# Clone
git clone https://github.com/jackrichard/charlotte.git
cd charlotte

# Install dependencies
flutter pub get

# Install iOS pods
cd ios && pod install && cd ..

# Run
flutter run
```

### Firebase Setup

1. Create Firebase project at console.firebase.google.com
2. Enable Firestore, Auth, Storage, Functions, Messaging
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Deploy rules and functions:

```bash
firebase deploy --only firestore:rules,storage:rules,functions
```

---

## Project Structure

```
charlotte/
├── lib/
│   ├── models/          # Node, Signal, Edge, Metric, etc.
│   ├── repositories/    # Firestore access layer
│   ├── services/        # Voice, tenant, seed services
│   ├── screens/         # Shell + 5 modes
│   ├── widgets/         # UI components
│   └── painters/        # Signal visualization
├── functions/           # Cloud Functions (Node.js)
├── sounder/             # Swine vertical test data
├── ios/                 # iOS native
├── android/             # Android native
└── web/                 # Web (experimental)
```

---

## Core Principles

1. **Append-only history** — signals are never edited, only superseded
2. **Graph traversal** — meaning emerges from edges, not hierarchy
3. **Time as truth** — everything is indexed by when it happened
4. **Domain agnostic** — industry meaning lives in seeds, not code
5. **Protocol-driven** — expected signals guide user action

---

---

## Next Steps

### Priority 1: Foundation & Context

- [ ] **Access previous repository** - Grant Claude access to the original Charlotte repo on GitHub for reference implementation, UI patterns, and tested features
  - Previous repo contains working implementations of many features
  - Need to review and port: onboarding flows, subscription handling, UI polish
  - Command: Add repo to context or share via GitHub URL

### Priority 2: Authentication & Subscriptions

- [ ] **Google Sign-In** - Replace anonymous auth with Google OAuth
  - Enable Google provider in Firebase Console
  - Add `google_sign_in` package
  - Test with personal Google account first
  - Preserve anonymous-to-authenticated upgrade path

- [ ] **Subscription Tiers** - Add tier field to HUMAN nodes
  ```
  HUMAN node fields:
    ::SUBSCRIPTION_TIER: "free" | "pro" | "team"
    ::SUBSCRIPTION_EXPIRES: ISO date
    ::STRIPE_CUSTOMER_ID: string (optional)
  ```
  - Free: 10 nodes, no AI agent
  - Pro ($10/mo): Unlimited nodes, AI agent, push notifications
  - Team ($10/mo): Pro + unlimited users on same operation

- [ ] **Stripe Integration** - Payment processing
  - Stripe Checkout for subscriptions
  - Webhook handler in Cloud Functions
  - Sync subscription status to Firestore

### Priority 3: Onboarding Flow

- [ ] **First-run experience**
  - Splash → Sign in (Google) → Create operation → Add first node
  - Industry selection (swine/cattle/equipment/custom)
  - Quick tutorial overlay on each mode

- [ ] **Operation setup wizard**
  - Name your operation
  - Import existing data (optional)
  - Invite team members (optional)

- [ ] **Sample data option**
  - "Try with demo data" button
  - Loads subset of Trogdon data for exploration
  - Clear demo data when ready to start fresh

### Priority 4: Assets & Branding

- [ ] **App icons** - Replace Flutter defaults
  - iOS: All required sizes (1024, 180, 120, etc.)
  - Android: Adaptive icons + legacy
  - Use existing assets from previous repo

- [ ] **Launch screen** - Branded splash
  - Purple gradient background
  - SOUNDER / CHARLOTTE logo
  - Smooth transition to app

- [ ] **Marketing assets**
  - App Store screenshots
  - Feature graphics
  - Promo video clips

### Priority 5: Testing & Polish

- [ ] **Test signal entry flow**
  - Quick entry from node detail
  - Voice input → signal creation
  - Photo attachment on signals

- [ ] **Test push notifications**
  - Record signal → verify notification received
  - Protocol reminder at 6 AM
  - Due date reminder at 7 AM

- [ ] **Test graph traversal**
  - Operation → owned sows
  - Sow → breeding groups → litters
  - Timeline view with signals

- [ ] **UI polish**
  - Loading states
  - Error handling
  - Empty states
  - Haptic feedback

### Priority 6: Beta Launch

- [ ] **TestFlight setup** (iOS)
  - App Store Connect configuration
  - Beta build upload
  - Internal testing group

- [ ] **Play Console setup** (Android)
  - Internal testing track
  - Beta build upload

- [ ] **Beta testers**
  - 3-5 friendly operations
  - Feedback collection mechanism
  - Crash reporting (Firebase Crashlytics)

---

## Repository Access

To give Claude context from the previous repository:

```bash
# Option 1: Add as submodule (if private)
git submodule add https://github.com/USER/previous-charlotte.git reference/

# Option 2: Share specific files
# Copy key implementation files to a /reference folder

# Option 3: In conversation
# Share GitHub URL and grant read access
```

Key files to reference from previous repo:
- Onboarding screens and flows
- Subscription/payment handling
- App icons and assets
- UI components and animations
- Working protocol implementations

---

## Environment Setup

### Required Accounts
- Apple Developer ($99/year) - iOS deployment
- Google Play Console ($25 one-time) - Android deployment
- Firebase (Blaze plan) - Pay as you go
- Stripe - Payment processing

### Local Development
```bash
# Flutter
flutter doctor
flutter pub get

# iOS
cd ios && pod install && cd ..
open ios/Runner.xcworkspace  # For capabilities

# Firebase
firebase login
firebase use charlotte-substrate

# Run
flutter run -d <device-id>
```

### Secrets Management
```
.env (gitignored):
  STRIPE_SECRET_KEY=sk_...
  STRIPE_WEBHOOK_SECRET=whsec_...

Firebase Console:
  OPENAI_API_KEY (in Functions secrets)
```

---

## License

Proprietary. All rights reserved.
