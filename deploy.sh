#!/bin/bash
# Star Fitness, one-command deploy to the Hostinger KVM VPS.
#
#   ./deploy.sh
#
# First time only, install your SSH key on the server so this runs without
# prompting for a password every time:
#
#   ssh-copy-id root@2.24.110.179
#
# ── CONFIG ──────────────────────────────────────────────────────────
VPS_IP="2.24.110.179"
VPS_USER="root"
REMOTE_DIR="/var/www/starfitness"
# ────────────────────────────────────────────────────────────────────

set -euo pipefail

cd "$(dirname "$0")"

echo "==> Building production bundle"
npm run build

# Guard against shipping a build that is missing the large media files. These
# live in public/ and have gone missing from the repo before, which would have
# taken the hero video down on the live site.
for required in dist/videos/star-mat-fv1.mp4 dist/images/og-share.jpg dist/site.webmanifest; do
  if [ ! -s "$required" ]; then
    echo "ABORT: $required is missing or empty. Not deploying a broken build." >&2
    exit 1
  fi
done
echo "==> Build verified ($(du -sh dist | cut -f1))"

echo "==> Uploading to $VPS_USER@$VPS_IP:$REMOTE_DIR"
ssh "$VPS_USER@$VPS_IP" "mkdir -p '$REMOTE_DIR'"
rsync -avz --delete --human-readable \
  --exclude '.DS_Store' \
  dist/ "$VPS_USER@$VPS_IP:$REMOTE_DIR/"

echo "==> Verifying live site"
sleep 2
for path in / site.webmanifest images/thumbs/star-mat-fv1.jpg videos/star-mat-fv1.mp4; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://starmat.app/$path")
  printf '    %-38s %s\n' "/$path" "$code"
done

echo "==> Deploy complete."
