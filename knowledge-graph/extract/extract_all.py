#!/usr/bin/env python3
"""Knowledge Graph extraction pipeline -- master orchestrator.

Runs all five extractors, derives edges via build_edges, and writes:
  - C:/dev/knowledge-graph/data/graph.json   (full graph: nodes + edges)
  - C:/dev/knowledge-graph/data/resources.json (reference nodes only, for list view)

Python 3.12, stdlib only.
"""

import json
import os
import sys
import time

# Ensure the extract directory is on the path so sibling modules resolve
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from extract_references import extract_references
from extract_business import extract_business
from extract_charlotte import extract_charlotte
from extract_projects import extract_projects
from extract_people import extract_people
from build_edges import build_edges


# ── Configuration ─────────────────────────────────────────────────────────────

BASE_PATH = 'C:/dev/'
DATA_DIR = 'C:/dev/knowledge-graph/data/'

GRAPH_OUTPUT = os.path.join(DATA_DIR, 'graph.json')
RESOURCES_OUTPUT = os.path.join(DATA_DIR, 'resources.json')


# ── Helpers ───────────────────────────────────────────────────────────────────

def _hr(char='-', width=64):
    """Print a horizontal rule."""
    print(char * width)


def _section(title):
    """Print a section header."""
    print()
    _hr('=')
    print(f'  {title}')
    _hr('=')


def _step(label):
    """Print a step label."""
    print(f'\n  >> {label}')


def _count_by(items, key):
    """Count items grouped by a key field."""
    counts = {}
    for item in items:
        val = item.get(key, '(none)')
        counts[val] = counts.get(val, 0) + 1
    return counts


def _ensure_data_dir():
    """Create the data directory if it does not exist."""
    os.makedirs(DATA_DIR, exist_ok=True)


# ── Pipeline ──────────────────────────────────────────────────────────────────

def run_pipeline():
    """Execute the full extraction pipeline."""
    t0 = time.time()

    _section('CHARLOTTE KNOWLEDGE GRAPH -- EXTRACTION PIPELINE')
    print(f'  Base path:    {BASE_PATH}')
    print(f'  Output dir:   {DATA_DIR}')

    all_nodes = []

    # ── Step 1: References ────────────────────────────────────────────────
    _step('Extracting references (C:/dev/references/)')
    ref_nodes, domain_nodes = extract_references(os.path.join(BASE_PATH, 'references/'))
    all_nodes.extend(ref_nodes)
    all_nodes.extend(domain_nodes)
    print(f'     {len(ref_nodes)} reference nodes, {len(domain_nodes)} domain nodes')

    # ── Step 2: Business ──────────────────────────────────────────────────
    _step('Extracting business entities (C:/dev/business/)')
    biz_nodes, doc_nodes = extract_business(os.path.join(BASE_PATH, 'business/'))
    all_nodes.extend(biz_nodes)
    all_nodes.extend(doc_nodes)
    print(f'     {len(biz_nodes)} business nodes, {len(doc_nodes)} document nodes')

    # ── Step 3: Charlotte docs ────────────────────────────────────────────
    _step('Extracting Charlotte docs (C:/dev/charlotte/docs/)')
    charlotte_nodes = extract_charlotte(os.path.join(BASE_PATH, 'charlotte/docs/'))
    all_nodes.extend(charlotte_nodes)
    print(f'     {len(charlotte_nodes)} document nodes')

    # ── Step 4: Projects ──────────────────────────────────────────────────
    _step('Extracting projects (games, math, tools)')
    project_nodes = extract_projects(BASE_PATH)
    all_nodes.extend(project_nodes)
    print(f'     {len(project_nodes)} project nodes')

    # ── Step 5: People ────────────────────────────────────────────────────
    _step('Extracting people')
    people_nodes = extract_people(BASE_PATH)
    all_nodes.extend(people_nodes)
    print(f'     {len(people_nodes)} person nodes')

    # ── Step 6: Deduplicate by ID ─────────────────────────────────────────
    _step('Deduplicating nodes by ID')
    seen_ids = set()
    deduped = []
    dupe_count = 0
    for node in all_nodes:
        nid = node.get('id')
        if nid in seen_ids:
            dupe_count += 1
            continue
        seen_ids.add(nid)
        deduped.append(node)
    all_nodes = deduped
    print(f'     {dupe_count} duplicates removed, {len(all_nodes)} unique nodes')

    # ── Step 7: Build edges ───────────────────────────────────────────────
    _step('Deriving edges (5 sources)')
    edges, extra_nodes = build_edges(all_nodes)

    # Merge extra nodes (primitives, category groups) -- deduplicate again
    extra_added = 0
    for en in extra_nodes:
        if en['id'] not in seen_ids:
            seen_ids.add(en['id'])
            all_nodes.append(en)
            extra_added += 1
    print(f'     {len(edges)} edges derived, {extra_added} extra nodes added')

    # ── Step 8: Write graph.json ──────────────────────────────────────────
    _step('Writing output files')
    _ensure_data_dir()

    # Clean nodes for JSON serialization: strip None values
    def _clean(node):
        return {k: v for k, v in node.items() if v is not None}

    graph_data = {
        'nodes': [_clean(n) for n in all_nodes],
        'edges': edges,
    }

    with open(GRAPH_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(graph_data, f, indent=2, ensure_ascii=False)
    graph_size = os.path.getsize(GRAPH_OUTPUT)
    print(f'     {GRAPH_OUTPUT}  ({graph_size:,} bytes)')

    # ── Step 9: Write resources.json ──────────────────────────────────────
    resource_nodes = [_clean(n) for n in all_nodes if n.get('type') == 'reference']
    with open(RESOURCES_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(resource_nodes, f, indent=2, ensure_ascii=False)
    res_size = os.path.getsize(RESOURCES_OUTPUT)
    print(f'     {RESOURCES_OUTPUT}  ({res_size:,} bytes)')

    # ── Summary ───────────────────────────────────────────────────────────
    elapsed = time.time() - t0
    _section('SUMMARY')

    node_counts = _count_by(all_nodes, 'type')
    edge_counts = _count_by(edges, 'type')

    print(f'\n  Nodes ({len(all_nodes)} total):')
    for ntype, count in sorted(node_counts.items(), key=lambda x: -x[1]):
        print(f'    {ntype:20s} {count:5d}')

    print(f'\n  Edges ({len(edges)} total):')
    for etype, count in sorted(edge_counts.items(), key=lambda x: -x[1]):
        print(f'    {etype:20s} {count:5d}')

    print(f'\n  Reference nodes:  {len(resource_nodes)}')
    print(f'  Elapsed:          {elapsed:.2f}s')
    _hr('=')
    print()

    return graph_data


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    run_pipeline()
