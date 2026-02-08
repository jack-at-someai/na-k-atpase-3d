# Midjourney Tools

Manual coded tools for AI image generation. Claude synthesizes prompts from your context files, then generates images directly via OpenAI, Flux, Stability AI, and Ideogram. No Discord needed.

## Setup

### 1. Install dependencies

```
pip install anthropic openai requests
```

### 2. Get your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys** in the left sidebar (or go directly to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys))
4. Click **Create Key**, give it a name like "midjourney-tools"
5. Copy the key (starts with `sk-ant-api03-...`)

### 3. Set API keys

```bash
# Required: Claude for prompt generation
setx ANTHROPIC_API_KEY sk-ant-api03-your-key-here

# Image generation engines (set whichever you want to use)
setx OPENAI_API_KEY sk-...          # https://platform.openai.com/api-keys
setx BFL_API_KEY ...                # https://dashboard.bfl.ai
setx STABILITY_API_KEY sk-...       # https://platform.stability.ai
setx IDEOGRAM_API_KEY ...           # https://ideogram.ai (Settings -> API)
```

Then **restart your terminal** so the env vars take effect.

Check which engines are ready: `mjlab --list-engines`

### 4. Verify

```
mj "test prompt" --ar 1:1
mjlab --style solarpunk --describe "small greenhouse lab" --prompt-only
```

Both `mj` and `mjlab` are on PATH.

---

## The Pipeline

The core idea: funnel all your references, context, and ideas through one command that produces images.

```
                                    +------------------+     +------------------+
  your files ----+                  |                  |     |  Image Engines   |
  (specs, notes, |                  |     Claude       |     |                  |
   floor plans,  +---> mjlab -----> | (synthesizes a   |---->|  OpenAI          |---> output/*.png
   research docs)|       |         |  detailed prompt  |     |  Flux            |
                 |       |         |  from your        |     |  Stability AI    |
  --style        +-------+         |  context)         |     |  Ideogram        |
  --engine                         |                  |     |                  |
  --acres                          +------------------+     +------------------+
  --describe
```

**Step by step:**
1. You point `mjlab` at your files, pick a style and an engine
2. Claude reads everything and generates a detailed isometric lab prompt
3. The prompt is sent to your chosen image generation engine(s)
4. Images are saved to `output/`

---

## mj -- Prompt Builder CLI

Compose structured Midjourney prompts with full parameter support, save reusable templates, generate variations, and auto-copy to clipboard.

### Quick Examples

```bash
# Basic prompt with params -- builds and copies to clipboard
mj "a cat wearing a top hat" --ar 16:9 --v 6.1

# Style raw + high stylize for artistic output
mj "cyberpunk city at night" --style raw --chaos 50 --stylize 750

# Negative prompt to exclude things
mj "serene mountain landscape" --no "people, cars, buildings" --ar 3:2

# Character reference from a URL
mj "portrait of a warrior" --cref https://example.com/face.jpg --cw 80

# Generate 5 variations with chaos sweep from 10 to 90
mj "a cat in a garden" --variations 5 --chaos 10-90
```

### Templates & History

```bash
# Save a reusable template
mj save cyberpunk "neon city, rain, reflections, volumetric lighting" --ar 16:9 --style raw --stylize 750

# Use it with a new subject injected
mj --template cyberpunk --subject "a samurai on a motorcycle"

# List all saved templates
mj templates

# See your last 20 prompts
mj history

# Delete a template
mj delete cyberpunk
```

### All Parameters

`--ar` `--v` `--style` `--stylize` `--chaos` `--weird` `--quality` `--repeat` `--seed` `--stop` `--tile` `--niji` `--cref` `--sref` `--cw` `--sw` `--iw` `--no` `--personalize`

---

## mjlab -- AI-Powered Research Lab Image Generator

Feed context files (specs, notes, floor plans) to Claude, which synthesizes an isometric bird's-eye-view prompt for a research lab campus in your chosen punk aesthetic, then generates images directly via API.

### Quick Examples

```bash
# Generate a solarpunk lab image via OpenAI
mjlab --style solarpunk --describe "quantum computing lab" --engine openai

# Generate with ALL engines that have API keys set
mjlab --files spec.md --style cyberpunk --engine all

# Use Flux for a steampunk campus
mjlab --files *.md --style steampunk --engine flux --acres 5

# Clipboard mode (original behavior, for pasting into Discord)
mjlab --style solarpunk --describe "biotech lab" --engine clipboard

# Just see what Claude generates without generating images
mjlab --style steampunk --describe "clockwork biotech lab" --prompt-only

# Generate 3 variations across all engines
mjlab --files notes.md --style biopunk --variations 3 --engine all

# Check which engines are ready
mjlab --list-engines

# List all available punk styles
mjlab --list-styles
```

### Styles

| Style | Vibe |
|---|---|
| **solarpunk** (default) | Utopian sustainable future, nature + technology harmony, golden light, living walls |
| **cyberpunk** | Neon dystopian megastructure, dense vertical infrastructure, chrome and holographics |
| **steampunk** | Victorian-era industrial institute, ornate brass clockwork, gas lamps |
| **biopunk** | Living architecture, genetically engineered materials, organic growth patterns |
| **lunarpunk** | Nocturnal mystical sanctuary, moonlit serenity, iridescent pearl surfaces |
| **dieselpunk** | WWII-era industrial complex, brutalist efficiency, riveted steel plate |
| **atompunk** | 1950s space-age optimism, Googie architecture, chrome and pastels |

### Engines

| Engine | Model | API Key |
|---|---|---|
| **openai** | gpt-image-1 | `OPENAI_API_KEY` |
| **flux** | flux-pro-1.1 | `BFL_API_KEY` |
| **stability** | sd3.5-large | `STABILITY_API_KEY` |
| **ideogram** | Ideogram 3.0 | `IDEOGRAM_API_KEY` |
| **clipboard** | (none) | -- |
| **all** | all with keys set | -- |

### All Flags

| Flag | Default | Description |
|---|---|---|
| `--engine` / `-e` | clipboard | Image generation engine |
| `--files` / `-f` | -- | Context files (specs, notes, plans). Supports globs. |
| `--style` / `-s` | solarpunk | Punk aesthetic |
| `--acres` / `-a` | 3 | Campus size in acres |
| `--focus` | -- | Area to emphasize (e.g. "biotech wing") |
| `--describe` / `-d` | -- | Freeform description (use instead of or alongside files) |
| `--variations` | 1 | Re-roll Claude N times for different takes |
| `--save-template` | -- | Save the result as a reusable `mj` template |
| `--prompt-only` | -- | Show Claude's output without generating images |
| `--raw` | -- | Print bare prompt text only |
| `--model` | claude-sonnet-4-5 | Claude model to use |
| `--list-engines` | -- | Show available engines and API key status |
| `--list-styles` | -- | Show available punk styles |

Plus MJ params (for clipboard mode): `--ar`, `--v`, `--stylize`, `--chaos`, `--seed`, `--tile`.

---

## TODO

- [ ] Set image engine API keys:
  - `setx OPENAI_API_KEY sk-...` — [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  - `setx BFL_API_KEY ...` — [dashboard.bfl.ai](https://dashboard.bfl.ai)
  - `setx STABILITY_API_KEY sk-...` — [platform.stability.ai](https://platform.stability.ai)
  - `setx IDEOGRAM_API_KEY ...` — [ideogram.ai](https://ideogram.ai) (Settings -> API)
- [ ] Test each engine: `mjlab --style solarpunk --describe "quantum computing lab" --engine openai`
- [ ] Verify with `mjlab --list-engines`

## Planned

- **Image Retrieval** -- Fetch and organize generated images by job ID
- **Job Management** -- Track, queue, and manage generation jobs
- **Gallery Viewer** -- Local viewer for browsing and comparing outputs
