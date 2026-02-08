#!/usr/bin/env python3
"""
clipper - Clip up to 15 seconds from any video or audio source.

Accepts a local file or URL (YouTube, Spotify, etc). Auto-detects
whether the source is audio or video and outputs the appropriate format.

Usage:
    clipper <source> --start 0:30 --duration 10
    clipper <source> --start 1:05 --end 1:15
    clipper <source>                              # first 15 seconds
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlparse

OUTPUT_DIR = Path(r"C:\dev\clips")
MAX_DURATION = 15
FFMPEG = "ffmpeg"
FFPROBE = "ffprobe"


def find_tool(name):
    """Find ffmpeg/ffprobe, checking common Windows install paths."""
    found = shutil.which(name)
    if found:
        return found
    # Check winget package install location
    winget_pkgs = Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Packages"
    if winget_pkgs.exists():
        for d in winget_pkgs.iterdir():
            if "FFmpeg" in d.name:
                for bin_path in d.rglob(f"{name}.exe"):
                    return str(bin_path)
    # winget alias links
    winget_links = Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Links" / f"{name}.exe"
    if winget_links.exists():
        return str(winget_links)
    return name  # hope it's on PATH after shell restart


def parse_timestamp(ts):
    """Parse a timestamp like '1:30', '01:30', '90', '0:01:30' into seconds."""
    if ts is None:
        return None
    ts = ts.strip()
    # Try float seconds first
    try:
        return float(ts)
    except ValueError:
        pass
    # HH:MM:SS or MM:SS
    parts = ts.split(":")
    parts = [float(p) for p in parts]
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    if len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    raise ValueError(f"Can't parse timestamp: {ts}")


def is_url(source):
    parsed = urlparse(source)
    return parsed.scheme in ("http", "https")


def probe_media(filepath):
    """Use ffprobe to determine if file has video/audio streams and get duration."""
    ffprobe = find_tool(FFPROBE)
    cmd = [
        ffprobe, "-v", "quiet", "-print_format", "json",
        "-show_format", "-show_streams", filepath
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
    except (subprocess.CalledProcessError, json.JSONDecodeError) as e:
        print(f"Warning: ffprobe failed ({e}), assuming video.")
        return "video", None

    has_video = False
    has_audio = False
    for stream in data.get("streams", []):
        codec_type = stream.get("codec_type", "")
        if codec_type == "video":
            # skip album art / cover streams
            if stream.get("disposition", {}).get("attached_pic", 0) == 1:
                continue
            has_video = True
        elif codec_type == "audio":
            has_audio = True

    duration = None
    fmt = data.get("format", {})
    if "duration" in fmt:
        duration = float(fmt["duration"])

    media_type = "video" if has_video else "audio"
    return media_type, duration


def download_url(url, temp_dir):
    """Download media from a URL using yt-dlp. Returns path to downloaded file."""
    print(f"Downloading from URL...")
    output_template = os.path.join(temp_dir, "%(title).80s.%(ext)s")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--no-playlist",
        "-o", output_template,
        url
    ]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError:
        print("Error: yt-dlp download failed.", file=sys.stderr)
        sys.exit(1)

    # Find the downloaded file
    files = list(Path(temp_dir).iterdir())
    if not files:
        print("Error: No file was downloaded.", file=sys.stderr)
        sys.exit(1)
    return str(files[0])


def clip_media(input_path, output_path, start_sec, duration_sec, media_type):
    """Use ffmpeg to extract a clip."""
    ffmpeg = find_tool(FFMPEG)
    cmd = [ffmpeg, "-y"]

    # Seek before input for speed
    if start_sec > 0:
        cmd += ["-ss", str(start_sec)]

    cmd += ["-i", input_path, "-t", str(duration_sec)]

    if media_type == "video":
        cmd += ["-c:v", "libx264", "-c:a", "aac", "-movflags", "+faststart"]
    else:
        # audio-only: output as mp3
        cmd += ["-vn", "-c:a", "libmp3lame", "-q:a", "2"]

    cmd.append(str(output_path))

    print(f"Clipping {duration_sec:.1f}s starting at {start_sec:.1f}s...")
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        print("Error: ffmpeg clipping failed.", file=sys.stderr)
        if e.stderr:
            # Show just the last few meaningful lines, not the full banner
            lines = [l for l in e.stderr.strip().splitlines() if l.strip()]
            for line in lines[-5:]:
                print(f"  {line}", file=sys.stderr)
        sys.exit(1)


def sanitize_filename(name):
    """Remove characters that are problematic in filenames."""
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    name = name.strip('. ')
    return name or "clip"


def main():
    parser = argparse.ArgumentParser(
        description="Clip up to 15 seconds from any video or audio source.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  clipper song.mp3 --start 0:45 --duration 15
  clipper https://youtube.com/watch?v=abc --start 1:00 --end 1:12
  clipper video.mp4                          # first 15 seconds
  clipper https://open.spotify.com/track/... --start 30 --duration 10
        """,
    )
    parser.add_argument("source", help="Local file path or URL (YouTube, Spotify, etc.)")
    parser.add_argument("--start", "-s", default="0", help="Start time (e.g. 1:30, 90, 0:01:30). Default: 0")
    parser.add_argument("--end", "-e", default=None, help="End time. Mutually exclusive with --duration.")
    parser.add_argument("--duration", "-d", default=None, help="Duration in seconds (max 15). Default: 15")
    parser.add_argument("--output", "-o", default=None, help=f"Output file path. Default: auto-named in {OUTPUT_DIR}")

    args = parser.parse_args()

    # Parse times
    start_sec = parse_timestamp(args.start)
    end_sec = parse_timestamp(args.end)
    dur_sec = parse_timestamp(args.duration)

    if end_sec is not None and dur_sec is not None:
        parser.error("Use --end or --duration, not both.")

    if end_sec is not None:
        dur_sec = end_sec - start_sec
        if dur_sec <= 0:
            parser.error("--end must be after --start.")

    if dur_sec is None:
        dur_sec = MAX_DURATION

    if dur_sec > MAX_DURATION:
        print(f"Clamping duration to {MAX_DURATION}s (was {dur_sec:.1f}s).")
        dur_sec = MAX_DURATION

    # Resolve source
    temp_dir = None
    source = args.source

    if is_url(source):
        temp_dir = tempfile.mkdtemp(prefix="clipper_")
        input_path = download_url(source, temp_dir)
    else:
        input_path = source
        if not os.path.isfile(input_path):
            print(f"Error: File not found: {input_path}", file=sys.stderr)
            sys.exit(1)

    try:
        # Probe the file
        media_type, total_duration = probe_media(input_path)
        print(f"Detected: {media_type} | Duration: {total_duration:.1f}s" if total_duration else f"Detected: {media_type}")

        if total_duration and start_sec >= total_duration:
            print(f"Error: Start time ({start_sec:.1f}s) is past end of media ({total_duration:.1f}s).", file=sys.stderr)
            sys.exit(1)

        if total_duration and start_sec + dur_sec > total_duration:
            dur_sec = total_duration - start_sec
            print(f"Adjusted duration to {dur_sec:.1f}s (would exceed media length).")

        # Build output path
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        if args.output:
            output_path = Path(args.output)
        else:
            base_name = sanitize_filename(Path(input_path).stem)
            ext = ".mp4" if media_type == "video" else ".mp3"
            tag = f"_clip_{start_sec:.0f}s"
            output_path = OUTPUT_DIR / f"{base_name}{tag}{ext}"

            # Avoid overwrites
            counter = 1
            while output_path.exists():
                output_path = OUTPUT_DIR / f"{base_name}{tag}_{counter}{ext}"
                counter += 1

        clip_media(input_path, str(output_path), start_sec, dur_sec, media_type)
        print(f"\nSaved: {output_path}")
        print(f"  Type: {media_type} | Start: {start_sec:.1f}s | Duration: {dur_sec:.1f}s")

    finally:
        if temp_dir:
            shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
