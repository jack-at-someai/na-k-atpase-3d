#!/usr/bin/env python3
"""
Constellation — Batch Image Knowledge Extraction Pipeline

Processes JOURNEY archive images through Claude Vision API
to extract structured knowledge graph nodes and edges.

Usage:
  python extract.py --dry-run                    # Preview what will be processed
  python extract.py --execute --limit 10         # Process first 10 images
  python extract.py --execute                    # Process all images
  python extract.py --execute --folder 10_SOCIAL # Process one folder only

Requires:
  pip install anthropic
  export ANTHROPIC_API_KEY=sk-ant-...
"""

import os
import sys
import json
import time
import base64
import hashlib
import argparse
from pathlib import Path
from datetime import datetime

JOURNEY_ROOT = Path(__file__).parent.parent.parent / "assets" / "JOURNEY"
OUTPUT_DIR = Path(__file__).parent / "fragments"
GRAPH_PATH = Path(__file__).parent.parent / "public" / "data" / "knowledge-graph.json"
CACHE_DIR = Path(__file__).parent / "cache"

SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB limit for API

EXTRACTION_PROMPT = """Analyze this image from a personal journey archive. Extract ALL knowledge you can deduce.

Return a JSON object with this exact structure:
{
  "nodes": [
    {
      "id": "suggested-id",
      "type": "person|place|company|concept|event|quote|music|artwork|artifact|group",
      "label": "Human readable name",
      "cluster": "origin|lineleap|sounder|isg|prier|charlotte|advisory|philosophy|creative|social|life|torus",
      "properties": {
        "description": "...",
        // any other relevant properties you can extract
      },
      "confidence": 0.9
    }
  ],
  "edges": [
    {
      "source": "node-id",
      "target": "node-id",
      "type": "relationship-type",
      "label": "human readable relationship"
    }
  ],
  "image_description": "One sentence describing what the image shows",
  "temporal_signal": "YYYY-MM-DD or date range if detectable, null otherwise",
  "content_type": "photo|screenshot|meme|art|diagram|document|other"
}

Be a detective. Extract:
- People visible (appearance, clothing, context clues)
- Locations (signs, landmarks, architecture)
- Text content (messages, captions, quotes, UI text)
- Objects and brands
- Emotional context and significance
- Relationships between entities
- Temporal clues (dates, seasons, events)

Use lowercase-kebab-case for all IDs. Be specific, not generic.
Return ONLY the JSON, no markdown formatting."""


def get_image_base64(filepath):
    """Read image and return base64 encoded string."""
    with open(filepath, 'rb') as f:
        data = f.read()
    return base64.standard_b64encode(data).decode('utf-8')


def get_media_type(filepath):
    """Get MIME type for image."""
    ext = filepath.suffix.lower()
    return {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
    }.get(ext, 'image/jpeg')


def get_cache_key(filepath):
    """Generate cache key from file path and size."""
    stat = filepath.stat()
    key_str = f"{filepath}:{stat.st_size}:{stat.st_mtime}"
    return hashlib.md5(key_str.encode()).hexdigest()


def extract_from_image(filepath, client, cache_dir):
    """Extract knowledge from a single image using Claude Vision API."""
    cache_key = get_cache_key(filepath)
    cache_file = cache_dir / f"{cache_key}.json"

    # Check cache
    if cache_file.exists():
        with open(cache_file) as f:
            return json.load(f)

    # Check file size
    if filepath.stat().st_size > MAX_FILE_SIZE:
        print(f"  SKIP (too large): {filepath.name}")
        return None

    try:
        image_data = get_image_base64(filepath)
        media_type = get_media_type(filepath)

        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1500,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data,
                        }
                    },
                    {
                        "type": "text",
                        "text": EXTRACTION_PROMPT
                    }
                ]
            }]
        )

        text = response.content[0].text

        # Parse JSON from response
        json_match = text.strip()
        if json_match.startswith('```'):
            json_match = json_match.split('```')[1]
            if json_match.startswith('json'):
                json_match = json_match[4:]

        result = json.loads(json_match)
        result['_source_file'] = str(filepath.relative_to(JOURNEY_ROOT))
        result['_extracted_at'] = datetime.now().isoformat()

        # Cache the result
        cache_dir.mkdir(parents=True, exist_ok=True)
        with open(cache_file, 'w') as f:
            json.dump(result, f, indent=2)

        return result

    except json.JSONDecodeError as e:
        print(f"  JSON PARSE ERROR: {filepath.name}: {e}")
        return None
    except Exception as e:
        print(f"  API ERROR: {filepath.name}: {e}")
        return None


def collect_images(folder=None):
    """Collect all processable images from JOURNEY archive."""
    images = []

    if folder:
        search_root = JOURNEY_ROOT / folder
    else:
        search_root = JOURNEY_ROOT

    for root, dirs, files in os.walk(search_root):
        # Skip _incoming
        if '_incoming' in root:
            continue

        for filename in sorted(files):
            filepath = Path(root) / filename
            if filepath.suffix.lower() in SUPPORTED_EXTENSIONS:
                if filepath.stat().st_size <= MAX_FILE_SIZE:
                    images.append(filepath)

    return images


def merge_into_graph(fragments, graph_path):
    """Merge extracted fragments into the main knowledge graph."""
    # Load existing graph
    with open(graph_path) as f:
        graph = json.load(f)

    existing_node_ids = {n['id'] for n in graph['nodes']}
    existing_edge_keys = {f"{e['source']}-{e['target']}-{e['type']}" for e in graph['edges']}

    new_nodes = 0
    new_edges = 0

    for fragment in fragments:
        if not fragment:
            continue

        # Add new nodes
        for node in fragment.get('nodes', []):
            if node['id'] not in existing_node_ids:
                # Set defaults
                cluster_colors = {
                    'origin': '#64748b', 'lineleap': '#f59e0b', 'sounder': '#10b981',
                    'isg': '#ef4444', 'prier': '#ec4899', 'charlotte': '#22d3ee',
                    'advisory': '#a78bfa', 'philosophy': '#c084fc', 'creative': '#f472b6',
                    'social': '#818cf8', 'life': '#38bdf8', 'torus': '#22d3ee'
                }
                node.setdefault('color', cluster_colors.get(node.get('cluster', ''), '#94a3b8'))
                node.setdefault('size', 3)
                node['sources'] = [fragment.get('_source_file', 'unknown')]

                graph['nodes'].append(node)
                existing_node_ids.add(node['id'])
                new_nodes += 1
            else:
                # Update existing node sources
                existing = next(n for n in graph['nodes'] if n['id'] == node['id'])
                src = fragment.get('_source_file', 'unknown')
                if 'sources' not in existing:
                    existing['sources'] = []
                if src not in existing['sources']:
                    existing['sources'].append(src)

        # Add new edges
        for edge in fragment.get('edges', []):
            key = f"{edge['source']}-{edge['target']}-{edge.get('type', 'related')}"
            if key not in existing_edge_keys:
                # Only add edge if both nodes exist
                if edge['source'] in existing_node_ids and edge['target'] in existing_node_ids:
                    graph['edges'].append(edge)
                    existing_edge_keys.add(key)
                    new_edges += 1

    # Update metadata
    graph['meta']['version'] = datetime.now().strftime('%Y%m%d-%H%M%S')
    graph['meta']['seed_images_analyzed'] = len([f for f in fragments if f])

    # Write back
    with open(graph_path, 'w') as f:
        json.dump(graph, f, indent=2)

    return new_nodes, new_edges


def main():
    parser = argparse.ArgumentParser(description='Constellation — Image Knowledge Extraction')
    parser.add_argument('--dry-run', action='store_true', help='Preview without processing')
    parser.add_argument('--execute', action='store_true', help='Actually process images')
    parser.add_argument('--limit', type=int, default=0, help='Max images to process (0=all)')
    parser.add_argument('--folder', type=str, default=None, help='Process specific folder only')
    parser.add_argument('--merge-only', action='store_true', help='Only merge cached fragments')
    args = parser.parse_args()

    if not args.dry_run and not args.execute and not args.merge_only:
        parser.print_help()
        return

    images = collect_images(args.folder)
    print(f"\nConstellation — Knowledge Extraction Pipeline")
    print(f"{'─' * 46}")
    print(f"Archive root: {JOURNEY_ROOT}")
    print(f"Images found: {len(images)}")

    if args.limit > 0:
        images = images[:args.limit]
        print(f"Limited to:   {len(images)}")

    if args.dry_run:
        print(f"\nDRY RUN — would process {len(images)} images:")
        for img in images[:20]:
            print(f"  {img.relative_to(JOURNEY_ROOT)}")
        if len(images) > 20:
            print(f"  ... and {len(images) - 20} more")
        return

    if args.merge_only:
        # Load all cached fragments
        cache_dir = CACHE_DIR
        fragments = []
        if cache_dir.exists():
            for cache_file in cache_dir.glob('*.json'):
                with open(cache_file) as f:
                    fragments.append(json.load(f))
        print(f"Loaded {len(fragments)} cached fragments")
        new_nodes, new_edges = merge_into_graph(fragments, GRAPH_PATH)
        print(f"Merged: +{new_nodes} nodes, +{new_edges} edges")
        return

    # Execute extraction
    try:
        import anthropic
    except ImportError:
        print("\nERROR: pip install anthropic")
        return

    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("\nERROR: export ANTHROPIC_API_KEY=sk-ant-...")
        return

    client = anthropic.Anthropic(api_key=api_key)
    cache_dir = CACHE_DIR
    cache_dir.mkdir(parents=True, exist_ok=True)
    output_dir = OUTPUT_DIR
    output_dir.mkdir(parents=True, exist_ok=True)

    fragments = []
    errors = 0
    cached = 0

    print(f"\nProcessing {len(images)} images...\n")

    for i, img_path in enumerate(images):
        rel_path = img_path.relative_to(JOURNEY_ROOT)
        cache_key = get_cache_key(img_path)
        cache_file = cache_dir / f"{cache_key}.json"

        if cache_file.exists():
            with open(cache_file) as f:
                result = json.load(f)
            fragments.append(result)
            cached += 1
            print(f"  [{i+1}/{len(images)}] CACHED: {rel_path}")
            continue

        print(f"  [{i+1}/{len(images)}] Processing: {rel_path}...", end=' ', flush=True)

        result = extract_from_image(img_path, client, cache_dir)

        if result:
            fragments.append(result)
            nodes = len(result.get('nodes', []))
            edges = len(result.get('edges', []))
            print(f"OK ({nodes}N, {edges}E)")
        else:
            errors += 1
            print("FAILED")

        # Rate limiting — be respectful
        time.sleep(0.5)

    print(f"\n{'─' * 46}")
    print(f"Processed: {len(fragments)} images")
    print(f"Cached:    {cached}")
    print(f"Errors:    {errors}")

    # Merge into main graph
    print(f"\nMerging into knowledge graph...")
    new_nodes, new_edges = merge_into_graph(fragments, GRAPH_PATH)
    print(f"Added: +{new_nodes} nodes, +{new_edges} edges")

    # Load updated graph for summary
    with open(GRAPH_PATH) as f:
        graph = json.load(f)
    print(f"Total: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges")
    print(f"\nDone. Graph at: {GRAPH_PATH}")


if __name__ == '__main__':
    main()
