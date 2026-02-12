# Pig Simulator

**A pixel art show pig simulator where generational knowledge matters more than money.**

---

## The Pitch

You're a kid — 10, maybe 14. Your grandpa was a legend in the show pig world. His herdmark meant something. People drove hours to buy his genetics. Your parents kept the operation alive, but the magic — that eye, that feel for livestock — skipped a generation. Or maybe it didn't. Maybe it just needs the right pig.

This is a game about the relationship between a kid and an animal. About learning to read a pig's body language. About understanding that the 250-pound animal at the end of your driving stick has its own personality, its own intelligence, its own will — and your job isn't to control it. It's to present it. To make it look like the best version of itself.

## Why This Game

The show pig world is one of the last places in America where 12-year-olds learn real things: genetics, nutrition, animal behavior, competition, failure, generational responsibility. A kid showing pigs at the county fair is doing applied biology, behavioral psychology, and physical performance — all before they can drive.

No game has ever taken this seriously. Farm sims treat animals as production units. This game treats them as individuals with genetics, temperament, and potential — just like real breeders do.

## The World

A rural county somewhere in the Midwest. The county fair is the Super Bowl. Breeding lines are legacies passed through generations. The feed store is where you get quests and gossip. Judges are legends with known preferences. The auction ring is where reputations are made or broken.

## Core Loop

1. **Raise** — Daily care, feeding, conditioning, health management
2. **Train** — Walk your pig, teach it to respond to the stick, build composure
3. **Show** — The ring. Top-down view. You drive, the pig decides. The judge watches everything.
4. **Breed** — Choose pairings. Chase genetics. Build a line. Earn your herdmark.

## What Makes It Different

- **The pig has AI.** It's not an avatar you control. It's an animal you guide. Each breed behaves differently. Each individual has traits inherited from its parents.
- **Genetics are real.** The breeding system is built on simplified EPDs (Expected Progeny Differences) from actual swine science. Trait inheritance has variance. There are no guaranteed outcomes.
- **Time is the currency.** You can't buy your way to a champion. You need seasons. You need patience. You need to learn.
- **The story is generational.** You're not building from nothing — you're inheriting something, and the question is whether you can honor it.

## Technical Foundation

This project's domain knowledge is grounded in:
- **Sounder** — 382K+ LISP facts modeling biological lifecycle intelligence, breeder registries (NSR, ABA, CPS), herdmarks, and the genetics graph
- **Livestock Science** — 80+ curated resources across genetics, reproduction, nutrition, show industry, herd management, and veterinary science
- **Charlotte** — The substrate architecture (Node, Metric, Signal, Edge, Protocol) that models all domain relationships

## Status

**Phase: Game Design Bible** — Story, mechanics, art direction, and animation specs. No code yet. The foundation has to be right before a single sprite is drawn.

## Structure

```
story/       — World, protagonist, characters, story arc
breeds/      — Per-breed game design docs grounded in real data
mechanics/   — Showring, breeding, raising, seasons, progression
art/         — Style guide, sprite specs, animation checklist
reference/   — Links back to sounder, livestock-science, charlotte
```
