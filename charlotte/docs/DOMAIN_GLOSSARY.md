# Charlotte Domain Glossary

> The language of purebred livestock production.

**REQUIRED READING FOR ALL AGENTS.**

---

## Swine Terminology

### Animal Classifications

| Term | Definition | Charlotte NODE Category |
|------|------------|------------------------|
| **Sow** | Adult female pig that has farrowed | `SOW` |
| **Gilt** | Young female pig that has not farrowed | `GILT` |
| **Boar** | Intact adult male pig | `BOAR` |
| **Barrow** | Castrated male pig | `BARROW` |
| **Piglet** | Baby pig from birth to weaning | `PIGLET` |
| **Feeder Pig** | Weaned pig being raised for market | `FEEDER` |
| **Show Pig** | Pig being raised for exhibition | `SHOW_PIG` |

### Breeding Terms

| Term | Definition |
|------|------------|
| **Farrowing** | The act of giving birth (pigs "farrow", not "give birth") |
| **Litter** | All piglets born to a sow in one farrowing |
| **Parity** | Number of times a sow has farrowed (Parity 1 = first litter) |
| **Dam** | Mother of an animal |
| **Sire** | Father of an animal |
| **Bred** | Pregnant (a sow is "bred", not "pregnant") |
| **Open** | Not pregnant |
| **Heat** | Estrus; the period when a female is receptive to breeding |
| **Standing Heat** | Peak receptivity; sow will stand for breeding |
| **Wean** | To separate piglets from the sow |
| **Colostrum** | First milk, critical for piglet immunity |

### Production Metrics

| Term | Definition | Charlotte METRIC |
|------|------------|-----------------|
| **ADG** | Average Daily Gain (lbs/day) | `METRIC:adg` |
| **Born Alive** | Piglets born alive in a litter | `METRIC:born_alive` |
| **Stillborn** | Piglets born dead | `METRIC:stillborn` |
| **Mummies** | Piglets that died in utero | `METRIC:mummies` |
| **Weaning Weight** | Weight at weaning | `METRIC:weaning_weight` |
| **Backfat** | Fat thickness at 10th rib (mm) | `METRIC:backfat` |
| **Loin Eye Area** | LEA - muscle size indicator | `METRIC:lea` |
| **Feed Conversion** | Lbs feed per lb gain | `METRIC:feed_conversion` |

### Time Periods

| Term | Duration | Charlotte PROTOCOL |
|------|----------|-------------------|
| **Gestation** | 114 days (3 months, 3 weeks, 3 days) | 114-day protocol |
| **Lactation** | 21-28 days | Post-farrowing protocol |
| **Estrous Cycle** | 21 days | Heat detection protocol |
| **Nursery** | 6-8 weeks post-weaning | Nursery protocol |
| **Finisher** | 8-16 weeks before show/market | Finishing protocol |

---

## Breed Terminology

### Major Swine Breeds (US)

| Breed | Color | Characteristics | Association |
|-------|-------|-----------------|-------------|
| **Hampshire** | Black with white belt | Muscular, lean | NSR |
| **Duroc** | Red | Growth, marbling | NSR |
| **Yorkshire** | White | Maternal, prolific | NSR |
| **Landrace** | White, droopy ears | Maternal, long-bodied | NSR |
| **Berkshire** | Black with white points | Meat quality, marbling | ABA |
| **Chester White** | White | Maternal, docile | CPS |
| **Poland China** | Black with white points | Heavy muscled | CPS |
| **Spotted** | Black and white spotted | Feed efficiency | CPS |
| **Hereford** | Red with white face | Docile, outdoor | CPS |

### Crossbreeding Terms

| Term | Definition |
|------|------------|
| **Purebred** | Animal with both parents of same breed |
| **Crossbred** | Animal with parents of different breeds |
| **F1** | First generation cross |
| **Terminal Cross** | Cross specifically for market pigs |
| **Maternal Line** | Breeds used as mothers (Yorkshire, Landrace) |
| **Paternal Line** | Breeds used as sires (Duroc, Hampshire) |

### Common Crosses

| Cross | Purpose |
|-------|---------|
| **Duroc × Hampshire** | Show pigs, muscle expression |
| **Landrace × Yorkshire** | Commercial maternal line |
| **Hampshire × (LY)** | Terminal market hogs |

---

## Show Terminology

### Show Types

| Term | Definition |
|------|------------|
| **Jackpot Show** | Cash prize competition |
| **County Fair** | Local/county level exhibition |
| **State Fair** | State-level major show |
| **National Show** | Breed association nationals |
| **Preview Show** | Early-season practice show |
| **Futurity** | Show for animals enrolled as piglets |

### Show Classes

| Term | Definition |
|------|------------|
| **Market Class** | Judged on meat quality characteristics |
| **Breeding Class** | Judged on breeding potential |
| **Showmanship** | Judged on exhibitor's presentation skills |
| **Weight Class** | Division by weight range |
| **Breed Class** | Division by breed |

### Show Metrics

| Term | Definition | Target Range |
|------|------------|--------------|
| **Show Weight** | Weight at show | 230-280 lbs (market) |
| **Condition** | Fat/muscle balance | "Right", not over/under |
| **Structure** | Skeletal correctness | Sound, level |
| **Muscle** | Visual muscling | Heavy, defined |
| **Balance** | Overall proportions | Harmonious |

---

## Registry Terminology

### Herdmark

A **herdmark** is a unique 2-4 letter code identifying a breeding operation:

```
HH  = Heimer Hampshires
TFS = 24/7 Showpigs
AG  = Armstrong Genetics
```

Herdmarks appear in:
- Pedigree documentation
- Registration papers
- Ear notches/tattoos

### Registration

| Term | Definition |
|------|------------|
| **Papers** | Registration certificate |
| **Transfer** | Change of ownership on registry |
| **Litter Registration** | Registering a new litter |
| **Individual Registration** | Registering a single animal |
| **Ear Notch** | Identification system using notches in ears |
| **Tattoo** | Permanent ID in ear |

### Associations

| Abbrev | Full Name | Breeds |
|--------|-----------|--------|
| **NSR** | National Swine Registry | Yorkshire, Duroc, Hampshire, Landrace |
| **ABA** | American Berkshire Association | Berkshire |
| **CPS** | Certified Pedigree Swine | Chester, Poland, Spot, Hereford |

---

## Facility Terminology

| Term | Definition |
|------|------------|
| **Farrowing Crate** | Enclosure for sow during farrowing/lactation |
| **Gestation Barn** | Housing for bred sows |
| **Nursery** | Housing for weaned piglets |
| **Finisher** | Housing for market-weight pigs |
| **Boar Stud** | Housing for breeding boars |
| **Isolation** | Quarantine area for new/sick animals |
| **Load Out** | Area for loading animals for transport |

---

## Calendar Terminology

### Key Dates

| Event | Timing | Charlotte EDGE Type |
|-------|--------|---------------------|
| **Breeding Date** | Day sow is bred | `BRED_ON` |
| **Due Date** | Expected farrowing (bred + 114) | `DUE_ON` |
| **Farrow Date** | Actual farrowing | `FARROWED_ON` |
| **Wean Date** | Piglets separated | `WEANED_ON` |
| **Show Date** | Competition date | `SHOWS_ON` |
| **Sale Date** | Animal sold | `SOLD_ON` |

### Seasonal Patterns

| Season | Activity |
|--------|----------|
| **Fall** | Major breeding season (farrow in late winter) |
| **Winter** | Farrowing season, state livestock shows |
| **Spring** | Major show season begins, spring farrowing |
| **Summer** | State fairs, major nationals |

---

## Economic Terminology

### Costs

| Term | Definition |
|------|------------|
| **Feed Cost** | Cost of feed per pig/day |
| **Veterinary** | Health costs |
| **Facilities** | Housing/equipment costs |
| **Entry Fees** | Show entry costs |
| **Hauling** | Transport costs |

### Revenue

| Term | Definition |
|------|------------|
| **Private Treaty** | Direct sale between buyer/seller |
| **Auction** | Competitive bidding sale |
| **Jackpot Winnings** | Prize money from shows |
| **Premium** | Quality premium over base price |
| **Cull** | Selling animal below market value |

### The "Porkulator" Metrics

| Input | Output |
|-------|--------|
| Current weight | Required ADG |
| Target weight | Days to target |
| Days to show | Feed needed |
| Feed price | Total feed cost |
| Expected price | Profit/loss projection |

---

## Charlotte-Specific Terms

### From Charlotte's Web

| Term | Meaning in Charlotte |
|------|---------------------|
| **Charlotte** | The AI orchestrator (the spider) |
| **Wilbur** | The chat agent (the pig Charlotte saved) |
| **Sounder** | The development team (a group of pigs) |

### Substrate Terms

| Term | Definition |
|------|------------|
| **FACT** | Any document in the substrate |
| **Signal** | An observation/measurement |
| **Protocol** | A scheduled plan with checkpoints |
| **Node** | An entity being observed |
| **Edge** | A relationship between nodes |
| **Metric** | A dimension that can be measured |

---

## Common Abbreviations

| Abbrev | Meaning |
|--------|---------|
| ADG | Average Daily Gain |
| AI | Artificial Insemination |
| BW | Birth Weight |
| D | Duroc |
| H | Hampshire |
| L | Landrace |
| LEA | Loin Eye Area |
| NSR | National Swine Registry |
| WW | Weaning Weight |
| Y | Yorkshire |

---

*This glossary maintained by CHARLOTTE. Last updated: 2026-01-30*
