#!/usr/bin/env bash
set -euo pipefail

# ---- config (override via env if you like) ----
API_PORT="${API_PORT:-4000}"
WEB_PORT="${WEB_PORT:-3001}"
DB_URL_DEFAULT="postgresql://postgres:postgres@localhost:5432/payroll?schema=public"
REDIS_URL_DEFAULT="redis://localhost:6379"
JWT_SECRET="${JWT_SECRET:-devjwt}"

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT_DIR"

echo "==> Starting DB & Redis with docker compose (detached)…"
docker compose up -d db redis

echo "==> Waiting for DB to be healthy…"
# wait until Postgres accepts connections
until docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; do
  printf "."
  sleep 1
done
echo ""

# -------- API: install, migrate, seed, run ----------
echo "==> API: install deps, generate prisma, migrate, seed"
pushd apps/api >/dev/null
  export DATABASE_URL="${DATABASE_URL:-$DB_URL_DEFAULT}"
  export REDIS_URL="${REDIS_URL:-$REDIS_URL_DEFAULT}"
  export API_PORT
  export JWT_SECRET

  pnpm install
  pnpm exec prisma generate
  pnpm exec prisma migrate dev --name dev --skip-seed
  pnpm exec ts-node prisma/seed.ts

  # dev token for the web app
  DEV_JWT="$(node -e "console.log(require('jsonwebtoken').sign({sub:'dev',role:'Admin',email:'admin@example.com'}, process.env.JWT_SECRET||'devjwt', {expiresIn:'8h'}))")"
popd >/dev/null

# -------- Web: write .env.local and run ----------
echo "==> Web: writing apps/web/.env.local"
cat > apps/web/.env.local <<EOF
NEXTAUTH_URL=http://localhost:${WEB_PORT}
NEXTAUTH_SECRET=changeme
API_BASE_URL=http://localhost:${API_PORT}
DEV_JWT=${DEV_JWT}
EOF

echo "==> Web: installing deps"
pushd apps/web >/dev/null
  pnpm install
popd >/dev/null

echo ""
echo "--------------------------------------------------------------"
echo "API   : http://localhost:${API_PORT}/api/healthz"
echo "WEB   : http://localhost:${WEB_PORT}"
echo "Token : (also written to apps/web/.env.local as DEV_JWT)"
echo "${DEV_JWT}"
echo "--------------------------------------------------------------"
echo ""

# Run both dev servers (web forced to ${WEB_PORT} to avoid 3000 conflicts)
# Tip: keep this terminal open; Ctrl+C will stop both
( cd apps/api && pnpm dev ) & API_PID=$!
( cd apps/web && pnpm exec next dev -p "${WEB_PORT}" ) & WEB_PID=$!

# Wait for either to exit
wait -n $API_PID $WEB_PID
