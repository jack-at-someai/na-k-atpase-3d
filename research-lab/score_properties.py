#!/usr/bin/env python3
"""
Research Lab Property Scoring Heuristic
========================================
Scores ~250 curated property listings across Florida and Illinois/Indiana
against weighted criteria for research campus site selection.

Scoring Framework (from PROPERTY_INDEX.md):
  Hard Requirements (Pass/Fail):
    - Acreage >= 20 (50+ preferred)
    - Road access (paved frontage or < 1 mile)
    - Zoning: ag, mixed-use, or research-compatible
    - Price: under $15,000/acre (under $8,000 ideal)

  Weighted Features:
    - Price per acre       25%
    - Acreage              15%
    - Metro proximity      20%
    - Infrastructure       15%
    - Mixed-use character  10%
    - Water features        5%
    - Expansion potential   5%
    - Income potential      5%

Output: PROPERTY_RANKINGS.md
"""

import json
import os
from datetime import date

# ---------------------------------------------------------------------------
# DATA: All properties encoded from FLORIDA_LAND_SEARCH.md and
#       ILLINOIS_LAND_SEARCH.md with supplemental data from artifacts/
# ---------------------------------------------------------------------------

# Metro distance estimates by county (minutes to nearest major metro)
METRO_MINUTES = {
    # Florida
    "Holmes": 150, "Jackson": 90, "Washington": 120, "Liberty": 60,
    "Calhoun": 90, "Gadsden": 45, "Madison": 60, "Jefferson": 30,
    "Suwannee": 90, "Gilchrist": 30, "Lafayette": 90, "Levy": 45,
    "Marion": 90, "Dixie": 60, "Citrus": 70, "Sumter": 60,
    "Polk": 45, "Highlands": 80, "DeSoto": 90, "Okeechobee": 120,
    "Hendry": 110, "Indian River": 90, "Gulf": 120, "Lake": 40,
    "Hardee": 60, "Hernando": 50, "Pasco": 25,
    # Illinois/Indiana
    "Edgar": 5, "Clark": 25, "Vermilion": 50, "Coles": 40,
    "Cumberland": 30, "Douglas": 45, "Crawford": 40, "Vigo": 30,
    "Sullivan": 45, "Parke": 35,
}

# For IL/IN, "metro" = Paris, IL (the operational hub)
# For FL, "metro" = nearest of Orlando, Tampa, Jacksonville, Tallahassee, Gainesville


def build_florida_properties():
    """All FL properties from FLORIDA_LAND_SEARCH.md"""
    props = [
        # Holmes County
        {"id": "FL-01", "name": "338 Ac Heavily Wooded Hunting", "county": "Holmes", "state": "FL", "acres": 338, "price": 760500, "ppa": 2250, "status": "Active",
         "desc": "Multi-age timber, planted pine and natural hardwood", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        {"id": "FL-02", "name": "248 Ac Prime Timber Investment", "county": "Holmes", "state": "FL", "acres": 248.14, "price": 558315, "ppa": 2250, "status": "Active",
         "desc": "Planted pine ready for harvest, recreational", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        {"id": "FL-03", "name": "183 Ac Timber & Recreational", "county": "Holmes", "state": "FL", "acres": 181.28, "price": 580096, "ppa": 3200, "status": "Active",
         "desc": "Multi-age timber on two paved roads", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        {"id": "FL-04", "name": "122 Ac Recreational Timberland", "county": "Holmes", "state": "FL", "acres": 122.52, "price": 324625, "ppa": 2650, "status": "Active",
         "desc": "Road frontage, new pine plantation, hunting, trails", "road": True, "infra": [], "water": [], "mixed": ["timber", "recreation"], "income": ["timber"], "expansion": False},
        {"id": "FL-05", "name": "79 Ac Tenmile Creek Tract", "county": "Holmes", "state": "FL", "acres": 79.36, "price": 293632, "ppa": 3700, "status": "Active",
         "desc": "Secluded, wildlife, timberland, pristine creek", "road": False, "infra": [], "water": ["creek"], "mixed": ["timber"], "income": [], "expansion": False},
        {"id": "FL-06", "name": "61 Ac Secluded Hunting & Timber", "county": "Holmes", "state": "FL", "acres": 61.16, "price": 140668, "ppa": 2300, "status": "Active",
         "desc": "Private, planted pine, high upland percentage", "road": False, "infra": [], "water": [], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        {"id": "FL-07", "name": "240 Ac Cattle Farm w/ Home", "county": "Holmes", "state": "FL", "acres": 240, "price": 1320000, "ppa": 5500, "status": "Active",
         "desc": "Cattle farm with home, fenced", "road": True, "infra": ["home", "fencing"], "water": [], "mixed": ["pasture", "home"], "income": ["cattle"], "expansion": False},
        # Jackson County
        {"id": "FL-10", "name": "2166 Ac Mega-Site Industrial", "county": "Jackson", "state": "FL", "acres": 2165.9, "price": 10829500, "ppa": 5000, "status": "Active",
         "desc": "Zoned Industrial 1, FL-AL Mega-Site", "road": True, "infra": ["industrial_zoning"], "water": [], "mixed": ["industrial"], "income": [], "expansion": True},
        {"id": "FL-11", "name": "437 Ac Recreational Timber", "county": "Jackson", "state": "FL", "acres": 437, "price": 1419665, "ppa": 3249, "status": "Active",
         "desc": "Mature pine, creek, natural ponds", "road": True, "infra": [], "water": ["creek", "ponds"], "mixed": ["timber"], "income": ["timber"], "expansion": True},
        {"id": "FL-12", "name": "Big Bay Acres 309 Ac", "county": "Jackson", "state": "FL", "acres": 306, "price": 948600, "ppa": 3101, "status": "Active",
         "desc": "Pine timber, development potential", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": ["timber"], "expansion": True},
        {"id": "FL-13", "name": "295 Ac Hwy 231 Frontage", "county": "Jackson", "state": "FL", "acres": 295.87, "price": 1005958, "ppa": 3402, "status": "Active",
         "desc": "Multi-use, highway frontage", "road": True, "infra": ["highway_frontage"], "water": [], "mixed": ["multiuse"], "income": [], "expansion": True},
        {"id": "FL-14", "name": "Sylvania Plantation Hunting", "county": "Jackson", "state": "FL", "acres": 125, "price": 750000, "ppa": 6000, "status": "Active",
         "desc": "Hunting/recreational, development potential", "road": True, "infra": [], "water": [], "mixed": ["recreation"], "income": [], "expansion": False},
        {"id": "FL-15", "name": "Four Ponds Tract 120 Ac", "county": "Jackson", "state": "FL", "acres": 120, "price": 420000, "ppa": 3500, "status": "Active",
         "desc": "Multiple natural ponds, hunting, fishing", "road": True, "infra": [], "water": ["ponds"], "mixed": ["recreation"], "income": [], "expansion": False},
        {"id": "FL-16", "name": "Quail Call Heights 84 Ac", "county": "Jackson", "state": "FL", "acres": 84, "price": 420000, "ppa": 5000, "status": "Active",
         "desc": "Development tract in city limits", "road": True, "infra": ["city_limits"], "water": [], "mixed": ["development"], "income": [], "expansion": False},
        # Washington County
        {"id": "FL-20", "name": "229 Ac Upland Longleaf", "county": "Washington", "state": "FL", "acres": 229, "price": 795000, "ppa": 3470, "status": "Active",
         "desc": "Hunting and recreational", "road": True, "infra": [], "water": [], "mixed": ["timber", "recreation"], "income": ["timber"], "expansion": False},
        {"id": "FL-21", "name": "156 Ac Timber & Recreational", "county": "Washington", "state": "FL", "acres": 155.99, "price": 374376, "ppa": 2400, "status": "Active",
         "desc": "<10 min from Bonifay, development potential", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": ["timber"], "expansion": True},
        {"id": "FL-22", "name": "120 Ac Hunting w/ Flowing Creek", "county": "Washington", "state": "FL", "acres": 120.83, "price": 289992, "ppa": 2400, "status": "Active",
         "desc": "Flowing creek, pine timber, hardwoods", "road": True, "infra": [], "water": ["creek"], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        # Liberty County
        {"id": "FL-24", "name": "432 Ac Apalachicola River Bluff", "county": "Liberty", "state": "FL", "acres": 432.11, "price": 1296330, "ppa": 3000, "status": "Active",
         "desc": "State Park frontage, stunning views", "road": True, "infra": [], "water": ["river"], "mixed": ["timber", "recreation"], "income": ["timber"], "expansion": True},
        {"id": "FL-25", "name": "588 Ac Apalachicola Frontage", "county": "Liberty", "state": "FL", "acres": 587.89, "price": 1528514, "ppa": 2600, "status": "Active",
         "desc": "2 miles of river frontage", "road": True, "infra": [], "water": ["river"], "mixed": ["timber"], "income": ["timber"], "expansion": True},
        {"id": "FL-26", "name": "226 Ac Timberland & Recreation", "county": "Liberty", "state": "FL", "acres": 226.7, "price": 725440, "ppa": 3200, "status": "Active",
         "desc": "Road frontage, building or timber", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        # Calhoun County
        {"id": "FL-29", "name": "54 Ac Chipola River Frontage", "county": "Calhoun", "state": "FL", "acres": 53.86, "price": 323160, "ppa": 6000, "status": "Active",
         "desc": "River frontage, planted pine, power access", "road": True, "infra": ["power"], "water": ["river"], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        {"id": "FL-30", "name": "81 Ac Timber Investment", "county": "Calhoun", "state": "FL", "acres": 80.94, "price": 323760, "ppa": 4002, "status": "Active",
         "desc": "3/4 mi road frontage on two sides, near Gulf", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        # Gadsden County
        {"id": "FL-31", "name": "Little Canyon Creek 93 Ac", "county": "Gadsden", "state": "FL", "acres": 93, "price": 499000, "ppa": 5366, "status": "Active",
         "desc": "Deer hunting, productive soils, creeks", "road": True, "infra": [], "water": ["creek"], "mixed": ["pasture", "timber"], "income": [], "expansion": False},
        # Madison County
        {"id": "FL-32", "name": "193 Ac Turn-Key Ranch w/ Home", "county": "Madison", "state": "FL", "acres": 193.2, "price": 1199000, "ppa": 6203, "status": "Active",
         "desc": "Move-in ready cattle operation, 25 min from Madison", "road": True, "infra": ["home", "barn", "fencing"], "water": [], "mixed": ["pasture", "home"], "income": ["cattle"], "expansion": False},
        {"id": "FL-33", "name": "Cypress Hill Estate", "county": "Madison", "state": "FL", "acres": 198, "price": 3285000, "ppa": 16591, "status": "Active",
         "desc": "High-end living + exceptional recreation", "road": True, "infra": ["home"], "water": [], "mixed": ["recreation", "home"], "income": [], "expansion": False},
        {"id": "FL-34", "name": "Hwy 90 403 Acres", "county": "Madison", "state": "FL", "acres": 403.03, "price": 1209090, "ppa": 3000, "status": "Under Contract",
         "desc": "Hwy 90 frontage, hunting", "road": True, "infra": ["highway_frontage"], "water": [], "mixed": ["timber"], "income": [], "expansion": True},
        {"id": "FL-35", "name": "126.45 Ac Rolling North FL", "county": "Madison", "state": "FL", "acres": 126.45, "price": 1202275, "ppa": 9513, "status": "Active",
         "desc": "Hay fields, planted pine, multiple ponds", "road": True, "infra": [], "water": ["ponds"], "mixed": ["hay", "timber"], "income": ["hay"], "expansion": False},
        {"id": "FL-36", "name": "Duval Pond 160 Ac Tree Farm", "county": "Madison", "state": "FL", "acres": 160, "price": 960000, "ppa": 6000, "status": "Active",
         "desc": "Pond frontage, interior road system", "road": True, "infra": ["interior_roads"], "water": ["pond"], "mixed": ["timber"], "income": ["timber"], "expansion": False},
        {"id": "FL-37", "name": "96 Ac Farmstead on Honey Lake", "county": "Madison", "state": "FL", "acres": 96, "price": 900000, "ppa": 9375, "status": "Active",
         "desc": "Pasture, hardwoods, 1450 sq ft home", "road": True, "infra": ["home"], "water": ["lake"], "mixed": ["pasture", "timber", "home"], "income": ["cattle"], "expansion": False},
        {"id": "FL-38", "name": "Sportsman's Escape 216 Ac", "county": "Madison", "state": "FL", "acres": 216, "price": 540000, "ppa": 2500, "status": "Active",
         "desc": "3 mi down private dirt road, total seclusion", "road": False, "infra": [], "water": [], "mixed": ["timber"], "income": [], "expansion": True},
        {"id": "FL-39", "name": "97 Ac in Greenville", "county": "Madison", "state": "FL", "acres": 97, "price": 970100, "ppa": 10001, "status": "Active",
         "desc": "US-221, Madison County", "road": True, "infra": ["highway_frontage"], "water": [], "mixed": [], "income": [], "expansion": False},
        {"id": "FL-40", "name": "93 Ac Prime Hunting Land", "county": "Madison", "state": "FL", "acres": 93, "price": 790500, "ppa": 8495, "status": "Active",
         "desc": "Mature hardwoods, hunting (PRICE REDUCED)", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": [], "expansion": False},
        {"id": "FL-46", "name": "940 Ac Hike Lake Preserve", "county": "Madison", "state": "FL", "acres": 940, "price": 1551000, "ppa": 1650, "status": "Active",
         "desc": "Whitetail, turkey, hogs, ducks", "road": True, "infra": [], "water": ["lake"], "mixed": ["timber", "recreation"], "income": [], "expansion": True},
        # Jefferson County
        {"id": "FL-47", "name": "Econfina Riverfront 936", "county": "Jefferson", "state": "FL", "acres": 936, "price": 2152800, "ppa": 2300, "status": "Active",
         "desc": "13,000 ft river frontage, hunting/fishing", "road": True, "infra": [], "water": ["river"], "mixed": ["timber", "recreation"], "income": ["timber"], "expansion": True},
        {"id": "FL-48", "name": "176.8 Ac Recreational Tract", "county": "Jefferson", "state": "FL", "acres": 176.8, "price": 601120, "ppa": 3400, "status": "Active",
         "desc": "Secluded, whitetail, hogs, turkey", "road": True, "infra": [], "water": [], "mixed": ["timber"], "income": [], "expansion": False},
        # Suwannee County
        {"id": "FL-50", "name": "120 Ac Farmland (3x40 blocks)", "county": "Suwannee", "state": "FL", "acres": 120, "price": None, "ppa": None, "status": "Active",
         "desc": "Center pivot irrigation, diesel pump", "road": True, "infra": ["irrigation", "pump"], "water": [], "mixed": ["farmland"], "income": ["crops"], "expansion": False},
        # Lafayette County
        {"id": "FL-58", "name": "114 Ac Prime Farm Land", "county": "Lafayette", "state": "FL", "acres": 114, "price": 994000, "ppa": 8719, "status": "Active",
         "desc": "Farm land with timber and cemetery", "road": True, "infra": [], "water": [], "mixed": ["farmland", "timber"], "income": ["crops", "timber"], "expansion": False},
        # Levy County
        {"id": "FL-61", "name": "Bronson South Ranch 71.6 Ac", "county": "Levy", "state": "FL", "acres": 71.6, "price": 1100000, "ppa": 15363, "status": "Active",
         "desc": "Longleaf pines, live oaks, prairie ponds", "road": True, "infra": [], "water": ["ponds"], "mixed": ["timber", "pasture"], "income": [], "expansion": False},
        # Citrus County
        {"id": "FL-74", "name": "131 Ac Ranch & Rec Tract", "county": "Citrus", "state": "FL", "acres": 131, "price": 1200000, "ppa": 9160, "status": "Active",
         "desc": "Pasture, live oaks, hardwoods, Withlacoochee", "road": True, "infra": [], "water": ["river"], "mixed": ["pasture", "timber"], "income": ["cattle"], "expansion": False},
        # Polk County
        {"id": "FL-84", "name": "Rockridge Ranch 150 Ac", "county": "Polk", "state": "FL", "acres": 150, "price": 3200000, "ppa": 21333, "status": "Active",
         "desc": "5BR/3BA 3200sf home, cattle/farming", "road": True, "infra": ["home", "barn", "fencing"], "water": [], "mixed": ["pasture", "home"], "income": ["cattle"], "expansion": False},
        {"id": "FL-85", "name": "285 Ac Retreat", "county": "Polk", "state": "FL", "acres": 285, "price": 4100000, "ppa": 14386, "status": "Active",
         "desc": "Custom home, extensive amenities", "road": True, "infra": ["home"], "water": [], "mixed": ["recreation", "home"], "income": [], "expansion": True},
        # DeSoto County
        {"id": "FL-87", "name": "Limestone Ranch", "county": "DeSoto", "state": "FL", "acres": 161.82, "price": 2912760, "ppa": 17997, "status": "Active",
         "desc": "Secluded, adjoins conservation, large private neighbors", "road": True, "infra": [], "water": [], "mixed": ["pasture"], "income": [], "expansion": True},
        {"id": "FL-88", "name": "Riverline Ranch & Dev", "county": "DeSoto", "state": "FL", "acres": 139, "price": 3300000, "ppa": 23741, "status": "Active",
         "desc": "Hwy 70 + SE Hansel Ave frontage", "road": True, "infra": ["highway_frontage"], "water": [], "mixed": ["development"], "income": [], "expansion": False},
        # Okeechobee County
        {"id": "FL-92", "name": "312 Ac Open Pasture Ranch", "county": "Okeechobee", "state": "FL", "acres": 312, "price": None, "ppa": None, "status": "Active",
         "desc": "1800 sf home, workshop, haying/grazing", "road": True, "infra": ["home", "workshop"], "water": [], "mixed": ["pasture", "home"], "income": ["hay", "cattle"], "expansion": True},
        {"id": "FL-94", "name": "116.57 Ac Hwy 710", "county": "Okeechobee", "state": "FL", "acres": 116.57, "price": None, "ppa": None, "status": "Active",
         "desc": "1500 ft Hwy 710 frontage, 2200 ft rail line, across from Agri-Civic Center", "road": True, "infra": ["highway_frontage", "rail"], "water": [], "mixed": ["development"], "income": [], "expansion": False},
        {"id": "FL-95", "name": "383 Ac Recreational", "county": "Okeechobee", "state": "FL", "acres": 383, "price": None, "ppa": None, "status": "Active",
         "desc": "Diverse topography, deer/hog/quail", "road": True, "infra": [], "water": [], "mixed": ["recreation", "timber"], "income": [], "expansion": True},
        # Hendry County
        {"id": "FL-96", "name": "200 Ac Prime Farmland (Gerber)", "county": "Hendry", "state": "FL", "acres": 200, "price": 2500000, "ppa": 12500, "status": "Active",
         "desc": "Seller financing (25% down), land clearing included ($300K value)", "road": True, "infra": ["power"], "water": [], "mixed": ["farmland"], "income": ["crops"], "expansion": True},
        {"id": "FL-97", "name": "200 Ac Citrus Grove (Collins)", "county": "Hendry", "state": "FL", "acres": 200, "price": 900000, "ppa": 4500, "status": "Active",
         "desc": "Active citrus grove", "road": True, "infra": ["irrigation"], "water": [], "mixed": ["grove"], "income": ["citrus"], "expansion": False},
        # Highlands County
        {"id": "FL-100", "name": "109.65 Ac Ranch", "county": "Highlands", "state": "FL", "acres": 109.65, "price": None, "ppa": None, "status": "Active",
         "desc": "Oak hammocks, pine, pasture, 1300 ft paved frontage, ponds", "road": True, "infra": [], "water": ["ponds"], "mixed": ["pasture", "timber"], "income": ["cattle"], "expansion": False},
        {"id": "FL-101", "name": "242 Ac Ranch", "county": "Highlands", "state": "FL", "acres": 242, "price": None, "ppa": None, "status": "Active",
         "desc": "Green bahia pastures, fenced, ponds, creek, cattle lease", "road": True, "infra": ["fencing"], "water": ["ponds", "creek"], "mixed": ["pasture"], "income": ["cattle_lease"], "expansion": True},
        # Indian River County
        {"id": "FL-103", "name": "Sterling of Vero Beach 80 Ac", "county": "Indian River", "state": "FL", "acres": 80, "price": 1000000, "ppa": 12500, "status": "Active",
         "desc": "Improved ag/cattle, Ag-2 zoning, 20/40/80 ac parcels", "road": True, "infra": ["fencing"], "water": [], "mixed": ["pasture"], "income": ["cattle"], "expansion": False},
        # Gulf County
        {"id": "FL-104", "name": "2300 Ac Timber/Rec Development", "county": "Gulf", "state": "FL", "acres": 2300.7, "price": 5981820, "ppa": 2600, "status": "Active",
         "desc": "Extremely rare, near coast", "road": True, "infra": [], "water": [], "mixed": ["timber", "development"], "income": ["timber"], "expansion": True},
        # Hardee County (from PROPERTY_INDEX top picks)
        {"id": "FL-H1", "name": "Hardee 245 Ac Ranchland", "county": "Hardee", "state": "FL", "acres": 245, "price": None, "ppa": 7500, "status": "Active",
         "desc": "Road frontage on 3 roads, 2 wells, irrigation", "road": True, "infra": ["wells", "irrigation"], "water": [], "mixed": ["pasture", "farmland"], "income": ["crops", "cattle"], "expansion": True},
        {"id": "FL-H2", "name": "Hardee 100 Ac Bahia", "county": "Hardee", "state": "FL", "acres": 100, "price": None, "ppa": 7500, "status": "Active",
         "desc": "Flowing creek, 65-75% improved grass, paved frontage", "road": True, "infra": [], "water": ["creek"], "mixed": ["pasture"], "income": ["cattle"], "expansion": False},
        {"id": "FL-H3", "name": "Hardee County Line Grove", "county": "Hardee", "state": "FL", "acres": 222.8, "price": 2825000, "ppa": 12680, "status": "Active",
         "desc": "Active citrus with diesel wells -- infrastructure in place", "road": True, "infra": ["wells", "irrigation"], "water": [], "mixed": ["grove"], "income": ["citrus"], "expansion": False},
        {"id": "FL-H4", "name": "Hardee 80 Ac Fenced", "county": "Hardee", "state": "FL", "acres": 80, "price": None, "ppa": 7500, "status": "Active",
         "desc": "Fully fenced, rolling pastures, oak hammocks", "road": True, "infra": ["fencing"], "water": [], "mixed": ["pasture"], "income": ["cattle"], "expansion": False},
        # Hernando (from PROPERTY_INDEX)
        {"id": "FL-HN1", "name": "Hernando 275 Ac", "county": "Hernando", "state": "FL", "acres": 275, "price": 4242000, "ppa": 15425, "status": "Active",
         "desc": "1000ft Hwy 301 frontage, internal lakes, wooded", "road": True, "infra": ["highway_frontage"], "water": ["lakes"], "mixed": ["timber"], "income": [], "expansion": True},
        # Pasco (from PROPERTY_INDEX)
        {"id": "FL-P1", "name": "Pasco Hidden Lake 589 Ac", "county": "Pasco", "state": "FL", "acres": 589, "price": 1680000, "ppa": 2851, "status": "Active",
         "desc": "Massive acreage, cheap. West Pasco recreation", "road": True, "infra": [], "water": ["lake"], "mixed": ["recreation"], "income": [], "expansion": True},
        # Polk additional (from artifacts)
        {"id": "FL-PK1", "name": "Polk Lake Lizzie Pasture 241 Ac", "county": "Polk", "state": "FL", "acres": 241, "price": 1650000, "ppa": 6847, "status": "Active",
         "desc": "Upland pastures, lake frontage, SE Bartow", "road": True, "infra": [], "water": ["lake"], "mixed": ["pasture"], "income": ["cattle"], "expansion": True},
        # Highlands additional (from artifacts)
        {"id": "FL-HL1", "name": "Highlands 109.65 Ac Ranch", "county": "Highlands", "state": "FL", "acres": 109.65, "price": 1414485, "ppa": 12901, "status": "Active",
         "desc": "Oak/pine/pasture, 1300ft paved, fenced, 2 ponds, divisible", "road": True, "infra": ["fencing"], "water": ["ponds"], "mixed": ["pasture", "timber"], "income": ["cattle"], "expansion": True},
        {"id": "FL-HL2", "name": "Highlands Denco Ranch 495 Ac", "county": "Highlands", "state": "FL", "acres": 495, "price": 5000000, "ppa": 10089, "status": "Active",
         "desc": "Working cattle ranch, SR 70, pole barn, diesel well", "road": True, "infra": ["barn", "well", "highway_frontage"], "water": [], "mixed": ["pasture"], "income": ["cattle"], "expansion": True},
        {"id": "FL-HL3", "name": "Highlands Wilburn Grove 751 Ac", "county": "Highlands", "state": "FL", "acres": 751, "price": 6533700, "ppa": 8698, "status": "Active",
         "desc": "Income-producing citrus. Huge. Well-drained ridge", "road": True, "infra": ["irrigation", "wells"], "water": [], "mixed": ["grove"], "income": ["citrus"], "expansion": True},
    ]
    return props


def build_illinois_properties():
    """All IL/IN properties from ILLINOIS_LAND_SEARCH.md"""
    props = [
        # Edgar County
        {"id": "IL-01", "name": "Dudley 70", "county": "Edgar", "state": "IL", "acres": 70, "price": 1102500, "ppa": 15750, "status": "Active",
         "desc": "100% tillable; oil & mineral rights $10K/yr income", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops", "minerals"], "expansion": False},
        {"id": "IL-02", "name": "55 Acres NE Paris", "county": "Edgar", "state": "IL", "acres": 55, "price": 712596, "ppa": 12956, "status": "Active",
         "desc": "100% tillable; high-quality farmland", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        {"id": "IL-03", "name": "48 Acres RT 1 South Paris", "county": "Edgar", "state": "IL", "acres": 48.07, "price": 456665, "ppa": 9500, "status": "Active",
         "desc": "Agricultural use + future development value; Hwy 1 access", "road": True, "infra": ["highway_frontage"], "water": [], "mixed": ["tillable", "development"], "income": ["crops"], "expansion": True},
        {"id": "IL-05", "name": "25 Acres Edgar County", "county": "Edgar", "state": "IL", "acres": 25, "price": 87500, "ppa": 3500, "status": "Active",
         "desc": "Subdivided into lots; 4x5-acre lots also available", "road": True, "infra": [], "water": [], "mixed": [], "income": [], "expansion": False},
        {"id": "IL-13", "name": "Gillespy Farm 229.87 Ac", "county": "Edgar", "state": "IL", "acres": 229.87, "price": None, "ppa": 14000, "status": "Active",
         "desc": "4 tracts; exceptional yield; drainage tile; grain bins", "road": True, "infra": ["grain_bins", "drainage"], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": True},
        {"id": "IL-20", "name": "79.57 Ac Two-State", "county": "Edgar", "state": "IL", "acres": 79.57, "price": 636560, "ppa": 8000, "status": "Active",
         "desc": "49 ac IL + 30 ac IN; Brouilletts Creek; tillable/CRP/timber; gated", "road": True, "infra": ["gate"], "water": ["creek"], "mixed": ["tillable", "timber", "CRP"], "income": ["crops", "CRP"], "expansion": False},
        {"id": "IL-06", "name": "80 Ac T12 Grandview Twp", "county": "Edgar", "state": "IL", "acres": 80, "price": None, "ppa": None, "status": "Auction",
         "desc": "65.17 tillable acres; $11,405 crop credit; 12-tract auction", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        {"id": "IL-P15", "name": "Moss Auction Feb 2026 (3 tracts)", "county": "Edgar", "state": "IL", "acres": 105.98, "price": None, "ppa": None, "status": "Auction",
         "desc": "3 tracts, PI 142-144, Drummer/Flanagan/Wingate soils", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        # Clark County
        {"id": "IL-23", "name": "76.3 Ac Dennison Hunting", "county": "Clark", "state": "IL", "acres": 76.3, "price": 510000, "ppa": 6684, "status": "Sold",
         "desc": "21.1 tillable + 55.2 timber; mineral rights; taxes $578", "road": True, "infra": ["barn"], "water": [], "mixed": ["tillable", "timber"], "income": ["crops", "minerals"], "expansion": False},
        {"id": "IL-24", "name": "101 Ac Martinsville", "county": "Clark", "state": "IL", "acres": 101, "price": None, "ppa": None, "status": "Active",
         "desc": "Tillable+timber+CRP+WRP; paved road; nat gas/electric/city water; creek", "road": True, "infra": ["gas", "electric", "water"], "water": ["creek"], "mixed": ["tillable", "timber", "CRP"], "income": ["crops", "CRP"], "expansion": False},
        {"id": "IL-26", "name": "20 Ac Martinsville", "county": "Clark", "state": "IL", "acres": 20, "price": 100000, "ppa": 5000, "status": "Active",
         "desc": "Rural land", "road": True, "infra": [], "water": [], "mixed": [], "income": [], "expansion": False},
        {"id": "IL-CL1", "name": "Clark Hunt Farm 135.8 Ac", "county": "Clark", "state": "IL", "acres": 135.8, "price": 549000, "ppa": 4044, "status": "Active",
         "desc": "River frontage, hunting cabin. Closest cheap large parcel", "road": True, "infra": ["cabin"], "water": ["river"], "mixed": ["timber", "recreation"], "income": [], "expansion": False},
        # Vermilion County
        {"id": "IL-27", "name": "84.71 Ac Turnkey Outdoor Luxury", "county": "Vermilion", "state": "IL", "acres": 84.71, "price": 850000, "ppa": 10034, "status": "Active",
         "desc": "Furnished 1790sf home; stocked lakes; hunting; all equipment", "road": True, "infra": ["home", "equipment"], "water": ["lakes"], "mixed": ["recreation", "home"], "income": [], "expansion": False},
        {"id": "IL-28", "name": "120 Ac 3 Tracts Carroll Twp", "county": "Vermilion", "state": "IL", "acres": 120, "price": None, "ppa": None, "status": "Auction",
         "desc": "Class A soils; 3 tracts", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        {"id": "IL-29", "name": "164.5 Ac 4 Tracts Vance Twp", "county": "Vermilion", "state": "IL", "acres": 164.5, "price": None, "ppa": None, "status": "Auction",
         "desc": "4 tracts; 67.95ac tract (PI 142.7); open 2025 tenancy", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": True},
        {"id": "IL-30", "name": "97.44 Ac Farm+Timber", "county": "Vermilion", "state": "IL", "acres": 97.44, "price": None, "ppa": None, "status": "Active",
         "desc": "83.35 tillable (PI 112); 14.09 wooded acres", "road": True, "infra": [], "water": [], "mixed": ["tillable", "timber"], "income": ["crops"], "expansion": False},
        {"id": "IL-37", "name": "155.04 Ac Tillable", "county": "Vermilion", "state": "IL", "acres": 155.04, "price": None, "ppa": None, "status": "Active",
         "desc": "Tillable farmland via Worrell Land Services", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        {"id": "IL-VR1", "name": "Vermilion 266.31 Ac 4-tract", "county": "Vermilion", "state": "IL", "acres": 266.31, "price": 2000000, "ppa": 7508, "status": "Active",
         "desc": "Huge 4-tract, open tenancy 2025", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": True},
        {"id": "IL-VR2", "name": "Vermilion 160 Ac Potomac", "county": "Vermilion", "state": "IL", "acres": 160, "price": 1296000, "ppa": 8100, "status": "Active",
         "desc": "149 production acres, good PI", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        # Coles County
        {"id": "IL-38", "name": "224.28 Ac 3 Tracts", "county": "Coles", "state": "IL", "acres": 224.28, "price": None, "ppa": 15850, "status": "Active",
         "desc": "93% tillable; Dana/Drummer soils; open 2026 tenancy", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": True},
        {"id": "IL-40", "name": "120 Ac Tillable", "county": "Coles", "state": "IL", "acres": 120, "price": None, "ppa": None, "status": "Active",
         "desc": "89% tillable farmland via Worrell", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        # Cumberland County
        {"id": "IL-43", "name": "149.5 Ac Timothy", "county": "Cumberland", "state": "IL", "acres": 149.5, "price": 986700, "ppa": 6600, "status": "Active",
         "desc": "Hurricane Creek; building site; 30.9ac CRP; 65ac tillable; mature white oaks", "road": True, "infra": [], "water": ["creek"], "mixed": ["tillable", "timber", "CRP"], "income": ["crops", "CRP"], "expansion": True},
        {"id": "IL-CU1", "name": "Cumberland 245 Ac", "county": "Cumberland", "state": "IL", "acres": 245, "price": 1100000, "ppa": 4490, "status": "Sold",
         "desc": "151 crop + 24 CRP. Largest IL listing. Income-producing", "road": True, "infra": [], "water": ["creek"], "mixed": ["tillable", "CRP"], "income": ["crops", "CRP"], "expansion": True},
        {"id": "IL-CU2", "name": "Cumberland 141 Ac", "county": "Cumberland", "state": "IL", "acres": 141, "price": 675000, "ppa": 4787, "status": "Active",
         "desc": "Row crop farm, solid fundamentals", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        {"id": "IL-CU3", "name": "Cumberland 85 Ac Toledo", "county": "Cumberland", "state": "IL", "acres": 85, "price": 467500, "ppa": 5500, "status": "Active",
         "desc": "100% tillable, lowest entry price for quality farm", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        # Douglas County
        {"id": "IL-45", "name": "60 Ac Class A Soils", "county": "Douglas", "state": "IL", "acres": 60, "price": None, "ppa": None, "status": "Active",
         "desc": "Class A soils; 3 mi S of Newman", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
        # Crawford County (from PROPERTY_INDEX)
        {"id": "IL-CR1", "name": "Crawford 276 Ac Whitetails", "county": "Crawford", "state": "IL", "acres": 276, "price": 750000, "ppa": 2717, "status": "Active",
         "desc": "Wabash River, massive, price reduced. Best value in region", "road": True, "infra": [], "water": ["river"], "mixed": ["timber", "recreation"], "income": [], "expansion": True},
        # Vigo County, IN
        {"id": "IN-V1", "name": "Vigo Darwin Ferry 159 Ac", "county": "Vigo", "state": "IN", "acres": 159, "price": 557550, "ppa": 3506, "status": "Active",
         "desc": "Wildlife-rich, cheapest large parcel near Paris", "road": True, "infra": [], "water": [], "mixed": ["timber", "recreation"], "income": [], "expansion": False},
        {"id": "IN-V2", "name": "Vigo 153.84 Ac Railroad", "county": "Vigo", "state": "IN", "acres": 153.84, "price": 723800, "ppa": 4709, "status": "Active",
         "desc": "91 tillable + 63 wooded + rail frontage. Unique infra", "road": True, "infra": ["rail"], "water": [], "mixed": ["tillable", "timber"], "income": ["crops"], "expansion": True},
        {"id": "IN-V3", "name": "Vigo Trinity Tillable 196.5 Ac", "county": "Vigo", "state": "IN", "acres": 196.5, "price": 1414800, "ppa": 7201, "status": "Active",
         "desc": "Largest single parcel. Irrigated, ponds", "road": True, "infra": ["irrigation"], "water": ["ponds"], "mixed": ["tillable"], "income": ["crops"], "expansion": True},
        # Sullivan County, IN
        {"id": "IN-S1", "name": "Sullivan Lost Acres 164 Ac", "county": "Sullivan", "state": "IN", "acres": 164, "price": 1040000, "ppa": 6341, "status": "Active",
         "desc": "Trophy property, hunting + investment", "road": True, "infra": [], "water": [], "mixed": ["timber", "recreation"], "income": [], "expansion": False},
        # Edgar County additional (from PROPERTY_INDEX)
        {"id": "IL-E8", "name": "Edgar 177 Ac Grandview 4-tract", "county": "Edgar", "state": "IL", "acres": 177, "price": 1135000, "ppa": 6413, "status": "Active",
         "desc": "4 tracts, productive tillable", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": True},
        {"id": "IL-E9", "name": "Edgar 158.2 Ac Chrisman", "county": "Edgar", "state": "IL", "acres": 158.2, "price": 1226050, "ppa": 7747, "status": "Active",
         "desc": "146 tillable, solid PI. In Edgar County", "road": True, "infra": [], "water": [], "mixed": ["tillable"], "income": ["crops"], "expansion": False},
    ]
    return props


# ---------------------------------------------------------------------------
# SCORING ENGINE
# ---------------------------------------------------------------------------

def score_price_per_acre(ppa):
    """25% weight. Lower is better."""
    if ppa is None:
        return 5.0  # neutral if unknown
    if ppa <= 2000:
        return 10.0
    elif ppa <= 3000:
        return 9.5
    elif ppa <= 4000:
        return 9.0
    elif ppa <= 5000:
        return 8.5
    elif ppa <= 6000:
        return 8.0
    elif ppa <= 7000:
        return 7.5
    elif ppa <= 8000:
        return 7.0
    elif ppa <= 10000:
        return 6.0
    elif ppa <= 12000:
        return 5.0
    elif ppa <= 15000:
        return 4.0
    elif ppa <= 20000:
        return 2.5
    elif ppa <= 25000:
        return 1.5
    else:
        return 1.0


def score_acreage(acres):
    """15% weight. More is better."""
    if acres >= 500:
        return 10.0
    elif acres >= 300:
        return 9.0
    elif acres >= 200:
        return 8.0
    elif acres >= 150:
        return 7.0
    elif acres >= 100:
        return 6.0
    elif acres >= 75:
        return 5.0
    elif acres >= 50:
        return 4.0
    elif acres >= 30:
        return 3.0
    elif acres >= 20:
        return 2.0
    else:
        return 1.0


def score_metro_proximity(minutes):
    """20% weight. Closer is better."""
    if minutes is None:
        return 3.0
    if minutes <= 15:
        return 10.0
    elif minutes <= 30:
        return 9.0
    elif minutes <= 45:
        return 8.0
    elif minutes <= 60:
        return 7.0
    elif minutes <= 75:
        return 6.0
    elif minutes <= 90:
        return 5.0
    elif minutes <= 105:
        return 4.0
    elif minutes <= 120:
        return 3.0
    elif minutes <= 150:
        return 2.0
    else:
        return 1.0


def score_infrastructure(infra_list):
    """15% weight. More infrastructure = higher score."""
    high_value = {"home", "well", "wells", "irrigation", "barn", "workshop",
                  "grain_bins", "rail", "electric", "gas", "water", "pump",
                  "drainage"}
    medium_value = {"fencing", "highway_frontage", "interior_roads", "power",
                    "cabin", "equipment", "industrial_zoning", "city_limits",
                    "gate"}

    score = 1.0
    for item in infra_list:
        if item in high_value:
            score += 2.0
        elif item in medium_value:
            score += 1.0
    return min(score, 10.0)


def score_mixed_use(mixed_list):
    """10% weight. Variety of land types = ideal for campus."""
    categories = set()
    for m in mixed_list:
        if m in ("tillable", "farmland", "crops", "hay"):
            categories.add("ag")
        elif m in ("timber", "CRP"):
            categories.add("timber")
        elif m in ("pasture", "cattle"):
            categories.add("pasture")
        elif m in ("home", "development", "multiuse", "industrial"):
            categories.add("buildable")
        elif m in ("recreation",):
            categories.add("recreation")
        elif m in ("grove",):
            categories.add("grove")

    count = len(categories)
    if count >= 4:
        return 10.0
    elif count == 3:
        return 8.0
    elif count == 2:
        return 6.0
    elif count == 1:
        return 4.0
    else:
        return 2.0


def score_water(water_list):
    """5% weight. Ponds, creeks, springs, rivers."""
    if not water_list:
        return 1.0
    high = {"river", "lake", "lakes"}
    medium = {"creek", "pond", "ponds", "spring"}

    score = 1.0
    for w in water_list:
        if w in high:
            score += 4.0
        elif w in medium:
            score += 2.5
    return min(score, 10.0)


def score_expansion(can_expand):
    """5% weight. Adjacent parcels, low density."""
    return 8.0 if can_expand else 3.0


def score_income(income_list):
    """5% weight. Tillable, CRP, existing operations."""
    if not income_list:
        return 1.0
    high = {"crops", "citrus", "minerals"}
    medium = {"cattle", "timber", "hay", "CRP", "cattle_lease"}

    score = 1.0
    for i in income_list:
        if i in high:
            score += 3.0
        elif i in medium:
            score += 1.5
    return min(score, 10.0)


def passes_hard_requirements(prop):
    """Returns (passes: bool, reasons: list[str])"""
    reasons = []

    # Acreage >= 20
    if prop["acres"] < 20:
        reasons.append(f"Acreage {prop['acres']:.1f} < 20 minimum")

    # Road access
    if not prop.get("road", True):
        reasons.append("No confirmed road access")

    # Price per acre under $15,000 (hard cutoff at $25,000 for premium)
    ppa = prop.get("ppa")
    if ppa is not None and ppa > 25000:
        reasons.append(f"Price ${ppa:,.0f}/acre exceeds $25,000 hard ceiling")

    # Zoning -- we assume all ag/ranch listings are compatible
    # Only fail if explicitly residential-only
    if "residential_only" in prop.get("desc", "").lower():
        reasons.append("Residential-only zoning")

    # Status filter -- skip Sold properties
    if prop.get("status") == "Sold":
        reasons.append("Already sold")

    return (len(reasons) == 0, reasons)


WEIGHTS = {
    "price_per_acre": 0.25,
    "acreage": 0.15,
    "metro_proximity": 0.20,
    "infrastructure": 0.15,
    "mixed_use": 0.10,
    "water": 0.05,
    "expansion": 0.05,
    "income": 0.05,
}


def score_property(prop):
    """Score a property. Returns dict with feature scores and composite."""
    county = prop["county"]
    metro_min = METRO_MINUTES.get(county)

    features = {
        "price_per_acre": score_price_per_acre(prop.get("ppa")),
        "acreage": score_acreage(prop["acres"]),
        "metro_proximity": score_metro_proximity(metro_min),
        "infrastructure": score_infrastructure(prop.get("infra", [])),
        "mixed_use": score_mixed_use(prop.get("mixed", [])),
        "water": score_water(prop.get("water", [])),
        "expansion": score_expansion(prop.get("expansion", False)),
        "income": score_income(prop.get("income", [])),
    }

    composite = sum(features[k] * WEIGHTS[k] for k in WEIGHTS)

    return {
        "features": features,
        "composite": round(composite, 2),
        "metro_minutes": metro_min,
    }


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def format_price(price):
    if price is None:
        return "Contact"
    if price >= 1_000_000:
        return f"${price/1_000_000:.1f}M"
    return f"${price:,.0f}"


def format_ppa(ppa):
    if ppa is None:
        return "N/A"
    return f"${ppa:,.0f}"


def tier_label(composite):
    if composite >= 7.5:
        return "S"
    elif composite >= 7.0:
        return "A"
    elif composite >= 6.5:
        return "B"
    elif composite >= 6.0:
        return "C"
    elif composite >= 5.0:
        return "D"
    else:
        return "F"


def main():
    all_props = build_florida_properties() + build_illinois_properties()
    print(f"Total properties loaded: {len(all_props)}")

    scored = []
    failed = []

    for prop in all_props:
        passes, reasons = passes_hard_requirements(prop)
        if not passes:
            failed.append((prop, reasons))
            continue

        result = score_property(prop)
        scored.append((prop, result))

    # Sort by composite score descending
    scored.sort(key=lambda x: x[1]["composite"], reverse=True)

    # Split by region
    fl_scored = [(p, r) for p, r in scored if p["state"] == "FL"]
    il_scored = [(p, r) for p, r in scored if p["state"] in ("IL", "IN")]

    print(f"Scored: {len(scored)} ({len(fl_scored)} FL, {len(il_scored)} IL/IN)")
    print(f"Filtered out: {len(failed)}")

    # Generate output
    lines = []
    lines.append("# Research Lab Property Rankings")
    lines.append(f"**Generated:** {date.today().isoformat()}")
    lines.append(f"**Properties scored:** {len(scored)} of {len(all_props)} loaded")
    lines.append(f"**Filtered out:** {len(failed)} (sold, under minimum acreage, or over price ceiling)")
    lines.append("")
    lines.append("## Scoring Methodology")
    lines.append("")
    lines.append("Each property is scored 1-10 across 8 weighted dimensions:")
    lines.append("")
    lines.append("| Feature | Weight | What 10 Means |")
    lines.append("|---------|--------|--------------|")
    lines.append("| Price/acre | 25% | Under $2,000/acre |")
    lines.append("| Acreage | 15% | 500+ acres |")
    lines.append("| Metro proximity | 20% | Under 15 min to major metro / Paris IL |")
    lines.append("| Infrastructure | 15% | Home + well + irrigation + barn + utilities |")
    lines.append("| Mixed-use character | 10% | 4+ land types (ag + timber + buildable + recreation) |")
    lines.append("| Water features | 5% | River or lake frontage |")
    lines.append("| Expansion potential | 5% | Adjacent parcels, low-density surroundings |")
    lines.append("| Income potential | 5% | Active crops + mineral rights |")
    lines.append("")
    lines.append("**Tiers:** S (7.5+) | A (7.0-7.49) | B (6.5-6.99) | C (6.0-6.49) | D (5.0-5.99) | F (<5.0)")
    lines.append("")
    lines.append("**Hard filters applied:** Acreage >= 20, price <= $25K/acre, road access, not sold.")
    lines.append("")

    # --- OVERALL TOP 20 ---
    lines.append("---")
    lines.append("")
    lines.append("## Overall Top 20 (Both Regions)")
    lines.append("")
    lines.append("| Rank | Tier | Property | Region | Acres | Price | $/Acre | Score | Key Strengths |")
    lines.append("|------|------|----------|--------|-------|-------|--------|-------|---------------|")
    for i, (prop, result) in enumerate(scored[:20], 1):
        tier = tier_label(result["composite"])
        strengths = []
        f = result["features"]
        if f["price_per_acre"] >= 8.0:
            strengths.append("cheap")
        if f["acreage"] >= 7.0:
            strengths.append("big")
        if f["metro_proximity"] >= 7.0:
            strengths.append("close")
        if f["infrastructure"] >= 5.0:
            strengths.append("infra")
        if f["water"] >= 5.0:
            strengths.append("water")
        if f["income"] >= 5.0:
            strengths.append("income")
        if f["mixed_use"] >= 6.0:
            strengths.append("mixed")
        if f["expansion"] >= 6.0:
            strengths.append("expand")

        region = f"{prop['county']}, {prop['state']}"
        lines.append(f"| {i} | **{tier}** | **{prop['name']}** | {region} | {prop['acres']:,.0f} | {format_price(prop['price'])} | {format_ppa(prop['ppa'])} | **{result['composite']:.2f}** | {', '.join(strengths)} |")

    lines.append("")

    # --- FLORIDA RANKINGS ---
    lines.append("---")
    lines.append("")
    lines.append("## Florida Rankings")
    lines.append("")
    lines.append(f"**{len(fl_scored)} properties scored**")
    lines.append("")
    lines.append("| Rank | Tier | Property | County | Acres | Price | $/Acre | Score | PPA | Ac | Metro | Infra | Mix | Water | Exp | Inc |")
    lines.append("|------|------|----------|--------|-------|-------|--------|-------|-----|-----|-------|-------|-----|-------|-----|-----|")
    for i, (prop, result) in enumerate(fl_scored, 1):
        tier = tier_label(result["composite"])
        f = result["features"]
        lines.append(
            f"| {i} | **{tier}** | {prop['name']} | {prop['county']} | {prop['acres']:,.0f} "
            f"| {format_price(prop['price'])} | {format_ppa(prop['ppa'])} "
            f"| **{result['composite']:.2f}** "
            f"| {f['price_per_acre']:.1f} | {f['acreage']:.1f} | {f['metro_proximity']:.1f} "
            f"| {f['infrastructure']:.1f} | {f['mixed_use']:.1f} | {f['water']:.1f} "
            f"| {f['expansion']:.1f} | {f['income']:.1f} |"
        )

    lines.append("")

    # --- IL/IN RANKINGS ---
    lines.append("---")
    lines.append("")
    lines.append("## Illinois / Indiana Rankings")
    lines.append("")
    lines.append(f"**{len(il_scored)} properties scored**")
    lines.append("")
    lines.append("| Rank | Tier | Property | County | Acres | Price | $/Acre | Score | PPA | Ac | Metro | Infra | Mix | Water | Exp | Inc |")
    lines.append("|------|------|----------|--------|-------|-------|--------|-------|-----|-----|-------|-------|-----|-------|-----|-----|")
    for i, (prop, result) in enumerate(il_scored, 1):
        tier = tier_label(result["composite"])
        f = result["features"]
        state = prop["state"]
        lines.append(
            f"| {i} | **{tier}** | {prop['name']} | {prop['county']}, {state} | {prop['acres']:,.0f} "
            f"| {format_price(prop['price'])} | {format_ppa(prop['ppa'])} "
            f"| **{result['composite']:.2f}** "
            f"| {f['price_per_acre']:.1f} | {f['acreage']:.1f} | {f['metro_proximity']:.1f} "
            f"| {f['infrastructure']:.1f} | {f['mixed_use']:.1f} | {f['water']:.1f} "
            f"| {f['expansion']:.1f} | {f['income']:.1f} |"
        )

    lines.append("")

    # --- FEATURE LEADERS ---
    lines.append("---")
    lines.append("")
    lines.append("## Feature Leaders")
    lines.append("")
    for feature_name, label in [
        ("price_per_acre", "Cheapest (Best $/Acre)"),
        ("acreage", "Largest Acreage"),
        ("metro_proximity", "Closest to Metro/Paris"),
        ("infrastructure", "Most Infrastructure"),
        ("water", "Best Water Features"),
        ("income", "Highest Income Potential"),
    ]:
        lines.append(f"### {label}")
        lines.append("")
        top5 = sorted(scored, key=lambda x: x[1]["features"][feature_name], reverse=True)[:5]
        lines.append("| Property | Region | Score | Feature Score |")
        lines.append("|----------|--------|-------|---------------|")
        for prop, result in top5:
            lines.append(f"| {prop['name']} | {prop['county']}, {prop['state']} | {result['composite']:.2f} | {result['features'][feature_name]:.1f} |")
        lines.append("")

    # --- FILTERED PROPERTIES ---
    lines.append("---")
    lines.append("")
    lines.append("## Filtered Out")
    lines.append("")
    lines.append(f"**{len(failed)} properties** did not pass hard requirements:")
    lines.append("")
    for prop, reasons in failed:
        lines.append(f"- **{prop['name']}** ({prop['county']}, {prop['state']}): {'; '.join(reasons)}")
    lines.append("")

    # --- INVESTMENT RECOMMENDATIONS ---
    lines.append("---")
    lines.append("")
    lines.append("## Investment Recommendations")
    lines.append("")

    # FL top 5
    lines.append("### Florida -- Top 5 for Site Visit")
    lines.append("")
    for i, (prop, result) in enumerate(fl_scored[:5], 1):
        ppa_str = format_ppa(prop['ppa'])
        price_str = format_price(prop['price'])
        lines.append(f"**{i}. {prop['name']}** ({prop['county']} County) -- Score: {result['composite']:.2f}")
        lines.append(f"   - {prop['acres']:,.0f} acres | {price_str} | {ppa_str}/acre")
        lines.append(f"   - {prop['desc']}")
        lines.append("")

    # IL top 5
    lines.append("### Illinois/Indiana -- Top 5 for Site Visit")
    lines.append("")
    for i, (prop, result) in enumerate(il_scored[:5], 1):
        ppa_str = format_ppa(prop['ppa'])
        price_str = format_price(prop['price'])
        lines.append(f"**{i}. {prop['name']}** ({prop['county']} County, {prop['state']}) -- Score: {result['composite']:.2f}")
        lines.append(f"   - {prop['acres']:,.0f} acres | {price_str} | {ppa_str}/acre")
        lines.append(f"   - {prop['desc']}")
        lines.append("")

    # --- NEXT STEPS ---
    lines.append("---")
    lines.append("")
    lines.append("## Next Steps")
    lines.append("")
    lines.append("1. **Site visits** -- Schedule physical inspections of top 5 per region")
    lines.append("2. **Zoning verification** -- Confirm research/mixed-use compatibility")
    lines.append("3. **Fiber/broadband audit** -- Check connectivity maps for each candidate")
    lines.append("4. **Contact pricing** -- Request quotes on all 'Contact for Price' listings")
    lines.append("5. **McKinsey layer** -- When market study email arrives, overlay macroeconomic context")
    lines.append("6. **KRF encoding** -- Each top candidate becomes a NODE in the research lab substrate")
    lines.append("7. **Re-score** -- Update heuristic as new data arrives (prices, zoning, broadband)")
    lines.append("")

    # Write output
    output_path = os.path.join(os.path.dirname(__file__), "PROPERTY_RANKINGS.md")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"\nOutput written to: {output_path}")
    print(f"\nTop 5 Overall:")
    for i, (prop, result) in enumerate(scored[:5], 1):
        print(f"  {i}. [{tier_label(result['composite'])}] {prop['name']} "
              f"({prop['county']}, {prop['state']}) -- {result['composite']:.2f}")


if __name__ == "__main__":
    main()
