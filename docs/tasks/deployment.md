# Деплой в Production

## Backend на Railway (2 часа)

**Зависимости:** Нужна prod база данных

### Checklist:
- [ ] 🤖 Research: Railway setup, best practices
- [ ] Создать аккаунт на Railway.app
- [ ] Подключить GitHub (branch: main)
- [ ] Настроить environment variables:
  - DATABASE_URL
  - JWT_SECRET
  - NODE_ENV=production
  - CORS_ORIGIN
- [ ] Build: `cd backend && pnpm build`
- [ ] Start: `cd backend && pnpm start`
- [ ] Запустить deploy
- [ ] Протестировать API endpoints

**Ресурсы:** https://docs.railway.app

---

## Frontend на Vercel (1.5 часа)

**Зависимости:** Нужен backend URL

### Checklist:
- [ ] Создать аккаунт Vercel.com
- [ ] Подключить GitHub
- [ ] Build settings:
  - Root: `webapp`
  - Build: `pnpm build`
  - Output: `dist`
- [ ] Environment variables:
  - VITE_BACKEND_URL
  - VITE_TELEGRAM_BOT_USERNAME
- [ ] Запустить deploy
- [ ] Тестировать: авторизация, растения, изображения

**Ресурсы:** https://vercel.com/docs

---

## Production PostgreSQL (2 часа)

### Checklist:
- [ ] Выбрать хостинг:
  - **Supabase**: бесплатный tier, UI
  - **Neon**: serverless, автоscaling
  - **Railway Postgres**: всё в одном
- [ ] Создать prod БД
- [ ] Получить DATABASE_URL
- [ ] 🤖 Сгенерировать migration план
- [ ] Запустить миграции:
  ```bash
  DATABASE_URL="postgres://..." pnpm prisma migrate deploy
  ```
- [ ] Проверить таблицы
- [ ] Настроить backups
- [ ] Сохранить credentials
