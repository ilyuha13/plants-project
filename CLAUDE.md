# CLAUDE.md

Этот файл содержит руководство для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Обзор проекта

Это full-stack приложение для каталога и продажи растений, создаваемое как учебный проект с планами выхода в production. Владелец занимается продажей растений и нуждается в реальном рабочем приложении для онлайн-продаж.

**Технологический стек:**
- **Monorepo**: pnpm workspaces с двумя пакетами: `backend` и `webapp`
- **Backend**: Express.js + tRPC + Prisma + PostgreSQL + Passport JWT
- **Frontend**: React 19 + TypeScript + Vite + Material UI + React Router 7 + TanStack Query
- **Управление состоянием**: MobX + React Context
- **Формы**: Formik + валидация через Zod
- **Работа с изображениями**: Sharp (backend), react-image-crop (frontend)

## Команды для разработки

### Корневой уровень (Monorepo)
```bash
# Запустить backend и frontend в режиме разработки (параллельно)
pnpm dev

# Сокращение для запуска команд backend
pnpm b <command>

# Сокращение для запуска команд webapp
pnpm w <command>

# Проверка типов для обоих пакетов
pnpm types

# Линтинг обоих пакетов
pnpm lint

# Форматирование кода в обоих пакетах
pnpm prettify
```

### Backend (директория `backend/`)
```bash
# Сервер разработки с горячей перезагрузкой
pnpm dev

# Сборка для production
pnpm build

# Запуск production сервера
pnpm start

# Запуск миграций Prisma в режиме разработки
pnpm pmd

# Генерация Prisma client (запускается автоматически при prepare)
pnpm pgc

# Проверка типов без генерации файлов
pnpm types

# Линтинг TypeScript файлов
pnpm lint

# Форматирование кода
pnpm prettify
```

**Важно:** Prisma schema находится по адресу `backend/src/prisma/schema.prisma` (нестандартное расположение, указанное в package.json).

### Frontend (директория `webapp/`)
```bash
# Сервер разработки с HMR
pnpm dev

# Production сборка (включает проверку типов)
pnpm build

# Предпросмотр production сборки
pnpm preview

# Проверка типов всех TypeScript файлов
pnpm types

# Линтинг TypeScript/TSX файлов
pnpm lint

# Линтинг SCSS файлов
pnpm stylelint

# Проверка синтаксиса SCSS
pnpm stylecheck

# Форматирование кода
pnpm prettify
```

## Архитектура

### Схема базы данных (Prisma)

Трехуровневая иерархия для организации растений:
1. **Species** (род) - например, Monstera, Philodendron, Aglaonema
2. **Variety** (сорт) - имеет `lifeForm` (лиана, дерево, кустарник) и `variegation` (вариегатность)
3. **Plant** (экземпляр) - конкретное растение для продажи с ценой

**Связи:**
- Species → имеет много Varieties
- Variety → принадлежит Species, имеет много Plants
- Plant → принадлежит Variety

**Система пользователей:**
- Пользователи имеют роли: `ADMIN` или `USER`
- Аутентификация через JWT токены, хранящиеся в cookies

### Архитектура Backend

**Точка входа:** `backend/src/index.ts`
- Express приложение с включенным CORS
- Статические файлы раздаются из `backend/public/` (загруженные изображения)
- Middleware аутентификации Passport JWT
- tRPC router смонтирован по адресу `/trpc`

**tRPC Routes:** (`backend/src/router/`)
- `signIn` / `signUp` - Аутентификация
- `getMe` - Получить текущего пользователя
- `addSpecies` / `getSpecies` / `getSpeciesById` - Управление родами
- `addVarieties` - Добавить сорта к роду
- `addPlant` / `getPlant` / `getPlants` / `updatePlant` - Управление экземплярами растений

**Паттерн структуры routes:**
```
backend/src/router/
  <routeName>/
    index.ts   - определение tRPC route
    input.ts   - Zod схемы валидации входных данных
```

**Context:** `backend/src/lib/ctx.ts` создает AppContext с экземпляром Prisma client.

**Обработка изображений:**
- Изображения загружаются как base64 строки
- Конвертируются и сохраняются в `backend/public/images/` с помощью Sharp
- Возвращаются URL вида `/images/<filename>`

### Архитектура Frontend

**Точка входа:** `webapp/src/main.tsx` → оборачивает `App` в `Providers`

**Стек провайдеров:** (`webapp/src/Providers.tsx`)
1. TrpcProvider (tRPC + TanStack Query)
2. AppContextProvider (состояние уровня приложения)
3. ThemeProvider (тема Material UI)
4. BrowserRouter (React Router)

**Роутинг:** `webapp/src/App.tsx`
- Layout обертка с Header/Footer для большинства роутов
- Основные роуты: PlantsList (главная), SignIn, SignUp, SignOut, AddSpeciesPage
- Многие роуты закомментированы (в разработке)

**Интеграция tRPC:** (`webapp/src/lib/trpc.tsx`)
- React хуки созданы через `createTRPCReact<TrpcRouter>()`
- Типы импортируются напрямую из backend: `@plants-project/backend/src/router`
- JWT токен автоматически включается из cookies в заголовки запросов
- SuperJSON трансформер для сериализации Date/Map/Set

**Управление состоянием:**
- Состояние уровня приложения в `webapp/src/lib/ctx.tsx` (Context API)
- Серверное состояние через TanStack Query (через tRPC)

**Паттерн форм:**
- Formik для управления состоянием форм
- Zod схемы для валидации (с использованием `formik-validator-zod`)
- Общая обертка форм: `webapp/src/lib/form.tsx`

**Компоненты загрузки изображений:**
- `ImageInput` - Простая загрузка файла
- `ImageInput2` - Альтернативная реализация
- `ImagesInput` - Загрузка нескольких изображений
- `ImagesInputWithCrop` - Загрузка с функционалом обрезки
- `ImageEditor` - Интерфейс обрезки/редактирования с использованием react-image-crop

**Организация компонентов:**
- Компоненты Material UI используются повсеместно
- Кастомные компоненты в `webapp/src/components/`
- Страницы в `webapp/src/pages/`
- Layout обертка в `webapp/src/layout/Layout.tsx`

### Переменные окружения

**Backend** (`.env` в `backend/`):
- `PORT` - Порт сервера
- `DATABASE_URL` - Строка подключения к PostgreSQL
- `JWT_SECRET` - Секретный ключ для подписи JWT токенов
- `PASSWORD_SALT` - Соль для хеширования паролей

**Frontend** (`.env` в `webapp/`):
- `VITE_BACKEND_TRPC_URL` - Конечная точка tRPC (например, `http://localhost:3000/trpc`)
- `VITE_BACKEND_URL` - Базовый URL бэкенда для URL изображений

Переменные окружения валидируются во время выполнения с использованием Zod схем в `src/lib/env.ts` (оба пакета).

## Рабочий процесс разработки

1. **Запуск разработки:**
   ```bash
   # Из корневой директории - запускает backend и frontend
   pnpm dev
   ```

2. **Изменения в базе данных:**
   ```bash
   # Отредактируйте backend/src/prisma/schema.prisma
   # Затем запустите миграцию
   cd backend
   pnpm pmd
   # Дайте миграции подходящее имя
   ```

3. **Добавление tRPC Routes:**
   - Создайте папку в `backend/src/router/<routeName>/`
   - Добавьте `index.ts` (определение route) и `input.ts` (Zod схемы)
   - Экспортируйте из `backend/src/router/index.ts` (см. комментарии @index для паттерна)
   - Типы автоматически доступны во frontend через `trpc.routeName.useQuery()` или `trpc.routeName.useMutation()`

4. **Паттерн загрузки изображений:**
   - Frontend конвертирует изображения в base64
   - Backend получает base64, сохраняет с помощью Sharp в `backend/public/images/`
   - Возвращает относительный URL путь `/images/<filename>`
   - Frontend отображает, добавляя префикс `VITE_BACKEND_URL`

## Важные замечания

- **Учебный проект:** Владелец изучает веб-разработку с планами устроиться разработчиком. Качество кода и лучшие практики важны для целей портфолио.

- **Реальная бизнес-потребность:** Это будет использоваться для реального бизнеса по продаже растений, поэтому должно достичь production качества.

- **Типобезопасность:** Проект использует полный TypeScript type inference от backend к frontend через tRPC. Поддерживайте эту типобезопасность.

- **Структура Monorepo:** Backend и frontend используют общее workspace. Типы backend импортируются напрямую во frontend package.json как `"@plants-project/backend": "workspace:*"`.

- **Нестандартные расположения:**
  - Prisma schema: `backend/src/prisma/schema.prisma` (не в корне)
  - Миграции: `backend/src/prisma/migrations/`

- **Git Hooks:** Husky настроен с lint-staged для проверок перед коммитом.

- **Стиль кода:** Настроены Prettier и ESLint. Запускайте `pnpm prettify` перед коммитом.

- **Русский язык:** Текст UI и содержимое базы данных на русском языке (родной язык владельца и целевой рынок).

## Стиль работы Claude

**ВАЖНО:** При работе с проектом Claude должен:

1. **Объяснять все команды и изменения:**
   - Перед выполнением bash команд объяснять что команда делает
   - После изменения файлов кратко описывать что было изменено и почему
   - Показывать ключевые фрагменты кода при больших изменениях

2. **Быть явным и понятным:**
   - Не делать молчаливых изменений
   - Предупреждать о потенциальных побочных эффектах
   - Объяснять архитектурные решения

3. **Формат объяснений:**
   ```
   # Что делаю: [краткое описание]
   # Почему: [причина/обоснование]
   # Команда: <bash команда>
   # Результат: [что получилось]
   ```

**Пример:**
```
# Что делаю: Переименовываю файл index.tsx в AddPlantPage.tsx
# Почему: Для единообразия именования (все компоненты используют ComponentName.tsx)
# Команда: mv webapp/src/pages/AddPlantPage/index.tsx webapp/src/pages/AddPlantPage/AddPlantPage.tsx
# Результат: Файл переименован, теперь в табах редактора будет видно "AddPlantPage.tsx" вместо "index.tsx"
```
