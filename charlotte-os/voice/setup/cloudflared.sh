#!/usr/bin/env bash
# Charlotte Voice Agent — Cloudflare Tunnel Setup
# =================================================
# Creates a named Cloudflare Tunnel to expose the voice agent.
# Requires: cloudflare account, domain added to Cloudflare DNS.
#
# Usage:
#   chmod +x cloudflared.sh && ./cloudflared.sh

set -euo pipefail

TUNNEL_NAME="charlotte-voice"
# Change this to your actual domain:
TUNNEL_HOSTNAME="${TUNNEL_DOMAIN:-charlotte.example.com}"

echo "=== Cloudflare Tunnel Setup ==="

# ---- Install cloudflared ----
if ! command -v cloudflared &> /dev/null; then
    echo "[1/4] Installing cloudflared (ARM64)..."
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb -o /tmp/cloudflared.deb
    sudo dpkg -i /tmp/cloudflared.deb
    rm /tmp/cloudflared.deb
else
    echo "[1/4] cloudflared already installed: $(cloudflared --version)"
fi

# ---- Login ----
echo "[2/4] Authenticating with Cloudflare..."
echo "  A browser window will open. Log in and authorize the domain."
cloudflared tunnel login

# ---- Create tunnel ----
echo "[3/4] Creating tunnel '$TUNNEL_NAME'..."
if cloudflared tunnel list | grep -q "$TUNNEL_NAME"; then
    echo "  Tunnel '$TUNNEL_NAME' already exists."
else
    cloudflared tunnel create "$TUNNEL_NAME"
fi

# Get tunnel UUID
TUNNEL_UUID=$(cloudflared tunnel list --output json | python3 -c "
import json, sys
tunnels = json.load(sys.stdin)
for t in tunnels:
    if t['name'] == '$TUNNEL_NAME':
        print(t['id'])
        break
")

echo "  Tunnel UUID: $TUNNEL_UUID"

# ---- DNS route ----
echo "[4/4] Creating DNS route: $TUNNEL_HOSTNAME -> tunnel..."
cloudflared tunnel route dns "$TUNNEL_NAME" "$TUNNEL_HOSTNAME" || echo "  DNS route may already exist."

# ---- Write config ----
CONFIG_DIR="$HOME/.cloudflared"
mkdir -p "$CONFIG_DIR"
CONFIG_FILE="$CONFIG_DIR/config.yml"

cat > "$CONFIG_FILE" << CFEOF
tunnel: $TUNNEL_UUID
credentials-file: $CONFIG_DIR/$TUNNEL_UUID.json

ingress:
  - hostname: $TUNNEL_HOSTNAME
    service: http://localhost:8080
  - service: http_status:404
CFEOF

echo "  Config written to $CONFIG_FILE"

# ---- Install as systemd service ----
echo ""
echo "Installing cloudflared as systemd service..."
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

echo ""
echo "=== Tunnel setup complete ==="
echo "Your voice agent will be reachable at: https://$TUNNEL_HOSTNAME"
echo "Test: curl https://$TUNNEL_HOSTNAME/health"
