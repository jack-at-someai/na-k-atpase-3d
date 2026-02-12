# Animation Master Checklist

**Every animation needed, organized by priority. Build iteratively — Phase 1 first, then expand.**

---

## Phase 1 — Proof of Concept
*Goal: One breed walks and idles in a ring. Validate the feel.*

### Yorkshire (48×48)
- [ ] `yorkshire_idle_right` — 4 frames, breathing cycle
- [ ] `yorkshire_walk_right` — 6 frames, walk cycle
- [ ] `yorkshire_brace_right` — 3 frames, stop to brace

### Handler (32×48)
- [ ] `handler_walk_right` — 6 frames, carrying stick
- [ ] `handler_stand_right` — 2 frames, idle with stick
- [ ] `handler_tap_right` — 2 frames, stick tap gesture

### Environment
- [ ] Show ring floor tile (sawdust texture) — 16×16, tileable
- [ ] Show ring fence segment — 16×48
- [ ] Basic background fill — solid color or gradient

**Total Phase 1: ~23 frames + tiles**

---

## Phase 2 — Starter Breeds Complete
*Goal: All three starter breeds playable. Full directional movement.*

### Yorkshire (Complete Directions)
- [ ] `yorkshire_idle_left` — 4 frames
- [ ] `yorkshire_idle_down` — 4 frames
- [ ] `yorkshire_idle_up` — 4 frames
- [ ] `yorkshire_walk_left` — 6 frames
- [ ] `yorkshire_walk_down` — 6 frames
- [ ] `yorkshire_walk_up` — 6 frames
- [ ] `yorkshire_trot_right` — 6 frames
- [ ] `yorkshire_trot_left` — 6 frames
- [ ] `yorkshire_brace_left` — 3 frames
- [ ] `yorkshire_turn_right` — 4 frames
- [ ] `yorkshire_turn_left` — 4 frames
- [ ] `yorkshire_spooked` — 4 frames

### Duroc (All Animations)
- [ ] `duroc_idle_right` — 4 frames
- [ ] `duroc_idle_left` — 4 frames
- [ ] `duroc_idle_down` — 4 frames
- [ ] `duroc_idle_up` — 4 frames
- [ ] `duroc_walk_right` — 8 frames (more bounce, needs extra frames)
- [ ] `duroc_walk_left` — 8 frames
- [ ] `duroc_walk_down` — 8 frames
- [ ] `duroc_walk_up` — 8 frames
- [ ] `duroc_trot_right` — 8 frames
- [ ] `duroc_trot_left` — 8 frames
- [ ] `duroc_brace_right` — 4 frames (slower to brace)
- [ ] `duroc_brace_left` — 4 frames
- [ ] `duroc_turn_right` — 4 frames
- [ ] `duroc_turn_left` — 4 frames
- [ ] `duroc_spooked` — 6 frames (bolt animation — more complex)

### Hampshire (All Animations)
- [ ] `hampshire_idle_right` — 4 frames (head higher than other breeds)
- [ ] `hampshire_idle_left` — 4 frames
- [ ] `hampshire_idle_down` — 4 frames
- [ ] `hampshire_idle_up` — 4 frames
- [ ] `hampshire_walk_right` — 6 frames
- [ ] `hampshire_walk_left` — 6 frames
- [ ] `hampshire_walk_down` — 6 frames
- [ ] `hampshire_walk_up` — 6 frames
- [ ] `hampshire_trot_right` — 6 frames
- [ ] `hampshire_trot_left` — 6 frames
- [ ] `hampshire_brace_right` — 3 frames (best brace — snappy)
- [ ] `hampshire_brace_left` — 3 frames
- [ ] `hampshire_turn_right` — 4 frames
- [ ] `hampshire_turn_left` — 4 frames
- [ ] `hampshire_spooked` — 5 frames (plant + push animation)

### Handler (Complete)
- [ ] `handler_walk_left` — 6 frames
- [ ] `handler_walk_down` — 6 frames
- [ ] `handler_walk_up` — 6 frames
- [ ] `handler_stand_left` — 2 frames
- [ ] `handler_stand_down` — 2 frames
- [ ] `handler_stand_up` — 2 frames
- [ ] `handler_tap_left` — 2 frames
- [ ] `handler_drive_right` — 3 frames (extended pressure)
- [ ] `handler_drive_left` — 3 frames

### Environment (Ring)
- [ ] Show ring sawdust — 3 tile variants
- [ ] Show ring fence — straight, corner, gate segments
- [ ] Judge sprite — idle, walking, evaluating (8 frames total)
- [ ] Bleacher background tile
- [ ] Ring entry gate

**Total Phase 2: ~250 frames + tiles**

---

## Phase 3 — Unlockable Breeds
*Goal: Berkshire, Landrace, Chester White, Poland China playable.*

### Berkshire (All Animations)
- [ ] Idle (4 directions × 6 frames — extra frames for head turn) — 24 frames
- [ ] Walk (4 directions × 6 frames) — 24 frames
- [ ] Trot (4 directions × 6 frames) — 24 frames
- [ ] Brace (2 directions × 3 frames) — 6 frames
- [ ] Turn (2 directions × 4 frames) — 8 frames
- [ ] Spooked (1 direction × 6 frames — freeze variant) — 6 frames

### Landrace (All Animations)
- [ ] Idle (4 directions × 5 frames — ear sway) — 20 frames
- [ ] Walk (4 directions × 8 frames — long body sway needs extra) — 32 frames
- [ ] Trot (4 directions × 8 frames) — 32 frames
- [ ] Brace (2 directions × 3 frames) — 6 frames
- [ ] Turn (2 directions × 5 frames — wide turn) — 10 frames
- [ ] Spooked (1 direction × 3 frames — minimal reaction) — 3 frames

### Chester White (All Animations)
- [ ] Idle (4 directions × 4 frames) — 16 frames
- [ ] Walk (4 directions × 6 frames) — 24 frames
- [ ] Trot (4 directions × 6 frames) — 24 frames
- [ ] Brace (2 directions × 3 frames) — 6 frames
- [ ] Turn (2 directions × 4 frames) — 8 frames
- [ ] Spooked (1 direction × 3 frames — quick recovery) — 3 frames

### Poland China (All Animations)
- [ ] Idle (4 directions × 4 frames) — 16 frames
- [ ] Walk (4 directions × 8 frames — heavy steps) — 32 frames
- [ ] Trot (4 directions × 8 frames) — 32 frames
- [ ] Brace (2 directions × 4 frames — heavy landing) — 8 frames
- [ ] Turn (2 directions × 5 frames — wide, slow) — 10 frames
- [ ] Spooked (1 direction × 4 frames — turn toward stimulus) — 4 frames

**Total Phase 3: ~384 frames**

---

## Phase 4 — Complete Set
*Goal: All breeds, all animations, all environments.*

### Spotted (All Animations)
- [ ] All standard animations (same frame counts as Poland China)
- [ ] **Special:** Procedural spot system — base sprite + spot overlay layer
- [ ] Each individual Spotted pig needs unique spot pattern generation
- [ ] 4 directional spot maps per individual

### Hereford (All Animations)
- [ ] All standard animations (similar frame counts to Berkshire)
- [ ] **Special:** Handler-seeking behavior in spooked animation (unique)
- [ ] Color pattern: red body with white face/legs/belly — must read at 48px

### Universal Supplementary Animations (All 9 Breeds)
- [ ] Eating — 5 frames per breed × 9 breeds = 45 frames
- [ ] Rooting — 4 frames per breed × 9 breeds = 36 frames
- [ ] Comparison pose — 2 frames per breed × 9 breeds = 18 frames

### Environment Art (All Locations)
- [ ] Barn interior — pen walls, bedding, feeders, waterers, heat lamps
- [ ] Wash rack — spray nozzle, drain, wet floor texture
- [ ] Fairgrounds — buildings, paths, signage, crowd (background)
- [ ] Morrison's Feed Store — interior shelves, counter, corkboard
- [ ] Vet clinic — exam room, medication shelf
- [ ] Auction ring — elevated seating, auctioneer stand, sale ring
- [ ] Farm exterior — barn, fences, fields, equipment

### UI Sprites
- [ ] Ribbon icons (blue, red, white, purple/champion, gold/grand champion)
- [ ] Feed bag icons (6 feed types)
- [ ] Equipment icons (stick, brush, scale, clippers, show box)
- [ ] Status icons (health, composure, hunger, training level)
- [ ] Pedigree chart elements (lines, boxes, breed color indicators)
- [ ] EPD display bars and indicators

### NPC Sprites
- [ ] Earl (grandpa) — seated, standing, pointing
- [ ] Parent — walking, working, talking
- [ ] Dale Morrison — behind counter, outside store
- [ ] Dr. Chen — examining, talking, treating
- [ ] Colton Hollister — in ring, talking
- [ ] Sierra Dawson — in ring, studying clipboard
- [ ] Tyler McAllister — in ring, confused
- [ ] Judges (4) — walking, evaluating, announcing
- [ ] Auctioneer — at podium
- [ ] Generic fair attendees (crowd) — 4-6 variants

**Total Phase 4: ~500+ frames + environment tiles + UI elements**

---

## Grand Total Estimate

| Phase | Frames | Priority |
|-------|--------|----------|
| Phase 1 | ~23 | **NOW** |
| Phase 2 | ~250 | Next |
| Phase 3 | ~384 | After core gameplay validated |
| Phase 4 | ~500+ | Ongoing expansion |
| **Total** | **~1,157+** | |

---

## Production Notes

### Tools
- **Aseprite** (already in `/c/dev/games/aseprite/`) — primary sprite editor
- Export as PNG sprite sheets with JSON frame data
- Use Aseprite's layer system for:
  - Base body (Layer 1)
  - Color/pattern overlay (Layer 2 — for breed variants)
  - Ear animation (Layer 3 — secondary motion)
  - Tail animation (Layer 4 — secondary motion)

### Workflow
1. Block out silhouette in single color (verify breed reads at distance)
2. Add base colors per palette
3. Animate walk cycle first (establishes character)
4. Add idle, then brace, then turns
5. Spooked animation last (most complex, breed-specific)
6. Review at 2× and 0.5× zoom for readability

### Quality Checks
- [ ] Breed identifiable at 10-pixel height?
- [ ] Walk cycle loops cleanly with no pop?
- [ ] Weight feels appropriate (250-lb animal, not a bouncing cartoon)?
- [ ] Ear type and position correct for breed?
- [ ] Color palette consistent with style guide?
