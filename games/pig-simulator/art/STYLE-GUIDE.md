# Style Guide

**Pixel art direction for a game about 250-pound animals with individual personalities.**

---

## Core Aesthetic

### Feeling
- **Warm, grounded, quiet.** Not cute. Not gritty. Honest.
- Think: early morning light in a hog barn. Sawdust, steel gates, rubber boots.
- The world should feel lived-in — equipment has wear, barns have character, fences have been repaired.
- Stardew Valley's warmth, but with more specificity. These aren't generic farm animals — they're individual pigs with breed-specific detail.

### Not This
- Not cartoon/chibi. Pigs should read as real animals, not mascots.
- Not dark/gritty. The world is hard but good.
- Not minimalist. The domain demands detail — breed silhouettes must be distinguishable.
- Not hyper-detailed. Pixel art should suggest, not render.

---

## Technical Specs

### Base Sprite Size
**48×48 pixels** for animal sprites. This gives enough resolution to:
- Distinguish breed silhouettes (erect vs. drooping ears, body length, muscle mass)
- Show basic animation detail (ear flick, side breathing, muscle movement)
- Maintain readability at the game's camera distance

**32×32 pixels** for human sprites (handler, judge, NPCs).

**16×16 pixels** for small items (driving stick, feed bucket, ribbon, etc.).

### Scale
- 1 pixel ≈ 2 inches at pig scale
- A 250-lb market hog is roughly 48×28 pixels (body area)
- A human handler is roughly 32×48 pixels (standing)
- The pig should feel *large* relative to the handler — this is important. These are big animals.

### Resolution
- Game renders at a native low resolution (target: 480×270 or 640×360)
- Scales up with nearest-neighbor filtering (crisp pixels, no smoothing)
- UI elements can render at higher resolution for readability

---

## Color Palette

### Palette Size: 24 colors

A constrained palette forces consistency and breeds cohesion across all art.

### Color Groups

**Pig Colors (8):**
| Color | Hex | Use |
|-------|-----|-----|
| White | `#F5ECD7` | Yorkshire, Landrace, Chester White body |
| Pink | `#E8B4B8` | Pig skin (nose, ears, underbelly on light breeds) |
| Light Red | `#D4764E` | Duroc light variant, Hereford body |
| Dark Red | `#A0452A` | Duroc dark variant |
| Mahogany | `#6B2D1A` | Duroc darkest, Hereford shadow |
| Black | `#2A2A2E` | Hampshire, Berkshire, Poland China, Spotted body |
| Dark Gray | `#4A4A50` | Black pig shading/highlight |
| Spot White | `#E8E0C8` | Spotted breed white patches, Hereford face/legs |

**Environment (8):**
| Color | Hex | Use |
|-------|-----|-----|
| Sawdust Light | `#D4B896` | Show ring floor, barn floor |
| Sawdust Dark | `#B09070` | Shadow, depth on floors |
| Barn Red | `#8B3A3A` | Barn walls, traditional structures |
| Steel Gray | `#7A7A80` | Gates, fencing, equipment |
| Grass Green | `#5B8C4A` | Outdoor areas, fairground |
| Grass Dark | `#3A6830` | Grass shadow |
| Sky Blue | `#87AECF` | Sky, outdoor backgrounds |
| Wood Brown | `#6B5240` | Fences, posts, wooden structures |

**UI & Accent (8):**
| Color | Hex | Use |
|-------|-----|-----|
| Cream | `#FFF8E8` | Text backgrounds, UI panels |
| Warm White | `#F0E8D8` | General background |
| Ribbon Blue | `#4A7AB5` | First place ribbon, UI accent |
| Ribbon Red | `#C44040` | Second place ribbon, alerts |
| Ribbon Gold | `#D4A840` | Grand Champion, special UI |
| Text Dark | `#2A2420` | Primary text |
| Text Light | `#8A7A6A` | Secondary text, labels |
| Highlight | `#E8C870` | Selection, interaction prompts |

---

## Breed Visual Identity

Each breed must be visually distinct at 48×48. The key differentiators:

| Breed | Primary Visual Key | Secondary Key |
|-------|--------------------|---------------|
| **Yorkshire** | White + erect ears + long body | Pink skin showing on nose/ears |
| **Duroc** | Red + drooping ears + deep body | Muscle visible through color shading |
| **Hampshire** | Black + white belt + erect ears | High-contrast pattern, athletic build |
| **Berkshire** | Black + white points (6) + compact | Dished face, smaller frame |
| **Landrace** | White + large drooping ears + very long | Ears extending past snout |
| **Chester White** | White + medium drooping ears + sturdy | Thicker bone than Yorkshire/Landrace |
| **Poland China** | Black + white points + LARGE frame | Visibly bigger than Berkshire |
| **Spotted** | Black/white random spots + large | Procedural spot pattern, unique per pig |
| **Hereford** | Red + white face/belly/legs | Cattle-like color pattern |

### The 10-Pixel Test
At any point during development, check: **can you identify the breed when the sprite is 10 pixels tall?** If not, the silhouette isn't distinct enough. Ears, body proportions, and color pattern must carry the breed identity at minimum scale.

---

## Animation Principles

### Weight
Pigs are heavy. 250 pounds of muscle and bone. Every animation should communicate mass:
- **Walk cycles** have impact. Each foot-plant should feel grounded.
- **Stops** have momentum. The pig doesn't just freeze — it decelerates.
- **Turns** have inertia. The front end starts, the rear follows.
- **No bouncing.** Pigs don't bounce. They lumber, stride, trot.

### Personality Through Animation
Breed personality should be visible in how the pig moves:
- Yorkshire walks steady and level. Reliable.
- Duroc moves with forward energy. Athletic.
- Hampshire holds its head up. Proud.
- Berkshire looks around. Curious.
- Landrace sways. Slow.
- Spotted bounces. Unpredictable.

### Secondary Motion
Ears, tails, and breathing are secondary animations that add life:
- **Ears:** Each breed has different ear types (erect, drooping, medium). Ears react to sounds, stress, handler position.
- **Tail:** Small curl. Twitches when content. Straightens when stressed.
- **Breathing:** Visible side expansion. Rate increases with exertion or stress.

---

## Environment Art

### The Barn
- Dirt/concrete floor with bedding
- Steel gate panels, wooden posts
- Overhead lighting (warm tone)
- Feed troughs, waterers, heat lamps
- Feels lived-in, functional, not decorative

### The Show Ring
- Oval or rectangular arena, 200×150 pixel playable area
- Sawdust floor (textured, not flat)
- Metal panel fencing around perimeter
- Bleachers on one or two sides (background detail)
- Judge visible as a distinct NPC
- Other exhibitors and pigs in the ring

### The Fairgrounds
- Multiple buildings (show barn, arena, auction pavilion)
- Grass paths between buildings
- Grandstand, midway in background
- Signage, banners, flags for atmosphere
- Should feel festive but grounded

### Morrison's Feed Store
- Interior shop with shelves, products
- Corkboard with flyers
- Counter with Dale Morrison behind it
- Outside: parking lot, loading dock, stacked feed bags

---

## UI Design

### HUD (During Ring)
- Minimal. Don't cover the action.
- Composure meter (small, positioned at screen edge)
- Judge attention indicator (subtle, directional)
- Time/lap indicator
- Pig name and class info (top of screen, small)

### Menus
- Warm, paper-textured backgrounds
- Clean typography (pixel font, readable)
- Stats displayed as visual bars, not spreadsheets
- Pedigree shown as family tree diagram
- Breeding interface: side-by-side comparison of sire and dam

---

## Inspiration & References

- **Stardew Valley** — Warmth, palette discipline, character through simple sprites
- **Harvest Moon (SNES/GBA)** — Animal sprites with personality, farm atmosphere
- **Undertale** — Character expression through minimal animation frames
- **Eastward** — Environmental detail, lighting, lived-in world feel
- **Real showpig photography** — For proportions, breed distinction, ring atmosphere
