#!/usr/bin/env python3
"""
mjlab - Generate isometric research lab images via Claude + image gen APIs.

Reads your context files (specs, notes, floor plans, ideas), sends them
to Claude to synthesize a prompt, then generates images directly via
OpenAI, Flux, Stability AI, and/or Ideogram. No Discord needed.

Usage:
    mjlab --style solarpunk --describe "quantum computing lab" --engine openai
    mjlab --files spec.md --style cyberpunk --engine all
    mjlab --files *.md --style steampunk --engine flux --acres 5
    mjlab --style solarpunk --describe "biotech lab" --engine clipboard
"""

import argparse
import glob
import json
import os
import subprocess
import sys
from pathlib import Path

PYTHON = sys.executable
MJ_SCRIPT = Path(__file__).parent / "mj.py"

# --- Punk aesthetics with Midjourney-tuned descriptors ---
PUNK_STYLES = {
    "solarpunk": {
        "palette": "warm golden light, living green walls, bamboo and reclaimed wood, solar panel canopies, hanging gardens, bioluminescent accents, morning sunlight",
        "vibe": "utopian sustainable future, harmonious integration of nature and technology, abundant vegetation, clean energy infrastructure",
        "materials": "cross-laminated timber, recycled glass, living moss walls, copper patina, terracotta, woven fiber optics",
    },
    "cyberpunk": {
        "palette": "neon magenta and cyan, dark chrome, rain-slicked surfaces, holographic signage, volumetric fog, LED strip lighting",
        "vibe": "high-tech dystopian megastructure, dense vertical infrastructure, data streams, corporate brutalism mixed with street-level grit",
        "materials": "brushed steel, carbon fiber, transparent OLED panels, exposed conduit, wet concrete, glowing circuitry",
    },
    "steampunk": {
        "palette": "warm brass and copper, rich mahogany, amber gas lamps, steam vents, sepia-toned atmosphere, leather and rivets",
        "vibe": "Victorian-era industrial research institute, ornate mechanical systems, clockwork precision, gothic arches with gear motifs",
        "materials": "polished brass, wrought iron, oak and walnut, stained glass, pressure gauges, exposed pipe systems, canvas awnings",
    },
    "biopunk": {
        "palette": "organic greens and purples, bioluminescent blues, translucent membranes, pulsing vein-like conduits, wet surfaces",
        "vibe": "living architecture, genetically engineered building materials, symbiotic technology, organic growth patterns",
        "materials": "chitin shell structures, mycelium composites, bio-glass, vascular tubing, cultured coral frameworks, membrane walls",
    },
    "lunarpunk": {
        "palette": "soft moonlight silver, deep indigo, iridescent pearl, phosphorescent trails, cool mist, aurora-like glows",
        "vibe": "nocturnal mystical research sanctuary, dreamlike serenity, celestial observation, quiet contemplation spaces",
        "materials": "polished obsidian, selenite crystal, silver filigree, frost glass, luminous lichen, reflective pools",
    },
    "dieselpunk": {
        "palette": "olive drab, rust orange, matte black, industrial yellow warning stripes, tungsten filament glow, exhaust haze",
        "vibe": "WWII-era industrial complex repurposed for science, brutalist efficiency, analog instrumentation, roaring generators",
        "materials": "riveted steel plate, rubber gaskets, bakelite panels, concrete bunker walls, canvas tarps, heavy-gauge wiring",
    },
    "atompunk": {
        "palette": "atomic age pastels, turquoise and coral, chrome accents, retro-futuristic glow, Googie architecture curves",
        "vibe": "1950s space-age optimism, Jetsons-meets-real-science, boomerang shapes, atomic motifs, gleaming white labs",
        "materials": "formica counters, chrome-plated fixtures, terrazzo floors, rounded acrylic domes, starburst wall panels",
    },
}

SYSTEM_PROMPT = """You are a Midjourney prompt engineer specializing in architectural visualization.

Your task: generate ONE highly detailed Midjourney prompt for an isometric bird's-eye-view illustration of a research laboratory complex.

Rules:
- Output ONLY the prompt text, nothing else. No explanations, no markdown, no quotes.
- The prompt must describe an isometric (30-degree angle) bird's-eye view
- It should be a detailed architectural illustration showing the full campus layout
- Include specific buildings, wings, pathways, equipment, and landscape features
- Reference the aesthetic style descriptors provided
- Incorporate details from the user's context files to make the lab specific and grounded
- Mention the approximate acre size to convey scale
- End with style/quality modifiers: "isometric illustration, architectural visualization, highly detailed, miniature diorama feel, tilt-shift"
- Keep the prompt under 350 words (Midjourney has limits)
- Do NOT include any Midjourney parameters (--ar, --v, etc.) — those are added separately
"""


def read_context_files(file_patterns):
    """Read and concatenate all context files."""
    contents = []
    for pattern in file_patterns:
        # Expand globs
        matches = glob.glob(pattern, recursive=True)
        if not matches:
            # Try as literal path
            if os.path.isfile(pattern):
                matches = [pattern]
            else:
                print(f"Warning: No files matched '{pattern}'", file=sys.stderr)
                continue
        for filepath in sorted(matches):
            try:
                text = Path(filepath).read_text(encoding="utf-8", errors="replace")
                contents.append(f"--- {filepath} ---\n{text}")
            except OSError as e:
                print(f"Warning: Could not read {filepath}: {e}", file=sys.stderr)
    return "\n\n".join(contents)


def call_claude(system, user_message, model="claude-sonnet-4-5-20250929"):
    """Call Claude API and return the text response."""
    try:
        import anthropic
    except ImportError:
        print("Error: anthropic package not installed. Run: pip install anthropic", file=sys.stderr)
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.", file=sys.stderr)
        print("  Set it with: set ANTHROPIC_API_KEY=sk-ant-...", file=sys.stderr)
        print("  Or permanently: setx ANTHROPIC_API_KEY sk-ant-...", file=sys.stderr)
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    print("  Generating prompt via Claude...", file=sys.stderr)

    response = client.messages.create(
        model=model,
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": user_message}],
    )

    return response.content[0].text.strip()


def build_user_message(style_name, style_info, acres, context, focus, describe):
    """Build the user message sent to Claude."""
    parts = []

    parts.append(f"AESTHETIC: {style_name}")
    parts.append(f"Palette: {style_info['palette']}")
    parts.append(f"Vibe: {style_info['vibe']}")
    parts.append(f"Materials: {style_info['materials']}")
    parts.append(f"\nSCALE: approximately {acres} acre{'s' if acres != 1 else ''} campus")

    if focus:
        parts.append(f"\nFOCUS AREA: {focus}")

    if describe:
        parts.append(f"\nDESCRIPTION: {describe}")

    if context:
        parts.append(f"\nCONTEXT FILES (use these details to make the lab specific):\n{context}")
    else:
        parts.append("\nNo context files provided — generate a compelling general-purpose research lab.")

    parts.append("\nGenerate the Midjourney prompt now.")
    return "\n".join(parts)


def run_mj(prompt_text, ar="16:9", version="6.1", stylize=None, extra_args=None):
    """Pass the generated prompt through mj.py."""
    cmd = [PYTHON, str(MJ_SCRIPT), prompt_text, "--ar", ar, "--v", version]
    if stylize:
        cmd += ["--stylize", str(stylize)]
    if extra_args:
        cmd += extra_args
    subprocess.run(cmd)


def main():
    parser = argparse.ArgumentParser(
        description="Generate isometric research lab Midjourney prompts via Claude.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Styles: solarpunk (default), cyberpunk, steampunk, biopunk, lunarpunk, dieselpunk, atompunk
Engines: clipboard (default), openai, flux, stability, ideogram, all

Examples:
  mjlab --style solarpunk --describe "quantum computing lab" --engine openai
  mjlab --files spec.md --style cyberpunk --engine all
  mjlab --files *.md --style steampunk --engine flux --acres 5
  mjlab --style solarpunk --describe "biotech lab" --engine clipboard
  mjlab --files plan.md --style biopunk --stylize 800 --chaos 30
  mjlab --list-styles
  mjlab --list-engines
        """,
    )

    parser.add_argument("--files", "-f", nargs="+", default=[], help="Context files (specs, notes, plans). Supports globs.")
    parser.add_argument("--style", "-s", default="solarpunk", help="Punk aesthetic (default: solarpunk)")
    parser.add_argument("--acres", "-a", type=float, default=3, help="Campus size in acres (default: 3)")
    parser.add_argument("--focus", default=None, help="Specific area to emphasize (e.g. 'biotech wing')")
    parser.add_argument("--describe", "-d", default=None, help="Freeform description (instead of/alongside files)")
    parser.add_argument("--ar", default="16:9", help="Aspect ratio (default: 16:9)")
    parser.add_argument("--v", dest="version", default="6.1", help="MJ version (default: 6.1)")
    parser.add_argument("--stylize", type=int, default=600, help="Stylize value (default: 600)")
    parser.add_argument("--chaos", type=int, default=None, help="Chaos value")
    parser.add_argument("--seed", type=int, default=None, help="Seed value")
    parser.add_argument("--tile", action="store_true", help="Tiling mode")
    parser.add_argument("--variations", type=int, default=None, help="Generate N variations (re-rolls Claude)")
    parser.add_argument("--model", default="claude-sonnet-4-5-20250929", help="Claude model to use")
    parser.add_argument("--no-copy", action="store_true", help="Don't copy to clipboard")
    parser.add_argument("--raw", action="store_true", help="Print only the raw MJ prompt")
    parser.add_argument("--prompt-only", action="store_true", help="Show Claude's output without running mj")
    parser.add_argument("--list-styles", action="store_true", help="List available punk styles")
    parser.add_argument("--engine", "-e", default="clipboard",
                        choices=["clipboard", "openai", "flux", "stability", "ideogram", "all"],
                        help="Image generation engine (default: clipboard)")
    parser.add_argument("--list-engines", action="store_true", help="List available engines and API key status")
    parser.add_argument("--save-template", default=None, help="Save the result as an mj template with this name")

    args = parser.parse_args()

    if args.list_engines:
        from engines import ENGINES, ENGINE_KEYS
        print(f"\n  {'Engine':<14} {'API Key Env Var':<24} {'Status'}")
        print(f"  {'-' * 14} {'-' * 24} {'-' * 10}")
        print(f"  {'clipboard':<14} {'(none)':<24} {'always available'}")
        for name in sorted(ENGINES.keys()):
            key_var = ENGINE_KEYS[name]
            status = "set" if os.environ.get(key_var) else "NOT SET"
            print(f"  {name:<14} {key_var:<24} {status}")
        print()
        return

    if args.list_styles:
        print(f"\n  {'Style':<14} {'Vibe'}")
        print(f"  {'-' * 14} {'-' * 56}")
        for name, info in sorted(PUNK_STYLES.items()):
            vibe = info['vibe'][:56]
            print(f"  {name:<14} {vibe}")
        print()
        return

    style_name = args.style.lower()
    if style_name not in PUNK_STYLES:
        print(f"Error: Unknown style '{style_name}'", file=sys.stderr)
        print(f"Available: {', '.join(sorted(PUNK_STYLES.keys()))}", file=sys.stderr)
        sys.exit(1)

    style_info = PUNK_STYLES[style_name]

    # Read context files
    context = ""
    if args.files:
        context = read_context_files(args.files)
        if context:
            # Truncate if huge (Claude context is big but MJ prompts should be focused)
            if len(context) > 30000:
                context = context[:30000] + "\n\n[... truncated for length ...]"
            print(f"  Read {len(args.files)} file pattern(s), {len(context):,} chars of context", file=sys.stderr)

    count = args.variations or 1
    prompts = []

    for i in range(count):
        if count > 1:
            print(f"\n  --- Variation {i + 1}/{count} ---", file=sys.stderr)

        user_msg = build_user_message(style_name, style_info, args.acres, context, args.focus, args.describe)
        mj_prompt = call_claude(SYSTEM_PROMPT, user_msg, model=args.model)

        # Clean up: remove any accidental MJ params Claude might have added
        import re
        mj_prompt = re.sub(r'\s*--(?:ar|v|s|stylize|chaos|q|quality|style|seed|weird|tile|repeat|stop|niji|cref|sref|cw|sw|iw|no|p)\s+\S+', '', mj_prompt)
        mj_prompt = re.sub(r'\s*--(?:tile|p)\b', '', mj_prompt)
        mj_prompt = mj_prompt.strip().strip('"').strip("'").strip()

        prompts.append(mj_prompt)

        if args.prompt_only or args.raw:
            if args.raw:
                print(mj_prompt)
            else:
                print(f"\n{mj_prompt}\n")
        elif args.engine != "clipboard":
            # Generate images directly via API
            from engines import generate, generate_all
            label = f"lab_{style_name}_{i}" if count > 1 else f"lab_{style_name}"
            if args.engine == "all":
                results = generate_all(mj_prompt, ar=args.ar, label_prefix=label)
                if results:
                    print(f"\n  Generated {len(results)} image(s):", file=sys.stderr)
                    for eng, path in results.items():
                        print(f"    [{eng}] {path}", file=sys.stderr)
                else:
                    print("  No images generated. Check API keys with --list-engines", file=sys.stderr)
            else:
                path = generate(args.engine, mj_prompt, ar=args.ar, label=label)
                if path:
                    print(f"\n  Generated: {path}", file=sys.stderr)
                else:
                    print(f"  Generation failed. Check API key with --list-engines", file=sys.stderr)
        else:
            # Default: clipboard mode via mj.py
            extra = []
            if args.chaos is not None:
                extra += ["--chaos", str(args.chaos)]
            if args.seed is not None:
                extra += ["--seed", str(args.seed)]
            if args.tile:
                extra += ["--tile"]
            if args.no_copy:
                extra += ["--no-copy"]

            run_mj(mj_prompt, ar=args.ar, version=args.version, stylize=args.stylize, extra_args=extra)

    # Save as template if requested
    if args.save_template and prompts:
        template_cmd = [
            PYTHON, str(MJ_SCRIPT), "save", args.save_template, prompts[-1],
            "--ar", args.ar, "--stylize", str(args.stylize),
        ]
        subprocess.run(template_cmd)
        print(f"\n  Saved as mj template: {args.save_template}")


if __name__ == "__main__":
    main()
