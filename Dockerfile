# ============================================
# Multi-stage Dockerfile for Plants Project
# ============================================
# Собирает весь monorepo: backend + webapp + shared
# Stage 1: Builder - компилируем TypeScript и Vite
# Stage 2: Runner - запускаем backend, webapp/dist доступен для nginx
# ============================================

# ============================================
# STAGE 1: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Включаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем ВСЁ (кроме того что в .dockerignore)
# Это включает: backend/, webapp/, shared/, все package.json и конфиги
COPY . .

# Устанавливаем ВСЕ зависимости (dev + prod)
# Нужны для компиляции TypeScript
RUN pnpm install --frozen-lockfile

# Генерируем Prisma Client (типы для backend)
RUN cd backend && pnpm prisma generate

# Собираем backend (TypeScript → JavaScript в backend/dist/)
RUN cd backend && pnpm build

# Собираем webapp (React + Vite → HTML/CSS/JS в webapp/dist/)
RUN cd webapp && pnpm build

# ============================================
# STAGE 2: Production Runner
# ============================================
FROM node:20-alpine

WORKDIR /app

# Включаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем workspace конфиги (нужны для pnpm workspace)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Копируем shared пакет (исходники - source-only)
COPY --from=builder /app/shared/package.json ./shared/package.json
COPY --from=builder /app/shared/tsconfig.json ./shared/tsconfig.json
COPY --from=builder /app/shared/src ./shared/src

# Копируем backend конфиги и Prisma схему
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/tsconfig.json ./backend/tsconfig.json
COPY --from=builder /app/backend/src/prisma ./backend/src/prisma

# Создаём symlink для Prisma (ожидает prisma/ в корне backend/)
RUN cd backend && ln -s src/prisma prisma

# Устанавливаем ТОЛЬКО production зависимости
# --ignore-scripts - пропускаем husky и другие dev-скрипты
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Копируем собранный backend (скомпилированный JavaScript)
# Из-за rootDir: ".." в tsconfig, файлы лежат в dist/backend/src/
COPY --from=builder /app/backend/dist/backend/src ./backend/dist

# Копируем собранный webapp (готовая статика HTML/CSS/JS)
# Эта папка будет доступна nginx через named volume (webapp_dist)
COPY --from=builder /app/webapp/dist ./webapp/dist

# Named volume webapp_dist будет монтироваться сюда из docker-compose.yml
# При запуске контейнера файлы из образа копируются в volume автоматически

# Генерируем Prisma Client для production
RUN cd backend && pnpm prisma generate

# Создаём папку для загруженных изображений
RUN mkdir -p /app/backend/public/images

# Переходим в директорию backend для запуска
WORKDIR /app/backend

# Открываем порт backend API
EXPOSE 3000

# Health check - проверяет что backend отвечает
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/ping', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Запускаем backend
CMD ["node", "dist/index.js"]
