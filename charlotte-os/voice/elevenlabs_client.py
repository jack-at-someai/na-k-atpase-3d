"""
Charlotte Voice Agent — ElevenLabs Streaming TTS
==================================================
Streams text to ElevenLabs WebSocket API, receives audio chunks.
Supports ulaw_8000 output for Twilio passthrough and mp3_44100 for app.
"""

import asyncio
import base64
import json
import logging

import websockets

from config import Config

log = logging.getLogger("charlotte.elevenlabs")


class ElevenLabsTTS:
    """Streaming text-to-speech via ElevenLabs WebSocket API."""

    ELEVENLABS_WSS = "wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input"

    def __init__(self, output_format: str = "ulaw_8000"):
        """
        Args:
            output_format: "ulaw_8000" for Twilio, "mp3_44100_128" for app
        """
        self._output_format = output_format
        self._ws = None
        self._running = False

    async def connect(self):
        """Open WebSocket to ElevenLabs."""
        if Config.DEMO:
            log.info("DEMO: ElevenLabs connection simulated")
            self._running = True
            return

        voice_id = Config.ELEVENLABS_VOICE_ID
        url = (
            self.ELEVENLABS_WSS.format(voice_id=voice_id)
            + f"?model_id=eleven_turbo_v2_5"
            + f"&output_format={self._output_format}"
        )

        self._ws = await websockets.connect(
            url,
            open_timeout=30,
            ping_interval=20,
            ping_timeout=20,
        )

        # Send initial config (BOS — beginning of stream)
        await self._ws.send(json.dumps({
            "text": " ",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
            },
            "xi_api_key": Config.ELEVENLABS_API_KEY,
        }))
        self._running = True
        log.info("ElevenLabs connected (format=%s)", self._output_format)

    # ── Incremental streaming interface ──────────────────────────────────
    # Use send_text() + flush() + receive_audio() for pipelined TTS where
    # text arrives in chunks (e.g., streamed from Claude sentence by sentence).

    async def send_text(self, text: str):
        """Send a text chunk for incremental synthesis.
        ElevenLabs will start generating audio as soon as it has enough text."""
        if not self._ws or not self._running:
            return
        await self._ws.send(json.dumps({
            "text": text + " ",
            "try_trigger_generation": True,
        }))

    async def flush(self):
        """Signal end of text input. Call once after all send_text() calls."""
        if not self._ws or not self._running:
            return
        await self._ws.send(json.dumps({"text": ""}))

    async def receive_audio(self):
        """Yield audio chunks (base64) until synthesis is complete (isFinal).
        Run this concurrently with send_text() calls for pipelined TTS."""
        if not self._ws or not self._running:
            return
        try:
            while True:
                msg = await asyncio.wait_for(self._ws.recv(), timeout=30.0)
                data = json.loads(msg)
                audio_b64 = data.get("audio")
                if audio_b64:
                    yield audio_b64
                if data.get("isFinal"):
                    break
        except asyncio.TimeoutError:
            log.warning("ElevenLabs receive timeout")
        except websockets.ConnectionClosed:
            log.warning("ElevenLabs connection closed during receive")
            self._running = False
        except Exception:
            log.exception("ElevenLabs receive error")

    # ── One-shot interface (backwards compat) ─────────────────────────────

    async def synthesize(self, text: str):
        """Send full text and yield audio chunks. Use for non-streaming callers."""
        if Config.DEMO:
            yield base64.b64encode(b"\xff" * 160).decode("ascii")
            return

        if not self._ws or not self._running:
            log.warning("ElevenLabs not connected, skipping TTS")
            return

        await self.send_text(text)
        await self.flush()
        async for chunk in self.receive_audio():
            yield chunk

    async def close(self):
        """Close the ElevenLabs WebSocket."""
        self._running = False
        if self._ws:
            try:
                await self._ws.close()
            except Exception:
                pass
            self._ws = None
        log.info("ElevenLabs disconnected")


class DemoElevenLabsTTS(ElevenLabsTTS):
    """Demo mode: returns silent audio without API calls."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._demo_text = ""

    async def connect(self):
        self._running = True
        self._demo_text = ""
        log.info("DEMO: ElevenLabs TTS ready (simulated)")

    async def send_text(self, text: str):
        self._demo_text += text

    async def flush(self):
        pass  # receive_audio handles the demo output

    async def receive_audio(self):
        """Yield silent chunks proportional to accumulated text."""
        await asyncio.sleep(0.1)  # Simulate processing delay
        words = self._demo_text.split()
        chunk_size = 1600
        for _ in range(0, max(len(words), 1), 3):
            yield base64.b64encode(b"\xff" * chunk_size).decode("ascii")
            await asyncio.sleep(0.2)
        self._demo_text = ""

    async def synthesize(self, text: str):
        """Yield a small silent mulaw chunk per ~word for timing simulation."""
        words = text.split()
        chunk_size = 1600
        for _ in range(0, len(words), 3):
            yield base64.b64encode(b"\xff" * chunk_size).decode("ascii")
            await asyncio.sleep(0.2)

    async def close(self):
        self._running = False
        self._demo_text = ""
        log.info("DEMO: ElevenLabs disconnected")
