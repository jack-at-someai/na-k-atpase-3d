#!/usr/bin/env python3
"""
mj - Midjourney prompt builder and manager.

Compose structured prompts with parameters, save/load prompt templates,
run variations, and copy results to clipboard.

Usage:
    mj "a cat wearing a top hat"
    mj "a cat wearing a top hat" --ar 16:9 --v 6.1 --stylize 500
    mj "a cat" --style raw --chaos 30 --no plants, trees
    mj --template cyberpunk --subject "a samurai"
    mj "a landscape" --variations 5 --chaos 20-80
    mj templates                          # list saved templates
    mj save cyberpunk "dark neon city, ..." --ar 16:9 --style raw
    mj history                            # show recent prompts
"""

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(r"C:\dev\midjourney\data")
TEMPLATES_FILE = DATA_DIR / "templates.json"
HISTORY_FILE = DATA_DIR / "history.json"
MAX_HISTORY = 200

# --- Midjourney parameter definitions ---
MJ_PARAMS = {
    "ar": {"flag": "--ar", "type": "str", "help": "Aspect ratio (e.g. 16:9, 1:1, 3:2)"},
    "v": {"flag": "--v", "type": "str", "help": "Model version (e.g. 6.1, 5.2)"},
    "style": {"flag": "--style", "type": "str", "help": "Style mode (raw)"},
    "stylize": {"flag": "--s", "type": "int", "help": "Stylize value (0-1000)", "range": (0, 1000)},
    "chaos": {"flag": "--c", "type": "int", "help": "Chaos value (0-100)", "range": (0, 100)},
    "weird": {"flag": "--weird", "type": "int", "help": "Weird value (0-3000)", "range": (0, 3000)},
    "quality": {"flag": "--q", "type": "str", "help": "Quality (.25, .5, 1)"},
    "repeat": {"flag": "--repeat", "type": "int", "help": "Repeat count (1-40)", "range": (1, 40)},
    "seed": {"flag": "--seed", "type": "int", "help": "Seed value (0-4294967295)"},
    "stop": {"flag": "--stop", "type": "int", "help": "Stop percentage (10-100)", "range": (10, 100)},
    "tile": {"flag": "--tile", "type": "bool", "help": "Seamless tiling pattern"},
    "niji": {"flag": "--niji", "type": "str", "help": "Niji model version"},
    "cref": {"flag": "--cref", "type": "str", "help": "Character reference URL"},
    "sref": {"flag": "--sref", "type": "str", "help": "Style reference URL"},
    "cw": {"flag": "--cw", "type": "int", "help": "Character weight (0-100)", "range": (0, 100)},
    "sw": {"flag": "--sw", "type": "int", "help": "Style weight (0-1000)", "range": (0, 1000)},
    "iw": {"flag": "--iw", "type": "str", "help": "Image weight (0-2)"},
    "no": {"flag": "--no", "type": "str", "help": "Negative prompt (things to exclude)"},
    "personalize": {"flag": "--p", "type": "bool", "help": "Apply personalization"},
}


def ensure_data_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def load_json(filepath, default=None):
    if default is None:
        default = {}
    if filepath.exists():
        try:
            return json.loads(filepath.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return default
    return default


def save_json(filepath, data):
    ensure_data_dir()
    filepath.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


# --- Prompt building ---

def build_prompt(text, params, negative=None, image_urls=None):
    """Assemble a complete Midjourney prompt string."""
    parts = []

    # Image URLs go first
    if image_urls:
        for url in image_urls:
            parts.append(url)

    # Main prompt text
    parts.append(text.strip())

    # Negative prompt
    if negative:
        parts.append(f"--no {negative.strip()}")

    # Parameters
    for key, value in sorted(params.items()):
        if key == "no":
            continue  # already handled
        info = MJ_PARAMS.get(key)
        if not info:
            continue
        if info["type"] == "bool":
            if value:
                parts.append(info["flag"])
        else:
            parts.append(f"{info['flag']} {value}")

    return " ".join(parts)


def validate_params(params):
    """Validate parameter values against known ranges. Returns list of warnings."""
    warnings = []
    for key, value in params.items():
        info = MJ_PARAMS.get(key)
        if not info:
            warnings.append(f"Unknown parameter: --{key}")
            continue
        if "range" in info and info["type"] == "int":
            lo, hi = info["range"]
            try:
                v = int(value)
                if v < lo or v > hi:
                    warnings.append(f"--{key} {value} is outside range [{lo}-{hi}]")
            except ValueError:
                warnings.append(f"--{key} expects an integer, got: {value}")
    return warnings


def copy_to_clipboard(text):
    """Copy text to clipboard. Works on Windows."""
    try:
        subprocess.run(
            ["clip.exe"],
            input=text.encode("utf-16le"),
            check=True,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError, OSError):
        pass
    # Fallback: powershell
    try:
        subprocess.run(
            ["powershell", "-Command", f"Set-Clipboard -Value '{text}'"],
            check=True,
            capture_output=True,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


# --- Variations ---

def generate_variations(text, params, negative, count, chaos_range=None):
    """Generate prompt variations by sweeping chaos and adding slight text permutations."""
    prompts = []
    for i in range(count):
        p = dict(params)
        if chaos_range:
            lo, hi = chaos_range
            # Linear interpolation across the range
            t = i / max(1, count - 1) if count > 1 else 0.5
            p["chaos"] = str(int(lo + t * (hi - lo)))
        prompts.append(build_prompt(text, p, negative))
    return prompts


def parse_range(s):
    """Parse a range like '20-80' into (20, 80)."""
    if "-" in s:
        parts = s.split("-", 1)
        return int(parts[0]), int(parts[1])
    v = int(s)
    return v, v


# --- Templates ---

def load_templates():
    return load_json(TEMPLATES_FILE, {})


def save_templates(templates):
    save_json(TEMPLATES_FILE, templates)


def cmd_save_template(name, text, params, negative):
    templates = load_templates()
    templates[name] = {
        "text": text,
        "params": params,
        "negative": negative,
        "created": datetime.now().isoformat(),
    }
    save_templates(templates)
    print(f"Saved template: {name}")


def cmd_list_templates():
    templates = load_templates()
    if not templates:
        print("No saved templates.")
        return
    print(f"{'Name':<20} {'Params':<30} {'Created':<20}")
    print("-" * 70)
    for name, t in sorted(templates.items()):
        param_str = " ".join(f"--{k} {v}" for k, v in t.get("params", {}).items())
        if not param_str:
            param_str = "(none)"
        created = t.get("created", "")[:10]
        print(f"{name:<20} {param_str:<30} {created:<20}")


def cmd_delete_template(name):
    templates = load_templates()
    if name in templates:
        del templates[name]
        save_templates(templates)
        print(f"Deleted template: {name}")
    else:
        print(f"Template not found: {name}")


# --- History ---

def add_to_history(prompt, text, params):
    history = load_json(HISTORY_FILE, [])
    if not isinstance(history, list):
        history = []
    history.append({
        "prompt": prompt,
        "text": text,
        "params": params,
        "timestamp": datetime.now().isoformat(),
    })
    # Trim
    if len(history) > MAX_HISTORY:
        history = history[-MAX_HISTORY:]
    save_json(HISTORY_FILE, history)


def cmd_history(count=20):
    history = load_json(HISTORY_FILE, [])
    if not isinstance(history, list):
        history = []
    if not history:
        print("No prompt history.")
        return
    recent = history[-count:]
    for i, entry in enumerate(recent, 1):
        ts = entry.get("timestamp", "")[:19].replace("T", " ")
        prompt = entry.get("prompt", "")
        # Truncate long prompts for display
        if len(prompt) > 100:
            prompt = prompt[:97] + "..."
        print(f"  {ts}  {prompt}")


# --- Main ---

def main():
    parser = argparse.ArgumentParser(
        description="Midjourney prompt builder — compose, save, and manage prompts.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  mj "a cat wearing a top hat" --ar 16:9 --v 6.1
  mj "cyberpunk city" --style raw --chaos 50 --stylize 750
  mj "a landscape" --no "people, cars" --ar 3:2
  mj "portrait" --cref https://example.com/face.jpg --cw 80
  mj "a cat" --variations 5 --chaos 10-90
  mj save cyberpunk "neon city, rain" --ar 16:9 --style raw
  mj templates
  mj --template cyberpunk --subject "a samurai"
  mj history
        """,
    )

    # Positional: command or prompt text
    parser.add_argument("prompt", nargs="*", help="Prompt text, or a command (templates, history, save, delete)")

    # MJ parameters
    parser.add_argument("--ar", default=None, help="Aspect ratio (e.g. 16:9)")
    parser.add_argument("--v", default=None, help="Model version (e.g. 6.1)")
    parser.add_argument("--style", default=None, help="Style mode (raw)")
    parser.add_argument("--stylize", "--s", default=None, help="Stylize (0-1000)")
    parser.add_argument("--chaos", "--c", default=None, help="Chaos (0-100), or range for variations (e.g. 20-80)")
    parser.add_argument("--weird", default=None, help="Weird (0-3000)")
    parser.add_argument("--quality", "--q", default=None, help="Quality (.25, .5, 1)")
    parser.add_argument("--repeat", default=None, help="Repeat count")
    parser.add_argument("--seed", default=None, help="Seed value")
    parser.add_argument("--stop", default=None, help="Stop percentage (10-100)")
    parser.add_argument("--tile", action="store_true", help="Seamless tiling")
    parser.add_argument("--niji", default=None, help="Niji model version")
    parser.add_argument("--cref", default=None, help="Character reference URL")
    parser.add_argument("--sref", default=None, help="Style reference URL")
    parser.add_argument("--cw", default=None, help="Character weight (0-100)")
    parser.add_argument("--sw", default=None, help="Style weight (0-1000)")
    parser.add_argument("--iw", default=None, help="Image weight (0-2)")
    parser.add_argument("--no", default=None, dest="negative", help="Negative prompt (exclude these)")
    parser.add_argument("--personalize", "--p", action="store_true", help="Apply personalization")

    # Tool features
    parser.add_argument("--template", "-t", default=None, help="Use a saved template")
    parser.add_argument("--subject", default=None, help="Replace subject in template prompt")
    parser.add_argument("--variations", type=int, default=None, help="Generate N variations")
    parser.add_argument("--image", "-i", action="append", default=None, help="Image URL(s) to prepend")
    parser.add_argument("--no-copy", action="store_true", help="Don't copy to clipboard")
    parser.add_argument("--raw", action="store_true", help="Output raw prompt only (no formatting)")

    args = parser.parse_args()

    # --- Handle subcommands ---
    tokens = args.prompt or []

    if tokens and tokens[0] == "templates":
        cmd_list_templates()
        return

    if tokens and tokens[0] == "history":
        count = int(tokens[1]) if len(tokens) > 1 else 20
        cmd_history(count)
        return

    if tokens and tokens[0] == "save":
        if len(tokens) < 3:
            parser.error("Usage: mj save <name> <prompt text> [--params...]")
        name = tokens[1]
        text = " ".join(tokens[2:])
        params = collect_params(args)
        cmd_save_template(name, text, params, args.negative)
        return

    if tokens and tokens[0] == "delete":
        if len(tokens) < 2:
            parser.error("Usage: mj delete <template-name>")
        cmd_delete_template(tokens[1])
        return

    # --- Build prompt ---
    text = " ".join(tokens) if tokens else ""

    # Apply template
    if args.template:
        templates = load_templates()
        tmpl = templates.get(args.template)
        if not tmpl:
            print(f"Error: Template '{args.template}' not found.", file=sys.stderr)
            print(f"Available: {', '.join(sorted(templates.keys())) or '(none)'}", file=sys.stderr)
            sys.exit(1)
        # Template provides base text and params; CLI args override
        base_text = tmpl.get("text", "")
        if args.subject:
            text = f"{args.subject}, {base_text}"
        elif text:
            text = f"{text}, {base_text}"
        else:
            text = base_text
        # Merge template params (CLI wins)
        tmpl_params = tmpl.get("params", {})
        cli_params = collect_params(args)
        params = {**tmpl_params, **{k: v for k, v in cli_params.items() if v is not None}}
        negative = args.negative or tmpl.get("negative")
    else:
        if not text:
            parser.print_help()
            return
        params = collect_params(args)
        negative = args.negative

    # Validate (skip chaos if it's a range for --variations)
    validate_p = {k: v for k, v in params.items() if not (k == "chaos" and isinstance(v, str) and "-" in v)}
    warnings = validate_params(validate_p)
    for w in warnings:
        print(f"Warning: {w}", file=sys.stderr)

    # --- Generate output ---
    if args.variations:
        chaos_range = None
        if args.chaos and "-" in str(args.chaos):
            chaos_range = parse_range(args.chaos)
            if "chaos" in params:
                del params["chaos"]
        prompts = generate_variations(text, params, negative, args.variations, chaos_range)
        print(f"\n--- {len(prompts)} Variations ---\n")
        all_prompts = []
        for i, p in enumerate(prompts, 1):
            print(f"  [{i}] /imagine prompt: {p}")
            all_prompts.append(f"/imagine prompt: {p}")
        combined = "\n".join(all_prompts)
        if not args.no_copy:
            if copy_to_clipboard(combined):
                print(f"\nAll {len(prompts)} prompts copied to clipboard.")
        # Save to history
        for p in prompts:
            add_to_history(p, text, params)
    else:
        prompt = build_prompt(text, params, negative, args.image)

        if args.raw:
            print(prompt)
        else:
            print(f"\n  /imagine prompt: {prompt}\n")

        if not args.no_copy:
            full = f"/imagine prompt: {prompt}"
            if copy_to_clipboard(full):
                print("  Copied to clipboard.")

        add_to_history(prompt, text, params)


def collect_params(args):
    """Extract MJ parameters from parsed args into a dict."""
    params = {}
    mapping = {
        "ar": args.ar,
        "v": args.v,
        "style": args.style,
        "stylize": args.stylize,
        "chaos": args.chaos,
        "weird": args.weird,
        "quality": args.quality,
        "repeat": args.repeat,
        "seed": args.seed,
        "stop": args.stop,
        "tile": args.tile,
        "niji": args.niji,
        "cref": args.cref,
        "sref": args.sref,
        "cw": args.cw,
        "sw": args.sw,
        "iw": args.iw,
        "personalize": args.personalize,
    }
    for key, val in mapping.items():
        if val is not None and val is not False:
            params[key] = val if not isinstance(val, bool) else True
    return params


if __name__ == "__main__":
    main()
