#!/usr/bin/env bash
set -euo pipefail
echo "==> Stopping API/WEB is manual (Ctrl+C the dev-up terminal)."
echo "==> Stopping docker services…"
docker compose down
