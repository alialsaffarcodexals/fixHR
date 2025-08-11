SHELL := /bin/bash

.PHONY: dev test payroll docker-up docker-down

dev:
	pnpm install
	pnpm -C apps/api prisma migrate dev
	pnpm -C apps/api prisma db seed
	pnpm dev

test:
	pnpm test

payroll:
	pnpm -C apps/api api payroll:run

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down -v
