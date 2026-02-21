#!/usr/bin/env python3
"""
Charlotte Voice Agent — Main Server
=====================================
Single Python asyncio process handling:
  - POST /twilio/voice      — TwiML webhook for incoming calls
  - POST /twilio/sms        — Webhook for incoming SMS messages
  - WS   /twilio/media      — Twilio bidirectional media stream
  - WS   /app/ws            — PWA WebSocket (push-to-talk + text)
  - GET  /app/*             — Static files for PWA
  - GET  /health            — Health check

Usage:
    python server.py [--demo] [--port 8080]

On the Pi:
    source ~/charlotte-env/bin/activate
    python server.py

Development (no API calls):
    python server.py --demo
"""

import argparse
import asyncio
import base64
import json
import logging
import os
import sys
import time
from pathlib import Path

from aiohttp import web

from config import Config
from session import SessionStore
from claude_agent import ClaudeAgent
from deepgram_client import DeepgramStreamer, DemoDeepgramStreamer
from elevenlabs_client import ElevenLabsTTS, DemoElevenLabsTTS
from twilio_handler import handle_voice_webhook, TwilioMediaStream, generate_sms_twiml, validate_twilio_signature
from tools.notes import set_store as set_notes_store
from tools.krf import init_krf_index

log = logging.getLogger("charlotte.voice")

# ---- Globals ----
store: SessionStore
agent: ClaudeAgent


# ===========================================================================
# Twilio media stream handler
# ===========================================================================

async def handle_twilio_media(request: web.Request) -> web.WebSocketResponse:
    """WS /twilio/media — bidirectional audio with Twilio."""
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    stream = TwilioMediaStream(ws)
    session = None
    deepgram = None
    tts = None
    is_speaking = False
    current_task = None

    async def on_transcript(text: str, is_final: bool):
        """Transcript events — for logging. Processing is triggered by turn events."""
        if is_final and text.strip():
            log.info("STT [twilio]: %s", text)

    async def on_utterance(text: str):
        """Confirmed end of turn — fire the agent."""
        nonlocal current_task
        log.info("Turn complete [twilio]: %s", text)
        # If a speculative task from eager_end_of_turn is already running, let it finish
        if current_task and not current_task.done():
            return
        current_task = asyncio.create_task(process_utterance(text))

    async def on_eager_utterance(text: str):
        """Speculative end of turn (Flux) — start agent early for lower latency."""
        nonlocal current_task
        log.info("Eager turn [twilio]: %s", text)
        if current_task and not current_task.done():
            current_task.cancel()
        current_task = asyncio.create_task(process_utterance(text))

    async def on_utterance_cancelled():
        """User kept talking after eager end (Flux TurnResumed) — cancel speculative work."""
        nonlocal current_task
        if current_task and not current_task.done():
            current_task.cancel()
            log.info("Speculative response cancelled — user still talking")

    async def on_speech_started():
        nonlocal is_speaking
        if is_speaking:
            # Barge-in: user started talking while Charlotte is speaking
            await stream.clear_audio()
            is_speaking = False
            log.info("Barge-in detected — cleared audio")

    # ── Minutes mode trigger detection ───────────────────────────────
    _MINUTES_START = (
        "take minutes", "start minutes", "start taking minutes",
        "take notes on this meeting", "meeting minutes",
        "record this meeting", "record the meeting",
    )
    _MINUTES_STOP = (
        "stop minutes", "end minutes", "stop taking minutes",
        "wrap up the minutes", "wrap it up", "finish minutes",
        "done with minutes", "that's it for the meeting",
        "end the meeting", "stop recording",
    )

    def _is_minutes_start(lower_text: str) -> bool:
        return any(p in lower_text for p in _MINUTES_START)

    def _is_minutes_stop(lower_text: str) -> bool:
        return any(p in lower_text for p in _MINUTES_STOP)

    # ── Briefing mode trigger detection ──────────────────────────────
    _BRIEFING_START = (
        "give me a briefing", "give me the briefing",
        "give me a rundown", "give me the rundown",
        "run me through", "brief me on", "brief me about",
        "brief me", "status report", "what's the latest",
    )
    _BRIEFING_STOP = (
        "end briefing", "stop briefing", "back to normal",
        "that's all", "that is all", "exit briefing",
    )
    _BRIEFING_SHORT_EXIT = (
        "thanks", "thank you", "got it", "okay",
        "ok", "cool", "great", "perfect", "good",
        "alright", "all right", "yep", "yup", "sure",
    )

    def _is_briefing_start(lower_text: str) -> bool:
        return any(p in lower_text for p in _BRIEFING_START)

    def _is_briefing_stop(lower_text: str) -> bool:
        return any(p in lower_text for p in _BRIEFING_STOP)

    def _extract_briefing_topic(lower_text: str) -> str:
        """Strip trigger prefix and return remainder as topic."""
        # Ordered longest-first to avoid partial matches
        prefixes = sorted(_BRIEFING_START, key=len, reverse=True)
        for prefix in prefixes:
            idx = lower_text.find(prefix)
            if idx != -1:
                remainder = lower_text[idx + len(prefix):].strip()
                # Clean up leading prepositions if the prefix didn't include them
                for prep in ("on ", "about ", "regarding ", "for "):
                    if remainder.startswith(prep):
                        remainder = remainder[len(prep):]
                        break
                return remainder
        return ""

    # ── MQTT publish helper ─────────────────────────────────────────
    def _publish_mqtt(event_data: dict):
        """Publish an event to charlotte/voice/session. Silently ignores failures."""
        try:
            from tools.charlotte import _get_mqtt
            mqtt = _get_mqtt()
            if mqtt:
                mqtt.publish("charlotte/voice/session", json.dumps(event_data))
        except Exception:
            pass

    # ── Speak a response via TTS (shared helper) ─────────────────────
    async def speak_response(messages_for_claude, source="phone", style_hint="", max_tokens=None):
        """Stream a Claude response through TTS to the caller. Returns response text."""
        nonlocal is_speaking
        is_speaking = True

        if Config.DEMO:
            tts_engine = DemoElevenLabsTTS(output_format="ulaw_8000")
        else:
            tts_engine = ElevenLabsTTS(output_format="ulaw_8000")

        try:
            await tts_engine.connect()
        except Exception:
            log.exception("TTS connect failed")
            is_speaking = False
            return ""

        audio_done = asyncio.Event()

        async def forward_audio():
            try:
                async for audio_b64 in tts_engine.receive_audio():
                    if not is_speaking:
                        break
                    await stream.send_audio(audio_b64)
            except asyncio.CancelledError:
                pass
            except Exception:
                log.exception("TTS audio forwarding error")
            finally:
                audio_done.set()

        audio_task = asyncio.create_task(forward_audio())

        async def on_sentence(sentence_text):
            await tts_engine.send_text(sentence_text)

        try:
            response_text = await agent.respond_streaming(
                messages_for_claude,
                on_sentence=on_sentence,
                source=source,
                style_hint=style_hint,
                max_tokens=max_tokens,
            )
        except asyncio.CancelledError:
            audio_task.cancel()
            await tts_engine.close()
            is_speaking = False
            raise
        except Exception:
            log.exception("Claude streaming error")
            audio_task.cancel()
            await tts_engine.close()
            is_speaking = False
            return ""

        await tts_engine.flush()
        try:
            await asyncio.wait_for(audio_done.wait(), timeout=30.0)
        except asyncio.TimeoutError:
            log.warning("TTS audio drain timed out")
        finally:
            audio_task.cancel()
            await tts_engine.close()
            is_speaking = False

        return response_text

    # ── Main utterance processor ─────────────────────────────────────
    async def process_utterance(text: str):
        if not session:
            return

        lower = text.lower().strip()

        # ── Minutes mode: accumulate or exit ─────────────────────────
        if session.mode == "minutes":
            if _is_minutes_stop(lower):
                await finish_minutes(text)
                return

            # Accumulate silently — no Claude call, no TTS
            elapsed = time.time() - session.minutes_started_at
            session.minutes_transcript.append({
                "text": text,
                "elapsed": elapsed,
            })
            log.info("Minutes [%s] [%d:%02d]: %s",
                     session.id[:8], int(elapsed) // 60, int(elapsed) % 60, text[:200])
            return

        # ── Briefing mode: handle follow-ups or exit ─────────────────
        if session.mode == "briefing":
            # Explicit exit
            if _is_briefing_stop(lower):
                await finish_briefing(text)
                return

            # Auto-exit: after 2+ turns, short utterances exit gracefully
            words = lower.split()
            if session.briefing_turn_count >= 2 and (
                len(words) <= 4
                or any(lower.startswith(s) for s in _BRIEFING_SHORT_EXIT)
            ):
                await finish_briefing(text)
                return

            # Follow-up question — stay in briefing mode
            session.briefing_turn_count += 1
            session.profile.update(text)
            await store.save_message(session, "user", text)
            messages = session.get_claude_messages()

            try:
                response_text = await speak_response(
                    messages, source="phone_briefing",
                    max_tokens=Config.CLAUDE_MAX_TOKENS_BRIEFING,
                )
            except asyncio.CancelledError:
                log.info("Briefing follow-up cancelled")
                return

            if response_text:
                await store.save_message(session, "assistant", response_text)
                log.info("Briefing follow-up [%s]: %s", session.id[:8], response_text[:200])
            return

        # ── Check for minutes mode entry ─────────────────────────────
        if _is_minutes_start(lower):
            session.mode = "minutes"
            session.minutes_transcript = []
            session.minutes_started_at = time.time()
            log.info("Entering minutes mode [%s]", session.id[:8])
            _publish_mqtt({
                "event": "minutes_start",
                "session_id": session.id,
                "timestamp": time.time(),
            })
            # Falls through to normal processing below

        # ── Check for briefing mode entry ─────────────────────────────
        if _is_briefing_start(lower):
            topic = _extract_briefing_topic(lower)
            session.mode = "briefing"
            session.briefing_topic = topic
            session.briefing_started_at = time.time()
            session.briefing_turn_count = 1
            log.info("Entering briefing mode [%s]: topic=%r", session.id[:8], topic or "(general)")
            _publish_mqtt({
                "event": "briefing_start",
                "session_id": session.id,
                "topic": topic,
                "timestamp": time.time(),
            })

            # Build briefing prompt
            if topic:
                prompt = f"Give me a briefing on {topic}."
            else:
                prompt = "Give me a general status briefing."

            session.profile.update(text)
            await store.save_message(session, "user", text)
            messages = session.get_claude_messages()
            # Replace last user message with the structured prompt
            messages[-1] = {"role": "user", "content": prompt}

            try:
                response_text = await speak_response(
                    messages, source="phone_briefing",
                    max_tokens=Config.CLAUDE_MAX_TOKENS_BRIEFING,
                )
            except asyncio.CancelledError:
                log.info("Briefing cancelled")
                return

            if response_text:
                await store.save_message(session, "assistant", response_text)
                log.info("Briefing [%s]: %s", session.id[:8], response_text[:200])
            return

        # ── Normal conversational processing ─────────────────────────
        session.profile.update(text)
        style_hint = session.profile.style_hint()
        if style_hint:
            log.info("Profile [%s]: style=%s avg_words=%.1f",
                     session.id[:8], session.profile.style, session.profile.avg_words)

        await store.save_message(session, "user", text)
        messages = session.get_claude_messages()

        try:
            response_text = await speak_response(messages, source="phone", style_hint=style_hint)
        except asyncio.CancelledError:
            log.info("Response cancelled (new utterance arrived)")
            return

        if response_text:
            await store.save_message(session, "assistant", response_text)
            log.info("Claude [twilio]: %s", response_text[:200])

    # ── Minutes summarization ────────────────────────────────────────
    async def finish_minutes(exit_text: str):
        """Summarize accumulated minutes, speak the summary, and save as a note."""
        transcript = session.minutes_transcript
        duration = time.time() - session.minutes_started_at
        session.mode = "conversational"

        log.info("Minutes ended [%s]: %d entries over %.0fs",
                 session.id[:8], len(transcript), duration)
        _publish_mqtt({
            "event": "minutes_end",
            "session_id": session.id,
            "entries": len(transcript),
            "duration_seconds": round(duration),
            "timestamp": time.time(),
        })

        if not transcript:
            # Nothing was said — just acknowledge
            await store.save_message(session, "user", exit_text)
            messages = [{"role": "user", "content": "The meeting is over but nothing was discussed."}]
            response = await speak_response(messages, source="phone")
            if response:
                await store.save_message(session, "assistant", response)
            return

        # Build timestamped transcript
        lines = []
        for entry in transcript:
            mins = int(entry["elapsed"]) // 60
            secs = int(entry["elapsed"]) % 60
            lines.append(f"[{mins}:{secs:02d}] {entry['text']}")
        transcript_text = "\n".join(lines)

        summary_request = (
            f"I just finished taking minutes on a meeting. "
            f"Duration: {duration/60:.0f} minutes, {len(transcript)} spoken entries.\n\n"
            f"Transcript:\n{transcript_text}\n\n"
            "Summarize this meeting. Cover the key points discussed, any decisions made, "
            "and action items if any were mentioned. This will be spoken aloud so keep it "
            "natural and conversational. No bullet points or formatting."
        )

        await store.save_message(session, "user", exit_text)
        messages = [{"role": "user", "content": summary_request}]

        try:
            response_text = await speak_response(messages, source="phone")
        except asyncio.CancelledError:
            log.info("Minutes summary cancelled")
            return

        if response_text:
            await store.save_message(session, "assistant", response_text)
            log.info("Minutes summary [%s]: %s", session.id[:8], response_text[:200])

            # Save the full minutes as a note
            from datetime import datetime
            note_title = f"Meeting Minutes — {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            note_body = (
                f"Duration: {duration/60:.0f} minutes | {len(transcript)} entries\n\n"
                f"Summary:\n{response_text}\n\n"
                f"--- Transcript ---\n{transcript_text}"
            )
            await store.save_note(note_title, note_body, session_id=session.id)
            log.info("Minutes saved as note: %s", note_title)

    # ── Briefing exit ────────────────────────────────────────────────
    async def finish_briefing(exit_text: str):
        """Exit briefing mode — acknowledge and return to conversational."""
        topic = session.briefing_topic
        turn_count = session.briefing_turn_count
        duration = time.time() - session.briefing_started_at

        session.mode = "conversational"
        session.briefing_topic = ""
        session.briefing_started_at = 0.0
        session.briefing_turn_count = 0

        log.info("Briefing ended [%s]: topic=%r turns=%d duration=%.0fs",
                 session.id[:8], topic or "(general)", turn_count, duration)
        _publish_mqtt({
            "event": "briefing_end",
            "session_id": session.id,
            "topic": topic,
            "turn_count": turn_count,
            "duration_seconds": round(duration),
            "timestamp": time.time(),
        })

        # Let Claude give a brief conversational close
        await store.save_message(session, "user", exit_text)
        close_prompt = "The briefing is over. Give a brief, natural acknowledgment — one sentence max."
        messages = [{"role": "user", "content": close_prompt}]

        try:
            response_text = await speak_response(messages, source="phone")
        except asyncio.CancelledError:
            return

        if response_text:
            await store.save_message(session, "assistant", response_text)
            log.info("Briefing close [%s]: %s", session.id[:8], response_text[:200])

    async def on_start(stream_sid, call_sid, custom_params):
        nonlocal session, deepgram
        # Use call SID as session identifier for phone calls
        identifier = call_sid or "unknown"
        session = await store.get_or_create(identifier, source="phone")
        session.stream_sid = stream_sid
        log.info("Session created: %s (call=%s)", session.id, call_sid)

        # Start Deepgram with turn detection callbacks
        if Config.DEMO:
            deepgram = DemoDeepgramStreamer(on_transcript, on_speech_started,
                                           on_utterance=on_utterance)
        else:
            deepgram = DeepgramStreamer(
                on_transcript,
                on_speech_started=on_speech_started,
                on_utterance=on_utterance,
                on_eager_utterance=on_eager_utterance,
                on_utterance_cancelled=on_utterance_cancelled,
                encoding="mulaw",
                sample_rate=8000,
            )
        await deepgram.connect()

        _publish_mqtt({
            "event": "call_start",
            "call_sid": call_sid,
            "timestamp": time.time(),
        })

    _audio_chunks = 0

    async def on_audio(audio_bytes: bytes):
        nonlocal _audio_chunks
        _audio_chunks += 1
        if _audio_chunks == 1:
            log.info("First audio chunk received: %d bytes", len(audio_bytes))
        elif _audio_chunks % 500 == 0:
            log.info("Audio chunks received: %d", _audio_chunks)
        if deepgram:
            await deepgram.send_audio(audio_bytes)

    async def on_stop():
        nonlocal session
        if deepgram:
            await deepgram.close()
        if session:
            log.info("Call ended: %s (%d messages)", session.id, len(session.messages))
            store.remove_session(session.id)
            _publish_mqtt({
                "event": "call_end",
                "session_id": session.id,
                "messages": len(session.messages),
                "timestamp": time.time(),
            })

    try:
        await stream.receive_events(on_audio, on_start, on_stop)
    except Exception:
        log.exception("Twilio media stream error")
    finally:
        if deepgram:
            await deepgram.close()

    return ws


# ===========================================================================
# Twilio SMS handler
# ===========================================================================

# ── SMS primitive mode constants ──────────────────────────────────────

_SMS_PREFIX_MAP = {
    "n:": "node", "e:": "edge", "m:": "metric",
    "s:": "signal", "p:": "protocol",
    "/node": "node", "/edge": "edge", "/metric": "metric",
    "/signal": "signal", "/protocol": "protocol",
}
_SMS_RESET_COMMANDS = frozenset({"x", "reset", "/reset", "/general", "/exit"})
_SMS_HELP_COMMANDS = frozenset({"?", "/help", "help", "/modes"})
_SMS_MODE_SOURCE = {
    "general": "sms", "node": "sms_node", "edge": "sms_edge",
    "metric": "sms_metric", "signal": "sms_signal", "protocol": "sms_protocol",
}
_SMS_MODE_TAGS = {
    "node": "[N]", "edge": "[E]", "metric": "[M]",
    "signal": "[S]", "protocol": "[P]",
}

_SMS_HELP_TEXT = (
    "Charlotte SMS modes:\n"
    "n: entity — Node (who/what)\n"
    "e: entity — Edge (relationships)\n"
    "m: entity — Metric (numbers)\n"
    "s: entity — Signal (conditions)\n"
    "p: entity — Protocol (procedures)\n"
    "x — reset to general\n"
    "? — this help\n"
    "Entity carries across mode switches."
)


def _parse_sms_mode(body: str) -> tuple[str | None, str]:
    """Parse SMS body for mode prefix. Returns (mode_or_None, cleaned_body)."""
    lower = body.lower().strip()
    # Check reset commands
    if lower in _SMS_RESET_COMMANDS:
        return ("reset", "")
    # Check prefix map (case-insensitive, ordered longest-first to avoid partial matches)
    for prefix in sorted(_SMS_PREFIX_MAP, key=len, reverse=True):
        if lower.startswith(prefix):
            rest = body[len(prefix):].strip()
            return (_SMS_PREFIX_MAP[prefix], rest)
    return (None, body)


async def handle_twilio_sms(request: web.Request) -> web.Response:
    """POST /twilio/sms — handle incoming SMS messages."""
    from urllib.parse import urlparse

    # Validate Twilio signature
    if Config.TWILIO_AUTH_TOKEN:
        signature = request.headers.get("X-Twilio-Signature", "")
        url = str(request.url)
        if "X-Forwarded-Proto" in request.headers:
            parsed = urlparse(url)
            url = f"{request.headers['X-Forwarded-Proto']}://{request.headers.get('X-Forwarded-Host', parsed.netloc)}{parsed.path}"

        post_data = await request.post()
        params = dict(post_data)

        if not validate_twilio_signature(url, params, signature):
            log.warning("Invalid Twilio signature on SMS — rejecting")
            return web.Response(status=403, text="Invalid signature")

    post_data = await request.post()
    sender = post_data.get("From", "unknown")
    body = post_data.get("Body", "").strip()
    log.info("Incoming SMS from %s: %s", sender, body[:200])

    if not body:
        twiml = generate_sms_twiml("I received an empty message. Send me some text and I'll respond.")
        return web.Response(text=twiml, content_type="application/xml")

    # Use sender phone number as session identifier for continuity
    session = await store.get_or_create(sender, source="sms")

    # ── Help handler ──────────────────────────────────────────────────
    if body.lower().strip() in _SMS_HELP_COMMANDS:
        mode_label = session.sms_mode if session.sms_mode != "general" else "general"
        help_reply = _SMS_HELP_TEXT + f"\nCurrent: {mode_label}"
        twiml = generate_sms_twiml(help_reply)
        return web.Response(text=twiml, content_type="application/xml")

    # ── Parse prefix ──────────────────────────────────────────────────
    parsed_mode, cleaned_body = _parse_sms_mode(body)

    # Handle reset
    if parsed_mode == "reset":
        session.sms_mode = "general"
        session.sms_last_entity = ""
        twiml = generate_sms_twiml("Mode reset. Back to general Charlotte.")
        return web.Response(text=twiml, content_type="application/xml")

    # Mode switch
    if parsed_mode and parsed_mode != "reset":
        session.sms_mode = parsed_mode
        log.info("SMS mode switch [%s]: %s", sender, parsed_mode)

    # ── Context carry (primitive modes only) ──────────────────────────
    query_for_claude = cleaned_body
    if session.sms_mode != "general":
        if not cleaned_body and session.sms_last_entity:
            # Empty query after mode switch — re-query last entity in new mode
            query_for_claude = f"(regarding: {session.sms_last_entity})"
        elif not cleaned_body and not session.sms_last_entity:
            # No entity context at all — prompt for one
            tag = _SMS_MODE_TAGS.get(session.sms_mode, "")
            twiml = generate_sms_twiml(f"{tag} Mode set to {session.sms_mode}. Send an entity to query.")
            return web.Response(text=twiml, content_type="application/xml")
        elif len(cleaned_body.split()) <= 3 and session.sms_last_entity:
            # Short query — inject entity context
            query_for_claude = f"{cleaned_body} (regarding: {session.sms_last_entity})"
        else:
            # Longer query — update entity context
            session.sms_last_entity = cleaned_body

    # ── Save and build messages ───────────────────────────────────────
    await store.save_message(session, "user", body)
    messages = session.get_claude_messages()

    # If context-enriched query differs from raw body, replace last message for Claude
    if query_for_claude != body and query_for_claude:
        messages[-1] = {"role": "user", "content": query_for_claude}

    # ── Pick source key and tokens ────────────────────────────────────
    source_key = _SMS_MODE_SOURCE.get(session.sms_mode, "sms")
    max_tokens = Config.CLAUDE_MAX_TOKENS_SMS if session.sms_mode != "general" else None

    try:
        response_text = await agent.respond(messages, source=source_key, max_tokens=max_tokens)
    except Exception:
        log.exception("Claude error processing SMS")
        response_text = "Sorry, I hit an error processing that. Try again in a moment."

    await store.save_message(session, "assistant", response_text)
    log.info("SMS reply to %s [%s]: %s", sender, session.sms_mode, response_text[:200])

    # Publish to MQTT
    try:
        from tools.charlotte import _get_mqtt
        mqtt = _get_mqtt()
        if mqtt:
            mqtt.publish("charlotte/voice/session", json.dumps({
                "event": "sms_received",
                "from": sender,
                "body": body[:500],
                "reply": response_text[:500],
                "mode": session.sms_mode,
                "last_entity": session.sms_last_entity,
                "timestamp": time.time(),
            }))
    except Exception:
        pass

    twiml = generate_sms_twiml(response_text)
    return web.Response(text=twiml, content_type="application/xml")


# ===========================================================================
# PWA app WebSocket handler
# ===========================================================================

async def handle_app_ws(request: web.Request) -> web.WebSocketResponse:
    """WS /app/ws — PWA push-to-talk and text interface."""
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    # Auth check
    token = request.query.get("token", "")
    if Config.APP_AUTH_TOKEN and token != Config.APP_AUTH_TOKEN:
        await ws.send_json({"type": "error", "message": "Unauthorized"})
        await ws.close()
        return ws

    session = await store.get_or_create(token or "app-default", source="app")
    deepgram = None
    log.info("App client connected: session=%s", session.id)

    # Send conversation history
    history = [
        {"role": m["role"], "content": m["content"]}
        for m in session.messages[-20:]
        if m["role"] in ("user", "assistant")
    ]
    await ws.send_json({"type": "history", "messages": history})

    async def on_transcript(text: str, is_final: bool):
        await ws.send_json({"type": "transcript", "text": text, "is_final": is_final})
        if is_final and text.strip():
            await process_app_utterance(text)

    async def process_app_utterance(text: str):
        await store.save_message(session, "user", text)
        await ws.send_json({"type": "status", "status": "thinking"})

        messages = session.get_claude_messages()

        async def on_tool_use(name, args):
            await ws.send_json({"type": "status", "status": "tool", "tool": name})

        response_text = await agent.respond(messages, on_tool_use=on_tool_use, source="app")
        await store.save_message(session, "assistant", response_text)
        log.info("Claude [app]: %s", response_text[:200])

        # Send text response
        await ws.send_json({"type": "response", "text": response_text})

        # Generate TTS audio
        await ws.send_json({"type": "status", "status": "speaking"})
        if Config.DEMO:
            tts = DemoElevenLabsTTS(output_format="mp3_44100_128")
        else:
            tts = ElevenLabsTTS(output_format="mp3_44100_128")
        await tts.connect()
        try:
            audio_chunks = []
            async for audio_b64 in tts.synthesize(response_text):
                audio_chunks.append(audio_b64)
                await ws.send_json({"type": "audio", "data": audio_b64, "final": False})
            await ws.send_json({"type": "audio", "data": "", "final": True})
        finally:
            await tts.close()

        await ws.send_json({"type": "status", "status": "idle"})

    async for msg in ws:
        if msg.type == web.WSMsgType.TEXT:
            try:
                data = json.loads(msg.data)
            except json.JSONDecodeError:
                continue

            msg_type = data.get("type")

            if msg_type == "text":
                # Text input (typed message)
                text = data.get("text", "").strip()
                if text:
                    await process_app_utterance(text)

            elif msg_type == "audio_start":
                # Start streaming audio from app
                if Config.DEMO:
                    deepgram = DemoDeepgramStreamer(on_transcript, encoding="linear16", sample_rate=16000)
                else:
                    deepgram = DeepgramStreamer(on_transcript, encoding="linear16", sample_rate=16000)
                await deepgram.connect()
                await ws.send_json({"type": "status", "status": "listening"})

            elif msg_type == "audio_data":
                # Raw PCM audio chunk from app (base64 encoded)
                if deepgram:
                    audio = base64.b64decode(data.get("data", ""))
                    await deepgram.send_audio(audio)

            elif msg_type == "audio_stop":
                # Stop streaming audio
                if deepgram:
                    await deepgram.close()
                    deepgram = None

        elif msg.type == web.WSMsgType.BINARY:
            # Raw audio bytes (alternative to base64)
            if deepgram:
                await deepgram.send_audio(msg.data)

    # Cleanup
    if deepgram:
        await deepgram.close()
    log.info("App client disconnected: session=%s", session.id)
    return ws


# ===========================================================================
# Static file serving (PWA)
# ===========================================================================

async def handle_app_static(request: web.Request) -> web.Response:
    """GET /app/* — serve PWA static files."""
    path = request.match_info.get("path", "index.html")
    if not path or path == "/":
        path = "index.html"

    file_path = Path(__file__).parent / "app" / path
    if not file_path.exists() or not file_path.is_file():
        return web.Response(status=404, text="Not found")

    # Content type mapping
    ext = file_path.suffix.lower()
    content_types = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".ico": "image/x-icon",
        ".svg": "image/svg+xml",
        ".webmanifest": "application/manifest+json",
    }
    ct = content_types.get(ext, "application/octet-stream")

    return web.Response(
        body=file_path.read_bytes(),
        content_type=ct,
        headers={"Cache-Control": "public, max-age=3600"},
    )


# ===========================================================================
# Health check
# ===========================================================================

async def handle_health(request: web.Request) -> web.Response:
    """GET /health — returns server status."""
    return web.json_response({
        "status": "ok",
        "mode": "demo" if Config.DEMO else "live",
        "uptime": time.time() - _start_time,
    })


# ===========================================================================
# Demo endpoint (trigger test utterances)
# ===========================================================================

async def handle_demo_trigger(request: web.Request) -> web.Response:
    """POST /demo/trigger — trigger a demo utterance (demo mode only)."""
    if not Config.DEMO:
        return web.Response(status=404, text="Not found")

    data = await request.json()
    text = data.get("text", "Hello Charlotte")

    session = await store.get_or_create("demo-user", source="demo")
    await store.save_message(session, "user", text)
    messages = session.get_claude_messages()
    response = await agent.respond(messages)
    await store.save_message(session, "assistant", response)

    return web.json_response({"input": text, "response": response})


# ===========================================================================
# Server setup
# ===========================================================================

_start_time = time.time()


async def on_startup(app: web.Application):
    """Initialize stores and connections on server start."""
    global store, agent
    store = SessionStore()
    await store.init()
    set_notes_store(store)
    await init_krf_index()
    agent = ClaudeAgent()
    log.info("Charlotte Voice Agent started")
    log.info(Config.log_status())
    missing = Config.validate()
    if missing:
        log.warning("Missing API keys: %s — some features disabled", ", ".join(missing))


async def on_shutdown(app: web.Application):
    """Cleanup on server shutdown."""
    if store:
        await store.close()
    log.info("Charlotte Voice Agent stopped")


def create_app() -> web.Application:
    """Create and configure the aiohttp application."""
    app = web.Application()

    # Routes
    app.router.add_post("/twilio/voice", handle_voice_webhook)
    app.router.add_post("/twilio/sms", handle_twilio_sms)
    app.router.add_get("/twilio/media", handle_twilio_media)
    app.router.add_get("/app/ws", handle_app_ws)
    app.router.add_get("/app/{path:.*}", handle_app_static)
    app.router.add_get("/app", handle_app_static)
    app.router.add_get("/health", handle_health)
    app.router.add_post("/demo/trigger", handle_demo_trigger)

    # Root redirect to app
    async def root_redirect(request):
        raise web.HTTPFound("/app/")
    app.router.add_get("/", root_redirect)

    app.on_startup.append(on_startup)
    app.on_shutdown.append(on_shutdown)

    return app


def main():
    parser = argparse.ArgumentParser(description="Charlotte Voice Agent")
    parser.add_argument("--demo", action="store_true", help="Run in demo mode (no API calls)")
    parser.add_argument("--port", type=int, default=None, help="Server port (default: 8080)")
    parser.add_argument("--host", type=str, default=None, help="Server host (default: 0.0.0.0)")
    args = parser.parse_args()

    if args.demo:
        Config.DEMO = True
    if args.port:
        Config.PORT = args.port
    if args.host:
        Config.HOST = args.host

    # Logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    mode = "DEMO" if Config.DEMO else "LIVE"
    log.info("Starting Charlotte Voice Agent (%s) on %s:%d", mode, Config.HOST, Config.PORT)

    app = create_app()
    web.run_app(app, host=Config.HOST, port=Config.PORT, print=None)


if __name__ == "__main__":
    main()
