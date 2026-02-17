"""
Charlotte Voice Agent — Notes Tool
=====================================
Voice-optimized note-taking backed by the session SQLite database.
"""

import logging

log = logging.getLogger("charlotte.tools.notes")

# Session store injected at startup
_store = None


def set_store(store):
    """Set the session store reference (called from server.py)."""
    global _store
    _store = store


TOOLS = [
    {
        "name": "take_note",
        "description": "Save a note with a title and content. Notes persist across conversations and can be searched later.",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "Short title for the note",
                },
                "content": {
                    "type": "string",
                    "description": "The note content",
                },
            },
            "required": ["title", "content"],
        },
    },
    {
        "name": "search_notes",
        "description": "Search saved notes by keyword. Returns matching notes with titles and content.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search keyword or phrase",
                },
            },
            "required": ["query"],
        },
    },
]


async def handle(name: str, args: dict) -> str:
    """Execute a notes tool."""
    if _store is None:
        return "Error: Note storage not initialized"

    if name == "take_note":
        title = args["title"]
        content = args["content"]
        await _store.save_note(title, content)
        return f"Note saved: {title}"

    elif name == "search_notes":
        query = args["query"]
        results = await _store.search_notes(query)
        if not results:
            return f"No notes found matching '{query}'"
        lines = []
        for note in results:
            lines.append(f"- {note['title']}: {note['content']}")
        return "\n".join(lines)

    return f"Unknown tool: {name}"
