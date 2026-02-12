# Breeding

**The long game. The generational bet. The reason this isn't just a show game.**

---

## Overview

Breeding is where the game becomes a genetics simulator. You select sire × dam pairings, wait through a 114-day gestation, raise litters, and select keepers. Every pig you show in Year 3+ could be one you bred — and every breeding decision echoes forward through generations.

The system is grounded in real swine genetics (EPDs, heritability, heterosis) but simplified for gameplay without losing the core truth: **breeding is prediction under uncertainty.**

---

## The EPD System (Simplified)

### What EPDs Are
Expected Progeny Differences predict the *average genetic merit of an animal's offspring* relative to the breed average. They're not the animal's own performance — they're predictions about its babies.

### Game Traits

| Trait | Symbol | Heritability | Description |
|-------|--------|-------------|-------------|
| **Muscle** | MUS | High (0.45) | Loin and ham muscling; visual meat expression |
| **Leanness** | LEN | High (0.40) | Backfat thickness (lower = leaner) |
| **Growth** | GRO | High (0.35) | Days to market weight; feed conversion |
| **Structure** | STR | Moderate (0.25) | Feet, legs, skeletal correctness, movement |
| **Fertility** | FER | Low (0.10) | Litter size, reproductive efficiency |
| **Temperament** | TMP | Moderate (0.20) | Ring behavior, trainability, composure |

### Reading EPDs
EPDs are expressed as deviations from breed average (0.0):
- **+2.0 MUS** = offspring will average 2 units above breed average for muscle
- **-1.5 LEN** = offspring will average 1.5 units below breed average for leanness (leaner)
- **+0.5 FER** = offspring will average 0.5 more piglets born alive

### Accuracy
Each EPD has an accuracy value (0.0 to 1.0):
- Low accuracy (0.1-0.3) — young animal, few offspring recorded. The EPD is a guess.
- Medium accuracy (0.4-0.6) — some offspring data. More reliable.
- High accuracy (0.7-1.0) — proven sire/dam with extensive progeny records. Reliable.

**Gameplay implication:** Using an unproven sire is a gamble. Using a proven sire is safer but expensive. This mirrors real breeding decisions.

---

## Mating Decisions

### The Selection Screen
When you choose a mating, you see:
- **The dam** — your gilt/sow. Her EPDs, accuracy, phenotype (what she looks like), and pedigree.
- **Available sires** — boars available through natural service (local) or AI catalogs (regional/national).
- **Predicted offspring range** — a probability distribution of possible outcomes for each trait.

### Sire Sources

| Source | Cost | Quality | Risk |
|--------|------|---------|------|
| **Local boar (natural service)** | Low | Variable | Must physically breed; limited selection |
| **AI catalog — local breeder** | Medium | Good | Semen delivery; moderate genetic range |
| **AI catalog — regional/national** | High | Elite | Best genetics available; highest cost |
| **Your own boar** | Invested | Your genetics | No cost per breeding but you invested in raising/buying him |

### Complementary Mating
The game teaches complementary mating — pairing a sire's strengths with a dam's weaknesses:
- Dam is muscular but heavy on backfat → choose a lean sire
- Dam has excellent feet but moderate growth → choose a fast-growing sire
- Dam is structurally perfect but small-littered → cross with a Landrace or Yorkshire sire for fertility heterosis

### Cross Types

| Cross | Example | Heterosis | Notes |
|-------|---------|-----------|-------|
| **Purebred** | Yorkshire × Yorkshire | None | For breed show classes. Maintaining breed identity. |
| **Two-breed cross** | Duroc × Yorkshire | 5-10% | Standard market hog cross. Captures heterosis. |
| **Three-breed cross** | Duroc × (Hampshire × Yorkshire) | 10-15% | Maximum heterosis. Complex to manage. |
| **Backcross** | Duroc × (Duroc × Yorkshire) | Reduced | Recovers purebred characteristics while retaining some heterosis |

---

## Gestation & Farrowing

### Timeline
- **Breeding event** — Mating occurs. Gestation clock starts.
- **Day 0-30** — Early gestation. Embryo implantation. Pregnancy confirmation at ~25 days.
- **Day 30-90** — Mid gestation. Fetal growth. Adjust dam nutrition for body condition.
- **Day 90-110** — Late gestation. Rapid fetal growth. Increase feed. Prepare farrowing pen.
- **Day 111-117** — Farrowing window. 114 days average. Monitor for signs of labor.

### Farrowing Event
Farrowing (birth) is a significant game event:
- The litter arrives — 6-14 piglets depending on dam breed and genetics
- Each piglet is generated with inherited traits (EPDs from both parents + random variance)
- Some piglets may be weak, stillborn, or have defects (reflects real biology)
- Player manages the farrowing — keeping piglets warm, ensuring they nurse, watching for complications
- **Dr. Chen may be needed** for difficult farrowings (dystocia, prolapse, weak piglets)

### Litter Generation Algorithm
```
For each piglet in the litter:
  For each trait:
    base_value = (sire_EPD + dam_EPD) / 2
    mendelian_sampling = random_normal(0, trait_variance * (1 - heritability))
    environmental_effect = random_normal(0, env_variance)
    piglet_trait = base_value + mendelian_sampling + environmental_effect

  If cross-breed:
    fertility_bonus = heterosis_fertility * breed_distance_coefficient
    growth_bonus = heterosis_growth * breed_distance_coefficient
```

---

## Selection

### The Hardest Decision in the Game
A litter of 10 piglets. You keep 1-3. The rest are sold or raised as market hogs. Which ones do you keep?

**What you can see:**
- Physical appearance at weaning (8 weeks) — limited information
- Birth weight and growth rate — measurable
- Parent EPDs — known
- Movement quality — observable but subtle at young age
- Gender — critical (keeping gilts for breeding, barrows for market)

**What you can't see:**
- True genetic potential — hidden until the pig matures
- How it will respond in the ring — unknown until you train it
- Whether it will breed true — unknown until its offspring arrive

### Selection Criteria
The game teaches real selection principles:
1. **Structural soundness first** — a pig with bad feet/legs can't show and can't breed
2. **Breed character** — does it look like the breed it's supposed to be?
3. **Growth and muscle** — visual appraisal of potential
4. **Pedigree** — what did the parents and grandparents produce?
5. **Gut feel** — after enough litters, you start seeing potential that isn't in the numbers

### Culling
Pigs not selected as breeding stock are:
- **Shown as market hogs** — one show, one chance
- **Sold to other operations** — if they have value as breeding stock
- **Sold as feeders** — lowest value, but clears barn space

---

## The Breeding Program Arc

### Year 1-2: Learning
- No breeding decisions. You're showing purchased stock.
- Observe your family's herd. Learn what your parent does.
- Begin understanding why certain pigs are better than others.

### Year 3: First Mating
- Your parent gives you a gilt.
- You choose a sire from the available options.
- You watch the gestation. You attend the farrowing.
- You select from the litter. Your first homebred pig.

### Year 4-5: Building
- Multiple sows, planned matings.
- You're tracking which crosses work and which don't.
- Your reputation as a breeder begins to form.
- Other operations start buying your stock.

### Year 6+: Legacy
- Your herd has a genetic direction — lean Durocs, maternal Yorkshires, balanced Hampshires.
- Your offspring are winning shows.
- Your herdmark appears on registration papers.
- You are your grandpa. The cycle continues.

---

## Inbreeding & Genetic Management

### Coefficient of Inbreeding (COI)
The game tracks inbreeding:
- Mating animals with shared ancestors increases COI
- High COI (>6.25%) increases risk of: reduced fertility, structural defects, lower vigor
- Visual warning when a proposed mating has high COI
- The player must balance genetic improvement with genetic diversity

### Bringing in New Genetics
- Buying outside sires from auctions or AI catalogs
- Trading breeding stock with other operations (NPC breeders)
- Attending sales where new bloodlines are available
- The tension: the best genetics for your program might increase inbreeding. The safest genetics might not improve your herd. This is real breeding.
