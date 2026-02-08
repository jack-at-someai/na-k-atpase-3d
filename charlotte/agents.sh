#!/bin/bash
# Sounder Agent Launcher
# Usage: ./agents.sh [agent-name]
# Example: ./agents.sh finn

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_DIR="$SCRIPT_DIR/.claude/agents"
AGENTS_JSON="$SCRIPT_DIR/.claude/agents.json"

show_help() {
    echo "Sounder Agent Launcher"
    echo ""
    echo "Usage: ./agents.sh [agent]"
    echo ""
    echo "Available agents:"
    echo "  charlotte  - Plan Agent (orchestrates and delegates to others)"
    echo "  finn       - Backend Agent (Firebase, models, repositories)"
    echo "  nemo       - Frontend: UPCOMING mode (±7 days)"
    echo "  squirt     - Frontend: METRIC mode (swimming lanes)"
    echo "  wilbur     - Frontend: AGENT mode (conversational UI)"
    echo "  cal        - Frontend: CALENDAR mode (signals as events)"
    echo "  milo       - Frontend: NODE mode (hex navigation)"
    echo "  dori       - Frontend: NODE detail (lighthouse view)"
    echo ""
    echo "Example:"
    echo "  ./agents.sh charlotte  # Start as orchestrator (can delegate)"
    echo "  ./agents.sh finn       # Start as FINN directly"
}

if [ -z "$1" ]; then
    show_help
    exit 0
fi

AGENT=$(echo "$1" | tr '[:upper:]' '[:lower:]')
AGENT_FILE="$AGENTS_DIR/$AGENT.md"

if [ ! -f "$AGENT_FILE" ]; then
    echo "Error: Unknown agent '$1'"
    echo ""
    show_help
    exit 1
fi

AGENT_UPPER=$(echo "$AGENT" | tr '[:lower:]' '[:upper:]')
echo "==========================================="
echo "  Starting Claude Code as $AGENT_UPPER"
echo "==========================================="
echo ""
echo "Territory: docs/agents/$AGENT_UPPER.md"
echo "Config:    .claude/agents/$AGENT.md"

# Read the agent's instructions
INSTRUCTIONS=$(cat "$AGENT_FILE")

cd "$SCRIPT_DIR"

# CHARLOTTE is special - she gets the agents.json for delegation
if [ "$AGENT" = "charlotte" ]; then
    echo "Agents:    .claude/agents.json (can delegate)"
    echo ""
    echo "Charlotte can delegate to: finn, nemo, squirt, wilbur, cal, milo, dori"
    echo ""
    exec claude --dangerously-skip-permissions --append-system-prompt "$INSTRUCTIONS" --agents "$AGENTS_JSON"
else
    echo ""
    exec claude --dangerously-skip-permissions --append-system-prompt "$INSTRUCTIONS"
fi
