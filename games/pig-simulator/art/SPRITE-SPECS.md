# Sprite Specifications

**Per-breed, per-action frame requirements for the pixel art sprite system.**

---

## Sprite Sheet Organization

### File Naming Convention
```
{breed}_{action}_{direction}.png
```
Examples:
- `yorkshire_walk_right.png`
- `duroc_idle_right.png`
- `hampshire_brace_right.png`

### Directions
Each animation needs at minimum:
- **Right** (primary direction)
- **Left** (horizontal flip of right, with corrections for asymmetric markings)
- **Down** (facing camera — needed for walking toward viewer)
- **Up** (facing away — needed for walking away)

For breeds with asymmetric markings (Spotted), all four directions must be hand-drawn.

### Canvas Size
- **48×48 pixels** per frame
- **Pig centered** in frame with 4-8px padding for movement/breathing expansion
- **Consistent anchor point** at bottom-center (feet position) for frame alignment

---

## Universal Animations (All Breeds)

### 1. Idle (Breathing)
**Frames:** 4-6
**Loop:** Yes (ping-pong)
**Speed:** 4-6 fps (slow, natural breathing)

| Frame | Description |
|-------|-------------|
| 1 | Neutral standing pose. Feet planted. |
| 2 | Slight side expansion (inhale). |
| 3 | Maximum expansion. |
| 4 | Return to neutral (exhale). |
| 5-6 | (Optional) Ear flick or tail twitch variation. |

**Breed Variations:**
- Yorkshire: minimal movement. Steady breather.
- Duroc: deeper breathing. More visible rib expansion.
- Hampshire: head held higher during idle. Alert posture.
- Berkshire: head turns slightly (looking around). Most animated idle.
- Landrace: ear sway added to breathing cycle.
- Spotted: never truly still. Weight shifts between frames.

---

### 2. Walk Cycle
**Frames:** 6-8
**Loop:** Yes
**Speed:** 8-10 fps (matches walking pace)

| Frame | Description |
|-------|-------------|
| 1 | Contact — front left foot strikes ground |
| 2 | Loading — weight transfers to front left |
| 3 | Mid-stride — opposite legs passing |
| 4 | Contact — front right foot strikes ground |
| 5 | Loading — weight transfers to front right |
| 6 | Mid-stride — return to position 1 |
| 7-8 | (Optional) Additional in-between frames for smoother motion |

**Breed Variations:**
- Yorkshire: level topline throughout. Smooth, even cadence.
- Duroc: more vertical motion (bounce). Powerful stride.
- Hampshire: shorter stride, higher head carriage.
- Berkshire: slower cadence, deliberate placement.
- Landrace: body sway (long body creates visible wave). Wider frames needed.
- Poland China: heavy impact. Each step shows weight.
- Spotted: irregular cadence. Slight speed variations between frames.

---

### 3. Trot (Driven Forward)
**Frames:** 6-8
**Loop:** Yes
**Speed:** 10-12 fps (faster than walk)

Same structure as walk but:
- Increased stride length
- More vertical motion
- Diagonal leg pairing (trotting gait)
- Ears and tail more active
- Breathing faster

**Breed Variations:**
- Duroc trot is impressive — powerful, fluid, athletic
- Yorkshire trot is efficient — steady increase in pace
- Hampshire trot shows the muscle — clean, upstanding movement
- Landrace trot is awkward — long body doesn't trot gracefully

---

### 4. Stop / Brace
**Frames:** 3-4
**Loop:** No (holds on final frame)
**Speed:** 12 fps (quick transition)

| Frame | Description |
|-------|-------------|
| 1 | Deceleration — front feet planting |
| 2 | Body catching up — rear feet planting |
| 3 | Brace — all four feet square, back level, head up |
| 4 | (Optional) Settling — slight adjustment |

**Breed Variations:**
- Hampshire: best brace in the game. Ears forward, back flat, legs square. The ideal.
- Yorkshire: clean, reliable brace. Correct but not dramatic.
- Duroc: takes longer to brace (momentum). Frame 1-2 show more deceleration.
- Berkshire: sometimes stops mid-brace and looks around instead of completing.
- Poland China: heavy brace. Ground impact visible. Impressive but slow.

---

### 5. Turn Left / Turn Right
**Frames:** 4
**Loop:** No
**Speed:** 10 fps

| Frame | Description |
|-------|-------------|
| 1 | Front end begins turning (head/shoulder rotate) |
| 2 | Body follows (mid-section angles) |
| 3 | Rear end catches up |
| 4 | Pig now facing new direction (transition to walk/idle) |

**Breed Variations:**
- Duroc: sharp, quick turns. Frames may feel snappier.
- Landrace: wide turns. Body curves through the turn (long body).
- Poland China: slow, wide turns. Needs space.
- Spotted: may add extra frame — unpredictable mid-turn pause.

---

### 6. Spooked / Break
**Frames:** 4-6
**Loop:** No
**Speed:** 12-14 fps (fast, panicked)

| Frame | Description |
|-------|-------------|
| 1 | Startle — body stiffens, ears back |
| 2 | Reaction — body drops (Duroc) OR plants (Hampshire) OR freezes (Berkshire) |
| 3-4 | Movement — bolt forward (Duroc), push backward (Hampshire), or spin (Spotted) |
| 5-6 | Recovery — return toward normal posture |

**This animation is BREED-SPECIFIC.** Each breed's panic response is different and defines its ring challenge:
- **Yorkshire:** Ears back → stiffens → slows down. Mild. Recovers in 2 frames.
- **Duroc:** Ears back → drops low → bolts forward. Fast, hard to recover.
- **Hampshire:** Ears back → plants feet → pushes into stick. Fights, doesn't flee.
- **Berkshire:** Freezes → looks around → may bolt OR plant. 50/50 unpredictable.
- **Landrace:** Ears twitch → body stiffens → relaxes. Barely reacts.
- **Spotted:** Wild card → may bolt, spin, stop, or run into another pig.
- **Poland China:** Turns toward stimulus. Aggressive posture. Doesn't flee.
- **Hereford:** Steps toward handler. Seeks comfort.

---

### 7. Eating
**Frames:** 4-6
**Loop:** Yes
**Speed:** 6 fps

| Frame | Description |
|-------|-------------|
| 1 | Head down to trough/feed |
| 2 | Jaw movement (chewing) |
| 3 | Jaw movement continued |
| 4 | Head slight lift (swallow) |
| 5-6 | Return to eating position |

Used in barn/daily care scenes. Not breed-differentiated (all pigs eat similarly).

---

### 8. Rooting (Nose Down)
**Frames:** 4
**Loop:** Yes (slow)
**Speed:** 4 fps

| Frame | Description |
|-------|-------------|
| 1 | Head drops to ground level |
| 2 | Nose pushes into ground (sawdust displacement) |
| 3 | Head moves laterally (rooting motion) |
| 4 | Return to frame 1 position |

Used when a pig loses focus in the ring. Negative behavior — costs presentation points.

---

### 9. Side-by-Side Comparison Pose
**Frames:** 2
**Loop:** No (static display)
**Speed:** N/A (UI element)

| Frame | Description |
|-------|-------------|
| 1 | Perfect broadside profile — show stance |
| 2 | Same pose with breed-specific annotation markers |

Used for breed education screens, selection UI, and genetics comparison. Every breed gets this in perfect form.

---

## Handler Sprite

### Size: 32×48 pixels
### Animations Needed:

| Animation | Frames | Notes |
|-----------|--------|-------|
| Walk (4 directions) | 6 per direction | Carrying stick |
| Stand (4 directions) | 2 (breathing) | Stick in hand |
| Drive gesture | 3 | Arm extends with stick |
| Tap gesture | 2 | Quick stick tap motion |
| Victory pose | 4 | Ribbon/trophy held up |
| Basic interaction | 3 | Petting/brushing pig |

### Handler Variants
- Boy and girl versions (player choice)
- Age progression across years (subtle height/build changes)
- Show attire vs. daily attire
- Fair-week boots and jeans vs. everyday clothes

---

## Production Priority

### Phase 1 (Minimum Viable Sprite Set)
- [ ] Yorkshire — idle, walk, trot, brace, turn, spooked (right direction only)
- [ ] Handler — walk, stand, drive gesture, tap gesture
- [ ] Show ring environment tiles

### Phase 2 (Starter Breeds)
- [ ] Duroc — all animations, right direction
- [ ] Hampshire — all animations, right direction
- [ ] All three starters — left direction (flip + corrections)
- [ ] All three starters — down and up directions

### Phase 3 (Expanded Breeds)
- [ ] Berkshire, Landrace — all animations
- [ ] Chester White, Poland China — all animations

### Phase 4 (Complete)
- [ ] Spotted — all animations (with procedural spot system)
- [ ] Hereford — all animations
- [ ] Eating, rooting animations for all breeds
- [ ] Comparison pose sprites for all breeds
- [ ] Environment art for all locations
