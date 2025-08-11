# -------- deps: install ALL deps with PNPM store inside /app --------
FROM node:20-bookworm-slim AS deps
WORKDIR /app
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm config set store-dir /app/.pnpm-store
RUN pnpm install --no-frozen-lockfile

# -------- build: compile NestJS (keeps dev deps) --------
FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
COPY . .
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm config set store-dir /app/.pnpm-store
RUN pnpm install --no-frozen-lockfile
RUN pnpm exec prisma generate
RUN pnpm build

# -------- prod-deps: prune to prod-only deps for runtime --------
FROM node:20-bookworm-slim AS proddeps
WORKDIR /app
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm config set store-dir /app/.pnpm-store
RUN pnpm install --prod --no-frozen-lockfile

# -------- runtime --------
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=proddeps /app/.pnpm-store ./.pnpm-store
COPY --from=build /app/dist         ./dist
COPY --from=build /app/prisma       ./prisma
COPY package.json ./package.json
RUN npx prisma generate
EXPOSE 4000
CMD ["node","dist/main.js"]
