"""
Charlotte Voice Agent — Tool Definitions
==========================================
All tools available to the Claude agent during voice conversations.
Each module exports tool definitions (for Claude) and handlers (for execution).
"""

from tools.filesystem import TOOLS as FS_TOOLS, handle as fs_handle
from tools.shell import TOOLS as SHELL_TOOLS, handle as shell_handle
from tools.charlotte import TOOLS as CHARLOTTE_TOOLS, handle as charlotte_handle
from tools.notes import TOOLS as NOTES_TOOLS, handle as notes_handle

# Combined tool list for Claude API
ALL_TOOLS = FS_TOOLS + SHELL_TOOLS + CHARLOTTE_TOOLS + NOTES_TOOLS

# Dispatch map: tool_name -> async handler function
HANDLERS = {}
for _tools, _handler in [
    (FS_TOOLS, fs_handle),
    (SHELL_TOOLS, shell_handle),
    (CHARLOTTE_TOOLS, charlotte_handle),
    (NOTES_TOOLS, notes_handle),
]:
    for _tool in _tools:
        HANDLERS[_tool["name"]] = _handler
