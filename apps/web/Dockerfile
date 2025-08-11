# ---- build stage: install deps, generate client, build ----
FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# keep pnpm store INSIDE the image to avoid broken symlinks when copying layers
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm config set store-dir /app/.pnpm-store

COPY package.json pnpm-lock.yaml* ./
COPY . .

RUN pnpm install --no-frozen-lockfile # install project deps
RUN pnpm add -g prisma # install prisma CLI globally

RUN pnpm exec prisma generate --schema prisma/schema.prisma
RUN pnpm build

# ---- runtime stage: copy node_modules + prisma + dist and (re)generate client ----
FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

# copy deps and pnpm store from build to keep symlinks valid
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.pnpm-store ./.pnpm-store

# copy compiled app and prisma schema
COPY --from=build /app/dist         ./dist
COPY --from=build /app/prisma       ./prisma
COPY --from=build /app/package.json ./package.json

# final safety net: generate Prisma client AGAIN in the final filesystem
# (ensures @prisma/client is initialized exactly where the app will run)
RUN node node_modules/.bin/prisma generate --schema prisma/schema.prisma

EXPOSE 4000
CMD ["node","dist/main.js"]
