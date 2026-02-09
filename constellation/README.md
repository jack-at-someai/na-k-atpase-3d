# Constellation — Journey Brain

A 3D knowledge graph extracted from 1,754 images of one person's life — rendered as a constellation of stars you can talk to and watch think.

## What This Is

Jack Richard has 1,754 images spanning a decade: family on boats, LineLeap launch nights at Kilroys, messages from FSU sales reps praising his app redesign, Marcus Aurelius quotes shared at 2am, Buckminster Fuller's geodesic sphere with "convert WEAPONRY to LIVINGRY," a museum exhibit in Africa where someone built a physical 3D knowledge graph out of colored nodes and golden edges above a miniature forest — the very thing we're building here, photographed years before it was built.

Every image is a signal. Every signal encodes entities, relationships, and meaning. Constellation extracts that meaning into a sparse knowledge graph, renders it as a 3D force-directed constellation in the browser, and lets you talk to it through your microphone. When you ask a question, you watch the graph light up — nodes pulse, trails arc between them, the camera follows the traversal path. The black box becomes transparent. You see the thinking happen.

## The Knowledge Graph

**47 nodes, 66 edges, 12 clusters** (seed — extracted from ~20 manually analyzed images).

The graph encodes:

- **People**: Jack Richard, Jim Richard (father), Joseph Richard (brother), Donald Almquist (grandfather), Nick Becker, John Sutor (FSU LineLeap rep), the Northwestern cohort
- **Ventures**: LineLeap (human behavior), Sounder/Trogdon (biological systems), ISG (mechanical systems), Prier Violins (cultural artifacts), Charlotte (convergence), SomeAI, Serengeti Enterprises
- **Places**: Lake Forest (origin), Northwestern University, Kilroy's on Kirkwood, Florida State University
- **Philosophy**: Marcus Aurelius (Stoicism), William Faulkner (courage), Benjamin Franklin (self-improvement), Mike Tyson (mental discipline), Buckminster Fuller (systems thinking, livingry)
- **Concepts**: Convex Hull Journey (four vertices converging into Charlotte), Temporal Torus (generational topology), Cognitive Science Hexagon, Entrepreneurial Resilience, Stoicism, Network/Graph Aesthetic, Biomimicry
- **Art**: Spider web neural networks (Midjourney), biomechanical beetle, biomechanical spider (Charlotte personified), African family 3D knowledge graph (museum), fantasy treehouse city
- **Music**: 93,308 Spotify minutes (top 2% US), Mac Miller, guitar
- **Events**: Family boat trip (~2014), Northwestern cohort photo (2018), Kilroy's LineLeap night (2021), LineLeap emotional support message (2020)

Each node has a type, cluster, color, properties, temporal range, and source images. Each edge has a type and label. Clusters map to the JOURNEY archive taxonomy (01_ORIGIN through 11_LIFE).

## Architecture

```
constellation/
├── server.py                    # Python HTTP server + Claude API proxy
├── public/
│   ├── index.html               # App shell
│   ├── style.css                # Dark space constellation theme
│   ├── js/
│   │   ├── graph.js             # Three.js 3D force-directed graph engine
│   │   ├── voice.js             # Web Speech API STT/TTS
│   │   └── app.js               # Orchestrator — wires graph + voice + query
│   └── data/
│       └── knowledge-graph.json # The extracted knowledge graph
└── extract/
    └── extract.py               # Batch image → knowledge extraction via Claude Vision API
```

**No build step. No npm. No bundler.** Python stdlib server, CDN-loaded Three.js, vanilla JavaScript. Opens in Chrome.

## How It Works

1. **Server** (`server.py`) — Python HTTP server on port 3333. Serves static files. Proxies voice queries to Claude API. Falls back to local keyword-based graph traversal when no API key is set.

2. **3D Graph** (`graph.js`) — Custom Three.js force-directed layout. Nodes are glowing spheres sized by connection count, color-coded by cluster. Edges are translucent lines. 3,000 background stars. Orbit controls with auto-rotation. Force simulation: repulsion between all nodes, attraction along edges, cluster gravity, center gravity.

3. **Voice** (`voice.js`) — Web Speech API SpeechRecognition for STT. SpeechSynthesis for TTS. Hold Space or click the mic button to speak. Interim transcription shown in real time.

4. **Query Engine** (`app.js`) — Extracts keywords from speech, finds matching nodes in the graph via text search across labels and properties, builds graph context (entities + relationships), sends to Claude API with system prompt instructing it to respond as the constellation's voice, receives response + traversed node IDs.

5. **Traversal Animation** (`graph.js`) — When a query returns traversed node IDs, the graph animates: all nodes dim, then each traversed node pulses bright sequentially, trail arcs draw between them, connected edges glow cyan, camera follows the path. After traversal, activated nodes stay bright. This is the "open black box" — you see which knowledge was accessed to form the answer.

## Running

```bash
cd constellation
python server.py
# Open http://localhost:3333 in Chrome
```

With Claude API for smarter answers:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
python server.py
```

## Extracting from Remaining Images

The seed graph comes from ~20 images I analyzed manually. 1,734 remain in the JOURNEY archive. The extraction pipeline processes them through Claude Vision API:

```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# Preview
python extract/extract.py --dry-run

# Process first 50 images
python extract/extract.py --execute --limit 50

# Process a specific folder
python extract/extract.py --execute --folder 10_SOCIAL

# Process everything
python extract/extract.py --execute

# Re-merge cached fragments without re-processing
python extract/extract.py --merge-only
```

Each image is sent to Claude Vision with a detective prompt. The response is structured JSON: nodes, edges, image description, temporal signal, content type. Results are cached (won't re-process the same image). After processing, fragments are merged into `knowledge-graph.json` — deduplicating entities, adding new source references, preserving existing data.

Every batch adds more stars to the constellation.

## The Deeper Point

This project is proof of Charlotte's thesis in miniature. Charlotte says: any domain where identities emit signals over time can be modeled as a knowledge graph on a spatiotemporal substrate. The JOURNEY archive is exactly that — 1,754 signals emitted by one identity over a decade. The constellation is the substrate made visible.

The museum exhibit Jack photographed in Africa — colored nodes connected by golden edges above a miniature forest — was Charlotte before Charlotte existed. The cognitive science hexagon he saved from Flipboard was the interdisciplinary map before he knew he needed one. The Midjourney spider webs were the visual language of graph infrastructure before the infrastructure was built. The Buckminster Fuller quote about converting technology from weaponry to livingry was the mission statement before the mission was articulated.

The graph doesn't just show what Jack knows. It shows how the knowing happened — which ideas influenced which, which people appeared at which moments, which images foreshadowed which systems. The traversal animation makes this visible: you ask a question and watch the constellation light up, tracing the path from stoic philosophy through entrepreneurial resilience through the convex hull through Charlotte.

The black box is no longer a black box.
