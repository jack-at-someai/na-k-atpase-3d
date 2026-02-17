#!/usr/bin/env bash
# Charlotte Voice Agent — Pi 5 Setup Script
# ==========================================
# Run on a fresh Pi 5 with Raspberry Pi OS Lite (Bookworm 64-bit).
# Assumes: user 'jack', mosquitto already installed (from nervous system setup).
#
# Usage:
#   chmod +x install.sh && ./install.sh

set -euo pipefail

echo "=== Charlotte Voice Agent — Pi 5 Setup ==="

# ---- System packages ----
echo "[1/5] Installing system packages..."
sudo apt update
sudo apt install -y \
    python3-pip python3-venv python3-dev \
    libffi-dev libssl-dev \
    ffmpeg curl wget

# ---- Python venv ----
VENV_DIR="$HOME/charlotte-env"
echo "[2/5] Setting up Python venv at $VENV_DIR..."
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"

# ---- Python dependencies ----
echo "[3/5] Installing Python packages..."
pip install --upgrade pip
pip install -r "$(dirname "$0")/requirements.txt"

# ---- Create directories ----
echo "[4/5] Creating directories..."
mkdir -p "$HOME/charlotte/voice"

# ---- .env template ----
ENV_FILE="$HOME/charlotte/voice/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "[5/5] Creating .env template..."
    cat > "$ENV_FILE" << 'ENVEOF'
# Charlotte Voice Agent — API Keys
# Fill these in and run: chmod 600 ~/.charlotte/voice/.env

# Twilio (for phone calls)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Deepgram (speech-to-text)
DEEPGRAM_API_KEY=

# ElevenLabs (text-to-speech)
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Anthropic (Claude)
ANTHROPIC_API_KEY=

# Cloudflare Tunnel domain
TUNNEL_DOMAIN=charlotte.example.com

# App auth token (generate one: python3 -c "import secrets; print(secrets.token_urlsafe(32))")
APP_AUTH_TOKEN=

# MQTT (usually localhost on the same Pi)
MQTT_HOST=localhost
MQTT_PORT=1883
ENVEOF
    chmod 600 "$ENV_FILE"
    echo "  Created $ENV_FILE — fill in your API keys!"
else
    echo "[5/5] .env already exists, skipping."
fi

echo ""
echo "=== Setup complete ==="
echo "Next steps:"
echo "  1. Edit $ENV_FILE with your API keys"
echo "  2. Run: ./setup/cloudflared.sh   (to set up the tunnel)"
echo "  3. Test: source ~/charlotte-env/bin/activate && python server.py --demo"
echo "  4. Install systemd service: sudo cp setup/charlotte-voice.service /etc/systemd/system/"
