# Breed Overview

## Real Data → Game Stats

Every breed in the game is grounded in real swine science data from the Sounder knowledge graph and livestock-science reference library. The mapping follows this principle: **real traits become gameplay behavior, not just numbers on a stat screen.**

---

## Breed Comparison Chart

| Breed | Registry | Game Difficulty | Temperament | Body Type | Primary Strength | Primary Weakness |
|-------|----------|----------------|-------------|-----------|-----------------|-----------------|
| **Yorkshire** | NSR | Beginner | Calm, cooperative | Long, lean, maternal | Forgiving in ring; high litter size | Not flashy; moderate muscle |
| **Duroc** | NSR | Intermediate | Athletic, responsive | Muscular, deep-bodied | Muscle expression; growth rate | Can be hot; overreacts to pressure |
| **Hampshire** | NSR | Intermediate | Strong-willed, bold | Trim, heavily muscled | Eye appeal; ham/loin muscle | Fights the stick; composure breaks |
| **Berkshire** | ABA | Advanced | Intelligent, independent | Compact, marbled | Meat quality; ring presence | Smaller frame; stubborn if bored |
| **Landrace** | NSR | Intermediate | Docile, slow-moving | Long, droopy-eared | Maternal traits; litter size | Lacks eye appeal; floppy movement |
| **Chester White** | CPS | Intermediate | Steady, reliable | Moderate, balanced | Durability; consistency | White skin issues; sunburn risk |
| **Poland China** | CPS | Advanced | Powerful, assertive | Big-framed, dark | Raw power; impressive profile | Hard to control; dominant |
| **Spotted** | CPS | Advanced | Unpredictable, energetic | Large, spotted | Uniqueness; growth | Erratic ring behavior; hard to train |
| **Hereford** | NHRA | Unlockable | Gentle, steady | Medium, red/white | Showmanship partner; docile | Rare; limited genetics pool |

---

## Registry Mapping (from Sounder data)

The Sounder knowledge graph tracks real breeder registries:

| Registry | Full Name | Breeds Covered | Sounder Data |
|----------|-----------|---------------|--------------|
| **NSR** | National Swine Registry | Yorkshire, Duroc, Hampshire, Landrace | `breeders/NSR.json` — breeder locations, herdmarks, breed flags |
| **ABA** | American Berkshire Association | Berkshire | `breeders/ABA.json` — Berkshire-specific breeder registry |
| **CPS** | Certified Pedigreed Swine | Chester White, Poland China, Spotted | Referenced in livestock-science genetics section |
| **NHRA** | National Hereford Hog Record Assoc. | Hereford | Rare breed — limited registry data |

---

## EPD Traits (Simplified for Gameplay)

Real EPDs from breed registries track these traits. The game simplifies them into gameplay-relevant stats:

| Real EPD Trait | Game Stat | What It Affects |
|---------------|-----------|-----------------|
| Backfat (BF) | **Leanness** | Show ring score — judges want lean |
| Loin Muscle Area (LMA) | **Muscle** | Visual muscle expression; judge preference |
| Days to 250 lbs (D250) | **Growth Rate** | How fast pig reaches show weight |
| Number Born Alive (NBA) | **Fertility** | Litter size in breeding mode |
| Feed Conversion (FCR) | **Efficiency** | Feed cost per unit of growth |
| Structural Score | **Soundness** | Feet/legs; movement quality in the ring |

### Inheritance Model
- Each parent contributes 50% of genetic value with random variance (±15%)
- Heterosis bonus of 5-10% on fertility and growth traits for crossbreds
- Heritability varies by trait: structural (h²=0.25), muscle (h²=0.45), fertility (h²=0.10)
- Higher heritability = more predictable inheritance = faster genetic progress
- Low heritability traits (fertility) require large litter evaluation, not individual selection

---

## Unlock Progression

| Availability | Breeds | How Unlocked |
|-------------|--------|--------------|
| **Start** | Yorkshire, Duroc, Hampshire | Starter breed selection |
| **Year 2** | Berkshire, Landrace | Attend first regional show |
| **Year 3** | Chester White, Poland China | Build relationship with CPS breeders |
| **Year 4** | Spotted | Win a breed championship |
| **Year 5+** | Hereford | Special event — rare breed showcase |

---

## Crossbreeding

Crossbred market hogs are a major class at every show. The game supports any two-breed cross, with:
- **Heterosis bonus** on growth and fertility traits
- **Blended behavior** — crossbred temperament is a weighted mix of parent breeds
- **No breed registration** — crossbreds can't be registered, only shown as market hogs
- **Strategic value** — the best market hog in the county might be a Yorkshire × Duroc cross that combines maternal capacity with muscle

The breeding system is detailed in [mechanics/BREEDING.md](../mechanics/BREEDING.md).
