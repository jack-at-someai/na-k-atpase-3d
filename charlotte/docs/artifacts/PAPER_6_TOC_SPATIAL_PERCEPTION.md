# Paper 6: Spatial Perception
## Interwoven Spatial Planes in Knowledge Graphs

**Target Venue:** ACM SIGSPATIAL
**Target Length:** 10-12 pages

---

## Abstract (~200 words)

Space as pre-built graph substrate rather than runtime-computed coordinates. Structural identity between spatial and temporal planes. LOCATED_IN edge pattern. CITY contact surface. Elimination of runtime geocoding.

---

## I. Introduction (1.5 pages)

### I.A. The Geocoding Problem
Runtime latency, string ambiguity ("Springfield" in 34 states), coordinate inconsistency.

### I.B. Motivating Example
"All breeders within 100 miles of a disease outbreak."

### I.C. The Substrate Thesis
Geographic reality is constant. Pre-compute once, traverse infinitely.

### I.D. Contributions
1. Formal definition of interwoven spatial planes
2. LOCATED_IN edge pattern
3. Cardinal direction edges (8-way adjacency)
4. Structural isomorphism with temporal substrate
5. Evaluation on 14,400+ operations across 4,236 cities

---

## II. Related Work (1 page)

### II.A. Geographic Information Systems
PostGIS, Oracle Spatial. Limitation: no inherent graph structure.

### II.B. Spatial Indexing
R-trees, Quad-trees, Geohash. Limitation: optimized for geometry, not semantics.

### II.C. Knowledge Graphs with Spatial Extensions
Wikidata, GeoSPARQL. Limitation: coordinates as attributes.

### II.D. Qualitative Spatial Reasoning
Cardinal direction calculus. FINN: cardinal edges as pre-computed relationships.

---

## III. Spatial Substrate Architecture (2 pages)

### III.A. The Interwoven Plane Model
```
WORLD
  └── CONTINENT
        └── COUNTRY
              └── REGION
                    └── STATE
                          └── COUNTY
                                └── CITY (contact surface)
                                      └── LATLON (resolution)
```

### III.B. The LOCATED_IN Edge Pattern
```json
{"P0": "CITY:TAYLOR_MO", "P1": "STATE:MO", "P2": "LOCATED_IN"}
{"P0": "STATE:MO", "P1": "COUNTRY:USA", "P2": "LOCATED_IN"}
```
Bidirectional traversal. Multiple containment paths.

### III.C. Cardinal Direction Edges
```
IS_NORTH_OF, IS_SOUTH_OF, IS_EAST_OF, IS_WEST_OF
IS_NORTHEAST_OF, IS_NORTHWEST_OF, IS_SOUTHEAST_OF, IS_SOUTHWEST_OF
```
8 edges per city. Pre-computed at substrate generation.

### III.D. LATLON Resolution
```json
{"P0": "CITY:TAYLOR_MO", "P1": "LATLON:39.9208_-91.5632", "P2": "AT_COORDS"}
```
Precise distance calculations when traversal insufficient.

---

## IV. Structural Identity with Temporal Plane (1 page)

### IV.A. Isomorphic Structure

| Temporal | Spatial |
|----------|---------|
| YEAR:2026 | COUNTRY:USA |
| QUARTER:Q1:2026 | REGION:MIDWEST |
| UNIQUEMONTH:JAN:2026 | STATE:MO |
| DATE:1-30-2026 (contact) | CITY:TAYLOR_MO (contact) |
| HOUR:14 (resolution) | LATLON:39.92_-91.56 (resolution) |

### IV.B. Unified 4D Coordinate System
Every SIGNAL: `(LATITUDE, LONGITUDE, DATE, HOUR)`

### IV.C. Query Optimization
Same traversal algorithms for spatial and temporal. Spacetime bounding box as subgraph extraction.

---

## V. Spatial Indexing Approaches (1.5 pages)

### V.A. Graph-Native Indexing
LOCATED_IN edges = containment index. Cardinal edges = adjacency index.

### V.B. Hybrid Indexing
LATLON nodes indexed with geospatial structures for precise queries.

### V.C. Firestore Composite Indexes
```
facts.(P2=LOCATED_IN).P1 → "what contains X?"
facts.(P0=CITY:*).P2=AT_COORDS → coordinate resolution
```

### V.D. Query Complexity

| Query Type | Traditional GIS | Graph Spatial |
|------------|-----------------|---------------|
| Point containment | O(log n) R-tree | O(1) edge |
| k-nearest | O(k log n) | O(k) traversal |
| Hierarchy | O(h) joins | O(h) hops |

---

## VI. Query Patterns for Spatial Reasoning (1.5 pages)

### VI.A. Containment Queries
"All operations in Missouri" → traverse LOCATED_IN chain.

### VI.B. Proximity Queries
"Operations within 50 miles" → resolve to LATLON, geometry calc, reverse-resolve.

### VI.C. Regional Aggregation
"Average litter size by region" → signals inherit location, roll up through hierarchy.

### VI.D. Spatial-Temporal Queries
"Cases within 100 miles in last 30 days" → 4D bounding box.

### VI.E. Direction-Based Queries
"Operations northwest of this venue" → cardinal edge traversal.

---

## VII. Visualization of Spatial Graph Layer (0.75 pages)

### VII.A. Layout Rules
Spatial nodes at periphery. Size by containment level.

### VII.B. LOCATED_IN Edge Rendering
Orange, solid, directed from contained to container.

### VII.C. Map Overlay Integration
LATLON resolution enables map pin placement.

---

## VIII. Evaluation (1 page)

### VIII.A. Dataset
4,236 CITY nodes, 50 STATE nodes, ~14,400 operations, ~17,300 LOCATED_IN edges.

### VIII.B. Query Performance

| Query | PostGIS | Graph Spatial |
|-------|---------|---------------|
| "Operations in MO" | 45ms | 12ms |
| "Within 50mi" | 120ms | 85ms |
| "Regional aggregation" | 230ms | 55ms |
| "State hierarchy" | 180ms | 8ms |

### VIII.C. Substrate Generation Cost
~2 min for 4,236 cities. Cardinal edges: ~15 min.

### VIII.D. Storage
Traditional: ~5MB. Graph spatial: ~18MB. 3.6x for traversal-based queries.

---

## IX. Discussion (0.5 pages)

### IX.A. Limitations
Cardinal edge threshold tuning. Not suited for high-frequency location updates.

### IX.B. Future Work
Dynamic spatial updates. External GIS integration.

---

## X. Conclusion (0.5 pages)

Space as pre-built graph eliminates runtime geocoding. LOCATED_IN enables hierarchical queries. Structural identity with temporal plane enables unified 4D queries.

---

## Page Budget

| Section | Pages |
|---------|-------|
| Abstract | 0.25 |
| Introduction | 1.5 |
| Related Work | 1.0 |
| Spatial Architecture | 2.0 |
| Structural Identity | 1.0 |
| Indexing | 1.5 |
| Query Patterns | 1.5 |
| Visualization | 0.75 |
| Evaluation | 1.0 |
| Discussion | 0.5 |
| Conclusion | 0.5 |
| **TOTAL** | **11.5** |

---

*Generated by CHARLOTTE planning agent. 2026-02-05*
