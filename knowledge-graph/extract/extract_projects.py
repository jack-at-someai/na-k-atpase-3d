"""
extract_projects.py — Inventory game, math, and tool project directories.

Sources:
  - C:/dev/games/   -> category 'game'
  - C:/dev/math/    -> category 'math'
  - C:/dev/tools/   -> category 'tool'

Extracts <title> from index.html when present, falls back to directory name.

Python 3.12, no external dependencies.
"""

import os
import re
import sys


CATEGORY_MAP = {
    'games': 'game',
    'math': 'math',
    'tools': 'tool',
}


def slugify(name):
    """Lowercase, strip non-alphanumeric, spaces/hyphens to underscores."""
    s = name.strip().lower()
    s = re.sub(r'[^a-z0-9\s_]', '', s)
    s = re.sub(r'\s+', '_', s)
    return s


def extract_html_title(filepath):
    """Extract content of <title> tag from an HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read(8192)  # Read first 8KB — title is always near the top
    except (OSError, UnicodeDecodeError):
        return None

    match = re.search(r'<title[^>]*>(.*?)</title>', text, re.IGNORECASE | re.DOTALL)
    if match:
        title = match.group(1).strip()
        # Clean up any HTML entities
        title = title.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
        title = title.replace('&#8212;', '\u2014').replace('&mdash;', '\u2014')
        title = title.replace('&#x2014;', '\u2014')
        if title:
            return title
    return None


def extract_projects(base_path='C:/dev/'):
    """Returns list of {id, type:'project', label, category: 'game'|'math'|'tool', source_path}"""
    nodes = []

    for folder_name, category in CATEGORY_MAP.items():
        folder_path = os.path.join(base_path, folder_name)
        if not os.path.isdir(folder_path):
            continue

        for dirname in sorted(os.listdir(folder_path)):
            dirpath = os.path.join(folder_path, dirname)
            if not os.path.isdir(dirpath):
                continue

            # Try to extract title from index.html
            index_path = os.path.join(dirpath, 'index.html')
            title = None
            if os.path.isfile(index_path):
                title = extract_html_title(index_path)

            # Fallback to directory name
            if not title:
                title = dirname.replace('-', ' ').replace('_', ' ').title()

            node_id = f'proj_{category}_{slugify(dirname)}'
            nodes.append({
                'id': node_id,
                'type': 'project',
                'label': title,
                'category': category,
                'source_path': dirpath.replace('\\', '/'),
            })

    return nodes


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    nodes = extract_projects()

    # Group by category
    by_cat = {}
    for n in nodes:
        cat = n['category']
        if cat not in by_cat:
            by_cat[cat] = []
        by_cat[cat].append(n)

    print(f'Extracted {len(nodes)} project nodes:\n')

    for cat in ['game', 'math', 'tool']:
        cat_nodes = by_cat.get(cat, [])
        print(f'{cat.upper()} ({len(cat_nodes)}):')
        for n in cat_nodes:
            print(f'  {n["id"]}: {n["label"]}')
            print(f'    {n["source_path"]}')
        print()
