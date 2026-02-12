# Reference Sources

**Every game design decision is grounded in real data. Here's where it comes from.**

---

## Primary Domain Sources

### Sounder — Biological Lifecycle Intelligence
**Location:** `/c/dev/business/sounder/`
**Project card:** [Sounder on index](https://jack-at-someai.github.io/core/business/sounder/)
**What it contains:**
- 382K+ LISP facts modeling biological lifecycle intelligence
- Breeder registry data:
  - `sounder_scripts/breeders/NSR.json` — National Swine Registry breeders (Yorkshire, Duroc, Hampshire, Landrace, Crossbred). Herdmarks, locations, breed flags.
  - `sounder_scripts/breeders/ABA.json` — American Berkshire Association breeders. Berkshire-specific herdmarks and locations.
  - `sounder_scripts/breeders/TSA.json` — Tamworth Swine Association breeders. Heritage breed registry.
- Pedigree data: `sounder_scripts/pedigree/`
- Breeding records: `sounder_scripts/breedings/`
- Show event data: `sounder_scripts/events/`
- Sale/high seller data: `sounder_scripts/high_sellers/`
- Sire evaluation: `sounder_scripts/sires_of_the_south/`
- Industry data: `sounder_scripts/industry/`
- Storefront/product data: `sounder_scripts/storefront/`

**How it's used in the game:**
- Herdmark system (WLD, real herdmark format)
- Registry structure (NSR, ABA, CPS mapping)
- Breeder network design (geographic distribution, breed specialization)
- Sale and auction mechanics
- Pedigree display and tracking system

---

### Livestock Science — Reference Library
**Location:** `/c/dev/references/livestock-science/`
**Project card:** [Livestock Science on index](https://jack-at-someai.github.io/core/references/livestock-science/)
**What it contains:**
80+ curated resources across 7 sections:

| Section | Resources | Game Application |
|---------|-----------|-----------------|
| **Overview** | Foundational texts (Falconer, Senger, Grandin) | Core science behind all systems |
| **Genetics & Breeding** | EPDs, registries, crossbreeding, university extension | Breeding mechanics, EPD system, inheritance model |
| **Reproduction** | Estrous cycles, gestation, AI, hormones | Breeding calendar, farrowing events, gestation timing |
| **Nutrition & Growth** | NRC standards, show feeds, growth curves | Feeding system, condition management, phase feeding |
| **Show Industry** | Showmanship guides, judging criteria, exhibitions | Showring mechanics, judge AI, scoring system |
| **Herd Management** | Record keeping, biosecurity, facility design | Daily care loop, health management, barn mechanics |
| **Veterinary Science** | Diseases, vaccination, show health | Health events, preventive care, Dr. Chen's role |
| **Datasets & Software** | USDA data, genetic evaluation tools, herd software | Market data, genetics analysis, production metrics |

**Key resources directly informing game design:**

**Genetics:**
- NSR (nationalswine.com) — EPD structure for Yorkshire, Duroc, Hampshire, Landrace
- ABA (americanberkshire.com) — Berkshire-specific EPDs including meat quality
- CPS (cpswine.com) — Chester White, Poland China, Spotted genetic evaluations
- NSIF Guidelines — Swine genetic evaluation methodology

**Reproduction:**
- Gestation: 114 days (3-3-3 rule) → game calendar
- Estrous cycle: 21 days → breeding timing mechanics
- Litter size: breed-dependent (10-14 for Yorkshire/Landrace) → fertility stat
- Puberty: 5-8 months → gilt development timeline

**Nutrition:**
- FCR: 2.5-3.0:1 for show pigs → feed efficiency stat
- ADG: 1.8-2.2 lbs/day → growth rate calculations
- Phase feeding (starter → grower → finisher) → feed type system
- Show feeds (Honor Show Chow, Kent, Lindner) → in-game feed brands

**Show Industry:**
- Judging criteria: structural correctness, muscle, balance, movement, presentation → judge AI weights
- 4-H/FFA showmanship guides → showmanship class mechanics
- Show hierarchy: county → regional → state → national → game progression
- Fitting and grooming guides → show prep mechanics

**Veterinary:**
- Major diseases (PRRS, PED, erysipelas) → health event system
- Vaccination schedules → preventive care mechanics
- Biosecurity protocols → post-show isolation mechanics
- Show health requirements → fair check-in system

---

### Charlotte — Substrate Architecture
**Location:** `/c/dev/charlotte/` (Flutter app) and `/c/dev/substrate/` (graph explorer)
**Project card:** [Substrate on index](https://jack-at-someai.github.io/core/substrate/)
**What it contains:**
- The five primitives: Node, Metric, Signal, Edge, Protocol
- Graph-native knowledge representation
- Time as primary axis of truth

**How it informs the game:**
- The game's data model mirrors Charlotte's approach:
  - Each **pig** is a Node with Metrics (EPDs, weight, condition)
  - **Breeding events** are Edges connecting sire and dam nodes
  - **Show results** are Signals emitted at specific times
  - **Genetic protocols** forecast offspring outcomes
  - **Time** drives everything — gestation clocks, growth curves, seasonal cycles
- The game is conceptually a Charlotte game instance — a domain-specific simulation running on the substrate architecture

---

### GesDate Agent
**Location:** `/c/dev/business/gesdate/`
**Project card:** [GesDate on index](https://jack-at-someai.github.io/core/business/gesdate/)
**What it contains:**
- Charlotte-powered herd management agent
- Gestation date tracking
- Breeding record management

**How it informs the game:**
- The gestation calendar system draws directly from GesDate's date calculation model
- The 114-day gestation + farrowing window mechanics

---

## External References

### Breed Registries (Real-World)
| Registry | URL | Breeds | Data Used |
|----------|-----|--------|-----------|
| National Swine Registry | nationalswine.com | Yorkshire, Duroc, Hampshire, Landrace | EPD ranges, breed standards, registration structure |
| American Berkshire Association | americanberkshire.com | Berkshire | Meat quality EPDs, breed characteristics |
| Certified Pedigreed Swine | cpswine.com | Chester White, Poland China, Spotted | Breed profiles, genetic evaluations |
| National Hereford Hog Record | herefordhog.org | Hereford | Heritage breed data, conservation status |

### University Extension Resources
| University | Focus | Data Used |
|-----------|-------|-----------|
| Iowa State (IPIC) | Swine genetics, nutrition | EPD interpretation, feeding programs |
| Purdue | Show pig management | Fitting/grooming guides, 4-H resources |
| Ohio State | Showmanship | Ring techniques, youth judging |
| Texas A&M | Meat science, judging | Oral reasons framework, evaluation criteria |
| Kansas State | Swine nutrition | Diet formulation, amino acid requirements |
| Penn State | Breeding management | Gilt development, reproductive protocols |

### Industry Organizations
| Organization | URL | Data Used |
|-------------|-----|-----------|
| National Pork Board | porkcheckoff.org | PQA Plus, industry data |
| NSIF | nsif.com | Genetic evaluation standards |
| Team Purebred | teampurebred.com | Junior show structure |
| World Pork Expo | worldpork.org | National show format |
| NAILE | livestockexpo.org | National show format |

### Show Supplies & Community
| Source | URL | Data Used |
|--------|-----|-----------|
| Sullivan Supply | sullivansupply.com | Fitting/grooming products and techniques |
| Showpig.com | showpig.com | Breeder marketplace, show results, industry culture |
| National Hog Farmer | nationalhogfarmer.com | Applied production articles |

---

## Data Integrity Notes

- All breed trait ranges are sourced from registry-published EPD summaries and university extension publications
- Heritability estimates (h²) are from Falconer & Mackay and peer-reviewed swine genetics literature
- Gestation length, estrous cycle, and reproductive parameters from Senger's *Pathways to Pregnancy and Parturition*
- Judging criteria from official 4-H/FFA evaluation guides and university livestock judging manuals
- Growth rates (ADG) and feed conversion (FCR) from NRC *Nutrient Requirements of Swine* (11th ed.)
- Disease information from *Diseases of Swine* (Zimmerman et al., 11th ed.) and AASV resources

Every number in the game design has a real-world source. The fantasy is in the story and the world — the science is real.
