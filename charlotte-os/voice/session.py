"""
Charlotte Voice Agent — Session Persistence
=============================================
SQLite-backed conversation history and notes.
Phone number or app token identifies a persistent session.
"""

import asyncio
import json
import time
import uuid
from pathlib import Path

import aiosqlite

from config import Config

_SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'phone',
    created_at REAL NOT NULL,
    last_active REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_identifier ON sessions(identifier);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    tool_use TEXT,
    timestamp REAL NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);

CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);
"""


class Session:
    """One conversation session — persists across calls/connections."""

    def __init__(self, session_id: str, identifier: str, source: str):
        self.id = session_id
        self.identifier = identifier
        self.source = source
        self.messages: list[dict] = []
        self.stream_sid: str | None = None  # Twilio stream ID
        self.deepgram_ws = None
        self.active = True

    def add_message(self, role: str, content: str, tool_use: str | None = None):
        self.messages.append({
            "role": role,
            "content": content,
            "tool_use": tool_use,
            "timestamp": time.time(),
        })

    def get_claude_messages(self) -> list[dict]:
        """Return messages formatted for Claude API, limited to context window."""
        limit = Config.SESSION_CONTEXT_MESSAGES
        recent = self.messages[-limit:]
        claude_msgs = []
        for msg in recent:
            if msg["role"] in ("user", "assistant"):
                claude_msgs.append({"role": msg["role"], "content": msg["content"]})
        return claude_msgs


class SessionStore:
    """Async SQLite-backed session store."""

    def __init__(self, db_path: str | None = None):
        self.db_path = db_path or Config.SESSION_DB
        self._db: aiosqlite.Connection | None = None
        self._sessions: dict[str, Session] = {}

    async def init(self):
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._db = await aiosqlite.connect(self.db_path)
        await self._db.executescript(_SCHEMA)
        await self._db.commit()

    async def close(self):
        if self._db:
            await self._db.close()

    async def get_or_create(self, identifier: str, source: str = "phone") -> Session:
        """Find existing session for this identifier or create new one."""
        # Check in-memory cache first
        for s in self._sessions.values():
            if s.identifier == identifier and s.source == source:
                return s

        # Check database
        now = time.time()
        expiry = now - (Config.SESSION_EXPIRY_HOURS * 3600)

        async with self._db.execute(
            "SELECT id FROM sessions WHERE identifier = ? AND source = ? AND last_active > ? ORDER BY last_active DESC LIMIT 1",
            (identifier, source, expiry),
        ) as cursor:
            row = await cursor.fetchone()

        if row:
            session_id = row[0]
            session = Session(session_id, identifier, source)
            # Load message history
            async with self._db.execute(
                "SELECT role, content, tool_use, timestamp FROM messages WHERE session_id = ? ORDER BY timestamp",
                (session_id,),
            ) as cursor:
                async for r in cursor:
                    session.messages.append({
                        "role": r[0], "content": r[1],
                        "tool_use": r[2], "timestamp": r[3],
                    })
            # Update last_active
            await self._db.execute(
                "UPDATE sessions SET last_active = ? WHERE id = ?", (now, session_id)
            )
            await self._db.commit()
        else:
            session_id = str(uuid.uuid4())
            session = Session(session_id, identifier, source)
            await self._db.execute(
                "INSERT INTO sessions (id, identifier, source, created_at, last_active) VALUES (?, ?, ?, ?, ?)",
                (session_id, identifier, source, now, now),
            )
            await self._db.commit()

        self._sessions[session_id] = session
        return session

    async def save_message(self, session: Session, role: str, content: str, tool_use: str | None = None):
        """Persist a message to the database."""
        now = time.time()
        session.add_message(role, content, tool_use)
        await self._db.execute(
            "INSERT INTO messages (session_id, role, content, tool_use, timestamp) VALUES (?, ?, ?, ?, ?)",
            (session.id, role, content, tool_use, now),
        )
        await self._db.execute(
            "UPDATE sessions SET last_active = ? WHERE id = ?", (now, session.id)
        )
        await self._db.commit()

    async def save_note(self, title: str, content: str, session_id: str | None = None):
        """Save a note (from the notes tool)."""
        await self._db.execute(
            "INSERT INTO notes (session_id, title, content, created_at) VALUES (?, ?, ?, ?)",
            (session_id, title, content, time.time()),
        )
        await self._db.commit()

    async def search_notes(self, query: str, limit: int = 10) -> list[dict]:
        """Search notes by title or content."""
        pattern = f"%{query}%"
        async with self._db.execute(
            "SELECT title, content, created_at FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC LIMIT ?",
            (pattern, pattern, limit),
        ) as cursor:
            return [{"title": r[0], "content": r[1], "created_at": r[2]} async for r in cursor]

    def remove_session(self, session_id: str):
        """Remove session from in-memory cache (DB data persists)."""
        self._sessions.pop(session_id, None)
