# JOURNEY Pipeline — Processing Summary

## What Was Done

Two-phase pipeline that organized 1,741 raw files from a flat photo archive into a narrative taxonomy, then extracted a FINN-primitive knowledge graph from 1,248 images via computer vision.

---

## Phase 1: Asset Organization

**Input:** 1,741 files (3.7 GB) in a single flat `assets/JOURNEY/` folder — photos, screenshots, videos, Live Photos with opaque filenames (IMG_xxxx, Snapchat-*, FB_IMG_*, etc.).

**Output:**
- **49 directories** in a numbered narrative taxonomy (`01_ORIGIN` through `11_LIFE`, plus `_incoming` and `_unsorted`)
- **`sort_journey.py`** — regex-based classifier with `--dry-run`, `--execute`, `--rename`, `--exif` flags
- **`MANIFEST.md`** — story map explaining each folder's narrative meaning
- **`CONVENTIONS.md`** — intake protocol for future file additions

**Result:** 1,741 files copied (never moved) into taxonomy. ~150 auto-sorted by filename pattern, ~178 date-prefixed but unsorted, ~1,413 staged in `_unsorted/` awaiting manual curation. Zero files lost.

**Commit:** `5c7d574`

---

## Phase 2: Knowledge Graph Extraction

**Input:** 1,467 viewable images (437 small JPG/PNG + 641 thumbnailed large images + 385 HEIC-to-JPEG conversions). 271 videos and 3 corrupt files excluded.

**Method:**
- Split images into 30 segments of ~48 each
- Launched 30 parallel agents (Sonnet model) for visual analysis
- Each agent viewed every image and produced structured observations: description, people detected, setting, category, entities, mood, era
- 26 of 30 segments succeeded (4 failed on image dimension limits)
- **Coverage: 1,248 / 1,467 images (85%)**

**FINN Primitive Mapping:**

| Primitive | Count | What It Captures |
|-----------|-------|------------------|
| NODEs | 119 | People, organizations, objects, domains, platforms, concepts |
| EDGEs | 27 | Biographical relationships, co-occurrences, domain associations |
| METRICs | 9 | Measurement definitions (appearance count, setting type, mood, category, etc.) |
| SIGNALs | 6,235 | Time-indexed observations — one per image per metric |
| PROTOCOLs | 3 | Trajectory predictions (domain focus shift, mood profile, setting profile) |

**Key Findings:**
- 58% of archive is digital content (screenshots, app captures, saved references)
- 38% informational mood, 23% professional — the archive is a knowledge capture system, not a photo album
- Jack appears in only 9% of photos — more observer than subject
- 330 reference images + 51 AI artworks reveal parallel creative/research tracks
- Content trajectory: social/personal (early) → technology/creative (late)

**Deliverables:**
- `JOURNEY_KNOWLEDGE_GRAPH.md` — human-readable report with all distributions and narrative synthesis
- `JOURNEY_KNOWLEDGE_GRAPH.json` — machine-readable FINN graph (146 KB)
- `JOURNEY_OBSERVATIONS.json` — raw observations from all 26 segments (332 KB, gitignored)
- `build_knowledge_graph.py` — the graph builder script

**Commit:** `b63860d`

---

## File Inventory

| File | Location | Tracked |
|------|----------|---------|
| Folder taxonomy (49 dirs) | `assets/JOURNEY/` | No (media gitignored) |
| `sort_journey.py` | `assets/` | Yes |
| `sort_report.json` | `assets/` | Yes |
| `MANIFEST.md` | `assets/` | Yes |
| `CONVENTIONS.md` | `assets/` | Yes |
| `build_knowledge_graph.py` | `assets/` | Yes |
| `JOURNEY_KNOWLEDGE_GRAPH.md` | `charlotte/docs/artifacts/` | Yes |
| `JOURNEY_KNOWLEDGE_GRAPH.json` | `charlotte/docs/artifacts/` | Yes |
| `JOURNEY_OBSERVATIONS.json` | `charlotte/docs/artifacts/` | No (gitignored) |
| Thumbnails | `assets/_thumbs/` | No (gitignored) |
