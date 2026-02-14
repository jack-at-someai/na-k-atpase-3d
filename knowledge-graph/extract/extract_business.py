"""
extract_business.py — Parse business directories into knowledge graph nodes.

Source: C:/dev/business/
Creates BusinessEntity nodes per directory and DocumentArtifact nodes per file.
Handles .md files (title + desc), .krf files (microtheory + fact count),
and checks for forecast.html.

Python 3.12, no external dependencies.
"""

import os
import re
import sys


BUSINESS_DIRS = [
    'allstate-manufacturing',
    'cardvault',
    'gesdate',
    'industrial-service-group',
    'lineleap',
    'sc-online-sales',
    'serengeti',
    'sounder',
    'top-tier-moving',
    'violins',
    'wendt-group',
]


def slugify(name):
    """Lowercase, strip non-alphanumeric, spaces/hyphens to underscores."""
    s = name.strip().lower()
    s = re.sub(r'[^a-z0-9\s_]', '', s)
    s = re.sub(r'\s+', '_', s)
    return s


def title_case_dirname(dirname):
    """Convert hyphenated directory name to title case."""
    return dirname.replace('-', ' ').title()


def parse_md_file(filepath):
    """Extract title from first H1 and first paragraph as description."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
    except (OSError, UnicodeDecodeError):
        return None, None

    lines = text.split('\n')

    # Title from first H1
    title = None
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('# ') and not stripped.startswith('## '):
            title = stripped[2:].strip()
            break

    # First non-empty paragraph as description
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


def parse_krf_file(filepath):
    """Extract microtheory name and count facts from a KRF file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
    except (OSError, UnicodeDecodeError):
        return None, 0

    # Extract microtheory name
    microtheory = None
    mt_match = re.search(r'\(in-microtheory\s+(\S+)\)', text)
    if mt_match:
        microtheory = mt_match.group(1)

    # Count facts: lines starting with '(' that are not comments or in-microtheory
    fact_count = 0
    for line in text.split('\n'):
        stripped = line.strip()
        if (stripped.startswith('(')
                and not stripped.startswith('(in-microtheory')
                and not stripped.startswith(';;')):
            fact_count += 1

    return microtheory, fact_count


def extract_business(base_path='C:/dev/business/'):
    """Returns (business_nodes: list, document_nodes: list)"""
    business_nodes = []
    document_nodes = []

    for dirname in BUSINESS_DIRS:
        dirpath = os.path.join(base_path, dirname)
        if not os.path.isdir(dirpath):
            continue

        # Create BusinessEntity node
        biz_id = 'biz_' + slugify(dirname)
        biz_label = title_case_dirname(dirname)
        business_nodes.append({
            'id': biz_id,
            'type': 'business',
            'label': biz_label,
        })

        # Walk all files recursively
        for root, dirs, files in os.walk(dirpath):
            for fname in sorted(files):
                filepath = os.path.join(root, fname)
                _, ext = os.path.splitext(fname)
                ext_lower = ext.lower()

                if ext_lower == '.md':
                    title, desc = parse_md_file(filepath)
                    basename = os.path.splitext(fname)[0]
                    label = title if title else basename.replace('_', ' ').title()
                    file_slug = slugify(basename)

                    document_nodes.append({
                        'id': f'bizdoc_{slugify(dirname)}_{file_slug}',
                        'type': 'document',
                        'label': label,
                        'desc': desc,
                        'category': 'business',
                        'parent_business': dirname,
                        'source_path': filepath.replace('\\', '/'),
                    })

                elif ext_lower == '.krf':
                    microtheory, fact_count = parse_krf_file(filepath)
                    basename = os.path.splitext(fname)[0]
                    label = microtheory if microtheory else basename.replace('_', ' ').title()
                    file_slug = slugify(basename)

                    document_nodes.append({
                        'id': f'bizdoc_{slugify(dirname)}_{file_slug}',
                        'type': 'document',
                        'label': label,
                        'desc': f'KRF substrate: {microtheory or "unknown"} ({fact_count} facts)',
                        'category': 'business',
                        'parent_business': dirname,
                        'source_path': filepath.replace('\\', '/'),
                        'microtheory': microtheory,
                        'fact_count': fact_count,
                    })

        # Check for forecast.html in business directory root
        forecast_path = os.path.join(dirpath, 'forecast.html')
        if os.path.isfile(forecast_path):
            document_nodes.append({
                'id': f'bizdoc_{slugify(dirname)}_forecast',
                'type': 'document',
                'label': f'{biz_label} Forecast',
                'desc': 'Business forecast visualization',
                'category': 'business',
                'parent_business': dirname,
                'source_path': forecast_path.replace('\\', '/'),
            })

    return business_nodes, document_nodes


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    biz_nodes, doc_nodes = extract_business()

    print(f'Extracted {len(biz_nodes)} business entities and {len(doc_nodes)} document artifacts:\n')

    # Count docs per business
    docs_per_biz = {}
    krf_facts = {}
    for d in doc_nodes:
        parent = d['parent_business']
        docs_per_biz[parent] = docs_per_biz.get(parent, 0) + 1
        if 'fact_count' in d:
            krf_facts[parent] = krf_facts.get(parent, 0) + d['fact_count']

    print('Business Entities:')
    for b in biz_nodes:
        dirname = b['id'].replace('biz_', '').replace('_', '-')
        # Find matching dirname
        for d in BUSINESS_DIRS:
            if slugify(d) == b['id'].replace('biz_', ''):
                dirname = d
                break
        doc_count = docs_per_biz.get(dirname, 0)
        fact_total = krf_facts.get(dirname, 0)
        fact_str = f', {fact_total} KRF facts' if fact_total else ''
        print(f'  {b["id"]}: {b["label"]} ({doc_count} docs{fact_str})')
    print()

    print('Document Artifacts:')
    for d in doc_nodes:
        desc_str = (d['desc'][:60] + '...') if d.get('desc') and len(d['desc']) > 60 else (d.get('desc') or '(no desc)')
        print(f'  {d["id"]}: {d["label"]}')
        print(f'    {desc_str}')
        print(f'    parent: {d["parent_business"]}')
        print()
