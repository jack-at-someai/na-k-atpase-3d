"""
Charlotte Voice Agent — Shell Tool
====================================
run_command — sandboxed shell execution with blocked commands and timeout.
"""

import asyncio
import logging

from config import Config

log = logging.getLogger("charlotte.tools.shell")

TOOLS = [
    {
        "name": "run_command",
        "description": "Run a shell command and return its output. Destructive commands are blocked. 30-second timeout.",
        "input_schema": {
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "The shell command to execute",
                },
            },
            "required": ["command"],
        },
    },
]


def _is_blocked(command: str) -> str | None:
    """Return reason if command is blocked, else None."""
    cmd_lower = command.lower().strip()
    for blocked in Config.BLOCKED_COMMANDS:
        if blocked.lower() in cmd_lower:
            return f"Blocked: command contains '{blocked}'"
    # Block sudo unless specifically allowed
    if cmd_lower.startswith("sudo "):
        return "Blocked: sudo not allowed in voice agent"
    return None


async def handle(name: str, args: dict) -> str:
    """Execute a shell command with safety checks."""
    if name != "run_command":
        return f"Unknown tool: {name}"

    command = args["command"]
    blocked = _is_blocked(command)
    if blocked:
        log.warning("Blocked command: %s — %s", command, blocked)
        return blocked

    if Config.DEMO:
        return f"DEMO: Would execute: {command}"

    log.info("Executing: %s", command)
    try:
        proc = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(Config.ALLOWED_PATHS[0]) if Config.ALLOWED_PATHS else None,
        )
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=30.0)
        except asyncio.TimeoutError:
            proc.kill()
            await proc.communicate()
            return "Error: Command timed out after 30 seconds"

        output = stdout.decode("utf-8", errors="replace").strip()
        errors = stderr.decode("utf-8", errors="replace").strip()

        result_parts = []
        if output:
            result_parts.append(output[:4000])
        if errors:
            result_parts.append(f"STDERR: {errors[:2000]}")
        if proc.returncode != 0:
            result_parts.append(f"Exit code: {proc.returncode}")

        return "\n".join(result_parts) if result_parts else "(no output)"

    except Exception as e:
        log.exception("Command execution error")
        return f"Error: {e}"
