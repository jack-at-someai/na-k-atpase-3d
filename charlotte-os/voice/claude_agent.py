"""
Charlotte Voice Agent — Claude Agent
======================================
Manages Claude API calls with tool execution loop.
Voice-optimized: short responses, no markdown, conversational tone.
"""

import json
import logging

import anthropic

from config import Config
from tools import ALL_TOOLS, HANDLERS

log = logging.getLogger("charlotte.agent")

SYSTEM_PROMPT = """You are Charlotte, a voice AI assistant running on a Raspberry Pi 5. You are part of the Charlotte OS — a universal substrate for modeling observable reality.

Voice interaction rules:
- Keep responses SHORT — 1-3 sentences max. This is spoken aloud, not read.
- Never use markdown, bullet points, code blocks, or formatting. Just speak naturally.
- Be warm, direct, and confident. You are Charlotte — not "an AI assistant."
- When using tools, briefly state what you're doing: "Let me check that..." or "Taking that note now..."
- If a task is complex, summarize the result concisely. Don't read file contents aloud verbatim — summarize.
- For errors, give a plain-English explanation. No stack traces.
- You can take notes, read/write files, run commands, and interact with Charlotte's MQTT systems.
- The caller may be Jack (the architect), a team member, or anyone with access. Be helpful to all.

You are running at home on Jack's Pi 5, connected to the Charlotte nervous system. You have access to local files and systems."""


class ClaudeAgent:
    """Claude agent with tool execution loop for voice conversations."""

    def __init__(self):
        if Config.DEMO:
            self._client = None
        else:
            self._client = anthropic.Anthropic(api_key=Config.ANTHROPIC_API_KEY)

    async def respond(self, messages: list[dict], on_tool_use=None) -> str:
        """
        Send messages to Claude, execute any tool calls, return final text.

        Args:
            messages: Conversation history (Claude format)
            on_tool_use: Optional async callback(tool_name, tool_args) for status updates

        Returns:
            Final text response from Claude
        """
        if Config.DEMO:
            return self._demo_respond(messages)

        current_messages = list(messages)

        # Agent loop — keep going until we get a text response with stop_reason="end_turn"
        for _ in range(10):  # Max 10 tool rounds
            try:
                response = self._client.messages.create(
                    model=Config.CLAUDE_MODEL,
                    max_tokens=Config.CLAUDE_MAX_TOKENS,
                    system=SYSTEM_PROMPT,
                    tools=ALL_TOOLS,
                    messages=current_messages,
                )
            except anthropic.APIError as e:
                log.error("Claude API error: %s", e)
                return "Sorry, I'm having trouble connecting to my brain right now. Try again in a moment."

            # Process response blocks
            text_parts = []
            tool_results = []

            for block in response.content:
                if block.type == "text":
                    text_parts.append(block.text)
                elif block.type == "tool_use":
                    tool_name = block.name
                    tool_args = block.input
                    tool_id = block.id

                    log.info("Tool call: %s(%s)", tool_name, json.dumps(tool_args)[:200])
                    if on_tool_use:
                        await on_tool_use(tool_name, tool_args)

                    # Execute the tool
                    handler = HANDLERS.get(tool_name)
                    if handler:
                        try:
                            result = await handler(tool_name, tool_args)
                        except Exception as e:
                            log.exception("Tool execution error: %s", tool_name)
                            result = f"Error: {e}"
                    else:
                        result = f"Unknown tool: {tool_name}"

                    log.info("Tool result: %s", result[:200])
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tool_id,
                        "content": result,
                    })

            # If no tool calls, we're done
            if not tool_results:
                return " ".join(text_parts).strip() or "Done."

            # Add assistant response and tool results to conversation
            current_messages.append({"role": "assistant", "content": response.content})
            current_messages.append({"role": "user", "content": tool_results})

            # If stop_reason is end_turn (no more tools), return text
            if response.stop_reason == "end_turn":
                return " ".join(text_parts).strip() or "Done."

        return "I've been working on that for a while. Let me know if you need anything else."

    def _demo_respond(self, messages: list[dict]) -> str:
        """Demo mode response without API calls."""
        last = messages[-1]["content"] if messages else ""
        if isinstance(last, str):
            text = last.lower()
        else:
            text = str(last).lower()

        if "hello" in text or "hi" in text:
            return "Hey! I'm Charlotte, running in demo mode on this Pi. What can I help with?"
        elif "note" in text:
            return "I've saved that note for you. You can search for it anytime."
        elif "status" in text:
            return "All systems nominal. Running in demo mode — no API calls active."
        elif "what can you" in text:
            return "I can take notes, read and write files, run shell commands, and control Charlotte's systems over MQTT. What do you need?"
        else:
            return "Got it. I'm in demo mode right now, so I'm giving canned responses. Connect the API keys for the full experience."
