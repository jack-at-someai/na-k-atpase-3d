"""
Charlotte Voice Agent — Twilio Handler
========================================
TwiML webhook generation, request signature validation, and media stream parsing.
"""

import base64
import hashlib
import hmac
import json
import logging
from urllib.parse import urlencode, urlparse

from aiohttp import web

from config import Config

log = logging.getLogger("charlotte.twilio")


def validate_twilio_signature(url: str, params: dict, signature: str) -> bool:
    """Validate that a request came from Twilio using HMAC-SHA1."""
    if not Config.TWILIO_AUTH_TOKEN:
        log.warning("No Twilio auth token configured — skipping validation")
        return True

    # Build the validation string per Twilio docs
    data = url
    if params:
        for key in sorted(params.keys()):
            data += key + params[key]

    expected = base64.b64encode(
        hmac.new(
            Config.TWILIO_AUTH_TOKEN.encode("utf-8"),
            data.encode("utf-8"),
            hashlib.sha1,
        ).digest()
    ).decode("utf-8")

    return hmac.compare_digest(expected, signature)


def generate_twiml(stream_url: str) -> str:
    """Generate TwiML that connects caller to our WebSocket media stream."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">Connecting to Charlotte.</Say>
    <Connect>
        <Stream url="{stream_url}">
            <Parameter name="source" value="twilio" />
        </Stream>
    </Connect>
</Response>"""


async def handle_voice_webhook(request: web.Request) -> web.Response:
    """
    POST /twilio/voice — Twilio calls this when someone dials the number.
    Returns TwiML that connects to our media stream WebSocket.
    """
    # Validate Twilio signature
    if Config.TWILIO_AUTH_TOKEN:
        signature = request.headers.get("X-Twilio-Signature", "")
        # Reconstruct the full URL Twilio used
        url = str(request.url)
        # For tunneled requests, use the original scheme/host
        if "X-Forwarded-Proto" in request.headers:
            parsed = urlparse(url)
            url = f"{request.headers['X-Forwarded-Proto']}://{request.headers.get('X-Forwarded-Host', parsed.netloc)}{parsed.path}"

        post_data = await request.post()
        params = dict(post_data)

        if not validate_twilio_signature(url, params, signature):
            log.warning("Invalid Twilio signature — rejecting request")
            return web.Response(status=403, text="Invalid signature")

    # Log caller info
    post_data = await request.post()
    caller = post_data.get("From", "unknown")
    log.info("Incoming call from %s", caller)

    # Build the WebSocket URL for the media stream
    tunnel_domain = Config.TUNNEL_DOMAIN
    stream_url = f"wss://{tunnel_domain}/twilio/media"

    twiml = generate_twiml(stream_url)
    return web.Response(
        text=twiml,
        content_type="application/xml",
    )


class TwilioMediaStream:
    """Handles a single Twilio media stream WebSocket connection."""

    def __init__(self, ws: web.WebSocketResponse):
        self.ws = ws
        self.stream_sid: str | None = None
        self.call_sid: str | None = None
        self.caller: str | None = None
        self._connected = False

    async def receive_events(self, on_audio, on_start, on_stop):
        """
        Process Twilio media stream events.

        Args:
            on_audio: async callback(audio_bytes: bytes) — raw mulaw audio
            on_start: async callback(stream_sid, call_sid, caller)
            on_stop: async callback()
        """
        async for msg in self.ws:
            if msg.type != web.WSMsgType.TEXT:
                continue

            try:
                data = json.loads(msg.data)
            except json.JSONDecodeError:
                continue

            event = data.get("event")

            if event == "connected":
                self._connected = True
                log.info("Twilio stream connected")

            elif event == "start":
                meta = data.get("start", {})
                self.stream_sid = meta.get("streamSid")
                self.call_sid = meta.get("callSid")
                # Custom parameters from TwiML
                custom = meta.get("customParameters", {})
                log.info("Stream started: sid=%s call=%s", self.stream_sid, self.call_sid)
                await on_start(self.stream_sid, self.call_sid, custom)

            elif event == "media":
                payload = data.get("media", {}).get("payload", "")
                if payload:
                    audio_bytes = base64.b64decode(payload)
                    await on_audio(audio_bytes)

            elif event == "stop":
                log.info("Twilio stream stopped")
                await on_stop()
                break

            elif event == "mark":
                # Mark event — audio playback reached a marker
                pass

    async def send_audio(self, audio_b64: str):
        """Send audio back to the caller via Twilio media stream."""
        if not self.stream_sid or not self._connected:
            return
        msg = json.dumps({
            "event": "media",
            "streamSid": self.stream_sid,
            "media": {
                "payload": audio_b64,
            },
        })
        await self.ws.send_str(msg)

    async def clear_audio(self):
        """Clear queued audio on Twilio side (for barge-in)."""
        if not self.stream_sid:
            return
        msg = json.dumps({
            "event": "clear",
            "streamSid": self.stream_sid,
        })
        await self.ws.send_str(msg)
        log.debug("Sent clear event for barge-in")

    async def send_mark(self, name: str):
        """Send a mark event to track audio playback position."""
        if not self.stream_sid:
            return
        msg = json.dumps({
            "event": "mark",
            "streamSid": self.stream_sid,
            "mark": {"name": name},
        })
        await self.ws.send_str(msg)
