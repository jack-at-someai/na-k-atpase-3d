"""
extract_charlotte.py — Parse Charlotte docs into knowledge graph nodes.

Source: C:/dev/charlotte/docs/ (recursive)
Skips: images, JSON, JSONL, SVG, PNG files.
Categorizes by subdirectory: artifacts, agents, resonance, substrate, root.
Special handling for PAPER_*_DRAFT.md files.

Python 3.12, no external dependencies.
"""

import os
import re
import sys


# File extensions to skip
SKIP_EXTENSIONS = {'.json', '.jsonl', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.bmp'}


def slugify(name):
    """Lowercase, strip non-alphanumeric, spaces/hyphens to underscores."""
    s = name.strip().lower()
    s = re.sub(r'[^a-z0-9\s_]', '', s)
    s = re.sub(r'\s+', '_', s)
    return s


def categorize_path(filepath, docs_root):
    """Determine category from file path relative to docs root."""
    rel = os.path.relpath(filepath, docs_root).replace('\\', '/')
    parts = rel.split('/')

    if len(parts) > 1:
        subdir = parts[0].lower()
        if subdir == 'artifacts':
            return 'artifact'
        elif subdir == 'agents':
            return 'agent'
        elif subdir == 'resonance':
            return 'resonance'
        elif subdir == 'substrate':
            return 'substrate'
        elif subdir == 'people':
            return 'people'
        else:
            return subdir
    return 'root'


def extract_paper_number(filename):
    """Extract paper number from PAPER_N_*_DRAFT.md pattern."""
    match = re.match(r'PAPER_(\d+)_', filename)
    if match:
        return int(match.group(1))
    return None


def parse_md_file(filepath):
    """Extract title from first H1 and first paragraph as description."""
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    lines = text.split('\n')

    # Extract title from first H1
    title = None
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('# ') and not stripped.startswith('## '):
            title = stripped[2:].strip()
            break

    # Extract first non-empty paragraph
    desc = None
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        if (not stripped
                or stripped.startswith('#')
                or stripped.startswith('---')
                or stripped.startswith('|')
                or stripped.startswith('**')):
            i += 1
            continue
        # Collect paragraph
        para_lines = []
        while i < len(lines) and lines[i].strip():
            line_s = lines[i].strip()
            if line_s.startswith('#') or line_s.startswith('---') or line_s.startswith('|'):
                break
            para_lines.append(line_s)
            i += 1
        if para_lines:
            desc = ' '.join(para_lines)
            break
        i += 1

    return title, desc


def extract_charlotte(base_path='C:/dev/charlotte/docs/'):
    """Returns list of {id, type:'document', label, desc, category, paper_number, source_path}"""
    nodes = []

    for root, dirs, files in os.walk(base_path):
        for fname in sorted(files):
            filepath = os.path.join(root, fname)
            _, ext = os.path.splitext(fname)

            # Skip non-document files
            if ext.lower() in SKIP_EXTENSIONS:
                continue

            # Only process .md files
            if ext.lower() != '.md':
                continue

            category = categorize_path(filepath, base_path)

            # Parse the markdown
            title, desc = parse_md_file(filepath)

            # Fallback title from filename
            basename = os.path.splitext(fname)[0]
            if not title:
                title = basename.replace('_', ' ').title()

            # Paper number extraction
            paper_number = extract_paper_number(fname)

            # Node ID from filename (without extension)
            node_id = 'doc_' + slugify(basename)

            nodes.append({
                'id': node_id,
                'type': 'document',
                'label': title,
                'desc': desc,
                'category': category,
                'paper_number': paper_number,
                'source_path': filepath.replace('\\', '/'),
            })

    return nodes


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    nodes = extract_charlotte()

    # Summary by category
    categories = {}
    papers = []
    for n in nodes:
        cat = n['category']
        categories[cat] = categories.get(cat, 0) + 1
        if n['paper_number'] is not None:
            papers.append(n)

    print(f'Extracted {len(nodes)} document nodes from Charlotte docs:\n')

    print('By category:')
    for cat, count in sorted(categories.items()):
        print(f'  {cat}: {count}')
    print()

    if papers:
        print(f'Papers ({len(papers)}):')
        for p in sorted(papers, key=lambda x: x['paper_number']):
            print(f'  Paper {p["paper_number"]}: {p["label"]}')
        print()

    print('All nodes:')
    for n in nodes:
        desc_str = (n['desc'][:70] + '...') if n['desc'] and len(n['desc']) > 70 else (n['desc'] or '(no description)')
        paper_str = f' [Paper {n["paper_number"]}]' if n['paper_number'] is not None else ''
        print(f'  [{n["category"]}] {n["id"]}: {n["label"]}{paper_str}')
        print(f'    {desc_str}')
        print()
