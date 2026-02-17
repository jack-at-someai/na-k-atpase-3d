"""
Charlotte Voice Agent — Filesystem Tools
==========================================
read_file, write_file — restricted to allowed paths.
"""

import os
from pathlib import Path

from config import Config

TOOLS = [
    {
        "name": "read_file",
        "description": "Read the contents of a file. Path must be within allowed directories.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Absolute path to the file to read",
                },
                "max_lines": {
                    "type": "integer",
                    "description": "Maximum number of lines to read (default: 200)",
                },
            },
            "required": ["path"],
        },
    },
    {
        "name": "write_file",
        "description": "Write content to a file. Creates parent directories if needed. Path must be within allowed directories.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Absolute path to write to",
                },
                "content": {
                    "type": "string",
                    "description": "Content to write to the file",
                },
            },
            "required": ["path", "content"],
        },
    },
]


def _is_allowed(path_str: str) -> bool:
    """Check if path is within allowed directories."""
    try:
        resolved = str(Path(path_str).resolve())
        return any(resolved.startswith(str(Path(p).resolve())) for p in Config.ALLOWED_PATHS)
    except Exception:
        return False


async def handle(name: str, args: dict) -> str:
    """Execute a filesystem tool and return the result as text."""
    if name == "read_file":
        path = args["path"]
        if not _is_allowed(path):
            return f"Error: Path not allowed. Must be within: {', '.join(Config.ALLOWED_PATHS)}"
        try:
            p = Path(path)
            if not p.exists():
                return f"Error: File not found: {path}"
            if not p.is_file():
                return f"Error: Not a file: {path}"
            max_lines = args.get("max_lines", 200)
            lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
            if len(lines) > max_lines:
                return "\n".join(lines[:max_lines]) + f"\n... ({len(lines) - max_lines} more lines)"
            return "\n".join(lines) if lines else "(empty file)"
        except Exception as e:
            return f"Error reading file: {e}"

    elif name == "write_file":
        path = args["path"]
        content = args["content"]
        if not _is_allowed(path):
            return f"Error: Path not allowed. Must be within: {', '.join(Config.ALLOWED_PATHS)}"
        try:
            p = Path(path)
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content, encoding="utf-8")
            return f"Written {len(content)} bytes to {path}"
        except Exception as e:
            return f"Error writing file: {e}"

    return f"Unknown tool: {name}"
