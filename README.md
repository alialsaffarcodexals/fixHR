# Enterprise Payroll Suite

An enterprise-grade HR & Payroll management system built as a monorepo with Next.js (web) and NestJS (api), PostgreSQL, Prisma, Redis, BullMQ, and Docker.

## Quick Start

### With Docker
```bash
# 1) Copy .env.example to .env and adjust if needed
cp .env.example .env

# 2) Build and start all services
docker compose up -d --build

# 3) Run initial DB migrations and seed pay scales
docker compose exec api pnpm prisma migrate deploy
docker compose exec api pnpm prisma db seed

# 4) (Optional first-run import) Import departments + employees from seed/startup.txt (only if DB empty)
docker compose exec api pnpm api import:start

# 5) Open the web app
open http://localhost:3000
```

### Local development (without Docker)

**Prereqs:** Node 20+, pnpm 9+, PostgreSQL 15+, Redis 7+

```bash
# 1) Copy env and edit
cp .env.example .env

# 2) Install deps
pnpm install

# 3) Start Postgres + Redis locally and set DATABASE_URL & REDIS_URL

# 4) Migrate and seed
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed

# 5) (Optional first-run import) departments + employees
pnpm --filter api api import:start

# 6) Start dev
pnpm dev   # starts both web (3000) and api (4000)
```

### Makefile shortcuts
```bash
make dev            # run both apps locally
make test           # run unit+integration+e2e tests
make payroll        # run payroll now (CLI)
make docker-up      # docker compose up -d --build
make docker-down    # docker compose down -v
```

### Useful Commands
```bash
# Generate payroll report right now (creates /data/reports/YYYY-MM-DD/payroll.txt)
docker compose exec api pnpm api payroll:run

# Run tests
pnpm test

# View coverage (HTML report under coverage/)
pnpm coverage

# Build Docker images
docker compose build

# Start prod
docker compose up -d
```

## URLs
- Web: http://localhost:3000
- API: http://localhost:4000 (health: `/api/healthz`, readiness: `/api/readyz`, metrics: `/api/metrics`)

## Contents
- apps/web — Next.js 14 + Tailwind + shadcn-style components
- apps/api — NestJS 10 + Prisma + BullMQ + Redis + PostgreSQL
- seed/startup.txt — Example first-run data import
- docs — Architecture, Security, Operations docs (also Mermaid diagrams)
- openapi.yaml — REST API surface
- docker-compose.yml — full stack (web, api, postgres, redis, worker, reverse proxy)
- .github/workflows/ci.yml — CI with lint/build/test and docker build
- Makefile — convenience commands
- prisma schema — at `apps/api/prisma/schema.prisma`

## Coverage
![coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
