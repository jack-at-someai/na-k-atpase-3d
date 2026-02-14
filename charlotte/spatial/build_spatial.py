"""
Charlotte Spatial Substrate Builder
====================================
Reads US states GeoJSON, computes:
  1. Convex hull polygon for each state
  2. Convex hull for the entire continental US
  3. Centroid for each state
  4. Cardinal direction edges between ALL state pairs
  5. Adjacency edges (shared borders)
  6. FIPS codes and abbreviations

Outputs:
  - us-states.json    — full spatial knowledge graph
  - us-map.svg        — SVG rendering of all state hulls
  - spatial.krf       — CycL/KRF fact file for Charlotte kernel
"""

import json
import math
import sys
from collections import defaultdict

# ── State metadata ──────────────────────────────────────────────────

STATES = {
    "Alabama": {"abbr": "AL", "fips": "01", "region": "SE"},
    "Alaska": {"abbr": "AK", "fips": "02", "region": "W"},
    "Arizona": {"abbr": "AZ", "fips": "04", "region": "SW"},
    "Arkansas": {"abbr": "AR", "fips": "05", "region": "SE"},
    "California": {"abbr": "CA", "fips": "06", "region": "W"},
    "Colorado": {"abbr": "CO", "fips": "08", "region": "W"},
    "Connecticut": {"abbr": "CT", "fips": "09", "region": "NE"},
    "Delaware": {"abbr": "DE", "fips": "10", "region": "NE"},
    "Florida": {"abbr": "FL", "fips": "12", "region": "SE"},
    "Georgia": {"abbr": "GA", "fips": "13", "region": "SE"},
    "Hawaii": {"abbr": "HI", "fips": "15", "region": "W"},
    "Idaho": {"abbr": "ID", "fips": "16", "region": "W"},
    "Illinois": {"abbr": "IL", "fips": "17", "region": "MW"},
    "Indiana": {"abbr": "IN", "fips": "18", "region": "MW"},
    "Iowa": {"abbr": "IA", "fips": "19", "region": "MW"},
    "Kansas": {"abbr": "KS", "fips": "20", "region": "MW"},
    "Kentucky": {"abbr": "KY", "fips": "21", "region": "SE"},
    "Louisiana": {"abbr": "LA", "fips": "22", "region": "SE"},
    "Maine": {"abbr": "ME", "fips": "23", "region": "NE"},
    "Maryland": {"abbr": "MD", "fips": "24", "region": "NE"},
    "Massachusetts": {"abbr": "MA", "fips": "25", "region": "NE"},
    "Michigan": {"abbr": "MI", "fips": "26", "region": "MW"},
    "Minnesota": {"abbr": "MN", "fips": "27", "region": "MW"},
    "Mississippi": {"abbr": "MS", "fips": "28", "region": "SE"},
    "Missouri": {"abbr": "MO", "fips": "29", "region": "MW"},
    "Montana": {"abbr": "MT", "fips": "30", "region": "W"},
    "Nebraska": {"abbr": "NE", "fips": "31", "region": "MW"},
    "Nevada": {"abbr": "NV", "fips": "32", "region": "W"},
    "New Hampshire": {"abbr": "NH", "fips": "33", "region": "NE"},
    "New Jersey": {"abbr": "NJ", "fips": "34", "region": "NE"},
    "New Mexico": {"abbr": "NM", "fips": "35", "region": "SW"},
    "New York": {"abbr": "NY", "fips": "36", "region": "NE"},
    "North Carolina": {"abbr": "NC", "fips": "37", "region": "SE"},
    "North Dakota": {"abbr": "ND", "fips": "38", "region": "MW"},
    "Ohio": {"abbr": "OH", "fips": "39", "region": "MW"},
    "Oklahoma": {"abbr": "OK", "fips": "40", "region": "SW"},
    "Oregon": {"abbr": "OR", "fips": "41", "region": "W"},
    "Pennsylvania": {"abbr": "PA", "fips": "42", "region": "NE"},
    "Rhode Island": {"abbr": "RI", "fips": "44", "region": "NE"},
    "South Carolina": {"abbr": "SC", "fips": "45", "region": "SE"},
    "South Dakota": {"abbr": "SD", "fips": "46", "region": "MW"},
    "Tennessee": {"abbr": "TN", "fips": "47", "region": "SE"},
    "Texas": {"abbr": "TX", "fips": "48", "region": "SW"},
    "Utah": {"abbr": "UT", "fips": "49", "region": "W"},
    "Vermont": {"abbr": "VT", "fips": "50", "region": "NE"},
    "Virginia": {"abbr": "VA", "fips": "51", "region": "SE"},
    "Washington": {"abbr": "WA", "fips": "53", "region": "W"},
    "West Virginia": {"abbr": "WV", "fips": "54", "region": "SE"},
    "Wisconsin": {"abbr": "WI", "fips": "55", "region": "MW"},
    "Wyoming": {"abbr": "WY", "fips": "56", "region": "W"},
    "District of Columbia": {"abbr": "DC", "fips": "11", "region": "NE"},
}

# Known adjacent state pairs (shared land or water border)
ADJACENCY = [
    ("AL", "FL"), ("AL", "GA"), ("AL", "MS"), ("AL", "TN"),
    ("AZ", "CA"), ("AZ", "CO"), ("AZ", "NM"), ("AZ", "NV"), ("AZ", "UT"),
    ("AR", "LA"), ("AR", "MO"), ("AR", "MS"), ("AR", "OK"), ("AR", "TN"), ("AR", "TX"),
    ("CA", "NV"), ("CA", "OR"),
    ("CO", "KS"), ("CO", "NE"), ("CO", "NM"), ("CO", "OK"), ("CO", "UT"), ("CO", "WY"),
    ("CT", "MA"), ("CT", "NY"), ("CT", "RI"),
    ("DE", "MD"), ("DE", "NJ"), ("DE", "PA"),
    ("FL", "GA"),
    ("GA", "NC"), ("GA", "SC"), ("GA", "TN"),
    ("ID", "MT"), ("ID", "NV"), ("ID", "OR"), ("ID", "UT"), ("ID", "WA"), ("ID", "WY"),
    ("IL", "IN"), ("IL", "IA"), ("IL", "KY"), ("IL", "MO"), ("IL", "WI"),
    ("IN", "KY"), ("IN", "MI"), ("IN", "OH"),
    ("IA", "MN"), ("IA", "MO"), ("IA", "NE"), ("IA", "SD"), ("IA", "WI"),
    ("KS", "MO"), ("KS", "NE"), ("KS", "OK"),
    ("KY", "MO"), ("KY", "OH"), ("KY", "TN"), ("KY", "VA"), ("KY", "WV"),
    ("LA", "MS"), ("LA", "TX"),
    ("ME", "NH"),
    ("MD", "PA"), ("MD", "VA"), ("MD", "WV"), ("MD", "DC"),
    ("MA", "NH"), ("MA", "NY"), ("MA", "RI"), ("MA", "VT"),
    ("MI", "OH"), ("MI", "WI"),
    ("MN", "ND"), ("MN", "SD"), ("MN", "WI"),
    ("MS", "TN"),
    ("MO", "NE"), ("MO", "OK"), ("MO", "TN"),
    ("MT", "ND"), ("MT", "SD"), ("MT", "WY"),
    ("NE", "SD"), ("NE", "WY"),
    ("NV", "OR"), ("NV", "UT"),
    ("NH", "VT"),
    ("NJ", "NY"), ("NJ", "PA"),
    ("NM", "OK"), ("NM", "TX"),
    ("NY", "PA"), ("NY", "VT"),
    ("NC", "SC"), ("NC", "TN"), ("NC", "VA"),
    ("ND", "SD"),
    ("OH", "PA"), ("OH", "WV"),
    ("OK", "TX"),
    ("OR", "WA"),
    ("PA", "WV"),
    ("TN", "VA"),
    ("UT", "WY"),
    ("VA", "WV"), ("VA", "DC"),
]

# ── Geometry helpers ────────────────────────────────────────────────

def extract_all_coords(geometry):
    """Flatten all coordinate rings from a Polygon or MultiPolygon."""
    coords = []
    if geometry["type"] == "Polygon":
        for ring in geometry["coordinates"]:
            coords.extend(ring)
    elif geometry["type"] == "MultiPolygon":
        for polygon in geometry["coordinates"]:
            for ring in polygon:
                coords.extend(ring)
    return coords


def cross(o, a, b):
    """2D cross product of vectors OA and OB."""
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


def convex_hull(points):
    """Andrew's monotone chain convex hull. Returns CCW hull."""
    pts = sorted(set(map(tuple, points)))
    if len(pts) <= 2:
        return list(pts)
    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def centroid(points):
    """Centroid of a set of points."""
    n = len(points)
    if n == 0:
        return [0, 0]
    cx = sum(p[0] for p in points) / n
    cy = sum(p[1] for p in points) / n
    return [round(cx, 4), round(cy, 4)]


def bearing_direction(from_pt, to_pt):
    """Compute cardinal direction from one point to another.
    Points are [lng, lat]. Returns one of: N, NE, E, SE, S, SW, W, NW.
    """
    dlng = to_pt[0] - from_pt[0]
    dlat = to_pt[1] - from_pt[1]
    angle = math.degrees(math.atan2(dlng, dlat))  # 0=N, 90=E
    if angle < 0:
        angle += 360
    # 8 cardinal bins, each 45 degrees wide, centered on 0, 45, 90, ...
    dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    idx = int((angle + 22.5) / 45) % 8
    return dirs[idx]


def distance_km(p1, p2):
    """Haversine distance between two [lng, lat] points in km."""
    R = 6371
    lat1, lat2 = math.radians(p1[1]), math.radians(p2[1])
    dlat = lat2 - lat1
    dlng = math.radians(p2[0] - p1[0])
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def round_hull(hull, decimals=4):
    """Round hull coordinates."""
    return [[round(p[0], decimals), round(p[1], decimals)] for p in hull]


# ── Main build ──────────────────────────────────────────────────────

def build():
    with open("C:/dev/charlotte/spatial/us-states-raw.json") as f:
        geojson = json.load(f)

    nodes = []
    all_continental_pts = []
    abbr_to_centroid = {}
    abbr_to_name = {}

    for feature in geojson["features"]:
        name = feature["properties"]["name"]
        if name not in STATES:
            continue
        meta = STATES[name]
        abbr = meta["abbr"]

        coords = extract_all_coords(feature["geometry"])
        hull = convex_hull(coords)
        cent = centroid(coords)

        # Collect continental US points (exclude AK, HI)
        if abbr not in ("AK", "HI"):
            all_continental_pts.extend(coords)

        abbr_to_centroid[abbr] = cent
        abbr_to_name[abbr] = name

        nodes.append({
            "id": abbr,
            "name": name,
            "fips": meta["fips"],
            "region": meta["region"],
            "centroid": cent,
            "hull": round_hull(hull),
            "hull_points": len(hull),
            "boundary_points": len(coords),
        })

    # US continental convex hull
    us_hull = convex_hull(all_continental_pts)

    print(f"Computed hulls for {len(nodes)} states/territories")

    # ── Cardinal direction edges ────────────────────────────────────

    # Build adjacency lookup
    adj_set = set()
    for a, b in ADJACENCY:
        adj_set.add((a, b))
        adj_set.add((b, a))

    # Compute direction from every state to every other state
    direction_edges = []
    abbrs = sorted(abbr_to_centroid.keys())
    for i, a in enumerate(abbrs):
        for j, b in enumerate(abbrs):
            if i >= j:
                continue
            ca = abbr_to_centroid[a]
            cb = abbr_to_centroid[b]
            dir_a_to_b = bearing_direction(ca, cb)
            dist = round(distance_km(ca, cb), 1)
            adjacent = (a, b) in adj_set

            direction_edges.append({
                "source": a,
                "target": b,
                "direction": dir_a_to_b,
                "distance_km": dist,
                "adjacent": adjacent,
            })

    print(f"Computed {len(direction_edges)} directional edges")
    adj_count = sum(1 for e in direction_edges if e["adjacent"])
    print(f"  {adj_count} adjacent pairs")

    # ── Assemble output ─────────────────────────────────────────────

    output = {
        "type": "SpatialSubstrate",
        "version": "1.0",
        "description": "Charlotte spatial substrate - US states convex hulls, centroids, and cardinal direction knowledge graph",
        "projection_note": "Coordinates are [longitude, latitude] (WGS84/EPSG:4326). Hull points form closed convex polygons.",
        "stats": {
            "states": len(nodes),
            "direction_edges": len(direction_edges),
            "adjacent_pairs": adj_count,
            "continental_hull_points": len(us_hull),
        },
        "continental_us_hull": round_hull(us_hull),
        "nodes": sorted(nodes, key=lambda n: n["id"]),
        "edges": direction_edges,
    }

    out_path = "C:/dev/charlotte/spatial/us-states.json"
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"Wrote {out_path}")

    # ── Generate SVG map ────────────────────────────────────────────

    generate_svg(nodes, us_hull)

    # ── Generate KRF fact file ──────────────────────────────────────

    generate_krf(nodes, direction_edges, round_hull(us_hull))

    return output


# ── SVG Generation (simple Mercator for now) ────────────────────────

def project(lng, lat, w=960, h=600):
    """Simple equirectangular projection for CONUS."""
    # Bounding box for continental US
    min_lng, max_lng = -125, -66
    min_lat, max_lat = 24, 50
    x = (lng - min_lng) / (max_lng - min_lng) * w
    y = (1 - (lat - min_lat) / (max_lat - min_lat)) * h
    return round(x, 1), round(y, 1)


def hull_to_svg_path(hull, w=960, h=600):
    """Convert a hull to SVG path string."""
    pts = [project(p[0], p[1], w, h) for p in hull]
    if not pts:
        return ""
    d = f"M{pts[0][0]},{pts[0][1]}"
    for p in pts[1:]:
        d += f"L{p[0]},{p[1]}"
    d += "Z"
    return d


def generate_svg(nodes, us_hull):
    W, H = 960, 600

    # Region colors matching SomeAI design system
    region_colors = {
        "W": "#E53E3E",
        "MW": "#F59E0B",
        "NE": "#4A9EE5",
        "SE": "#68D391",
        "SW": "#FB923C",
    }
    region_strokes = {
        "W": "#B91C1C",
        "MW": "#D97706",
        "NE": "#2563EB",
        "SE": "#16A34A",
        "SW": "#EA580C",
    }

    svg_parts = []
    svg_parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
    svg_parts.append(f'  <rect width="{W}" height="{H}" fill="#141414"/>')

    # US outline
    us_path = hull_to_svg_path(us_hull, W, H)
    svg_parts.append(f'  <path d="{us_path}" fill="none" stroke="#333" stroke-width="2" opacity="0.5"/>')

    # State hulls
    svg_parts.append('  <g id="states">')
    for node in sorted(nodes, key=lambda n: n["id"]):
        abbr = node["id"]
        region = node["region"]
        if abbr in ("AK", "HI"):
            continue  # Skip non-continental for the main map
        hull = node["hull"]
        path = hull_to_svg_path(hull, W, H)
        fill = region_colors.get(region, "#666")
        stroke = region_strokes.get(region, "#444")
        cx, cy = project(node["centroid"][0], node["centroid"][1], W, H)
        svg_parts.append(f'    <path id="{abbr}" d="{path}" fill="{fill}" fill-opacity="0.15" stroke="{stroke}" stroke-width="1" stroke-opacity="0.6"/>')
        svg_parts.append(f'    <text x="{cx}" y="{cy}" fill="{fill}" font-size="9" font-family="Inter,sans-serif" font-weight="600" text-anchor="middle" dominant-baseline="central" opacity="0.8">{abbr}</text>')
    svg_parts.append('  </g>')

    svg_parts.append('</svg>')

    svg_path = "C:/dev/charlotte/spatial/us-map.svg"
    with open(svg_path, "w") as f:
        f.write("\n".join(svg_parts))
    print(f"Wrote {svg_path}")


def generate_krf(nodes, direction_edges, us_hull):
    """Generate CycL/KRF fact file for the Charlotte spatial substrate."""
    lines = []
    lines.append(";;; ================================================================")
    lines.append(";;; CHARLOTTE SPATIAL SUBSTRATE")
    lines.append(";;; US States - Convex Hulls, Centroids, Cardinal Directions")
    lines.append(";;; Generated by build_spatial.py")
    lines.append(";;; ================================================================")
    lines.append("")
    lines.append("(in-microtheory CharlotteSpatialMt)")
    lines.append("")

    # ── Type definitions ──
    lines.append(";;; === Spatial Types ===")
    lines.append("")
    lines.append("(isa SpatialEntity Collection)")
    lines.append("(genls SpatialEntity NODE)")
    lines.append('(comment SpatialEntity "A geographic entity with a convex hull and centroid")')
    lines.append("")
    lines.append("(isa USState Collection)")
    lines.append("(genls USState SpatialEntity)")
    lines.append('(comment USState "A US state or territory - geographic NODE in the spatial substrate")')
    lines.append("")
    lines.append("(isa USRegion Collection)")
    lines.append("(genls USRegion SpatialEntity)")
    lines.append('(comment USRegion "A US geographic region grouping states")')
    lines.append("")

    # ── Spatial predicates ──
    lines.append(";;; === Spatial Predicates ===")
    lines.append("")

    preds = [
        ("hasAbbreviation", "USState", "Thing", "Two-letter postal abbreviation"),
        ("hasFIPS", "USState", "Thing", "Federal Information Processing Standard code"),
        ("inRegion", "USState", "USRegion", "State belongs to a geographic region"),
        ("hasCentroid", "SpatialEntity", "Thing", "Geographic centroid as (lng lat) pair"),
        ("hasConvexHull", "SpatialEntity", "Thing", "Ordered convex hull vertices as list of (lng lat) pairs"),
        ("hasHullPointCount", "SpatialEntity", "Thing", "Number of vertices in the convex hull"),
        ("cardinalDirectionTo", "SpatialEntity", "Thing",
         "Cardinal direction from source centroid to target - value is (target direction distance_km)"),
        ("adjacentTo", "SpatialEntity", "SpatialEntity", "Two states share a border"),
        ("distanceKm", "SpatialEntity", "Thing",
         "Great-circle distance between centroids - value is (target distance_km)"),
    ]

    for name, arg1, arg2, comment in preds:
        lines.append(f"(isa {name} Predicate)")
        lines.append(f"(arity {name} 2)")
        lines.append(f"(arg1Isa {name} {arg1})")
        lines.append(f"(arg2Isa {name} {arg2})")
        lines.append(f'(comment {name} "{comment}")')
        lines.append("")

    # ── Region nodes ──
    lines.append(";;; === Regions ===")
    lines.append("")
    regions = {
        "W": "West",
        "MW": "Midwest",
        "NE": "Northeast",
        "SE": "Southeast",
        "SW": "Southwest",
    }
    for abbr, name in regions.items():
        lines.append(f"(isa Region-{abbr} USRegion)")
        lines.append(f'(comment Region-{abbr} "{name} region of the United States")')
    lines.append("")

    # ── State nodes ──
    lines.append(";;; === State Nodes ===")
    lines.append("")
    for node in sorted(nodes, key=lambda n: n["id"]):
        sid = f"State-{node['id']}"
        lines.append(f"(isa {sid} USState)")
        lines.append(f'(comment {sid} "{node["name"]}")')
        lines.append(f'(hasAbbreviation {sid} "{node["id"]}")')
        lines.append(f'(hasFIPS {sid} "{node["fips"]}")')
        lines.append(f'(inRegion {sid} Region-{node["region"]})')
        lines.append(f'(hasCentroid {sid} "({node["centroid"][0]} {node["centroid"][1]})")')
        hull_str = " ".join(f"({p[0]} {p[1]})" for p in node["hull"])
        lines.append(f'(hasConvexHull {sid} "({hull_str})")')
        lines.append(f'(hasHullPointCount {sid} {node["hull_points"]})')
        lines.append("")

    # ── Continental US hull ──
    lines.append(";;; === Continental US Convex Hull ===")
    lines.append("")
    lines.append("(isa ContinentalUS SpatialEntity)")
    lines.append('(comment ContinentalUS "The convex hull of the 48 contiguous states plus DC")')
    us_hull_str = " ".join(f"({p[0]} {p[1]})" for p in us_hull)
    lines.append(f'(hasConvexHull ContinentalUS "({us_hull_str})")')
    lines.append(f'(hasHullPointCount ContinentalUS {len(us_hull)})')
    lines.append("")

    # ── Adjacency edges ──
    lines.append(";;; === Adjacency Edges ===")
    lines.append("")
    adj_edges = [e for e in direction_edges if e["adjacent"]]
    for e in adj_edges:
        lines.append(f'(adjacentTo State-{e["source"]} State-{e["target"]})')
        lines.append(f'(adjacentTo State-{e["target"]} State-{e["source"]})')
    lines.append("")

    # ── Cardinal direction edges ──
    lines.append(";;; === Cardinal Direction Edges ===")
    lines.append(f";;; {len(direction_edges)} directed pairs (A -> B direction)")
    lines.append("")

    # Opposite direction map
    opposite = {"N": "S", "NE": "SW", "E": "W", "SE": "NW",
                "S": "N", "SW": "NE", "W": "E", "NW": "SE"}

    for e in direction_edges:
        src = f'State-{e["source"]}'
        tgt = f'State-{e["target"]}'
        d = e["direction"]
        dist = e["distance_km"]
        rev = opposite[d]
        lines.append(f'(cardinalDirectionTo {src} (State-{e["target"]} {d} {dist}))')
        lines.append(f'(cardinalDirectionTo {tgt} (State-{e["source"]} {rev} {dist}))')
        lines.append(f'(distanceKm {src} (State-{e["target"]} {dist}))')

    krf_path = "C:/dev/charlotte/spatial/spatial.krf"
    with open(krf_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Wrote {krf_path} ({len(lines)} lines)")


if __name__ == "__main__":
    build()
