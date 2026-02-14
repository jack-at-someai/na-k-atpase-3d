"""
extract_references.py — Parse reference hub app.js files into normalized nodes.

Reads SECTIONS arrays from C:/dev/references/*/app.js and extracts resource
entries into a flat list of reference nodes plus domain nodes.

Two format variants exist across the 24 reference hubs:
  Variant 1: sections use `title` key, subsections use `resources` array
  Variant 2: sections use `label` key, subsections use `items` array
Some hubs mix conventions (e.g. `label` with `resources`). The parser
handles all combinations by checking for both keys.

Strategy: regex-based field extraction from JS object literals.
We never attempt to parse JS as JSON. Instead we find each resource
object block { ... } and pull individual fields with targeted patterns.
"""

import os
import re
from pathlib import Path


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _strip_backtick_strings(text: str) -> str:
    """Replace template literal strings (backtick-delimited) with empty strings.

    Handles nested backticks carefully by tracking depth. This removes the
    long HTML intro fields so they don't interfere with object extraction.
    """
    result = []
    i = 0
    while i < len(text):
        if text[i] == '`':
            # Skip everything until the matching closing backtick.
            # Template literals can contain ${...} but no nested backticks
            # in these files, so simple scan is safe.
            i += 1
            while i < len(text) and text[i] != '`':
                if text[i] == '\\':
                    i += 1  # skip escaped char
                i += 1
            i += 1  # skip closing backtick
            result.append('""')
        else:
            result.append(text[i])
            i += 1
    return ''.join(result)


def _extract_string_value(block: str, key: str) -> str | None:
    """Extract the value for a given key from a JS object literal block.

    Handles single-quoted and double-quoted values, including escaped
    quotes within the string (e.g. 'Neo4j\\'s graph library').
    Returns None if the key is not found.
    """
    # Find key: followed by a quote character
    pattern = rf'{key}\s*:\s*([\'"])'
    m = re.search(pattern, block)
    if not m:
        return None

    quote = m.group(1)
    start = m.end()  # position right after the opening quote
    i = start
    chars = []
    while i < len(block):
        ch = block[i]
        if ch == '\\' and i + 1 < len(block):
            next_ch = block[i + 1]
            if next_ch == quote:
                chars.append(next_ch)
                i += 2
                continue
            elif next_ch == '\\':
                chars.append('\\')
                i += 2
                continue
            else:
                chars.append(ch)
                chars.append(next_ch)
                i += 2
                continue
        elif ch == quote:
            return ''.join(chars)
        else:
            chars.append(ch)
        i += 1
    return None


def _extract_number_value(block: str, key: str) -> int | None:
    """Extract an integer value for a given key from a JS object literal."""
    pattern = rf'{key}\s*:\s*(\d+)'
    m = re.search(pattern, block)
    if m:
        return int(m.group(1))
    return None


def _find_sections_block(text: str) -> str:
    """Locate the SECTIONS array from the file content.

    Returns the full text of the array between the opening [ and its
    matching ].
    """
    # Find the start of the SECTIONS assignment
    m = re.search(r'(?:const\s+)?SECTIONS\s*=\s*\[', text)
    if not m:
        return ''

    start = m.end() - 1  # position of the opening [
    depth = 0
    i = start
    while i < len(text):
        ch = text[i]
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
        elif ch in ('"', "'"):
            # Skip quoted strings
            quote = ch
            i += 1
            while i < len(text) and text[i] != quote:
                if text[i] == '\\':
                    i += 1
                i += 1
        elif ch == '`':
            # Skip template literals
            i += 1
            while i < len(text) and text[i] != '`':
                if text[i] == '\\':
                    i += 1
                i += 1
        elif ch == '/' and i + 1 < len(text):
            # Skip comments
            if text[i + 1] == '/':
                while i < len(text) and text[i] != '\n':
                    i += 1
            elif text[i + 1] == '*':
                i += 2
                while i < len(text) - 1 and not (text[i] == '*' and text[i + 1] == '/'):
                    i += 1
                i += 1  # skip past /
        i += 1
    return ''


def _find_top_level_objects(array_text: str) -> list[str]:
    """Given the text of a JS array [...], find the top-level { ... } objects.

    These are the section objects within SECTIONS.
    """
    objects = []
    # We need to find { ... } at depth 1 inside the array (depth 0 = the [ itself)
    depth = 0
    i = 0
    obj_start = -1
    while i < len(array_text):
        ch = array_text[i]
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
        elif ch == '{' and depth == 1:
            # Start of a top-level object
            obj_start = i
            brace_depth = 1
            i += 1
            while i < len(array_text) and brace_depth > 0:
                c = array_text[i]
                if c == '{':
                    brace_depth += 1
                elif c == '}':
                    brace_depth -= 1
                elif c in ('"', "'"):
                    quote = c
                    i += 1
                    while i < len(array_text) and array_text[i] != quote:
                        if array_text[i] == '\\':
                            i += 1
                        i += 1
                elif c == '`':
                    i += 1
                    while i < len(array_text) and array_text[i] != '`':
                        if array_text[i] == '\\':
                            i += 1
                        i += 1
                elif c == '/' and i + 1 < len(array_text):
                    if array_text[i + 1] == '/':
                        while i < len(array_text) and array_text[i] != '\n':
                            i += 1
                    elif array_text[i + 1] == '*':
                        i += 2
                        while i < len(array_text) - 1 and not (array_text[i] == '*' and array_text[i + 1] == '/'):
                            i += 1
                        i += 1
                i += 1
            objects.append(array_text[obj_start:i])
            continue
        i += 1
    return objects


def _extract_section_name(section_text: str) -> str:
    """Extract the section name from a section object.

    Checks for both `title: '...'` and `label: '...'` at the section level.
    We look for the key before the first `subsections:` to avoid picking up
    resource-level titles.
    """
    # Find the header portion — everything before 'subsections'
    sub_idx = section_text.find('subsections')
    header = section_text[:sub_idx] if sub_idx != -1 else section_text[:500]

    # Try label first (it's unambiguous), then title
    for key in ('label', 'title'):
        val = _extract_string_value(header, key)
        if val:
            return val
    return 'Unknown'


def _extract_section_id(section_text: str) -> str:
    """Extract the section id."""
    sub_idx = section_text.find('subsections')
    header = section_text[:sub_idx] if sub_idx != -1 else section_text[:500]
    val = _extract_string_value(header, 'id')
    return val or 'unknown'


def _find_resource_arrays(section_text: str) -> list[str]:
    """Find all resources: [...] or items: [...] arrays within a section.

    Returns the text of each array (the content between [ and ]).
    """
    arrays = []
    # Look for resources: [ or items: [
    for pattern in (r'resources\s*:\s*\[', r'items\s*:\s*\['):
        for m in re.finditer(pattern, section_text):
            start = m.end() - 1  # the [
            depth = 0
            i = start
            while i < len(section_text):
                ch = section_text[i]
                if ch == '[':
                    depth += 1
                elif ch == ']':
                    depth -= 1
                    if depth == 0:
                        arrays.append(section_text[start + 1:i])
                        break
                elif ch in ('"', "'"):
                    quote = ch
                    i += 1
                    while i < len(section_text) and section_text[i] != quote:
                        if section_text[i] == '\\':
                            i += 1
                        i += 1
                elif ch == '`':
                    i += 1
                    while i < len(section_text) and section_text[i] != '`':
                        if section_text[i] == '\\':
                            i += 1
                        i += 1
                i += 1
    return arrays


def _find_resource_objects(array_text: str) -> list[str]:
    """Find individual resource objects { ... } within a resource/items array."""
    objects = []
    i = 0
    while i < len(array_text):
        ch = array_text[i]
        if ch == '{':
            obj_start = i
            depth = 1
            i += 1
            while i < len(array_text) and depth > 0:
                c = array_text[i]
                if c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                elif c in ('"', "'"):
                    quote = c
                    i += 1
                    while i < len(array_text) and array_text[i] != quote:
                        if array_text[i] == '\\':
                            i += 1
                        i += 1
                i += 1
            objects.append(array_text[obj_start:i])
        else:
            i += 1
    return objects


def _parse_resource(obj_text: str, domain: str, index: int) -> dict:
    """Parse a single resource object block into a normalized dict."""
    title = _extract_string_value(obj_text, 'title')
    author = _extract_string_value(obj_text, 'author')
    url = _extract_string_value(obj_text, 'url')
    desc = _extract_string_value(obj_text, 'desc')
    resource_type = _extract_string_value(obj_text, 'type')
    level = _extract_string_value(obj_text, 'level')

    return {
        'id': f'ref_{domain}_{index}',
        'type': 'reference',
        'label': title or 'Untitled',
        'desc': desc,
        'author': author,
        'url': url,
        'resourceType': resource_type,
        'level': level,
        'domain': domain,
    }


# ---------------------------------------------------------------------------
# Main extraction
# ---------------------------------------------------------------------------

def extract_references(base_path: str = 'C:/dev/references/') -> tuple[list[dict], list[dict]]:
    """Parse all reference hub app.js files and return normalized nodes.

    Args:
        base_path: Path to the references directory containing subdirectories
                   each with an app.js file.

    Returns:
        A tuple of (reference_nodes, domain_nodes) where each node is a dict.
    """
    base = Path(base_path)
    reference_nodes: list[dict] = []
    domain_nodes: list[dict] = []

    if not base.is_dir():
        print(f'Base path does not exist: {base_path}')
        return reference_nodes, domain_nodes

    # Sort directories for deterministic output
    dirs = sorted(
        d for d in base.iterdir()
        if d.is_dir() and (d / 'app.js').exists()
    )

    for d in dirs:
        domain = d.name
        app_js = d / 'app.js'

        # Create domain node
        nice_label = domain.replace('-', ' ').title()
        domain_nodes.append({
            'id': f'domain_{domain}',
            'type': 'domain',
            'label': nice_label,
        })

        # Read and parse
        try:
            content = app_js.read_text(encoding='utf-8')
        except Exception as e:
            print(f'  Warning: could not read {app_js}: {e}')
            continue

        sections_block = _find_sections_block(content)
        if not sections_block:
            print(f'  Warning: no SECTIONS array found in {app_js}')
            continue

        # Strip template literals to simplify parsing
        cleaned = _strip_backtick_strings(sections_block)

        # Find top-level section objects
        section_objects = _find_top_level_objects(cleaned)

        domain_index = 0
        for sec_text in section_objects:
            # Find resource/items arrays within this section
            resource_arrays = _find_resource_arrays(sec_text)

            for arr_text in resource_arrays:
                resource_objects = _find_resource_objects(arr_text)
                for obj_text in resource_objects:
                    node = _parse_resource(obj_text, domain, domain_index)
                    if node['label'] != 'Untitled':
                        reference_nodes.append(node)
                        domain_index += 1

    return reference_nodes, domain_nodes


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == '__main__':
    nodes, domains = extract_references()
    print(f'Domains:    {len(domains)}')
    print(f'References: {len(nodes)}')
    print()

    # Breakdown per domain
    from collections import Counter
    by_domain = Counter(n['domain'] for n in nodes)
    for domain, count in sorted(by_domain.items()):
        print(f'  {domain:30s} {count:4d} resources')

    # Type breakdown
    print()
    by_type = Counter(n['resourceType'] for n in nodes)
    for t, count in sorted(by_type.items(), key=lambda x: -x[1]):
        print(f'  {t or "unknown":15s} {count:4d}')
