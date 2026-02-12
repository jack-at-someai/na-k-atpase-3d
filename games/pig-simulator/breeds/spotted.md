# Spotted

**The Wild Card. The Character. The Pig That Keeps You Honest.**

---

## Real-World Profile

| Attribute | Value |
|-----------|-------|
| **Registry** | CPS (Certified Pedigreed Swine) |
| **Origin** | Indiana (from Poland China × Gloucester Old Spots crosses) |
| **Color** | Black and white spotted — variable pattern, no two alike |
| **Primary Use** | Show pig; crossbreeding; growth and efficiency |
| **Key Strengths** | Growth rate, feed efficiency, unique appearance |
| **Identity** | Every Spotted pig looks different — individual recognition at a glance |

### Real Trait Profile
- **Backfat:** Moderate — similar to Poland China
- **Loin Muscle Area:** Good — respectable muscling
- **Growth Rate:** Excellent — one of the fastest-growing breeds
- **Litter Size:** Moderate — adequate but not exceptional
- **Feed Efficiency:** Very good — converts feed to gain efficiently

### Why Spotted Pigs Matter
The Spotted breed (formerly Spotted Poland China) carries a lot of Poland China genetics but has developed its own identity. Spotted pigs are growthy, efficient, and visually unique. No two Spotted pigs have the same pattern, which makes them instantly identifiable in the barn. In the show ring, they bring energy and unpredictability — which is either exciting or terrifying depending on the handler.

---

## Game Profile

### Difficulty: Advanced

Spotted pigs have the most unpredictable ring behavior in the game. They're energetic, curious, easily distracted, and have strong opinions about everything. Showing a Spotted pig well is a high-wire act. When it works, it's electric. When it doesn't, it's chaos.

### Game Stats (Base)
| Stat | Value | Range |
|------|-------|-------|
| Muscle | 6/10 | Good but variable |
| Leanness | 5/10 | Moderate condition |
| Growth Rate | 8/10 | Fast grower; efficient converter |
| Fertility | 5/10 | Moderate litters |
| Soundness | 6/10 | Variable — some excellent, some rough |
| Temperament | 2/10 | Unpredictable, energetic, curious, chaotic |

### Ring Behavior AI
- **Walking:** Variable speed. Starts slow, speeds up, slows down again. Hard to maintain rhythm.
- **Stopping:** Stops suddenly and without warning. Starts again just as suddenly.
- **Turning:** Erratic. May turn when you ask, may turn when you don't. May turn *into* other pigs.
- **Under pressure:** Inconsistent response. Same pressure gets different results each time.
- **Fatigue:** High energy that burns out in bursts. Manic energy → sudden rest → manic again.
- **Quirk:** Fascinated by other pigs. Will try to nose/investigate any pig near it. Easily distracted by crowd noise, other exhibitors, or anything novel. The wildcard of the ring.

### Personality
Spotted pigs are the golden retrievers of the pig world — if golden retrievers weighed 260 pounds and had no concept of personal space. They're friendly, curious, energetic, and completely unreliable. They don't mean to be difficult — they're just *interested in everything*. A Spotted pig in the ring sees the judge, the other pigs, the gate, the crowd, the sawdust, a piece of hay — and wants to investigate all of it.

### Why Choose Spotted
- You want the most unique-looking pig (every individual is different)
- You enjoy chaotic, unpredictable gameplay
- You want to prove you can handle anything
- You want fast growth and efficiency in your breeding program

### Why Not Spotted
- You want control in the ring (Spotted offers none)
- You want consistent results (Spotted is the anti-consistent)
- You want a calm daily handling experience (Spotted is always doing something)

---

## Sprite Notes

### Silhouette
- **Large body** — similar frame to Poland China (shared ancestry)
- **Drooping ears** — medium droop
- **Spotted pattern** — THIS IS THE KEY. Black and white spots, variable per individual.
- **Each pig should have a unique spot pattern** generated procedurally
- **Slightly less massive** than Poland China despite similar frame

### Proportions (32×32 base)
- Body length: ~19px
- Body depth: ~11px
- Leg height: ~8px
- Ear droop: 1-2px below horizontal
- Spot pattern: random distribution, 40-60% black, 40-60% white

### Animation Notes
- Walk cycle should feel **bouncy and irregular**. Not a clean cadence.
- Head movement: more than any other breed. Always looking around.
- Ear movement: frequent. Ears are radar dishes.
- Idle: never truly idle. Always moving slightly — shifting weight, looking around, nosing the ground.
- When spooked: unpredictable. Might bolt, might freeze, might turn toward it, might spin in a circle.
- Spot pattern must be consistent across animation frames for the same individual but unique between individuals.

### Procedural Spot Generation
- Divide the body into a grid
- Randomly assign black or white to each cell
- Apply smoothing to create natural-looking patches (not noise)
- Save pattern per individual pig — it's their visual identity
- Spots should be visible and readable at 32×32 scale (larger patches, not fine speckle)

---

## Breeding Value

### As Sire
- Adds growth rate and efficiency to crosses
- Spotted × Yorkshire produces fast-growing market hogs with maternal backing
- Spotted × Hampshire adds mass and growth to lean genetics
- Temperament concerns in crosses — Spotted energy can be dominant

### As Dam
- Adequate maternal ability but not a maternal specialist
- Spotted dams are active mothers — sometimes too active (restlessness can cause piglet loss)
- Better used in crossbred market hog programs than as maternal foundation

### Genetic Tendencies
- Growth rate breeds true — Spotted lines grow fast consistently
- Pattern is genetically variable — spot distribution is unpredictable
- Risk: the unpredictable temperament is partially heritable. Spotted crosses tend toward higher energy.
- Feed efficiency is a real advantage in the game's economics — cheaper to raise
