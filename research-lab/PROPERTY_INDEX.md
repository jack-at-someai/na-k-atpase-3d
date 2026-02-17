# Research Lab Property Curation Index
## SomeAI / SumAI Research Campus — Site Selection

**Compiled:** 2026-02-16
**Objective:** Identify and rank candidate properties (20-200+ acres) across two target regions for one or more research lab campus locations.

---

## Two-Region Strategy

The research lab may deploy as a single campus or distributed across multiple locations. Both regions serve different strategic purposes:

| Region | Strategic Role | Target Size | Budget Range |
|--------|---------------|-------------|-------------|
| **Florida** | Primary campus — year-round operations, PE-facing, client proximity (ISG) | 50-200 acres | $500K-$3M |
| **Paris, IL area** | Secondary campus — Midwest hub, agricultural research (Sounder), lower cost | 50-200 acres | $300K-$1.5M |

---

## Data Files

| File | Region | Listings | Coverage |
|------|--------|----------|----------|
| [`FLORIDA_LAND_SEARCH.md`](FLORIDA_LAND_SEARCH.md) | Florida | 105 properties | 20 counties, panhandle to south-central |
| [`ILLINOIS_LAND_SEARCH.md`](ILLINOIS_LAND_SEARCH.md) | Illinois/Indiana | 45 properties + 17 auction results | 7 IL counties + 2 IN counties |
| `artifacts/FLORIDA_LAND_LISTINGS.md` | Central FL | 56 properties ranked by $/acre | Polk, Highlands, Hardee, Osceola, Pasco, Hernando, DeSoto |
| `artifacts/LAND_SEARCH_PARIS_IL.md` | IL/IN | 51 properties + county avg data | 11 counties, broker contacts |

---

## Campus Requirements (Feature Engineering Inputs)

The heuristic will score each property across these dimensions:

### Hard Requirements (Pass/Fail)

| Requirement | Threshold | Rationale |
|-------------|-----------|-----------|
| **Acreage** | >= 20 acres (50+ preferred) | Hexagonal campus vision: server center + 6 research divisions |
| **Road access** | Paved road frontage or < 1 mile to paved road | Equipment delivery, daily commute, client visits |
| **Zoning** | Agricultural, mixed-use, or research-compatible | Must allow buildings, offices, server infrastructure |
| **Price** | Under $15,000/acre (under $8,000 ideal) | Capital preservation — land is infrastructure, not speculation |

### Scored Features (Weighted)

| Feature | Weight | Scoring | Data Available |
|---------|--------|---------|----------------|
| **Price per acre** | 25% | Lower is better. $2K=10, $8K=7, $15K=4, $25K+=1 | All listings |
| **Acreage** | 15% | More is better. 200+=10, 100-200=8, 50-100=6, 20-50=4 | All listings |
| **Metro proximity** | 20% | Closer is better. <1hr=10, 1-1.5hr=7, 1.5-2hr=4, 2hr+=2 | County-level |
| **Infrastructure** | 15% | Existing buildings/wells/power/rail = higher score | Per listing |
| **Mixed-use character** | 10% | Tillable + wooded + buildable = ideal for campus | Per listing |
| **Water features** | 5% | Ponds, creeks, springs add value for campus aesthetics | Per listing |
| **Expansion potential** | 5% | Adjacent parcels available, low-density surroundings | Per listing |
| **Income potential** | 5% | Tillable acres, CRP payments, existing operations offset carrying costs | Per listing |

---

## Florida — Top 15 Candidates

Ranked by combined heuristic score (price, acreage, metro access, infrastructure):

| Rank | Property | County | Acres | Price | $/Acre | Metro | Score |
|------|----------|--------|-------|-------|--------|-------|-------|
| 1 | **Hardee 245 Ac Ranchland** | Hardee | 245 | Contact | est ~$7,500 | 60 min Tampa | Huge acreage, road frontage on 3 roads, 2 wells, irrigation |
| 2 | **Hardee 100 Ac Bahia** | Hardee | 100 | Contact | est ~$7,500 | 60 min Tampa | Flowing creek, 65-75% improved grass, paved frontage |
| 3 | **Highlands 109.65 Ac Ranch** | Highlands | 109.65 | $1,414,485 | $12,901 | 80 min both | Oak/pine/pasture, 1300ft paved, fenced, 2 ponds, divisible |
| 4 | **Highlands Denco Ranch** | Highlands | 495 | $5,000,000 | $10,089 | 80 min both | Working cattle ranch, SR 70, pole barn, diesel well |
| 5 | **Citrus 131 Ac Ranch** | Citrus | 131 | $1,200,000 | $9,160 | 70 min Tampa | Pasture, oaks, Withlacoochee River proximity |
| 6 | **Hardee County Line Grove** | Hardee | 222.80 | $2,825,000 | $12,680 | 60 min Tampa | Active citrus with diesel wells — infrastructure in place |
| 7 | **Hernando 275 Ac** | Hernando | 275 | $4,242,000 | $15,425 | 50 min Tampa | 1000ft Hwy 301 frontage, internal lakes, wooded |
| 8 | **Polk Lake Lizzie Pasture** | Polk | 241 | $1,650,000 | $6,847 | 40 min both | Upland pastures, lake frontage, SE Bartow |
| 9 | **Hendry 200 Ac Citrus** | Hendry | 200 | $900,000 | $4,500 | 110 min Tampa | Active grove — cheapest 200-ac FL listing. Seller financing |
| 10 | **Madison 216 Ac** | Madison | 216 | $540,000 | $2,500 | 60 min Tally | Best price in FL. Total seclusion. Far from Orlando/Tampa |
| 11 | **Hardee 80 Ac Fenced** | Hardee | 80 | Contact | est ~$7,500 | 60 min Tampa | Fully fenced, rolling pastures, oak hammocks |
| 12 | **Polk Rockridge Ranch** | Polk | 150 | $3,200,000 | $21,333 | 45 min both | Home + infrastructure. Best dual-metro access |
| 13 | **Indian River 80 Ac** | Indian River | 80 | $1,000,000 | $12,500 | 90 min Orlando | Ag-2 zoning, flexible 20/40/80 parcels |
| 14 | **Pasco Hidden Lake** | Pasco | 589 | $1,680,000 | $2,851 | 25 min Tampa | Massive acreage, cheap. West Pasco recreation |
| 15 | **Highlands Wilburn Grove** | Highlands | 751 | $6,533,700 | $8,698 | 80 min both | Income-producing citrus. Huge. Well-drained ridge |

**Best value zone:** The Hardee-DeSoto-Highlands triangle at $7,500-$13,000/acre, all within 60-90 min of Tampa, with the original Serengeti Oasis target (Polk County) offering the best dual-metro access at $6,800-$15,000/acre for rural parcels.

---

## Illinois/Indiana — Top 15 Candidates

| Rank | Property | County | Acres | Price | $/Acre | Paris Distance | Score |
|------|----------|--------|-------|-------|--------|----------------|-------|
| 1 | **Crawford 276 Ac Whitetails** | Crawford, IL | 276 | $750,000 | $2,717 | 40 min | Wabash River, massive, price reduced. Best value in region |
| 2 | **Vigo Darwin Ferry 159 Ac** | Vigo, IN | 159 | $557,550 | $3,506 | 30 min | Wildlife-rich, cheapest large parcel near Paris |
| 3 | **Clark Hunt Farm 135.8 Ac** | Clark, IL | 135.8 | $549,000 | $4,044 | 25 min | River frontage, hunting cabin. Closest cheap large parcel |
| 4 | **Vigo 153.84 Ac Railroad** | Vigo, IN | 153.84 | $723,800 | $4,709 | 30 min | 91 tillable + 63 wooded + rail frontage. Unique infra |
| 5 | **Cumberland 245 Ac** | Cumberland, IL | 245 | $1,100,000 | $4,490 | 30 min | 151 crop + 24 CRP. Largest IL listing. Income-producing |
| 6 | **Cumberland 149.5 Ac** | Cumberland, IL | 149.5 | $986,700 | $6,601 | 30 min | Hurricane Creek, tillable + CRP + hunting. Mixed use ideal |
| 7 | **Cumberland 141 Ac** | Cumberland, IL | 141 | $675,000 | $4,787 | 30 min | Row crop farm, solid fundamentals |
| 8 | **Edgar 177 Ac Grandview** | Edgar, IL | 177 | $1,135,000 | $6,413 | 5 min | IN Edgar County. 4 tracts, productive tillable |
| 9 | **Sullivan Lost Acres 164 Ac** | Sullivan, IN | 164 | $1,040,000 | $6,341 | 45 min | Trophy property, hunting + investment |
| 10 | **Vigo Trinity Tillable 196.5 Ac** | Vigo, IN | 196.5 | $1,414,800 | $7,201 | 30 min | Largest single parcel. Irrigated, ponds |
| 11 | **Vermilion 266.31 Ac** | Vermilion, IL | 266.31 | $2,000,000 | $7,508 | 50 min | Huge 4-tract, open tenancy 2025 |
| 12 | **Edgar Gillespy Farm 229.87 Ac** | Edgar, IL | 229.87 | TBD | est ~$14K | 5 min | 4 tracts, grain bins, exceptional yields. Near Paris |
| 13 | **Edgar 158.2 Ac Chrisman** | Edgar, IL | 158.2 | $1,226,050 | $7,747 | 15 min | 146 tillable, solid PI. In Edgar County |
| 14 | **Vermilion 160 Ac Potomac** | Vermilion, IL | 160 | $1,296,000 | $8,100 | 50 min | 149 production acres, good PI |
| 15 | **Cumberland 85 Ac Toledo** | Cumberland, IL | 85 | $467,500 | $5,500 | 30 min | 100% tillable, lowest entry price for quality farm |

**Best value zone:** Vigo County, IN ($3,500-$7,200/acre, 30 min from Paris) and Clark/Crawford counties, IL ($2,700-$7,700/acre). Cumberland County offers the best balance of proximity, affordability, and large-parcel availability.

---

## Market Benchmarks

### Florida (2024-2025 closed sales)

| Land Type | Avg $/Acre | Source |
|-----------|-----------|--------|
| All farmland (statewide) | $10,404 | Saunders 2024 |
| Interior cropland (Hardee/DeSoto/Highlands) | $4,500-$6,000 | Saunders 2024 |
| Ranch & recreation (50-500 ac) | $8,998 | Saunders 2024 (-4.7% YoY) |
| Citrus land | $13,700 | Saunders 2024 (+47% YoY) |
| Timberland | $2,867 | Saunders 2023 |

### Illinois/Indiana (2024-2025 auction results)

| County | Avg $/Acre | High Sale | Cheapest Listed |
|--------|-----------|-----------|-----------------|
| Edgar, IL | $14,179 | $17,412 | $3,500 (undeveloped) |
| Clark, IL | $7,734 | $10,170 | $4,044 (135.8 ac) |
| Cumberland, IL | $10,503 | $15,030 | $4,490 (245 ac) |
| Crawford, IL | $9,076 | — | $2,717 (276 ac) |
| Vigo, IN | $7,588 | $10,638 | $3,506 (159 ac) |

---

## Next Steps

1. **McKinsey market study** — When the email arrives, add macroeconomic context layer to property evaluation
2. **Feature engineering heuristic** — Build scoring model using the weighted features above, run against all ~250 listings
3. **Site visits** — Shortlist top 5 per region for physical inspection
4. **Zoning research** — Verify research/mixed-use compatibility for top candidates
5. **Fiber/connectivity audit** — Check broadband availability maps for top candidates
6. **KRF encoding** — Each property becomes a NODE in the research lab substrate with location, price, features, and heuristic score as METRICs

---

## Sources

See individual search files for complete source lists. Primary platforms:
- [LandWatch](https://www.landwatch.com) | [Land.com](https://www.land.com) | [RanchFlip](https://www.ranchflip.com) | [FarmFlip](https://www.farmflip.com)
- [Mossy Oak Properties](https://www.mossyoakproperties.com) | [Whitetail Properties](https://www.whitetailproperties.com)
- [Ag-Exchange](https://www.ag-exchange.com) | [Worrell Land Services](https://worrell-landservices.com)
- [Saunders Real Estate 2024 Market Report](https://land.saundersrealestate.com)
- [GFarmland County Reports](https://gfarmland.com) | [DreamDirt Auction Results](https://dreamdirt.com)
- [PrimeLandBuyers FL Price Data](https://www.primelandbuyers.com/blog/florida-land-price-per-acre-by-county)
