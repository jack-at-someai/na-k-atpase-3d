"""
Charlotte Voice Agent — Charlotte Integration Tools
=====================================================
MQTT publish/subscribe and KRF query interface.
Connects voice agent to the Charlotte nervous system.
"""

import asyncio
import json
import logging
import time

from config import Config

log = logging.getLogger("charlotte.tools.charlotte")

# Lazy MQTT client — only connects if MQTT broker is available
_mqtt_client = None


def _get_mqtt():
    """Lazy-initialize MQTT client."""
    global _mqtt_client
    if _mqtt_client is not None:
        return _mqtt_client
    try:
        import paho.mqtt.client as mqtt
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="charlotte-voice")
        client.connect(Config.MQTT_HOST, Config.MQTT_PORT, keepalive=60)
        client.loop_start()
        _mqtt_client = client
        log.info("MQTT connected to %s:%d", Config.MQTT_HOST, Config.MQTT_PORT)
        return client
    except Exception as e:
        log.warning("MQTT not available: %s", e)
        return None


TOOLS = [
    {
        "name": "mqtt_publish",
        "description": "Publish a message to the Charlotte MQTT broker. Use for controlling Charlotte systems, sending signals, or triggering protocols.",
        "input_schema": {
            "type": "object",
            "properties": {
                "topic": {
                    "type": "string",
                    "description": "MQTT topic (e.g. 'charlotte/voice/command', 'charlotte/signals/isg')",
                },
                "payload": {
                    "type": "string",
                    "description": "Message payload (string or JSON)",
                },
                "retain": {
                    "type": "boolean",
                    "description": "Whether to retain the message (default: false)",
                },
            },
            "required": ["topic", "payload"],
        },
    },
    {
        "name": "charlotte_status",
        "description": "Get the status of Charlotte OS systems — running services, connected satellites, active sessions.",
        "input_schema": {
            "type": "object",
            "properties": {},
        },
    },
    {
        "name": "send_sms",
        "description": "Send an outbound SMS text message via Twilio. Use to proactively notify Jack or other contacts.",
        "input_schema": {
            "type": "object",
            "properties": {
                "to": {
                    "type": "string",
                    "description": "Recipient phone number in E.164 format (e.g. '+18475551234')",
                },
                "body": {
                    "type": "string",
                    "description": "Message text to send",
                },
            },
            "required": ["to", "body"],
        },
    },
]


async def handle(name: str, args: dict) -> str:
    """Execute a Charlotte integration tool."""
    if name == "mqtt_publish":
        topic = args["topic"]
        payload = args["payload"]
        retain = args.get("retain", False)

        if Config.DEMO:
            return f"DEMO: Would publish to {topic}: {payload}"

        client = _get_mqtt()
        if not client:
            return "Error: MQTT broker not available"

        try:
            result = client.publish(topic, payload, retain=retain)
            if result.rc == 0:
                return f"Published to {topic}"
            else:
                return f"Error: MQTT publish failed (rc={result.rc})"
        except Exception as e:
            return f"Error: {e}"

    elif name == "charlotte_status":
        if Config.DEMO:
            return json.dumps({
                "mode": "demo",
                "services": ["voice-agent"],
                "mqtt": "simulated",
                "uptime": "demo mode",
            }, indent=2)

        status = {
            "mqtt": "connected" if _get_mqtt() else "unavailable",
            "voice_agent": "running",
            "timestamp": time.time(),
        }

        # Try to read system uptime
        try:
            proc = await asyncio.create_subprocess_shell(
                "uptime -p 2>/dev/null || echo 'unknown'",
                stdout=asyncio.subprocess.PIPE,
            )
            stdout, _ = await asyncio.wait_for(proc.communicate(), timeout=5)
            status["uptime"] = stdout.decode().strip()
        except Exception:
            status["uptime"] = "unknown"

        return json.dumps(status, indent=2)

    elif name == "send_sms":
        to = args["to"]
        body = args["body"]

        if Config.DEMO:
            return f"DEMO: Would send SMS to {to}: {body}"

        if not Config.TWILIO_ACCOUNT_SID or not Config.TWILIO_AUTH_TOKEN:
            return "Error: Twilio credentials not configured"
        if not Config.TWILIO_PHONE_NUMBER:
            return "Error: TWILIO_PHONE_NUMBER not set in .env"

        try:
            from twilio.rest import Client
            client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=body,
                from_=Config.TWILIO_PHONE_NUMBER,
                to=to,
            )
            log.info("SMS sent to %s: sid=%s", to, message.sid)
            return f"SMS sent to {to}"
        except ImportError:
            return "Error: twilio package not installed (pip install twilio)"
        except Exception as e:
            log.error("SMS send failed: %s", e)
            return f"Error sending SMS: {e}"

    return f"Unknown tool: {name}"
