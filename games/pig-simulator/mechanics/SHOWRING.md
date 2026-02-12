# The Show Ring

**The core gameplay loop. Everything else feeds into this.**

---

## Overview

The show ring is where the game happens. You guide your pig around an arena while a judge evaluates it against the competition. You don't control the pig directly — you *drive* it with a stick (or two), and the pig's AI determines how it responds. Your skill as a handler, combined with your pig's genetics and conditioning, determines the outcome.

This is not a button-mashing action game. It's a **real-time animal management sim** where reading your pig's behavior and the judge's attention is everything.

---

## Camera & Perspective

### Primary View: Top-Down (3/4 Isometric)
- Camera looks down at ~60 degrees
- Show ring is an oval or rectangular arena with fencing
- Sawdust floor texture
- Judge, other exhibitors, and crowd visible
- Pig and handler sprites visible with breed-specific detail

### Why Top-Down
- Lets the player see the entire ring and all competitors
- Shows spatial relationships (where is the judge looking? where are the other pigs?)
- Allows strategic positioning (keep your pig between you and the judge)
- Mirrors real showmanship — the handler's job is spatial awareness

---

## Controls

### The Driving Stick
In real life, exhibitors use a rigid stick (cane, whip stock, or show stick) to guide the pig by tapping or pressing on its sides, shoulders, and hams. The game simulates this.

**Control Scheme (Gamepad):**
| Input | Action |
|-------|--------|
| Left stick | Position your handler relative to the pig |
| Right stick | Direct the driving stick — tap direction to apply pressure |
| A / X | Tap the pig (light pressure — encourages movement) |
| B / Y | Firm pressure (stronger push — used for turns and stops) |
| LB / RB | Switch stick to left/right hand (changes approach angle) |
| D-pad | Quick handler positions (lead from front, drive from behind, flank left/right) |

**Control Scheme (Keyboard):**
| Input | Action |
|-------|--------|
| WASD | Position handler |
| Arrow keys | Direct stick pressure |
| Space | Tap (light pressure) |
| Shift + Space | Firm pressure |
| Q / E | Switch stick hand |

### Pressure System
The stick applies directional pressure. The pig responds based on:
- **Pressure direction** — tap on left side, pig moves right
- **Pressure intensity** — light tap encourages, firm press demands
- **Pressure timing** — rhythmic tapping creates steady movement; erratic tapping creates stress
- **Breed temperament** — each breed has different pressure sensitivity thresholds

### The Handler's Position
Where you stand relative to the pig matters:
- **Behind the pig** — driving position. The pig moves forward.
- **Beside the pig** — guiding position. Control direction.
- **In front of the pig** — blocking position. The pig stops or turns.
- **At the shoulder** — presentation position. Best for when the judge is evaluating.

---

## The Judge

### Judge AI
The judge moves around the ring, evaluating each pig from multiple angles. The judge is an NPC with:
- **Attention system** — The judge looks at one pig at a time, then moves to the next
- **Position preference** — The judge prefers to see pigs from the side (broadside profile)
- **Movement tracking** — The judge watches how the pig moves, not just how it stands
- **Note-taking** — Internal scoring that updates in real-time based on what the judge sees

### What the Judge Evaluates
| Criteria | Weight | What It Means |
|----------|--------|---------------|
| **Structural correctness** | 25% | Feet and legs, skeletal soundness, joint angles during movement |
| **Muscle expression** | 25% | Visible loin and ham muscling, width of base, depth of body |
| **Balance & eye appeal** | 20% | Overall proportion, levelness, style, attractiveness |
| **Movement quality** | 15% | Gait fluidity, freedom of movement, stride length |
| **Handler presentation** | 15% | Pig composure, handler smoothness, time in good position |

### Judge Preferences
Each judge (see [story/CHARACTERS.md](../story/CHARACTERS.md)) has different weight distributions. Judge Reeves cares more about structural correctness. Judge Carver wants muscle. The player should learn which pigs match which judges.

---

## Scoring System

### Real-Time Score Factors

**Positive Scoring:**
- Pig walking with steady, fluid gait (+)
- Pig broadside to the judge when judge is watching (++)
- Clean stop with good brace position (+++)
- Smooth turns without breaking stride (+)
- Handler maintaining appropriate distance (+)
- Handler switching stick sides smoothly (+)

**Negative Scoring:**
- Pig breaking composure (bolting, stopping unexpectedly) (--)
- Pig facing away from judge when judge is watching (-)
- Handler blocking judge's view of the pig (--)
- Pig fighting the stick (visible resistance) (-)
- Handler using excessive pressure (-)
- Pig crowding or interfering with other exhibitors (-)
- Pig nosing the ground / rooting (-)

### Class Placement
At the end of the class, the judge places all pigs from first to last. Placement is based on:
1. The pig's base genetic quality (muscle, structure, lean — what the pig *is*)
2. The pig's conditioning (feeding management leading up to the show)
3. The presentation score (how well you showed it)

A mediocre pig shown perfectly can beat a good pig shown poorly. This is the core game loop — **your skill matters as much as your pig's genetics.**

---

## Ring Flow

### Before the Class
1. **Wash and prep** — Mini-game or automated sequence where you prepare the pig
2. **Enter the ring** — Walk through the gate. Establish control immediately.
3. **Initial drive** — The judge watches all pigs moving together for the first 1-2 laps

### During the Class
4. **Free drive** — All pigs moving. Judge walks among them. Keep your pig visible.
5. **Profile request** — Judge signals exhibitors to line up broadside. Stop your pig. Brace.
6. **Individual evaluation** — Judge examines specific pigs. If it's yours, keep it still and presented.
7. **Continued drive** — More laps. The judge is comparing, sorting, narrowing.
8. **Final sort** — Judge pulls top pigs forward. If your pig is pulled, you've placed.

### After the Class
9. **Placement announcement** — Results displayed
10. **Champion drive** — Class winners compete for breed/grand champion (later in the game)

---

## Class Types

### Market Hog
- Pig is evaluated on meat animal merit
- Muscle, leanness, structure, growth
- Your pig's weight and condition must be in the target range (230-280 lbs)

### Breeding Gilt
- Female pig evaluated on reproductive potential
- Structural correctness, femininity, underline quality (teat count/placement)
- Balance, body capacity, maternal characteristics
- Only available with purebred registered females

### Showmanship
- **You** are judged, not the pig
- Control of the pig, awareness of the judge, ring etiquette, grooming, presentation
- Same pig, different competition — tests handler skill independently

---

## Difficulty Progression

### Year 1 — County Fair
- 4-6 competitors per class
- Judges are forgiving
- Other exhibitors make mistakes you can capitalize on
- Showmanship is the winnable class even with an average pig

### Year 2-3 — Competitive County
- 8-12 competitors per class
- Quality of competition increases
- Judges have stronger preferences
- Need both a good pig AND good showing skills

### Year 4+ — Regional/State
- 15-25 competitors per class
- Elite genetics. Everyone's pig is good.
- The difference is preparation and ring craft
- Judge preferences become critical strategic knowledge

---

## Advanced Ring Mechanics (Unlock Over Time)

### Reading the Judge
- After enough shows with the same judge, you learn their patterns
- Visual indicator shows where the judge is looking
- Experienced players position their pig in the judge's field of view at the right moments

### Pig Composure Meter
- Hidden early, revealed in Year 2+
- Shows the pig's stress/calm level
- Influenced by pressure intensity, time in ring, noise, proximity to other pigs
- Composure breaks cause the pig to bolt, stop, or fight the stick

### Stick Finesse
- Early game: basic directional pressure
- Mid game: pressure intensity control (light/medium/firm)
- Late game: rhythmic driving patterns that keep the pig in a flow state
- Mastery: the pig and handler move as one. Zero wasted motion.
