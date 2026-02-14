"""
extract_people.py — Parse people markdown files into knowledge graph nodes.

Sources:
  - C:/dev/people/*.md
  - C:/dev/charlotte/docs/people/*.md (deduplicated by filename, people/ preferred)

Python 3.12, no external dependencies.
"""

import os
import re
import sys


def slugify(name):
    """Lowercase, strip non-alphanumeric, spaces to underscores."""
    s = name.strip().lower()
    s = re.sub(r'[^a-z0-9\s_]', '', s)
    s = re.sub(r'\s+', '_', s)
    return s


def parse_person_md(filepath):
    """Extract name (H1), role (first H2), and first paragraph from a markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    lines = text.split('\n')

    # Extract name from first H1
    name = None
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('# ') and not stripped.startswith('## '):
            name = stripped[2:].strip()
            break

    if not name:
        # Fallback to filename
        name = os.path.splitext(os.path.basename(filepath))[0].replace('_', ' ').title()

    # Extract role from first H2
    role = None
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('## ') and not stripped.startswith('### '):
            role = stripped[3:].strip()
            break

    # Extract first non-empty paragraph (skip headings, horizontal rules, blank lines)
    desc = None
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        # Skip blank lines, headings, horizontal rules, metadata, and list items
        if (not stripped
                or stripped.startswith('#')
                or stripped.startswith('---')
                or stripped.startswith('|')
                or stripped.startswith('**')
                or stripped.startswith('- ')
                or stripped.startswith('> ')):
            i += 1
            continue
        # Found a content line — collect the full paragraph
        para_lines = []
        while i < len(lines) and lines[i].strip():
            line_s = lines[i].strip()
            # Stop if we hit a heading, rule, or table
            if line_s.startswith('#') or line_s.startswith('---') or line_s.startswith('|'):
                break
            para_lines.append(line_s)
            i += 1
        if para_lines:
            desc = ' '.join(para_lines)
            break
        i += 1

    return {
        'name': name,
        'role': role,
        'desc': desc,
    }


def extract_people(base_path='C:/dev/'):
    """Returns list of {id, type:'person', label, desc, role, source_path}"""
    primary_dir = os.path.join(base_path, 'people')
    secondary_dir = os.path.join(base_path, 'charlotte', 'docs', 'people')

    # Collect files, primary takes precedence
    files_by_name = {}

    # Secondary first so primary overwrites
    if os.path.isdir(secondary_dir):
        for fname in os.listdir(secondary_dir):
            if fname.endswith('.md'):
                files_by_name[fname] = os.path.join(secondary_dir, fname)

    # Primary overwrites
    if os.path.isdir(primary_dir):
        for fname in os.listdir(primary_dir):
            if fname.endswith('.md'):
                files_by_name[fname] = os.path.join(primary_dir, fname)

    nodes = []
    for fname in sorted(files_by_name.keys()):
        filepath = files_by_name[fname]
        parsed = parse_person_md(filepath)
        node_id = 'person_' + slugify(parsed['name'])
        nodes.append({
            'id': node_id,
            'type': 'person',
            'label': parsed['name'],
            'desc': parsed['desc'],
            'role': parsed['role'],
            'source_path': filepath.replace('\\', '/'),
        })

    return nodes


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    nodes = extract_people()
    print(f'Extracted {len(nodes)} person nodes:\n')
    for n in nodes:
        role_str = f' | {n["role"]}' if n["role"] else ''
        desc_str = (n['desc'][:80] + '...') if n['desc'] and len(n['desc']) > 80 else (n['desc'] or '(no description)')
        print(f'  {n["id"]}: {n["label"]}{role_str}')
        print(f'    {desc_str}')
        print(f'    src: {n["source_path"]}')
        print()
