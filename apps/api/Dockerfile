# Build context: repo root
# docker build -f apps/api/Dockerfile -t tavern-api .

# --- Stage 1: build ---
FROM node:22-alpine AS builder
WORKDIR /app
# openssl required so prisma generate detects the correct binary target (openssl-3.0.x)
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
# Copy prisma schema before npm ci so postinstall (prisma generate) can run
COPY apps/api/prisma ./apps/api/prisma
# Install all deps
RUN npm ci --workspace=apps/api
# Generate Prisma client explicitly (postinstall doesn't run for workspaces)
RUN npm run db:generate --workspace=apps/api
# Copy source and compile TypeScript -> apps/api/dist/
COPY apps/api/tsconfig.json apps/api/tsconfig.build.json ./apps/api/
COPY apps/api/src ./apps/api/src
RUN npm run build --workspace=apps/api

# --- Stage 2: production runtime ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# openssl required so Prisma can detect the version and load the correct engine binary
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
# --ignore-scripts: prisma CLI is a devDep; pre-generated client is copied below
RUN npm ci --workspace=apps/api --omit=dev --ignore-scripts
# Compiled app
COPY --from=builder /app/apps/api/dist ./apps/api/dist
# Prisma schema (referenced by the client at runtime)
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
# Pre-generated Prisma client (linux-musl binary from builder)
# @prisma/client lives in apps/api/node_modules, so .prisma must be co-located there
COPY --from=builder /app/apps/api/node_modules/.prisma ./apps/api/node_modules/.prisma

EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
