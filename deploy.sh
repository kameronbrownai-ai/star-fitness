#!/bin/bash
# Star Fitness — one-command deploy to Hostinger KVM VPS
# Usage: ./deploy.sh
# First run: make executable with: chmod +x deploy.sh

# ── CONFIG — fill these in ──────────────────────────────────────────
VPS_IP="YOUR_VPS_IP"          # e.g. 185.123.45.67
VPS_USER="root"               # or your sudo user
REMOTE_DIR="/var/www/starfitness"
# ───────────────────────────────────────────────────────────────────

set -e

echo "🔨 Building production bundle..."
npm run build

echo "📦 Uploading to VPS..."
ssh "$VPS_USER@$VPS_IP" "mkdir -p $REMOTE_DIR"
rsync -avz --delete dist/ "$VPS_USER@$VPS_IP:$REMOTE_DIR/"

echo "✅ Deploy complete! Site is live."
