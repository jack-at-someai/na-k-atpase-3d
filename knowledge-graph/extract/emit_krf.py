#!/usr/bin/env python3
"""
Knowledge Graph — JSON-to-KRF Emitter
======================================
Reads graph.json and emits Charlotte KRF S-expression files
grouped by node type and edge type.

Usage:
    python emit_krf.py [--source PATH] [--output PATH] [--dry-run]

Input:
    data/graph.json — consolidated knowledge graph
        { "nodes": [...], "edges": [...] }

Output structure:
    substrate/knowledge/
        nodes/
            references.krf    — ReferenceResource nodes
            domains.krf       — ReferenceDomain nodes
            people.krf        — PersonEntity nodes
            documents.krf     — DocumentArtifact nodes
            projects.krf      — ProjectEntity nodes
            businesses.krf    — BusinessEntity nodes
        edges/
            topic.krf         — domain membership edges
            authorship.krf    — author edges
            cross_ref.krf     — citation edges
            overlap.krf       — keyword similarity edges
            hierarchy.krf     — structural containment edges
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path


# ── Paths ──

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DEFAULT_SOURCE = PROJECT_DIR / "data" / "graph.json"
DEFAULT_OUTPUT = PROJECT_DIR / "substrate" / "knowledge"

MICROTHEORY = "KnowledgeGraphMt"


# ── Node type mapping ──
# Maps graph.json "type" values to (KRF type, output filename)

NODE_TYPE_MAP = {
    "reference":  ("ReferenceResource", "references.krf"),
    "domain":     ("ReferenceDomain",   "domains.krf"),
    "person":     ("PersonEntity",      "people.krf"),
    "document":   ("DocumentArtifact",  "documents.krf"),
    "project":    ("ProjectEntity",     "projects.krf"),
    "business":   ("BusinessEntity",    "businesses.krf"),
    "concept":    ("ConceptCluster",    "businesses.krf"),
}

# ── Edge type mapping ──
# Maps graph.json edge "type" values to (KRF predicate, output filename)

EDGE_TYPE_MAP = {
    # Domain membership
    "domain_membership":  ("belongsToDomain",      "topic.krf"),
    "belongs_to_domain":  ("belongsToDomain",      "topic.krf"),
    # Authorship / co-authorship
    "co_author":          ("hasAuthor",            "authorship.krf"),
    "authored_by":        ("hasAuthor",            "authorship.krf"),
    # Citation / Cross-reference
    "cross_reference":    ("citesResource",        "cross_ref.krf"),
    "cites":              ("citesResource",        "cross_ref.krf"),
    # Topic overlap
    "topic_overlap":      ("topicOverlap",         "overlap.krf"),
    "overlap":            ("topicOverlap",         "overlap.krf"),
    # Structural hierarchy
    "hierarchy":          ("parentChild",          "hierarchy.krf"),
    "part_of":            ("partOfBusiness",       "hierarchy.krf"),
    "parent_child":       ("parentChild",          "hierarchy.krf"),
    # Primitive connection
    "primitive_link":     ("exemplifiesPrimitive", "hierarchy.krf"),
}


# ── KRF helpers ──

def krf_string(s):
    """Escape a string for KRF S-expression. Double-quote it."""
    if s is None:
        return '"unknown"'
    s = str(s).replace("\\", "\\\\").replace('"', '\\"')
    return f'"{s}"'


def make_id(raw):
    """Clean an ID for KRF — alphanumeric + underscore only."""
    clean = re.sub(r'[^a-zA-Z0-9_]', '_', str(raw))
    return clean[:60] if len(clean) > 60 else clean


# ── Stats tracker ──

class Stats:
    def __init__(self):
        self.counts = {}
        self.errors = 0

    def inc(self, category, n=1):
        self.counts[category] = self.counts.get(category, 0) + n

    def total(self):
        return sum(self.counts.values())

    def report(self):
        print("\n  === KRF Emission Report ===")
        for cat in sorted(self.counts.keys()):
            print(f"    {cat:40s}  {self.counts[cat]:>8,}")
        print(f"    {'TOTAL':40s}  {self.total():>8,}")
        if self.errors:
            print(f"    {'ERRORS':40s}  {self.errors:>8,}")
        print()


# ── KRF file writer ──

class KRFWriter:
    """Accumulates KRF facts and writes them to a .krf file."""

    def __init__(self, path, microtheory, header_comment=""):
        self.path = Path(path)
        self.microtheory = microtheory
        self.header_comment = header_comment
        self.facts = []

    def add(self, fact):
        """Add a single S-expression fact string."""
        self.facts.append(fact)

    def add_blank(self):
        """Add a blank line separator."""
        self.facts.append("")

    def write(self):
        """Write all accumulated facts to the .krf file."""
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            if self.header_comment:
                for line in self.header_comment.strip().split("\n"):
                    f.write(f";;; {line}\n")
                f.write("\n")
            f.write(f"(in-microtheory {self.microtheory})\n\n")
            for fact in self.facts:
                f.write(fact + "\n")
        return len(self.facts)


# ── Node emitter ──

def emit_nodes(nodes, output, stats, dry_run=False):
    """Group nodes by type and emit one KRF file per type."""
    # Group nodes by their mapped output file
    groups = {}
    for node in nodes:
        ntype = node.get("type", "").lower().strip()
        if ntype not in NODE_TYPE_MAP:
            # Unmapped type — default to ConceptCluster
            krf_type = "ConceptCluster"
            filename = "businesses.krf"
            stats.inc(f"nodes/unmapped ({ntype})")
        else:
            krf_type, filename = NODE_TYPE_MAP[ntype]

        if filename not in groups:
            groups[filename] = []
        groups[filename].append((node, krf_type))

    # Headers for each file
    headers = {
        "references.krf":  "ReferenceResource Nodes\nCurated books, papers, courses, videos, code, and datasets",
        "domains.krf":     "ReferenceDomain Nodes\nSubject domain groupings",
        "people.krf":      "PersonEntity Nodes\nResearchers, advisors, team members, industry contacts",
        "documents.krf":   "DocumentArtifact Nodes\nPaper drafts, design docs, assessments, KRF files",
        "projects.krf":    "ProjectEntity Nodes\nGames, math visualizers, tools, domain applications",
        "businesses.krf":  "BusinessEntity and ConceptCluster Nodes\nClients, partners, prospective clients, thematic clusters",
    }

    files_written = {}
    for filename, entries in groups.items():
        path = output / "nodes" / filename
        header = headers.get(filename, f"Knowledge Graph Nodes — {filename}")
        w = KRFWriter(path, MICROTHEORY, header)

        for node, krf_type in entries:
            nid = make_id(node.get("id", ""))
            if not nid:
                stats.errors += 1
                continue

            label = node.get("label", "")
            desc = node.get("desc", "")

            # Type assertion
            w.add(f"(isa {nid} {krf_type})")

            # Label
            if label:
                w.add(f"(hasLabel {nid} {krf_string(label)})")

            # Description
            if desc:
                w.add(f"(hasDescription {nid} {krf_string(desc)})")

            # URL
            url = node.get("url", "")
            if url:
                w.add(f"(hasURL {nid} {krf_string(url)})")

            # Resource-specific properties
            if krf_type == "ReferenceResource":
                rtype = node.get("resourceType", "")
                if rtype:
                    w.add(f"(hasResourceType {nid} {krf_string(rtype)})")
                level = node.get("level", "")
                if level:
                    w.add(f"(hasLevel {nid} {krf_string(level)})")
                author = node.get("author", "")
                if author:
                    w.add(f"(hasAuthor {nid} {krf_string(author)})")
                domain = node.get("domain", "")
                if domain:
                    w.add(f"(belongsToDomain {nid} domain_{make_id(domain)})")

            # Person-specific properties
            if krf_type == "PersonEntity":
                role = node.get("role", "")
                if role:
                    w.add(f"(hasRole {nid} {krf_string(role)})")

            w.add_blank()
            stats.inc(f"nodes/{filename}")

        if not dry_run:
            count = w.write()
            files_written[filename] = count
        else:
            files_written[filename] = len(w.facts)

    return files_written


# ── Edge emitter ──

def emit_edges(edges, output, stats, dry_run=False):
    """Group edges by type and emit KRF files."""
    # Group edges by their mapped output file
    groups = {}
    for edge in edges:
        etype = edge.get("type", "").lower().strip()
        if etype not in EDGE_TYPE_MAP:
            # Try to infer a reasonable default
            predicate = "topicOverlap"
            filename = "overlap.krf"
            stats.inc(f"edges/unmapped ({etype})")
        else:
            predicate, filename = EDGE_TYPE_MAP[etype]

        if filename not in groups:
            groups[filename] = []
        groups[filename].append((edge, predicate))

    # Headers for each file
    headers = {
        "topic.krf":      "Domain Membership Edges\nLinks reference resources to subject domains",
        "authorship.krf":  "Authorship Edges\nLinks resources to their authors",
        "cross_ref.krf":   "Citation / Cross-Reference Edges\nLinks documents to nodes they reference",
        "overlap.krf":     "Topic Overlap Edges\nKeyword similarity connections between nodes",
        "hierarchy.krf":   "Structural Hierarchy Edges\nParent-child and containment relationships",
    }

    files_written = {}
    for filename, entries in groups.items():
        path = output / "edges" / filename
        header = headers.get(filename, f"Knowledge Graph Edges — {filename}")
        w = KRFWriter(path, MICROTHEORY, header)

        for edge, predicate in entries:
            source = make_id(edge.get("source", ""))
            target = make_id(edge.get("target", ""))
            if not source or not target:
                stats.errors += 1
                continue

            # Emit the predicate assertion
            w.add(f"({predicate} {source} {target})")

            # If the edge has a label or description in properties, add as comment
            props = edge.get("properties", {})
            label = props.get("label", "")
            if label:
                w.add(f";;; ^ {label}")

            stats.inc(f"edges/{filename}")

        if not dry_run:
            count = w.write()
            files_written[filename] = count
        else:
            files_written[filename] = len(w.facts)

    return files_written


# ── Main ──

def main():
    parser = argparse.ArgumentParser(
        description="Emit KRF files from knowledge graph JSON"
    )
    parser.add_argument(
        "--source", type=Path, default=DEFAULT_SOURCE,
        help=f"Path to graph.json (default: {DEFAULT_SOURCE})"
    )
    parser.add_argument(
        "--output", type=Path, default=DEFAULT_OUTPUT,
        help=f"Output directory (default: {DEFAULT_OUTPUT})"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Parse and count facts without writing files"
    )
    args = parser.parse_args()

    # Validate source
    if not args.source.exists():
        print(f"  ERROR: Source file not found: {args.source}")
        print(f"  Expected graph.json at: {args.source.resolve()}")
        sys.exit(1)

    # Load graph
    print(f"  Loading {args.source} ...")
    with open(args.source, "r", encoding="utf-8") as f:
        graph = json.load(f)

    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    meta = graph.get("metadata", {})

    print(f"  Graph: {meta.get('title', 'untitled')}")
    print(f"  Nodes: {len(nodes)}")
    print(f"  Edges: {len(edges)}")

    if args.dry_run:
        print("\n  [DRY RUN — no files will be written]\n")

    stats = Stats()

    # Emit nodes
    print("  Emitting node KRF files ...")
    node_files = emit_nodes(nodes, args.output, stats, dry_run=args.dry_run)
    for fname, count in sorted(node_files.items()):
        tag = "[dry]" if args.dry_run else "[ok]"
        print(f"    {tag} nodes/{fname:20s}  {count:>6} lines")

    # Emit edges
    print("  Emitting edge KRF files ...")
    edge_files = emit_edges(edges, args.output, stats, dry_run=args.dry_run)
    for fname, count in sorted(edge_files.items()):
        tag = "[dry]" if args.dry_run else "[ok]"
        print(f"    {tag} edges/{fname:20s}  {count:>6} lines")

    # Report
    stats.report()

    if args.dry_run:
        print("  Dry run complete. No files written.")
    else:
        total_files = len(node_files) + len(edge_files)
        print(f"  Done. {total_files} KRF files written to {args.output.resolve()}")


if __name__ == "__main__":
    main()
