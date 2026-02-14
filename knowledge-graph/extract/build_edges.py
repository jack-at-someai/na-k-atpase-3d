#!/usr/bin/env python3
"""Edge derivation engine for the Charlotte Research Lab knowledge graph.

Derives edges from five sources:
  1. Domain membership — reference nodes linked to their domain
  2. Author co-occurrence — references sharing an author
  3. Keyword overlap — simplified Jaccard similarity on labels/descriptions
  4. Explicit cross-references — Paper N patterns and directory mentions in descriptions
  5. Structural hierarchy — documents to parent businesses, Charlotte docs to categories

Also injects Charlotte's five primitive nodes and links them to cluster/domain nodes.

Stdlib only. Python 3.12.
"""

import re
from itertools import combinations


# ── Stopwords for keyword extraction ──────────────────────────────────────────

STOPWORDS = frozenset({
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare',
    'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
    'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'not',
    'no', 'nor', 'so', 'if', 'then', 'than', 'too', 'very', 'just',
    'about', 'above', 'after', 'again', 'all', 'also', 'any', 'because',
    'before', 'between', 'both', 'each', 'few', 'more', 'most', 'other',
    'over', 'same', 'some', 'such', 'into', 'through', 'during', 'out',
    'under', 'until', 'what', 'which', 'who', 'whom', 'how', 'when',
    'where', 'why', 'while', 'only', 'own', 'here', 'there', 'once',
    'being', 'many', 'much', 'every', 'never', 'still', 'even',
    'like', 'used', 'using', 'based', 'well', 'also', 'case', 'data',
    'full', 'real', 'time', 'makes', 'made', 'make', 'type', 'types',
    'system', 'systems', 'approach', 'new', 'one', 'two', 'three',
})


# ── Charlotte's five primitives ───────────────────────────────────────────────

PRIMITIVES = [
    {
        'id': 'NODE', 'type': 'primitive', 'label': 'NODE',
        'desc': 'Identity — any uniquely identifiable entity that exists in the graph.',
        'size': 22,
    },
    {
        'id': 'EDGE', 'type': 'primitive', 'label': 'EDGE',
        'desc': 'Relationship — typed connection between two nodes.',
        'size': 22,
    },
    {
        'id': 'METRIC', 'type': 'primitive', 'label': 'METRIC',
        'desc': 'Quantitative signal — any measurable property of a node.',
        'size': 22,
    },
    {
        'id': 'SIGNAL', 'type': 'primitive', 'label': 'SIGNAL',
        'desc': 'Event — a timestamped observation emitted by a node.',
        'size': 22,
    },
    {
        'id': 'PROTOCOL', 'type': 'primitive', 'label': 'PROTOCOL',
        'desc': 'Rule — business logic, constraints, and behavioral contracts.',
        'size': 22,
    },
]

# Primitive-to-cluster affinity map (which clusters each primitive gravitates to)
PRIMITIVE_CLUSTER_LINKS = {
    'NODE':     [('c-kg', 0.8), ('c-life', 0.7)],
    'EDGE':     [('c-kg', 0.8), ('c-st', 0.6)],
    'METRIC':   [('c-sig', 0.8), ('c-life', 0.6)],
    'SIGNAL':   [('c-sig', 0.9), ('c-swarm', 0.6), ('c-neuro', 0.5)],
    'PROTOCOL': [('c-ops', 0.8), ('c-swarm', 0.5)],
}

# Primitive-to-domain links (every domain uses all five primitives)
DOMAIN_IDS = ['d-ll', 'd-isg', 'd-vio', 'd-ttm', 'd-con', 'd-snd', 'd-sea']


# ── Helpers ───────────────────────────────────────────────────────────────────

def _extract_keywords(text: str) -> set[str]:
    """Extract keywords from text: lowercase, split on non-alpha, remove stopwords, len > 3."""
    if not text:
        return set()
    words = re.split(r'[^a-zA-Z]+', text.lower())
    return {w for w in words if len(w) > 3 and w not in STOPWORDS}


def _jaccard(a: set, b: set) -> float:
    """Jaccard similarity between two sets."""
    if not a or not b:
        return 0.0
    intersection = len(a & b)
    union = len(a | b)
    return intersection / union if union else 0.0


def _make_edge(source: str, target: str, edge_type: str, strength: float) -> dict:
    """Create a canonical edge dict."""
    return {
        'source': source,
        'target': target,
        'type': edge_type,
        'strength': round(strength, 4),
    }


# ── Edge source builders ─────────────────────────────────────────────────────

def _domain_membership_edges(nodes: list[dict]) -> list[dict]:
    """Source 1: Reference nodes linked to their domain node."""
    edges = []
    for node in nodes:
        if node.get('type') != 'reference':
            continue
        domain = node.get('domain')
        if not domain:
            continue
        domain_id = f'domain_{domain}' if not domain.startswith('domain_') else domain
        edges.append(_make_edge(node['id'], domain_id, 'domain_membership', 0.7))
    return edges


def _author_cooccurrence_edges(nodes: list[dict]) -> list[dict]:
    """Source 2: Reference nodes that share an author get co-author edges."""
    # Group by author
    author_groups: dict[str, list[str]] = {}
    for node in nodes:
        if node.get('type') != 'reference':
            continue
        author = (node.get('author') or '').strip()
        if not author:
            continue
        # Normalize author name
        author_key = author.lower()
        author_groups.setdefault(author_key, []).append(node['id'])

    edges = []
    for author_key, node_ids in author_groups.items():
        if len(node_ids) < 2:
            continue
        # Cap at 5 edges per author to avoid combinatorial explosion
        pairs = list(combinations(node_ids, 2))
        for src, tgt in pairs[:5]:
            edges.append(_make_edge(src, tgt, 'co_author', 0.5))
    return edges


def _keyword_overlap_edges(nodes: list[dict]) -> list[dict]:
    """Source 3: Jaccard similarity on keyword sets of non-reference nodes."""
    # Build keyword sets for non-reference nodes only
    candidates = []
    for node in nodes:
        if node.get('type') == 'reference':
            continue
        text = ' '.join(filter(None, [node.get('label', ''), node.get('desc', '')]))
        kw = _extract_keywords(text)
        if kw:
            candidates.append((node['id'], kw))

    # Compute pairwise Jaccard
    scored: list[tuple[float, str, str]] = []
    for i in range(len(candidates)):
        for j in range(i + 1, len(candidates)):
            sim = _jaccard(candidates[i][1], candidates[j][1])
            if sim > 0.25:
                scored.append((sim, candidates[i][0], candidates[j][0]))

    # Sort descending by similarity, cap at 300
    scored.sort(key=lambda x: x[0], reverse=True)
    scored = scored[:300]

    edges = []
    for sim, src, tgt in scored:
        edges.append(_make_edge(src, tgt, 'topic_overlap', round(sim * 0.8, 4)))
    return edges


def _cross_reference_edges(nodes: list[dict], node_index: dict[str, dict]) -> list[dict]:
    """Source 4: Explicit references in desc fields.

    Detects:
      - 'Paper N' or 'Paper {N}' patterns
      - Directory/project names appearing in descriptions
    """
    # Build lookup for paper nodes by paper_number
    paper_by_number: dict[int, str] = {}
    for node in nodes:
        pn = node.get('paper_number')
        if pn is not None:
            paper_by_number[int(pn)] = node['id']

    # Build lookup for business/project nodes by directory-like names
    dir_name_to_id: dict[str, str] = {}
    for node in nodes:
        # Use source_path basename or label as directory name
        sp = node.get('source_path', '')
        if sp:
            # Extract last meaningful directory component
            parts = sp.replace('\\', '/').rstrip('/').split('/')
            for part in parts:
                if part and len(part) > 2:
                    dir_name_to_id[part.lower()] = node['id']
        # Also register the label (lowered, hyphenated)
        label = node.get('label', '')
        if label:
            dir_name_to_id[label.lower().replace(' ', '-')] = node['id']

    edges = []
    seen = set()

    # Pattern: Paper N, Paper {N}
    paper_pat = re.compile(r'[Pp]aper\s*\{?(\d{1,2})\}?')

    for node in nodes:
        desc = node.get('desc', '')
        if not desc:
            continue

        # Paper references
        for match in paper_pat.finditer(desc):
            num = int(match.group(1))
            target_id = paper_by_number.get(num)
            if target_id and target_id != node['id']:
                key = (node['id'], target_id)
                if key not in seen:
                    seen.add(key)
                    edges.append(_make_edge(node['id'], target_id, 'cross_reference', 0.8))

        # Directory name mentions
        desc_lower = desc.lower()
        for dir_name, target_id in dir_name_to_id.items():
            if len(dir_name) < 4:
                continue
            if dir_name in desc_lower and target_id != node['id']:
                key = (node['id'], target_id)
                if key not in seen:
                    seen.add(key)
                    edges.append(_make_edge(node['id'], target_id, 'cross_reference', 0.8))

    return edges


def _hierarchy_edges(nodes: list[dict]) -> tuple[list[dict], list[dict]]:
    """Source 5: Structural hierarchy.

    - Business documents -> parent business entity
    - Charlotte docs -> virtual category group nodes

    Returns (edges, extra_nodes).
    """
    edges = []
    extra_nodes = []
    created_groups: dict[str, bool] = {}

    # Build lookup of existing node IDs for parent resolution
    existing_ids = {n['id'] for n in nodes}

    for node in nodes:
        # Business documents -> parent business
        parent_biz = node.get('parent_business')
        if parent_biz:
            # Slugify to match business node ID format (biz_ + slugified dirname)
            slug = re.sub(r'[^a-z0-9\s_]', '', parent_biz.lower())
            slug = re.sub(r'\s+', '_', slug)
            parent_id = f'biz_{slug}'
            if parent_id not in existing_ids:
                # Try original as fallback
                parent_id = parent_biz if parent_biz in existing_ids else f'biz_{parent_biz}'
            edges.append(_make_edge(node['id'], parent_id, 'hierarchy', 0.6))

        # Charlotte docs -> category groups
        category = node.get('category')
        if category and node.get('source_path', '').replace('\\', '/').startswith(('charlotte/', 'C:/dev/charlotte/')):
            group_id = f'cat_{category}'
            if group_id not in created_groups:
                created_groups[group_id] = True
                extra_nodes.append({
                    'id': group_id,
                    'type': 'category',
                    'label': category.replace('_', ' ').title(),
                    'desc': f'Charlotte docs category: {category}',
                    'size': 10,
                })
            edges.append(_make_edge(node['id'], group_id, 'hierarchy', 0.6))

    return edges, extra_nodes


def _primitive_edges(existing_ids: set[str]) -> list[dict]:
    """Connect primitive nodes to cluster and domain nodes that exist."""
    edges = []

    # Primitives -> Clusters
    for prim_id, links in PRIMITIVE_CLUSTER_LINKS.items():
        for cluster_id, strength in links:
            if cluster_id in existing_ids:
                edges.append(_make_edge(prim_id, cluster_id, 'primitive_link', strength))

    # Primitives -> Domains (lighter weight — every domain uses all five)
    for prim_id in PRIMITIVE_CLUSTER_LINKS:
        for domain_id in DOMAIN_IDS:
            if domain_id in existing_ids:
                edges.append(_make_edge(prim_id, domain_id, 'primitive_link', 0.25))

    return edges


# ── Main entry point ──────────────────────────────────────────────────────────

def build_edges(nodes: list[dict]) -> tuple[list[dict], list[dict]]:
    """Derive all edges from the provided node list.

    Returns:
        (edges, extra_nodes) — edges is a list of edge dicts,
        extra_nodes includes primitive nodes and any virtual group nodes.
    """
    # Build a quick index of all node IDs
    node_index = {n['id']: n for n in nodes}

    all_edges: list[dict] = []
    extra_nodes: list[dict] = list(PRIMITIVES)  # Always inject primitives

    # Extend node_index with primitives for cross-ref scanning
    for p in PRIMITIVES:
        node_index[p['id']] = p

    # Source 1: Domain membership
    domain_edges = _domain_membership_edges(nodes)
    all_edges.extend(domain_edges)

    # Source 2: Author co-occurrence
    author_edges = _author_cooccurrence_edges(nodes)
    all_edges.extend(author_edges)

    # Source 3: Keyword overlap (non-reference nodes only)
    combined_nodes = nodes + extra_nodes
    keyword_edges = _keyword_overlap_edges(combined_nodes)
    all_edges.extend(keyword_edges)

    # Source 4: Explicit cross-references
    xref_edges = _cross_reference_edges(combined_nodes, node_index)
    all_edges.extend(xref_edges)

    # Source 5: Structural hierarchy
    hier_edges, hier_extra = _hierarchy_edges(nodes)
    all_edges.extend(hier_edges)
    extra_nodes.extend(hier_extra)

    # Primitive links to clusters/domains
    all_existing = {n['id'] for n in nodes} | {n['id'] for n in extra_nodes}
    prim_edges = _primitive_edges(all_existing)
    all_edges.extend(prim_edges)

    # Deduplicate edges (same source+target+type -> keep highest strength)
    dedup: dict[tuple[str, str, str], dict] = {}
    for e in all_edges:
        key = (e['source'], e['target'], e['type'])
        if key not in dedup or e['strength'] > dedup[key]['strength']:
            dedup[key] = e
    all_edges = list(dedup.values())

    return all_edges, extra_nodes


if __name__ == '__main__':
    # Quick self-test with minimal synthetic data
    test_nodes = [
        {'id': 'ref_1', 'type': 'reference', 'label': 'Graph Theory Basics',
         'desc': 'See Paper 3 for swarm applications', 'domain': 'mathematics',
         'author': 'Jack Richard'},
        {'id': 'ref_2', 'type': 'reference', 'label': 'Graph Databases Overview',
         'desc': 'Knowledge representation', 'domain': 'mathematics',
         'author': 'Jack Richard'},
        {'id': 'ref_3', 'type': 'reference', 'label': 'Swarm Behavior Patterns',
         'desc': 'Multi-agent systems and flocking', 'domain': 'biology',
         'author': 'Jane Doe', 'paper_number': 3},
        {'id': 'c-kg', 'type': 'cluster', 'label': 'Knowledge Graphs',
         'desc': 'Graph theory, formal logic, ontology'},
        {'id': 'c-swarm', 'type': 'cluster', 'label': 'Swarm Intelligence',
         'desc': 'Multi-agent coordination, flocking, self-organization'},
        {'id': 'd-snd', 'type': 'domain', 'label': 'Sounder',
         'desc': 'Biological domain, swine genetics'},
        {'id': 'domain_mathematics', 'type': 'domain', 'label': 'Mathematics',
         'desc': 'Mathematical foundations'},
        {'id': 'domain_biology', 'type': 'domain', 'label': 'Biology',
         'desc': 'Biological sciences'},
    ]

    edges, extras = build_edges(test_nodes)

    print(f'Edges derived: {len(edges)}')
    for etype in sorted({e["type"] for e in edges}):
        count = sum(1 for e in edges if e['type'] == etype)
        print(f'  {etype}: {count}')
    print(f'Extra nodes: {len(extras)}')
    for n in extras:
        print(f'  {n["id"]} ({n["type"]})')
