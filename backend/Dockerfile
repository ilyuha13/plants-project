# ============================================
# Multi-stage Dockerfile for Backend
# ============================================
# Stage 1: Builder - Compile TypeScript
# Stage 2: Runner - Run production build
# ============================================

# ============================================
# STAGE 1: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy TypeScript configs (needed by tsconfig in packages)
COPY tsconfig.base.json tsconfig.json ./

# Copy all packages
COPY shared ./shared
COPY backend ./backend

# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (for build stage)
RUN cd backend && pnpm prisma generate

# Build backend
RUN cd backend && pnpm build

# ============================================
# STAGE 2: Production Runner
# ============================================
FROM node:20-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy TypeScript configs (needed for workspace resolution)
COPY tsconfig.base.json tsconfig.json ./

# Copy shared (only built files)
COPY --from=builder /app/shared/package.json ./shared/package.json
COPY --from=builder /app/shared/tsconfig.json ./shared/tsconfig.json
COPY --from=builder /app/shared/dist ./shared/dist

# Copy backend package.json and prisma schema with migrations
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/tsconfig.json ./backend/tsconfig.json
COPY --from=builder /app/backend/src/prisma ./backend/src/prisma

# Create symlink for Prisma migrations (Prisma expects prisma/migrations/)
RUN cd backend && ln -s src/prisma prisma

# Install ONLY production dependencies
# --ignore-scripts: Skip prepare/postinstall (husky, build scripts)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copy built backend code
COPY --from=builder /app/backend/dist ./backend/dist

# Generate Prisma Client (prisma is now in dependencies)
RUN cd backend && pnpm prisma generate

# Create directory for uploaded images
RUN mkdir -p /app/backend/public/images

WORKDIR /app/backend

# Expose backend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/ping', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/index.js"]
