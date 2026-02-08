"""
engines.py — Image generation engines for OpenAI, Flux, Stability AI, and Ideogram.

Each engine takes a prompt and returns the path to a saved image file.
"""

import base64
import os
import sys
import time
from pathlib import Path

OUTPUT_DIR = Path(r"C:\dev\midjourney\output")


def ensure_output_dir():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _unique_path(base_name, ext):
    """Generate a unique output path to avoid overwrites."""
    ensure_output_dir()
    path = OUTPUT_DIR / f"{base_name}.{ext}"
    counter = 1
    while path.exists():
        path = OUTPUT_DIR / f"{base_name}_{counter}.{ext}"
        counter += 1
    return path


def _ar_to_openai_size(ar):
    """Map aspect ratio string to OpenAI's supported sizes."""
    mapping = {
        "1:1": "1024x1024",
        "16:9": "1536x1024",
        "9:16": "1024x1536",
        "3:2": "1536x1024",
        "2:3": "1024x1536",
        "4:3": "1536x1024",
        "3:4": "1024x1536",
    }
    return mapping.get(ar, "1536x1024")


def _ar_to_flux_dims(ar):
    """Map aspect ratio to width/height for Flux (multiples of 32)."""
    mapping = {
        "1:1": (1024, 1024),
        "16:9": (1344, 768),
        "9:16": (768, 1344),
        "3:2": (1216, 832),
        "2:3": (832, 1216),
        "4:3": (1152, 896),
        "3:4": (896, 1152),
    }
    return mapping.get(ar, (1344, 768))


def _ar_to_ideogram(ar):
    """Map aspect ratio to Ideogram's format (NxN)."""
    return ar.replace(":", "x")


# ---------------------------------------------------------------------------
# OpenAI (GPT Image / DALL-E)
# ---------------------------------------------------------------------------

def generate_openai(prompt, ar="16:9", quality="high", label="openai"):
    """Generate an image using OpenAI's gpt-image-1 model."""
    try:
        from openai import OpenAI
    except ImportError:
        print("Error: openai package not installed. Run: pip install openai", file=sys.stderr)
        return None

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY not set.", file=sys.stderr)
        print("  Get one at: https://platform.openai.com/api-keys", file=sys.stderr)
        print("  Set it: setx OPENAI_API_KEY sk-...", file=sys.stderr)
        return None

    size = _ar_to_openai_size(ar)
    print(f"  [OpenAI] Generating {size} with gpt-image-1...", file=sys.stderr)

    try:
        client = OpenAI(api_key=api_key)
        result = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size=size,
            quality=quality,
            output_format="png",
            n=1,
        )
        image_bytes = base64.b64decode(result.data[0].b64_json)
        out_path = _unique_path(label, "png")
        out_path.write_bytes(image_bytes)
        print(f"  [OpenAI] Saved: {out_path}", file=sys.stderr)
        return str(out_path)
    except Exception as e:
        print(f"  [OpenAI] Error: {e}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# Flux (Black Forest Labs)
# ---------------------------------------------------------------------------

def generate_flux(prompt, ar="16:9", label="flux"):
    """Generate an image using Black Forest Labs Flux API."""
    import requests as req

    api_key = os.environ.get("BFL_API_KEY")
    if not api_key:
        print("Error: BFL_API_KEY not set.", file=sys.stderr)
        print("  Get one at: https://dashboard.bfl.ai", file=sys.stderr)
        print("  Set it: setx BFL_API_KEY ...", file=sys.stderr)
        return None

    w, h = _ar_to_flux_dims(ar)
    headers = {
        "accept": "application/json",
        "x-key": api_key,
        "Content-Type": "application/json",
    }

    print(f"  [Flux] Generating {w}x{h} with flux-pro-1.1...", file=sys.stderr)

    try:
        # Submit
        resp = req.post(
            "https://api.bfl.ai/v1/flux-pro-1.1",
            headers=headers,
            json={
                "prompt": prompt,
                "width": w,
                "height": h,
                "output_format": "png",
                "safety_tolerance": 2,
            },
        )
        resp.raise_for_status()
        task = resp.json()
        polling_url = task["polling_url"]
        print(f"  [Flux] Task submitted, polling...", file=sys.stderr)

        # Poll
        for _ in range(120):
            time.sleep(1)
            result = req.get(polling_url, headers=headers).json()
            status = result.get("status")
            if status == "Ready":
                image_url = result["result"]["sample"]
                img_data = req.get(image_url).content
                out_path = _unique_path(label, "png")
                out_path.write_bytes(img_data)
                print(f"  [Flux] Saved: {out_path}", file=sys.stderr)
                return str(out_path)
            elif status in ("Error", "Failed"):
                print(f"  [Flux] Generation failed: {status}", file=sys.stderr)
                return None

        print("  [Flux] Timed out waiting for result.", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  [Flux] Error: {e}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# Stability AI (Stable Diffusion 3.5)
# ---------------------------------------------------------------------------

def generate_stability(prompt, ar="16:9", label="stability"):
    """Generate an image using Stability AI's SD3.5 model."""
    import requests as req

    api_key = os.environ.get("STABILITY_API_KEY")
    if not api_key:
        print("Error: STABILITY_API_KEY not set.", file=sys.stderr)
        print("  Get one at: https://platform.stability.ai", file=sys.stderr)
        print("  Set it: setx STABILITY_API_KEY sk-...", file=sys.stderr)
        return None

    print(f"  [Stability] Generating {ar} with sd3.5-large...", file=sys.stderr)

    try:
        resp = req.post(
            "https://api.stability.ai/v2beta/stable-image/generate/sd3",
            headers={
                "authorization": f"Bearer {api_key}",
                "accept": "image/*",
            },
            files={"none": ""},
            data={
                "prompt": prompt,
                "model": "sd3.5-large",
                "aspect_ratio": ar,
                "output_format": "png",
            },
        )

        if resp.status_code == 200:
            out_path = _unique_path(label, "png")
            out_path.write_bytes(resp.content)
            print(f"  [Stability] Saved: {out_path}", file=sys.stderr)
            return str(out_path)
        else:
            error = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else resp.text
            print(f"  [Stability] Error {resp.status_code}: {error}", file=sys.stderr)
            return None
    except Exception as e:
        print(f"  [Stability] Error: {e}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# Ideogram (v3)
# ---------------------------------------------------------------------------

def generate_ideogram(prompt, ar="16:9", label="ideogram"):
    """Generate an image using Ideogram 3.0 API."""
    import requests as req

    api_key = os.environ.get("IDEOGRAM_API_KEY")
    if not api_key:
        print("Error: IDEOGRAM_API_KEY not set.", file=sys.stderr)
        print("  Get one at: https://ideogram.ai (Settings -> API)", file=sys.stderr)
        print("  Set it: setx IDEOGRAM_API_KEY ...", file=sys.stderr)
        return None

    ideo_ar = _ar_to_ideogram(ar)
    print(f"  [Ideogram] Generating {ideo_ar} with Ideogram 3.0...", file=sys.stderr)

    try:
        resp = req.post(
            "https://api.ideogram.ai/v1/ideogram-v3/generate",
            headers={"Api-Key": api_key},
            data={
                "prompt": prompt,
                "aspect_ratio": ideo_ar,
                "rendering_speed": "DEFAULT",
                "magic_prompt": "AUTO",
                "style_type": "REALISTIC",
                "num_images": "1",
            },
        )
        resp.raise_for_status()
        result = resp.json()
        images = result.get("data", [])
        if images:
            image_url = images[0]["url"]
            img_data = req.get(image_url).content
            out_path = _unique_path(label, "png")
            out_path.write_bytes(img_data)
            print(f"  [Ideogram] Saved: {out_path}", file=sys.stderr)
            return str(out_path)
        else:
            print("  [Ideogram] No images returned.", file=sys.stderr)
            return None
    except Exception as e:
        print(f"  [Ideogram] Error: {e}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# Dispatcher
# ---------------------------------------------------------------------------

ENGINES = {
    "openai": generate_openai,
    "flux": generate_flux,
    "stability": generate_stability,
    "ideogram": generate_ideogram,
}

ENGINE_KEYS = {
    "openai": "OPENAI_API_KEY",
    "flux": "BFL_API_KEY",
    "stability": "STABILITY_API_KEY",
    "ideogram": "IDEOGRAM_API_KEY",
}


def generate(engine, prompt, ar="16:9", label=None):
    """Generate with a single engine. Returns output path or None."""
    fn = ENGINES.get(engine)
    if not fn:
        print(f"Unknown engine: {engine}. Available: {', '.join(ENGINES.keys())}", file=sys.stderr)
        return None
    return fn(prompt, ar=ar, label=label or engine)


def generate_all(prompt, ar="16:9", label_prefix="lab"):
    """Generate with all engines that have API keys set. Returns dict of engine->path."""
    results = {}
    for name, fn in ENGINES.items():
        key_var = ENGINE_KEYS[name]
        if os.environ.get(key_var):
            path = fn(prompt, ar=ar, label=f"{label_prefix}_{name}")
            if path:
                results[name] = path
        else:
            print(f"  [{name}] Skipped (no {key_var})", file=sys.stderr)
    return results
