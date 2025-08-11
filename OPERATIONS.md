# OPERATIONS

## Health & Readiness
- `/api/healthz` performs shallow liveness.
- `/api/readyz` checks DB + Redis connectivity and queue readiness.
- `/api/metrics` exposes Prometheus metrics.

## Backups
- PostgreSQL: use `pg_dump -Fc` regularly; see `scripts/backup.sh` (example).
- Redis: persistence via RDB/AOF as configured in docker-compose.
- Reports stored under `/data/reports/YYYY-MM-DD/*.txt|csv|pdf`; mount and back up the `/data` volume.

## Restores
- Stop writers, restore DB from the latest dump, run migrations, and re-seed PayScale if required.

## Logs & Tracing
- pino JSON logs with correlation IDs. Include requestId header `x-request-id` if present.
- Prometheus metrics counters for API requests and queue jobs; basic histogram timings.
