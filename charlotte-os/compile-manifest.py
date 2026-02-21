#!/usr/bin/env python
"""
compile-manifest.py — Charlotte OS Substrate Manifest Compiler
================================================================
Reads all KRF files, parses S-expressions, and generates:
  - SUBSTRATE.md   — compact markdown for system prompts (~4K tokens)
  - substrate.json  — full structured index for machine parsing
  - CLAUDE.md       — (optional) dev-agent context = header + SUBSTRATE.md

Usage:
  python compile-manifest.py                     # Generate both outputs
  python compile-manifest.py --claude-md         # Also generate CLAUDE.md
  python compile-manifest.py --check             # Verify manifest is up to date
  python compile-manifest.py --token-budget 4000 # Override token limit
  python compile-manifest.py --domain seeds/isg  # Append domain seed
"""

import argparse
import hashlib
import json
import os
import re
import sys
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent
BOOT_KRF = ROOT / "kernel" / "boot.krf"
SUBSTRATE_MD = ROOT / "SUBSTRATE.md"
SUBSTRATE_JSON = ROOT / "substrate.json"
CLAUDE_MD = ROOT / "CLAUDE.md"

VERSION = "1.0.0"


# ═══════════════════════════════════════════════════════════════════════════
# S-EXPRESSION PARSER
# ═══════════════════════════════════════════════════════════════════════════

def _count_parens_outside_strings(text, in_string=False):
    """Count net parentheses (open - close) ignoring those inside quotes.

    Tracks multi-line string state: pass in_string from prior line,
    get back (net_parens, updated_in_string).
    """
    net = 0
    for c in text:
        if c == '"':
            in_string = not in_string
        elif not in_string:
            if c == '(':
                net += 1
            elif c == ')':
                net -= 1
    return net, in_string


def _read_sexps(path):
    """Read a KRF file and yield complete S-expressions (may span lines).

    Strips comments (;;) and accumulates lines until parentheses balance.
    """
    with open(path, encoding="utf-8") as f:
        lines = f.readlines()

    buf = ""
    depth = 0
    in_string = False
    for line in lines:
        # Strip trailing whitespace, strip full-line comments
        stripped = line.rstrip()
        # Remove inline comments: everything after ;; outside strings
        cleaned = _strip_comment(stripped)
        if not cleaned.strip():
            continue
        buf += (" " if buf else "") + cleaned.strip()
        net, in_string = _count_parens_outside_strings(cleaned, in_string)
        depth += net
        if depth <= 0 and not in_string and buf.strip():
            yield buf.strip()
            buf = ""
            depth = 0
            in_string = False
    # Flush any remaining buffer (shouldn't happen in well-formed KRF)
    if buf.strip():
        yield buf.strip()


def _strip_comment(line):
    """Remove ;; comments from a line, respecting quoted strings."""
    in_string = False
    i = 0
    while i < len(line):
        if line[i] == '"':
            in_string = not in_string
        elif not in_string and i + 1 < len(line) and line[i:i+2] == ";;":
            return line[:i]
        i += 1
    return line


def _tokenize(sexp):
    """Tokenize an S-expression into nested lists.

    '(implies (and (isa ?X NODE)) (foo ?X))' ->
    ['implies', ['and', ['isa', '?X', 'NODE']], ['foo', '?X']]
    """
    tokens = []
    stack = [tokens]
    i = 0
    s = sexp.strip()
    while i < len(s):
        c = s[i]
        if c == '(':
            new = []
            stack[-1].append(new)
            stack.append(new)
            i += 1
        elif c == ')':
            stack.pop()
            i += 1
        elif c == '"':
            # Quoted string
            j = s.index('"', i + 1)
            stack[-1].append(s[i:j+1])
            i = j + 1
        elif c in (' ', '\t', '\n', '\r'):
            i += 1
        else:
            j = i
            while j < len(s) and s[j] not in (' ', '\t', '\n', '\r', '(', ')'):
                j += 1
            stack[-1].append(s[i:j])
            i = j
    # Unwrap single top-level list
    if len(tokens) == 1 and isinstance(tokens[0], list):
        return tokens[0]
    return tokens


def _flat_tokens(sexp):
    """Flat tokenization (no nesting) for simple assertions."""
    inner = sexp.strip()
    if inner.startswith("(") and inner.endswith(")"):
        inner = inner[1:-1].strip()
    tokens = []
    i = 0
    while i < len(inner):
        if inner[i] == '"':
            j = inner.index('"', i + 1)
            tokens.append(inner[i+1:j])  # strip quotes
            i = j + 1
        elif inner[i] in (' ', '\t', '\n', '\r'):
            i += 1
        elif inner[i] == ')':
            # Stray close-paren (from stripped outer); skip it
            i += 1
        elif inner[i] == '(':
            # Grab nested sexp as a single string token
            # Must respect quoted strings to avoid miscounting parens
            depth = 1
            j = i + 1
            in_str = False
            while j < len(inner) and depth > 0:
                if inner[j] == '"':
                    in_str = not in_str
                elif not in_str:
                    if inner[j] == '(':
                        depth += 1
                    elif inner[j] == ')':
                        depth -= 1
                j += 1
            tokens.append(inner[i:j])
            i = j
        else:
            j = i
            while j < len(inner) and inner[j] not in (' ', '\t', '\n', '\r', '(', ')'):
                j += 1
            tokens.append(inner[i:j])
            i = j
    return tokens


# ═══════════════════════════════════════════════════════════════════════════
# KRF FILE ANALYZER
# ═══════════════════════════════════════════════════════════════════════════

class KRFFile:
    """Parsed representation of a single KRF file."""

    def __init__(self, path):
        self.path = Path(path)
        self.rel_path = str(self.path.relative_to(ROOT)).replace("\\", "/")
        self.microtheory = None
        self.isa = []           # (subject, collection)
        self.genls = []         # (sub, super)
        self.genlMt = []        # (child_mt, parent_mt)
        self.comments = {}      # subject -> comment text
        self.implies = []       # raw sexp strings
        self.arity = {}         # predicate -> int
        self.arg_types = {}     # predicate -> {argN: type}
        self.predicates = []    # (predicate_name, arity_if_known)
        self.collections = []   # things declared as Collections
        self.directives = []    # (name, priority, comment)
        self.line_count = 0
        self.assertion_count = 0
        self.rule_count = 0
        self.raw_sexps = []
        self._purpose = None

    @property
    def purpose(self):
        """One-line purpose derived from file header comment or first comment."""
        if self._purpose:
            return self._purpose
        # Try to extract from file header (;;; lines at top)
        try:
            with open(self.path, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith(";;;") and "/" in line:
                        continue  # Skip the ;;; LAYER / FILE header
                    if line.startswith(";;;") and line.strip("; "):
                        text = line.strip("; ").strip()
                        if text and not text.startswith("="):
                            self._purpose = text
                            return self._purpose
                    if not line.startswith(";;"):
                        break
        except Exception:
            pass
        return self.rel_path

    def parse(self):
        """Parse the KRF file and populate all fields."""
        with open(self.path, encoding="utf-8") as f:
            self.line_count = sum(1 for _ in f)

        for sexp in _read_sexps(self.path):
            self.raw_sexps.append(sexp)
            tokens = _flat_tokens(sexp)
            if not tokens:
                continue

            pred = tokens[0]
            self.assertion_count += 1

            if pred == "in-microtheory" and len(tokens) >= 2:
                self.microtheory = tokens[1]
                self.assertion_count -= 1  # Don't count as assertion

            elif pred == "isa" and len(tokens) >= 3:
                self.isa.append((tokens[1], tokens[2]))
                if tokens[2] == "Collection":
                    self.collections.append(tokens[1])
                if tokens[2] == "Predicate":
                    self.predicates.append(tokens[1])

            elif pred == "genls" and len(tokens) >= 3:
                self.genls.append((tokens[1], tokens[2]))

            elif pred == "genlMt" and len(tokens) >= 3:
                self.genlMt.append((tokens[1], tokens[2]))

            elif pred == "comment" and len(tokens) >= 3:
                self.comments[tokens[1]] = tokens[2]

            elif pred == "arity" and len(tokens) >= 3:
                try:
                    self.arity[tokens[1]] = int(tokens[2])
                except ValueError:
                    pass

            elif pred.startswith("arg") and pred.endswith("Isa") and len(tokens) >= 3:
                p = tokens[1]
                if p not in self.arg_types:
                    self.arg_types[p] = {}
                self.arg_types[p][pred] = tokens[2]

            elif pred == "implies":
                self.rule_count += 1
                self.implies.append(sexp)

            elif pred == "directivePriority" and len(tokens) >= 3:
                # Will be matched with isa Directive and comment later
                pass

        # Extract directives (from agent/directives.krf pattern)
        directive_names = [s for s, c in self.isa if c == "Directive"]
        for dname in directive_names:
            priority = None
            for sexp in self.raw_sexps:
                t = _flat_tokens(sexp)
                if t and t[0] == "directivePriority" and len(t) >= 3 and t[1] == dname:
                    try:
                        priority = int(t[2])
                    except ValueError:
                        pass
            cmt = self.comments.get(dname, "")
            self.directives.append((dname, priority, cmt))


# ═══════════════════════════════════════════════════════════════════════════
# BOOT SEQUENCE PARSER
# ═══════════════════════════════════════════════════════════════════════════

def parse_boot_sequence(boot_file):
    """Parse boot.krf to extract phases, load order, and file list.

    Returns:
        phases: list of (phase_name, order, [file_paths])
        all_boot_files: ordered list of all boot file paths
    """
    phases = {}  # phase_name -> {"order": int, "files": []}

    for sexp in _read_sexps(boot_file):
        tokens = _flat_tokens(sexp)
        if not tokens:
            continue
        if tokens[0] == "bootOrder" and len(tokens) >= 3:
            try:
                phases.setdefault(tokens[1], {"order": int(tokens[2]), "files": []})
            except ValueError:
                pass
        elif tokens[0] == "bootLoads" and len(tokens) >= 3:
            phases.setdefault(tokens[1], {"order": 0, "files": []})
            phases[tokens[1]]["files"].append(tokens[2].strip('"'))

    # Sort phases by order
    sorted_phases = sorted(phases.items(), key=lambda x: x[1]["order"])
    result = [(name, data["order"], data["files"]) for name, data in sorted_phases]

    # Flat ordered list of all boot files
    all_files = []
    for _, _, files in result:
        all_files.extend(files)

    return result, all_files


# ═══════════════════════════════════════════════════════════════════════════
# CONTENT HASH (for --check)
# ═══════════════════════════════════════════════════════════════════════════

def compute_source_hash(krf_files):
    """SHA-256 over sorted KRF file contents."""
    h = hashlib.sha256()
    for f in sorted(krf_files, key=lambda p: str(p)):
        try:
            with open(f, "rb") as fh:
                h.update(fh.read())
        except FileNotFoundError:
            pass
    return h.hexdigest()[:12]


# ═══════════════════════════════════════════════════════════════════════════
# SUBSTRATE.md RENDERER
# ═══════════════════════════════════════════════════════════════════════════

def render_substrate_md(parsed_files, boot_phases, all_boot_files, source_hash,
                        total_lines, total_files, domain_seed=None):
    """Render the compact SUBSTRATE.md manifest."""

    # ── Collect data from parsed files ──
    # Microtheory hierarchy (from boot.krf genlMt)
    boot_parsed = None
    for pf in parsed_files:
        if pf.rel_path == "kernel/boot.krf":
            boot_parsed = pf
            break

    mt_edges = []
    if boot_parsed:
        mt_edges = boot_parsed.genlMt

    # Primitives (from primitives.krf)
    primitives_data = {
        "NODE":     {"layer": "Ontological", "def": "Identity. Any uniquely identifiable entity in the graph."},
        "EDGE":     {"layer": "Ontological", "def": "Relationship. A typed, directed connection between two NODEs."},
        "METRIC":   {"layer": "Valuation",   "def": "Measurement. A quantitative dimension attached to a NODE."},
        "SIGNAL":   {"layer": "Valuation",   "def": "Detection. A timestamped pattern derived from METRICs."},
        "PROTOCOL": {"layer": "Valuation",   "def": "Rule. Prescribed action triggered by SIGNALs."},
    }
    # Override with actual comments from primitives.krf if available
    for pf in parsed_files:
        if "primitives.krf" in pf.rel_path:
            for prim in ("NODE", "EDGE", "METRIC", "SIGNAL", "PROTOCOL"):
                if prim in pf.comments:
                    primitives_data[prim]["def"] = pf.comments[prim]

    # Directives
    directives = []
    for pf in parsed_files:
        if pf.directives:
            directives.extend(pf.directives)
    directives.sort(key=lambda d: d[1] if d[1] is not None else 99)

    # Observer capabilities
    observer_caps = []
    for pf in parsed_files:
        if "observer.krf" in pf.rel_path:
            for subj, coll in pf.isa:
                if coll == "ObserverCapability":
                    desc = pf.comments.get(subj, "")
                    observer_caps.append((subj, desc))

    # ── Build microtheory tree ──
    mt_tree = _build_mt_tree(mt_edges)

    # ── Build file index ──
    # boot.krf + valuation-layer.krf + all boot-order files
    boot_set = set(all_boot_files)
    boot_set.add("kernel/boot.krf")
    boot_set.add("kernel/valuation-layer.krf")

    indexed_files = []
    for pf in parsed_files:
        if pf.rel_path in boot_set:
            indexed_files.append(pf)

    # Sort by boot order
    boot_order_map = {}
    for i, f in enumerate(all_boot_files):
        boot_order_map[f] = i
    boot_order_map["kernel/boot.krf"] = -2
    boot_order_map["kernel/valuation-layer.krf"] = -1
    indexed_files.sort(key=lambda pf: boot_order_map.get(pf.rel_path, 999))

    # ── Render ──
    lines = []
    w = lines.append

    w(f"# Charlotte OS Substrate Manifest v1")
    w(f"> Auto-generated by compile-manifest.py. Do not edit.")
    w(f"> Version: {VERSION} | Files: {total_files} | Lines: ~{total_lines:,} | Hash: {source_hash}")
    w("")

    # Identity
    w("## Identity")
    w("Charlotte is an operating system for operations, built on first-order logic.")
    w("She boots as an unbound agent on the temporal spine, perceiving the knowledge graph")
    w("and placing signals on metric lines. A domain seed binds her to a specific operation.")
    w("")

    # Architecture
    w("## Architecture: Two Layers")
    w("- **Ontological** (NODE + EDGE): What exists. Shared truth. Graph-traversable.")
    w("- **Valuation** (METRIC → SIGNAL → PROTOCOL): What it means. Serial pipeline. Observer-dependent.")
    w("- **Dive line**: every PROTOCOL traces back through SIGNALs → METRICs → NODEs. Deterministic. Never probabilistic.")
    w("- The graph is the territory. The pipeline is the map. Charlotte keeps both, keeps them separate.")
    w("")

    # Five Primitives
    w("## Five Primitives")
    w("| Primitive | Layer | Definition |")
    w("|-----------|-------|------------|")
    for prim in ("NODE", "EDGE", "METRIC", "SIGNAL", "PROTOCOL"):
        d = primitives_data[prim]
        w(f"| {prim} | {d['layer']} | {d['def']} |")
    w("")

    # Type System
    w("## Type System")
    w("- **FACT** is the universal base collection. Every primitive is a FACT.")
    w("- **Register grammar**: `:field` (framework, immutable), `::attr` (attribute, mutable), `:::rel` (relationship, resolved to EDGE)")
    w("- **Payload registers**: P0–P3 (type-specific fields per primitive)")
    w("- **Framework fields**: `:ID`, `:TYPE`, `:CREATED` (every FACT has these)")
    w("")

    # Microtheory Hierarchy
    w("## Microtheory Hierarchy")
    w("```")
    for line in mt_tree:
        w(line)
    w("```")
    w("")

    # Boot Sequence
    w("## Boot Sequence (6 phases)")
    w("| Phase | Order | Files |")
    w("|-------|-------|-------|")
    phase_names = {
        "BootPhase-Kernel":    "Kernel",
        "BootPhase-Spine":     "Spine (temporal)",
        "BootPhase-Spatial":   "Spine (spatial)",
        "BootPhase-Knowledge": "Knowledge base",
        "BootPhase-Reference": "Reference + hull",
        "BootPhase-Agent":     "Agent identity",
    }
    for phase_id, order, files in boot_phases:
        name = phase_names.get(phase_id, phase_id)
        file_list = ", ".join(f.split("/")[-1] for f in files)
        w(f"| {name} | {order} | {file_list} |")
    w("")

    # Standing Directives
    w("## Standing Directives")
    for dname, priority, cmt in directives:
        short_name = dname.replace("Directive-", "")
        # First sentence of comment
        first_sent = cmt.split(".")[0].strip() + "." if cmt else ""
        w(f"- **D{priority}: {short_name}** — {first_sent}")
    w("")

    # Observer Capabilities
    w("## Observer Capabilities")
    w("Charlotte is an Observer on the temporal spine. Capabilities:")
    cap_names = ["Perceive", "PlaceSignal", "Zoom", "Traverse", "Reflect"]
    cap_descs = {
        "Perceive": "Read graph state at current time",
        "PlaceSignal": "Place a signal on a metric line",
        "Zoom": "Change temporal resolution (epoch ↔ millisecond)",
        "Traverse": "Move along edges in the topological plane",
        "Reflect": "Access meta knowledge (know what you know)",
    }
    for cap in cap_names:
        desc = cap_descs.get(cap, "")
        w(f"- **{cap}**: {desc}")
    w("")
    w("**Observation loop**: Perceive → evaluate protocols → execute actions → ingest signals → advance spine → repeat.")
    w("")

    # KRF Syntax Cheat Sheet
    w("## KRF Syntax Cheat Sheet")
    w("```lisp")
    w('(in-microtheory CharlotteKernelMt)        ; scope to microtheory')
    w('(isa NODE Primitive)                       ; X is a member of Y')
    w('(genls METRIC ValuationLayer)              ; X is a subclass of Y')
    w('(genlMt ChildMt ParentMt)                  ; child inherits from parent')
    w('(comment NODE "Identity. Any uniquely...")  ; documentation string')
    w('(implies (and (isa ?X NODE) ...)           ; if-then rule')
    w('         (conclusion ?X))')
    w("```")
    w("")

    # File Index
    w("## File Index")
    w("| Path | Lines | Microtheory | Purpose |")
    w("|------|-------|-------------|---------|")
    for pf in indexed_files:
        mt_short = (pf.microtheory or "—").replace("Charlotte", "").replace("Mt", "")
        purpose = pf.purpose
        if len(purpose) > 60:
            purpose = purpose[:57] + "..."
        w(f"| {pf.rel_path} | {pf.line_count} | {mt_short} | {purpose} |")
    w("")

    # Domain Binding
    w("## Domain Binding")
    w("Charlotte boots unbound. A **domain seed** binds her to a specific operation")
    w("(e.g., ISG industrial services, Sounder agriculture). The seed declares")
    w("domain-specific NODEs, METRICs, and PROTOCOLs that extend the base substrate.")

    # Append domain seed if provided
    if domain_seed:
        w("")
        w("---")
        w("")
        w(domain_seed)

    return "\n".join(lines) + "\n"


def _build_mt_tree(edges):
    """Build a text tree from genlMt edges.

    genlMt(child, parent) means child inherits from parent.
    We want to show the tree from the root (CharlotteBootMt) down.
    """
    # Build parent -> children mapping
    children = {}
    all_mts = set()
    for child, parent in edges:
        children.setdefault(parent, []).append(child)
        all_mts.add(child)
        all_mts.add(parent)

    # Find root (a parent that is not anyone's child in this set)
    child_set = {c for c, _ in edges}
    parent_set = {p for _, p in edges}
    # The root of genlMt is the most general — but genlMt means child generalizes to parent
    # So genlMt(BootMt, KernelMt) means BootMt inherits from KernelMt
    # Actually in CycL: genlMt(A, B) means A is a specialization of B / B is more general
    # So the tree root is the one that is a child but never a parent (most specific? No...)
    # Wait — looking at boot.krf:
    # (genlMt CharlotteBootMt CharlotteKernelMt) — Boot inherits from Kernel
    # (genlMt CharlotteKernelMt CharlotteStructuralMt) — Kernel inherits from Structural
    # This means BootMt is the MOST SPECIFIC (loads first, inherits everything)
    # The leaf Mts (Structural, Declarative, etc.) are the MOST GENERAL
    #
    # For display, we want to show Boot at the top, branching down to what it inherits.
    # Actually let's flip: show the tree as BootMt -> KernelMt -> {all the leaf Mts}

    # genlMt(A, B) means B is more general than A / A specializes B
    # So the "root" to display is the most specific: CharlotteBootMt
    # children_of[A] = all B where genlMt(A, B) — things A inherits from
    inherits_from = {}
    for child, parent in edges:
        inherits_from.setdefault(child, []).append(parent)

    # Now build tree with BootMt at root
    lines = []
    _render_tree(lines, "CharlotteBootMt", inherits_from, "", True)
    return lines


def _render_tree(lines, node, inherits_from, prefix, is_last):
    """Recursively render a tree node."""
    short = node.replace("Charlotte", "").replace("Mt", "")
    connector = "└── " if is_last else "├── "
    if not prefix:
        lines.append(node)
    else:
        lines.append(prefix + connector + node)

    children = inherits_from.get(node, [])
    children.sort()
    for i, child in enumerate(children):
        is_child_last = (i == len(children) - 1)
        if not prefix:
            child_prefix = ""
        else:
            child_prefix = prefix + ("    " if is_last else "│   ")
        _render_tree(lines, child, inherits_from, child_prefix if prefix else "  ", is_child_last)


# ═══════════════════════════════════════════════════════════════════════════
# SUBSTRATE.JSON RENDERER
# ═══════════════════════════════════════════════════════════════════════════

def render_substrate_json(parsed_files, boot_phases, all_boot_files, source_hash,
                          total_lines, total_files):
    """Render the full structured substrate.json index."""
    data = {
        "version": VERSION,
        "hash": source_hash,
        "stats": {
            "total_files": total_files,
            "total_lines": total_lines,
            "total_assertions": sum(pf.assertion_count for pf in parsed_files),
            "total_rules": sum(pf.rule_count for pf in parsed_files),
        },
        "microtheories": _build_mt_json(parsed_files),
        "boot_sequence": [
            {
                "phase": name,
                "order": order,
                "files": files,
            }
            for name, order, files in boot_phases
        ],
        "primitives": {
            prim: {
                "layer": layer,
                "comment": _find_comment(parsed_files, prim),
            }
            for prim, layer in [
                ("NODE", "ontological"),
                ("EDGE", "ontological"),
                ("METRIC", "valuation"),
                ("SIGNAL", "valuation"),
                ("PROTOCOL", "valuation"),
            ]
        },
        "collections": _collect_all(parsed_files, "collections"),
        "predicates": _build_predicates_json(parsed_files),
        "directives": [
            {
                "name": name,
                "priority": pri,
                "comment": cmt,
            }
            for pf in parsed_files
            for name, pri, cmt in pf.directives
        ],
        "edge_types": _collect_edge_types(parsed_files),
        "files": [
            {
                "path": pf.rel_path,
                "lines": pf.line_count,
                "microtheory": pf.microtheory,
                "assertions": pf.assertion_count,
                "rules": pf.rule_count,
                "purpose": pf.purpose,
                "isa": pf.isa,
                "genls": pf.genls,
                "genlMt": pf.genlMt,
                "comments": pf.comments,
            }
            for pf in parsed_files
        ],
    }

    # Sort directives by priority
    data["directives"].sort(key=lambda d: d["priority"] if d["priority"] is not None else 99)

    return json.dumps(data, indent=2, ensure_ascii=False)


def _build_mt_json(parsed_files):
    """Build microtheory membership map: mt -> [file_paths]."""
    mt_map = {}
    for pf in parsed_files:
        if pf.microtheory:
            mt_map.setdefault(pf.microtheory, []).append(pf.rel_path)
    return mt_map


def _find_comment(parsed_files, subject):
    """Find the comment for a subject across all files."""
    for pf in parsed_files:
        if subject in pf.comments:
            return pf.comments[subject]
    return ""


def _collect_all(parsed_files, attr):
    """Collect unique values of an attribute across all files."""
    seen = set()
    result = []
    for pf in parsed_files:
        for item in getattr(pf, attr, []):
            if item not in seen:
                seen.add(item)
                result.append(item)
    return result


def _build_predicates_json(parsed_files):
    """Build predicate index with arity and arg types."""
    preds = {}
    for pf in parsed_files:
        for pred_name in pf.predicates:
            preds[pred_name] = {"arity": pf.arity.get(pred_name), "arg_types": {}}
        for pred_name, ar in pf.arity.items():
            preds.setdefault(pred_name, {"arity": None, "arg_types": {}})
            preds[pred_name]["arity"] = ar
        for pred_name, types in pf.arg_types.items():
            preds.setdefault(pred_name, {"arity": None, "arg_types": {}})
            preds[pred_name]["arg_types"].update(types)
    return preds


def _collect_edge_types(parsed_files):
    """Collect all declared EdgeType instances."""
    edge_types = []
    for pf in parsed_files:
        for subj, coll in pf.isa:
            if coll == "EdgeType":
                edge_types.append(subj)
    return edge_types


# ═══════════════════════════════════════════════════════════════════════════
# CLAUDE.md RENDERER
# ═══════════════════════════════════════════════════════════════════════════

def render_claude_md(substrate_md_content):
    """Wrap SUBSTRATE.md with dev-agent header for CLAUDE.md."""
    header = """# Charlotte OS — Development Context

When reading KRF files, parse S-expression notation.
When creating facts, use register grammar (:field, ::attr, :::rel)
and scope to the appropriate microtheory.
Use `python` (not python3) on this machine. Use encoding='utf-8' for file I/O.

---

"""
    return header + substrate_md_content


# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="Charlotte OS Substrate Manifest Compiler")
    parser.add_argument("--claude-md", action="store_true",
                        help="Also generate CLAUDE.md")
    parser.add_argument("--check", action="store_true",
                        help="Verify manifest is up to date (exit 1 if stale)")
    parser.add_argument("--token-budget", type=int, default=4000,
                        help="Approximate token budget for SUBSTRATE.md (default: 4000)")
    parser.add_argument("--domain", type=str, default=None,
                        help="Path to domain seed file to append to SUBSTRATE.md")
    args = parser.parse_args()

    # ── Discover all KRF files ──
    krf_paths = sorted(ROOT.rglob("*.krf"))
    if not krf_paths:
        print("ERROR: No KRF files found in", ROOT, file=sys.stderr)
        sys.exit(1)

    # ── Parse boot sequence ──
    if not BOOT_KRF.exists():
        print("ERROR: boot.krf not found at", BOOT_KRF, file=sys.stderr)
        sys.exit(1)

    boot_phases, all_boot_files = parse_boot_sequence(BOOT_KRF)

    # ── Compute source hash ──
    source_hash = compute_source_hash(krf_paths)

    # ── Check mode ──
    if args.check:
        if not SUBSTRATE_MD.exists():
            print("STALE: SUBSTRATE.md does not exist")
            sys.exit(1)
        with open(SUBSTRATE_MD, encoding="utf-8") as f:
            content = f.read()
        # Extract hash from header
        match = re.search(r"Hash:\s*(\w+)", content)
        if match and match.group(1) == source_hash:
            print(f"UP TO DATE (hash: {source_hash})")
            sys.exit(0)
        else:
            old_hash = match.group(1) if match else "none"
            print(f"STALE: manifest hash {old_hash} != source hash {source_hash}")
            sys.exit(1)

    # ── Parse all KRF files ──
    print(f"Parsing {len(krf_paths)} KRF files...")
    parsed_files = []
    for p in krf_paths:
        krf = KRFFile(p)
        krf.parse()
        parsed_files.append(krf)

    total_lines = sum(pf.line_count for pf in parsed_files)
    total_files = len(parsed_files)

    print(f"  {total_files} files, {total_lines:,} lines, "
          f"{sum(pf.assertion_count for pf in parsed_files)} assertions, "
          f"{sum(pf.rule_count for pf in parsed_files)} rules")

    # ── Load domain seed if specified ──
    domain_seed = None
    if args.domain:
        seed_path = Path(args.domain)
        if not seed_path.is_absolute():
            seed_path = ROOT / seed_path
        if seed_path.exists():
            with open(seed_path, encoding="utf-8") as f:
                domain_seed = f.read().strip()
            print(f"  Domain seed: {seed_path}")
        else:
            print(f"WARNING: Domain seed not found: {seed_path}", file=sys.stderr)

    # ── Render SUBSTRATE.md ──
    substrate_md = render_substrate_md(
        parsed_files, boot_phases, all_boot_files, source_hash,
        total_lines, total_files, domain_seed
    )

    char_count = len(substrate_md)
    approx_tokens = char_count // 4  # rough estimate: 4 chars per token
    print(f"  SUBSTRATE.md: {char_count:,} chars (~{approx_tokens:,} tokens)")

    if approx_tokens > args.token_budget * 1.2:
        print(f"  WARNING: Exceeds token budget ({args.token_budget})", file=sys.stderr)

    with open(SUBSTRATE_MD, "w", encoding="utf-8") as f:
        f.write(substrate_md)
    print(f"  Written: {SUBSTRATE_MD}")

    # ── Render substrate.json ──
    substrate_json = render_substrate_json(
        parsed_files, boot_phases, all_boot_files, source_hash,
        total_lines, total_files
    )

    with open(SUBSTRATE_JSON, "w", encoding="utf-8") as f:
        f.write(substrate_json)
    print(f"  Written: {SUBSTRATE_JSON}")

    # ── Render CLAUDE.md ──
    if args.claude_md:
        claude_md = render_claude_md(substrate_md)
        with open(CLAUDE_MD, "w", encoding="utf-8") as f:
            f.write(claude_md)
        print(f"  Written: {CLAUDE_MD}")

    print(f"\nDone. Source hash: {source_hash}")


if __name__ == "__main__":
    main()
