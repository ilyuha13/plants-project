# Plants Project TODO

> **📖 Инструкция по использованию:** См. раздел [Как пользоваться этим файлом](#-как-пользоваться-этим-файлом)

## 📑 Навигация

**Задачи по времени:**
- [⚡ Quick Wins (< 15 мин)](#-quick-wins--15-мин)
- [🏃 Short Tasks (15-60 мин)](#-short-tasks-15-60-мин)
- [🚀 Medium Tasks (1-3 часа)](#-medium-tasks-1-3-часа)
- [🏔️ Large Tasks (3+ часа)](#-large-tasks-3-часа)

**Для работы с Claude:**
- [🤖 Задачи для Claude](#-задачи-для-claude)

**Детали и документация:**
- [📖 Детали задач](#-детали-задач)
- [📊 Прогресс по задачам](#-прогресс-по-задачам)
- [📚 Ссылки на документацию](#-ссылки-на-документацию)
- [📖 Как пользоваться этим файлом](#-как-пользоваться-этим-файлом)

---

## 🎯 Текущая цель
**Запустить MVP каталога растений в production**

**Deadline:** -
**Статус:** Pre-deployment phase - критичные задачи
**Прогресс:** 62% (8/13 критичных задач выполнено)

---

## 🔥 Приоритеты (по порядку)
1. 🔴 КРИТИЧНЫЕ задачи для MVP (корзина, типографика, sticky header, telegram, validation)
2. 🟡 ВАЖНЫЕ задачи (сообщения об ошибках, price validation)
3. 🟢 Деплой в production (backend + frontend + DB)
4. 🔵 UX улучшения (после запуска)
5. ⚪ Code quality рефакторинг (отложено на потом)

---

## ⚡ Quick Wins (< 15 мин)
*Когда есть 5-15 минут свободного времени*

- [ ] Переместить telegramUsername в .env [5 мин]
  - Файл: `PlantDetailPage.tsx:53`
  - Сейчас: hardcoded 'your_bot_username'
  - Добавить: `VITE_TELEGRAM_BOT_USERNAME` в .env

- [ ] Исправить typo "lable" → "label" во всех TextInput [5 мин]
  - Файлы: AddPlantPage, SignInPage, SignUpPage
  - Найти: `lable=`
  - Заменить: `label=`

- [ ] Удалить неиспользуемые зависимости (часть 1) [10 мин]
  ```bash
  cd webapp
  pnpm remove @dnd-kit/core @dnd-kit/utilities @toolpad/core classnames
  ```

---

## 🏃 Short Tasks (15-60 мин)
*Когда есть полчаса - час*

- [ ] Добавить input maxLength для SignIn/SignUp [30 мин]
  - Файлы: `SignInPage.tsx:35`, `SignUpPage.tsx:49`
  - Добавить maxLength для nick (20), password (50)
  - Обновить zod схемы если нужно

- [x] Сделать Header sticky с opacity [20 мин] → ПЕРЕМЕЩЕНО В КРИТИЧНЫЕ
  - Файл: `Header.tsx:13` (TODO в коде)
  - `position: sticky`, `top: 0`, `backdropFilter: blur`
  - Добавить тень при скролле

- [ ] 🤖 Research: Telegram Bot API best practices [45 мин] → [детали](#telegram-bot)
  - Изучить официальную документацию
  - Понять webhook vs polling
  - Подготовить checklist для создания бота

- [ ] Удалить неиспользуемые зависимости (часть 2) [40 мин]
  ```bash
  cd webapp
  pnpm remove mobx mobx-react-lite date-fns include-media
  ```
  - Запустить `pnpm dev` - проверить что всё работает
  - Закоммитить: "chore: remove unused dependencies"

- [ ] Cleanup SCSS remnants [45 мин]
  - См. TODO.md старый раздел "Аудит зависимостей → SCSS"
  - Удалить sass/stylelint из package.json
  - Обновить lint-staged config
  - Обновить Husky hooks (v10 format)

---

## 🚀 Medium Tasks (1-3 часа)
*Задачи на вечер или выходные*

### 🔴 КРИТИЧНЫЕ для MVP

- [ ] Реализовать корзину [4 ч] → [детали](#shopping-cart)
  - БД: Cart + CartItem модели
  - Backend: getCart, addToCart, removeFromCart, clearCart
  - Frontend: CartButton, CartDrawer, CartPage
  - Интеграция с Telegram для оформления заказа

- [ ] Настроить типографику [1.5 ч] → [детали](#typography)
  - Выбрать и подключить шрифты (Inter/Montserrat/Roboto)
  - Настроить MUI theme typography
  - Применить ко всем компонентам
  - Согласованная типографская система

- [ ] Sticky Header с эффектами [30 мин] → [детали](#sticky-header)
  - position: sticky + top: 0
  - backdropFilter: blur для размытия
  - Прозрачность фона
  - Тень при скролле

### 🟢 Деплой

- [ ] Deploy backend на Railway [2 ч] 🤖 → [детали](#deploy-backend)

- [ ] Deploy frontend на Vercel [1.5 ч] → [детали](#deploy-frontend)

- [ ] Setup production PostgreSQL [2 ч] 🤖 → [детали](#prod-db)

- [ ] Telegram bot setup [1 ч] 🤖📋 → [детали](#telegram-bot)
  - Сейчас: личный username
  - Потом: бот с пересылкой и кнопками

- [ ] Улучшить дизайн PlantCard [2 ч] → [детали](#plantcard-design)
  - Кликабельное название вместо всей карточки
  - Галерея изображений с индикаторами
  - Lightbox для полноэкранного просмотра
  - Навигация между фото (стрелки + thumbnails)

- [ ] Добавить fullscreen preview в Galery [1.5 ч]
  - Файл: `Galery.tsx:26` (TODO в коде)
  - Dialog с изображением на весь экран
  - Навигация prev/next между фото
  - Закрытие по ESC или клику вне

- [ ] Drag & Drop для изменения порядка фото [2 ч] → [детали](#photo-reorder)
  - Первое фото = главное (обложка карточки)
  - Перетаскивание мышью для изменения порядка
  - Визуальный feedback при перетаскивании
  - Работает в ImagesInput и при редактировании

- [ ] Миграция на FormData (вместо Base64) [2.5 ч]
  - См. старый TODO.md → "Архитектурные решения #1"
  - Backend: создать `/api/upload` REST endpoint
  - Frontend: `useFileUpload` хук
  - Тестирование с большими файлами

---

## 🏔️ Large Tasks (3+ часа)
*Проекты на несколько дней*

- [ ] MUI Theme Refactor - Стадия 2 [2 ч]
  - См. старый TODO.md → "СТАДИЯ 2: Утилитарные компоненты"
  - CenteredBox, PageContainer, PriceCard, ResponsiveImage

- [ ] MUI Theme Refactor - Стадия 3 [3 ч]
  - См. старый TODO.md → "СТАДИЯ 3: Domain-компоненты"
  - PlantImageGallery, PlantInfoCard, ContactButton

- [ ] MUI Theme Refactor - Стадия 4 [1 ч]
  - См. старый TODO.md → "СТАДИЯ 4: Исправить кастомный Button"
  - Решить проблему variant="outlined" vs theme

- [ ] MUI Theme Refactor - Стадия 5 [2 ч]
  - См. старый TODO.md → "СТАДИЯ 5: PageWrapper"
  - Централизованная логика loading/error

---

## 🤖 Задачи для Claude
> **Как использовать:** Скажи "прочитай план и выполни задачи из очереди Claude"

### 📋 Исследования (Research)
- [ ] Telegram Bot API best practices для e-commerce
  - Webhook vs Polling
  - Обработка deep links (start параметры)
  - Best practices для приема заявок
  - → Выдать checklist для создания бота

- [ ] Production deployment checklist
  - Environment variables management
  - Database migration strategy
  - Health checks and monitoring
  - → Выдать пошаговый план деплоя

- [ ] Bundle size optimization
  - Проанализировать текущий bundle
  - Найти самые тяжелые зависимости
  - Рекомендации по code splitting
  - → Выдать список улучшений

### ⚙️ Генерация кода/команд
- [ ] Generate: .env.example template
  - Все нужные переменные для production
  - Комментарии с пояснениями
  - → Создать файл webapp/.env.example

- [ ] Generate: Production DB migration script
  - Безопасная миграция из dev в prod
  - Handling existing data
  - Rollback plan
  - → Выдать SQL скрипт + инструкции

- [ ] Generate: Git hooks для commit message validation
  - Conventional commits format
  - Emoji prefixes (опционально)
  - → Выдать .husky/commit-msg скрипт

### 🔍 Анализ кодовой базы
- [ ] Audit: Найти все TODO комментарии в коде
  - Пройтись по всем файлам
  - Категоризировать по приоритетам
  - → Добавить в этот файл

- [ ] Audit: Неиспользуемые компоненты и файлы
  - Найти файлы, которые нигде не импортируются
  - Проверить ImageEditor (существует, но не используется), старые SCSS
  - → Выдать список на удаление

- [ ] Решить что делать с ImageEditor компонентом [30 мин]
  - Файл: `webapp/src/components/ImageEditor/ImageEditor.tsx`
  - Уже реализован crop с aspect ratio 3/4
  - Использует react-image-crop библиотеку
  - НО нигде не импортируется и не используется
  - Варианты: 1) Интегрировать в ImagesInput 2) Удалить если не нужен
  - → Принять решение и реализовать

- [ ] Audit: Performance bottlenecks
  - Ненужные ре-рендеры
  - Большие images без оптимизации
  - Неоптимальные queries
  - → Выдать список улучшений

---

## 📖 Детали задач

<a name="deploy-backend"></a>
### #deploy-backend: Deploy Backend на Railway

**Приоритет:** 🔴 Высокий
**Время:** 2 часа
**Тип:** 🤖 Claude помогает с research
**Зависимости:** [#prod-db](#prod-db) (сначала нужна база данных)

**Checklist:**
- [ ] 🤖 Claude: исследовать Railway setup, найти best practices
- [ ] Создать аккаунт на Railway.app
- [ ] Подключить GitHub репозиторий (branch: main)
- [ ] Настроить environment variables:
  - [ ] DATABASE_URL (из #prod-db)
  - [ ] JWT_SECRET
  - [ ] NODE_ENV=production
  - [ ] CORS_ORIGIN (frontend URL)
- [ ] Настроить build command: `cd backend && pnpm build`
- [ ] Настроить start command: `cd backend && pnpm start`
- [ ] Запустить первый deploy
- [ ] Проверить health check endpoint
- [ ] Протестировать API endpoints (getPlants, addPlant)

**Ресурсы:**
- Railway docs: https://docs.railway.app
- DATABASE_URL: из задачи [#prod-db](#prod-db)

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

<a name="deploy-frontend"></a>
### #deploy-frontend: Deploy Frontend на Vercel

**Приоритет:** 🔴 Высокий
**Время:** 1.5 часа
**Тип:** Я делаю сам
**Зависимости:** [#deploy-backend](#deploy-backend) (нужен backend URL)

**Checklist:**
- [ ] Создать аккаунт на Vercel.com
- [ ] Подключить GitHub репозиторий
- [ ] Настроить build settings:
  - [ ] Root directory: `webapp`
  - [ ] Build command: `pnpm build`
  - [ ] Output directory: `dist`
- [ ] Настроить environment variables:
  - [ ] VITE_BACKEND_URL (из #deploy-backend)
  - [ ] VITE_TELEGRAM_BOT_USERNAME
- [ ] Запустить первый deploy
- [ ] Проверить, что приложение открывается
- [ ] Протестировать:
  - [ ] Авторизация работает
  - [ ] Загрузка растений работает
  - [ ] Добавление растения работает
  - [ ] Изображения отображаются

**Ресурсы:**
- Vercel docs: https://vercel.com/docs

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

<a name="prod-db"></a>
### #prod-db: Production PostgreSQL Setup

**Приоритет:** 🔴 Высокий
**Время:** 2 часа
**Тип:** 🤖 Claude генерирует migration plan
**Зависимости:** Нет

**Checklist:**
- [ ] Выбрать хостинг (Supabase, Neon, Railway Postgres)
- [ ] Создать production базу данных
- [ ] Получить DATABASE_URL (connection string)
- [ ] 🤖 Claude: сгенерировать migration план (dev → prod)
- [ ] Запустить Prisma migrations:
  ```bash
  DATABASE_URL="postgres://..." pnpm prisma migrate deploy
  ```
- [ ] Проверить, что все таблицы созданы
- [ ] (Опционально) Перенести данные из dev базы
- [ ] Настроить backups (если доступно)
- [ ] Сохранить DATABASE_URL в безопасное место

**Варианты хостинга:**
- Supabase: бесплатный tier, UI для управления
- Neon: serverless PostgreSQL, автоscaling
- Railway Postgres: всё в одном месте с backend

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

<a name="telegram-bot"></a>
### #telegram-bot: Telegram Bot Setup

**Приоритет:** 🔴 КРИТИЧНО
**Время:** MVP: 15 мин → Продвинутый: 2 часа
**Тип:** Поэтапная реализация
**Зависимости:** Нет

## 🎯 Стратегия реализации:

### ЭТАП 1: MVP - Личный username (СЕЙЧАС) ✅

**Время:** 15 минут
**Зачем:** Начать принимать заказы прямо сейчас

**Checklist:**
- [ ] Добавить свой username в `.env`
- [ ] Обновить `env.ts` схему
- [ ] Заменить в `DetailCard.tsx`
- [ ] Протестировать

**Как работает:**
- Клиент нажимает "Связаться" → открывается чат с ТОБОЙ лично
- Клиент пишет тебе в личку напрямую
- Ты отвечаешь со своего обычного аккаунта
- Просто и работает

**Код:**
```bash
# webapp/.env
VITE_TELEGRAM_USERNAME=tvoi_username  # твой личный username без @
```

```tsx
// webapp/src/lib/env.ts
const envSchema = z.object({
  VITE_BACKEND_URL: z.string().url(),
  VITE_TELEGRAM_USERNAME: z.string().min(1),
})

export const env = envSchema.parse({
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  VITE_TELEGRAM_USERNAME: import.meta.env.VITE_TELEGRAM_USERNAME,
})
```

```tsx
// webapp/src/components/DetailCard/DetailCard.tsx:125
// Было:
const telegramUsername = 'your_bot_username'

// Стало:
const telegramUsername = env.VITE_TELEGRAM_USERNAME
```

**Плюсы:**
- ✅ Работает за 15 минут
- ✅ Не нужен код бота
- ✅ Видишь сообщения сразу в Telegram
- ✅ Отвечаешь как обычно

**Минусы:**
- ❌ Смешиваются личные и рабочие сообщения
- ❌ Клиент видит твой личный профиль

---

### ЭТАП 2: Бот через @BotFather (ПОТОМ, когда заказов много)

**Время:** 30 минут
**Зачем:** Разделить личное и рабочее, выглядеть профессиональнее

**Checklist:**
- [ ] Создать бота через @BotFather
  - Открыть Telegram → найти `@BotFather`
  - `/newbot` → следовать инструкциям
  - Получить username (например `plants_store_bot`)
  - Получить token (сохранить!)

- [ ] Настроить бота (опционально):
  - `/setdescription` → "Магазин комнатных растений"
  - `/setabouttext` → "Мы продаем растения с доставкой"
  - `/setuserpic` → загрузить логотип

- [ ] Обновить `.env`:
  ```bash
  VITE_TELEGRAM_USERNAME=plants_store_bot  # без @
  ```

**Как работает:**
- Клиент пишет боту `@plants_store_bot`
- Ты заходишь в Telegram → открываешь чат с ботом
- Видишь все сообщения от клиентов
- Отвечаешь вручную через бота

⚠️ **Проблема:** По умолчанию ты НЕ увидишь сообщения в обычном Telegram!

Нужен **ЭТАП 3** ↓

---

### ЭТАП 3: Бот с пересылкой сообщений (когда 10+ заказов в день)

**Время:** 2 часа
**Зачем:** Видеть все сообщения клиентов у себя в Telegram + отвечать удобно

**Архитектура:**
```
Клиент → Пишет боту → Бот пересылает ТЕБЕ в личку
                       ↓
        Ты нажимаешь кнопку "Ответить" под сообщением
                       ↓
        Ты пишешь текст → Бот отправляет клиенту
```

**Checklist:**

**1. Backend setup (30 мин)**
- [ ] Установить: `pnpm add node-telegram-bot-api`
- [ ] Получить свой Telegram ID через `@userinfobot`
- [ ] Добавить в `.env`:
  ```bash
  TELEGRAM_BOT_TOKEN=123456789:ABCdef...  # от BotFather
  TELEGRAM_ADMIN_ID=123456789  # твой ID
  ```

**2. Создать бота (1 час)**
```typescript
// backend/src/telegram/bot.ts
import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true })
const ADMIN_ID = process.env.TELEGRAM_ADMIN_ID!

// Храним: кому сейчас отвечаем
const replyingTo = new Map<number, number>()

// Клиент пишет боту → пересылаем админу
bot.on('message', async (msg) => {
  const chatId = msg.chat.id

  // Если это админ отвечает
  if (chatId.toString() === ADMIN_ID) {
    const clientId = replyingTo.get(chatId)
    if (clientId) {
      await bot.sendMessage(clientId, msg.text!)
      await bot.sendMessage(ADMIN_ID, '✅ Отправлено!')
      replyingTo.delete(chatId)
      return
    }
    return
  }

  // Пересылаем админу с кнопкой "Ответить"
  await bot.sendMessage(ADMIN_ID,
    `📬 Новое сообщение\n\n` +
    `От: ${msg.from?.first_name} ${msg.from?.last_name || ''}\n` +
    `Username: @${msg.from?.username || 'нет'}\n` +
    `───────────────\n${msg.text}`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: '💬 Ответить', callback_data: `reply_${msg.from?.id}` }
        ]]
      }
    }
  )

  // Автоответ клиенту
  await bot.sendMessage(chatId, 'Спасибо! Мы ответим в ближайшее время. ⏱️')
})

// Админ нажимает "Ответить"
bot.on('callback_query', async (query) => {
  if (!query.data?.startsWith('reply_')) return

  const clientId = parseInt(query.data.split('_')[1])
  replyingTo.set(parseInt(ADMIN_ID), clientId)

  await bot.answerCallbackQuery(query.id)
  await bot.sendMessage(ADMIN_ID,
    '✍️ Режим ответа активирован.\nСледующее сообщение отправится клиенту.'
  )
})

console.log('🤖 Telegram bot started!')
```

**3. Запустить бота (30 мин)**
- [ ] Создать скрипт запуска:
  ```json
  // backend/package.json
  "scripts": {
    "telegram-bot": "tsx src/telegram/bot.ts"
  }
  ```

- [ ] Запустить локально: `pnpm telegram-bot`
- [ ] Протестировать: написать боту → должно прийти тебе
- [ ] Настроить автозапуск (pm2 или systemd)

**4. Деплой (опционально)**
- [ ] Добавить в Railway/Render как отдельный процесс
- [ ] Или использовать webhook вместо polling

**Как ты будешь работать:**

1. Клиент пишет боту: "Хочу заказать Монстеру"
2. Тебе в личку приходит:
   ```
   📬 Новое сообщение

   От: Иван Петров
   Username: @ivan_petrov
   ───────────────
   Хочу заказать Монстеру

   [💬 Ответить]  ← кнопка
   ```
3. Нажимаешь "Ответить"
4. Пишешь: "Принято! 2500₽. Доставим завтра."
5. Бот отправляет твой текст клиенту
6. Тебе приходит: "✅ Отправлено!"

---

### ЭТАП 4: Продвинутая автоматизация (будущее)

**Когда:** Когда заказов 50+ в день

**Возможности:**
- Автоматическое создание заказов в БД
- Уведомления о статусе заказа
- Интеграция с корзиной
- Веб-админка для управления заказами
- Бот-команды: `/orders`, `/stats`, `/catalog`
- Оплата через Telegram Payments

**Время:** 5-10 часов разработки

---

## 📊 Рекомендуемый план:

```
Сейчас (15 мин):
├─ ЭТАП 1: Личный username → начать работать

Через неделю (30 мин):
├─ ЭТАП 2: Создать бота → профессиональный вид

Когда заказов 10+ в день (2 часа):
├─ ЭТАП 3: Бот с пересылкой → удобство

Когда бизнес вырастет (5-10 часов):
└─ ЭТАП 4: Полная автоматизация → масштаб
```

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

<a name="plantcard-design"></a>
### #plantcard-design: Улучшение дизайна PlantCard

**Приоритет:** 🟢 Средний (UX улучшение)
**Время:** 2 часа
**Тип:** Я делаю сам
**Зависимости:** Нет

**Текущая проблема:**
- Вся карточка кликабельна (CardActionArea) - непонятно, куда именно ведет клик
- Нет возможности посмотреть все фото без перехода на детальную страницу
- Если фото несколько - пользователь об этом не знает

**Решение:**
1. **Кликабельное название**
   - Только название (Typography/Link) ведет на детальную страницу
   - Остальная карточка - статична
   - Лучше для UX - ясно, куда кликать

2. **Индикаторы фото**
   - Dots (точки) внизу изображения
   - Показывают количество фото
   - Белые точки с прозрачностью + border

3. **Lightbox галерея**
   - Клик по фото → открывается Modal с полноэкранным просмотром
   - Навигация стрелками влево/вправо
   - Thumbnails внизу для быстрого перехода
   - Закрытие по крестику или ESC

**Пример реализации:**

```tsx
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Modal,
  Stack,
  Link,
} from '@mui/material'
import { Close as CloseIcon, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useMe } from '../../lib/ctx'
import { env } from '../../lib/env'

type BaseCardProps = {
  onClick?: () => void
}

type PlantCardProps = BaseCardProps & {
  type: 'plant'
  data: {
    plantId: string
    name: string
    description: string
    imagesUrl: string[]
  }
}

type PlantInstanceCardProps = BaseCardProps & {
  type: 'instance'
  data: {
    Id: string
    inventoryNumber: string
    plantName?: string
    price: string
    description?: string | null
    imagesUrl: string[]
    createdAt: Date
  }
}

type TPlantCardProps = PlantCardProps | PlantInstanceCardProps

export const PlantCard = (props: TPlantCardProps) => {
  const me = useMe()
  const { type, data, onClick } = props
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = data.imagesUrl.map(
    (url) => `${env.VITE_BACKEND_URL}/${url.replace('public/', '')}`
  )
  const mainImage = images[0] || '/placeholder.jpg'

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (type === 'plant') {
    return (
      <>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="300"
              image={mainImage}
              alt={data.name}
              sx={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => {
                setCurrentImageIndex(0)
                setLightboxOpen(true)
              }}
            />
            {data.imagesUrl.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                {data.imagesUrl.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: idx === 0 ? 'white' : 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(0,0,0,0.3)',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
          <CardContent sx={{ flexGrow: 1 }}>
            <Link
              component="button"
              variant="h6"
              onClick={onClick}
              sx={{
                textAlign: 'left',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                cursor: 'pointer',
              }}
            >
              {data.name}
            </Link>
            {data.description && (
              <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 1 }}>
                {data.description}
              </Typography>
            )}
          </CardContent>
        </Card>

        <Modal
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
            }}
          >
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
              onClick={() => setLightboxOpen(false)}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {images.length > 1 && (
                <IconButton onClick={handlePrevImage}>
                  <ChevronLeft />
                </IconButton>
              )}
              <img
                src={images[currentImageIndex]}
                alt={`${data.name} - фото ${currentImageIndex + 1}`}
                style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain' }}
              />
              {images.length > 1 && (
                <IconButton onClick={handleNextImage}>
                  <ChevronRight />
                </IconButton>
              )}
            </Box>

            {images.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: 'center' }}>
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: idx === currentImageIndex ? '2px solid' : '2px solid transparent',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                    }}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Modal>
      </>
    )
  }

  if (type === 'instance') {
    return (
      <>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="250"
              image={mainImage}
              alt={`Экземпляр #${data.inventoryNumber}`}
              sx={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => {
                setCurrentImageIndex(0)
                setLightboxOpen(true)
              }}
            />
            {data.imagesUrl.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                {data.imagesUrl.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: idx === 0 ? 'white' : 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(0,0,0,0.3)',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
          <CardContent sx={{ flexGrow: 1 }}>
            {data.plantName && (
              <Link
                component="button"
                variant="caption"
                onClick={onClick}
                sx={{
                  display: 'block',
                  textAlign: 'left',
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {data.plantName}
              </Link>
            )}
            {me?.role === 'ADMIN' && (
              <Typography variant="body2" fontWeight="medium" color="primary">
                #{data.inventoryNumber}
              </Typography>
            )}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              {data.price} ₽
            </Typography>
            {data.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
                {data.description}
              </Typography>
            )}
            {me?.role === 'ADMIN' && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Добавлено:{' '}
                {data.createdAt.toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Typography>
            )}
          </CardContent>
        </Card>

        <Modal
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
            }}
          >
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
              onClick={() => setLightboxOpen(false)}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {images.length > 1 && (
                <IconButton onClick={handlePrevImage}>
                  <ChevronLeft />
                </IconButton>
              )}
              <img
                src={images[currentImageIndex]}
                alt={`Экземпляр #${data.inventoryNumber} - фото ${currentImageIndex + 1}`}
                style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain' }}
              />
              {images.length > 1 && (
                <IconButton onClick={handleNextImage}>
                  <ChevronRight />
                </IconButton>
              )}
            </Box>

            {images.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: 'center' }}>
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: idx === currentImageIndex ? '2px solid' : '2px solid transparent',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                    }}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Modal>
      </>
    )
  }

  return null
}
```

**Основные фичи:**
1. ✅ Кликабельное название (`<Link component="button">`) вместо CardActionArea
2. ✅ Индикаторы фото (dots) внизу изображения - показывают количество
3. ✅ Lightbox галерея - Modal с полноэкранным просмотром
4. ✅ Навигация - стрелки ChevronLeft/ChevronRight (если фото > 1)
5. ✅ Thumbnails - миниатюры внизу для быстрого перехода
6. ✅ Клик по фото - открывает галерею
7. ✅ Закрытие - крестик или клик вне области (встроено в Modal)

**Checklist реализации:**
- [ ] Скопировать код в `plantCard.tsx`
- [ ] Проверить импорты (IconButton, Modal, Stack, Link, иконки)
- [ ] Добавить импорт иконок из `@mui/icons-material`
- [ ] Протестировать на карточках с 1 фото
- [ ] Протестировать на карточках с несколькими фото
- [ ] Проверить lightbox на мобильных
- [ ] Проверить навигацию стрелками и thumbnails
- [ ] Проверить, что название кликабельно, остальное - нет

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

<a name="shopping-cart"></a>
### #shopping-cart: Реализация корзины

**Приоритет:** 🔴 КРИТИЧНО
**Время:** 4 часа
**Тип:** Полная реализация
**Зависимости:** Нет

**Почему критично:**
Без корзины сайт - просто витрина. Пользователь не может собрать заказ, приходится писать по каждому товару отдельно. Корзина - базовый функционал интернет-магазина.

**Checklist:**

**1. Backend - БД (30 мин)**
```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String?    // null для гостей (опционально)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  items     CartItem[]

  @@unique([userId]) // один пользователь = одна корзина
}

model CartItem {
  id              String        @id @default(uuid())
  cartId          String
  cart            Cart          @relation(fields: [cartId], references: [id], onDelete: Cascade)
  plantInstanceId String
  plantInstance   PlantInstance @relation(fields: [plantInstanceId], references: [Id], onDelete: Cascade)
  addedAt         DateTime      @default(now())

  @@unique([cartId, plantInstanceId]) // товар не может быть дважды в одной корзине
}
```
- [ ] Добавить модели в schema.prisma
- [ ] Запустить миграцию: `pnpm prisma migrate dev --name add_cart`

**2. Backend - tRPC роуты (1 час)**
- [ ] `getCart` - получить корзину с товарами (с join PlantInstance + Plant)
- [ ] `addToCart` - добавить товар (проверка что не добавлен уже)
- [ ] `removeFromCart` - удалить товар
- [ ] `clearCart` - очистить всю корзину

**3. Frontend - Context + хук (30 мин)**
```tsx
// CartContext.tsx
const CartContext = createContext<CartContextValue>()

export const useCart = () => {
  const cart = trpc.getCart.useQuery()
  const addItem = trpc.addToCart.useMutation()
  const removeItem = trpc.removeFromCart.useMutation()
  const clearCart = trpc.clearCart.useMutation()

  return {
    items: cart.data?.items || [],
    totalPrice: calculateTotal(cart.data?.items),
    itemCount: cart.data?.items.length || 0,
    addItem,
    removeItem,
    clearCart,
  }
}
```

**4. Frontend - CartButton в Header (30 мин)**
- [ ] IconButton с Badge (количество товаров)
- [ ] Клик → открывает CartDrawer
- [ ] Анимация при добавлении товара

**5. Frontend - CartDrawer (1 час)**
- [ ] MUI Drawer справа
- [ ] Список товаров (фото, название, цена, кнопка удалить)
- [ ] Пустое состояние ("Корзина пуста")
- [ ] Итоговая сумма внизу
- [ ] Кнопка "Оформить заказ"

**6. Frontend - Кнопки "В корзину" (30 мин)**
- [ ] PlantCard - кнопка в CardActions или на фото
- [ ] DetailCard - большая кнопка рядом с ценой
- [ ] Проверка: уже в корзине → показать "Уже в корзине" или "Перейти в корзину"

**7. Интеграция с Telegram (30 мин)**
- [ ] Кнопка "Оформить заказ" формирует сообщение со всеми товарами
- [ ] Формат: "Здравствуйте! Хочу заказать:\n1. Название - цена₽\n2. ...\n\nИтого: XXXX₽"
- [ ] После клика - открывается Telegram
- [ ] После отправки - clearCart()

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

<a name="typography"></a>
### #typography: Настройка типографики

**Приоритет:** 🔴 КРИТИЧНО
**Время:** 1.5 часа
**Тип:** Design System
**Зависимости:** Нет

**Почему критично:**
Сейчас используется дефолтная Roboto с базовыми настройками. Типографика - основа визуальной иерархии и читаемости. Без правильной типографики сайт выглядит непрофессионально.

**Варианты шрифтов:**

**Вариант 1: Современный минимализм**
- Inter для всего
- Плюсы: единообразие, чистота, читаемость
- Минусы: может быть скучновато

**Вариант 2: Элегантный (РЕКОМЕНДУЮ)**
- Montserrat (заголовки h1-h3) - характерный, выразительный
- Inter (основной текст, h4-h6) - читаемый
- Плюсы: контраст, визуальная иерархия
- Минусы: нужно подключать 2 шрифта

**Вариант 3: Классика**
- Roboto улучшенный
- Плюсы: привычный, не нужно подключать
- Минусы: как у всех

**Checklist:**

**1. Подключить шрифты (20 мин)**
```tsx
// webapp/src/theme/index.tsx или main.tsx
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
```
- [ ] Установить: `pnpm add @fontsource/inter @fontsource/montserrat`
- [ ] Импортировать в main.tsx

**2. Настроить MUI theme (40 мин)**
```tsx
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none', // убрать UPPERCASE
    },
  },
})
```

**3. Проверить все страницы (30 мин)**
- [ ] PlantCard - название, описание
- [ ] DetailCard - заголовки, текст
- [ ] Forms - labels, inputs
- [ ] Header - навигация
- [ ] Кнопки - текст

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

<a name="sticky-header"></a>
### #sticky-header: Фиксированный Header с эффектами

**Приоритет:** 🔴 КРИТИЧНО
**Время:** 30 минут
**Тип:** UI улучшение
**Зависимости:** Нет

**Почему критично:**
Header должен быть всегда доступен для навигации и доступа к корзине. Размытие и прозрачность - современный тренд, добавляет премиальности.

**Checklist:**

**1. Базовый sticky (10 мин)**
```tsx
// Header.tsx
<AppBar
  position="sticky"
  sx={{
    top: 0,
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // или theme.palette.background.paper с alpha
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }}
>
```

**2. Динамическая тень при скролле (20 мин)**
```tsx
const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10)
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

<AppBar
  sx={{
    boxShadow: scrolled ? 3 : 0,
    transition: 'box-shadow 0.3s ease',
  }}
>
```

**3. Проверить на всех страницах**
- [ ] PlantsList
- [ ] PlantDetail
- [ ] InstanceDetail
- [ ] Forms (Add/Edit)

**Дополнительно (если время):**
- Анимация появления при скролле вверх
- Скрывать при скролле вниз (auto-hide)

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

<a name="photo-reorder"></a>
### #photo-reorder: Drag & Drop для изменения порядка фото

**Приоритет:** 🟢 Средний (UX улучшение)
**Время:** 2 часа
**Тип:** Я делаю с помощью Claude
**Зависимости:** Нет

**Текущая проблема:**
- Фото хранятся в массиве `imagesUrl: string[]`
- Первое фото = главное (обложка карточки)
- Невозможно изменить порядок после загрузки
- При добавлении новых фото порядок случайный

**Решение: @dnd-kit/sortable**

**Почему @dnd-kit:**
- ✅ Поддержка touch (mobile работает из коробки)
- ✅ Keyboard navigation (доступность)
- ✅ Smooth animations
- ✅ У тебя уже установлен `@dnd-kit/core` и `@dnd-kit/utilities`
- ✅ Современная, активно поддерживаемая библиотека
- ✅ Маленький размер (~10kb gzipped)

**Где применить:**
1. **ImagesInput** - при загрузке фото
2. **EditPlantPage** - при редактировании
3. **AddPlantInstancePage** - при добавлении экземпляра

**Установка (если нужно):**
```bash
cd webapp
pnpm add @dnd-kit/sortable
```

**Пример реализации (ImagesInput с @dnd-kit):**

```tsx
import { Box, IconButton, Typography } from '@mui/material'
import { Delete as DeleteIcon, DragIndicator } from '@mui/icons-material'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type ImageWithPreview = {
  id: string
  preview: string
  file?: File
}

const SortableImageItem = ({ image, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'relative',
        width: 120,
        height: 160,
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'grey.300',
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'move',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      {index === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bgcolor: 'primary.main',
            color: 'white',
            px: 1,
            py: 0.5,
            fontSize: 10,
            fontWeight: 'bold',
            zIndex: 1,
          }}
        >
          ОБЛОЖКА
        </Box>
      )}
      <img
        src={image.preview}
        alt={`Фото ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box
        {...attributes}
        {...listeners}
        sx={{
          position: 'absolute',
          top: index === 0 ? 28 : 4,
          right: 4,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicator
          sx={{
            color: 'white',
            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
            fontSize: 28,
          }}
        />
      </Box>
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{
          position: 'absolute',
          bottom: 4,
          right: 4,
          bgcolor: 'error.main',
          color: 'white',
          '&:hover': { bgcolor: 'error.dark' },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

export const ImagesInputWithDragDrop = ({ value, onChange }) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = value.findIndex((img) => img.id === active.id)
    const newIndex = value.findIndex((img) => img.id === over.id)

    onChange(arrayMove(value, oldIndex, newIndex))
  }

  return (
    <Box>
      {value.length > 0 && (
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          Перетащите фото чтобы изменить порядок. Первое фото - обложка.
        </Typography>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((img) => img.id)} strategy={rectSortingStrategy}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {value.map((image, index) => (
              <SortableImageItem
                key={image.id}
                image={image}
                index={index}
                onRemove={() => {
                  onChange(value.filter((_, i) => i !== index))
                }}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  )
}
```

**Основные фичи:**
1. ✅ @dnd-kit - современная библиотека с touch поддержкой
2. ✅ Визуальный feedback - прозрачность и border при перетаскивании
3. ✅ Badge "ОБЛОЖКА" на первом фото
4. ✅ Иконка DragIndicator с cursor: grab/grabbing
5. ✅ Кнопка удаления на каждом фото
6. ✅ Aspect ratio 3:4 (120x160px)
7. ✅ Hover эффект
8. ✅ Smooth animations
9. ✅ Работает на мобильных (touch)

**Checklist реализации:**
- [ ] Установить `@dnd-kit/sortable` (если ещё не установлен)
- [ ] Создать SortableImageItem компонент
- [ ] Обновить ImagesInput с DndContext
- [ ] Добавить визуальный feedback
- [ ] Тестировать на desktop (мышь)
- [ ] Тестировать на mobile (touch)
- [ ] Добавить hint текст "Первое фото - обложка"
- [ ] Проверить что порядок сохраняется в formik
- [ ] Проверить что первое фото отображается на PlantCard
- [ ] Протестировать keyboard navigation (accessibility)

[↑ Вернуться к задачам](#-medium-tasks-1-3-часа)

---

## 📊 Прогресс по задачам

### ✅ Выполнено (последние 10)
- [x] Galery component создан (2025-01-14)
- [x] PlantDetailPage redesign - новый layout (2025-01-14)
- [x] MUI Theme Phase 1 - расширение темы (2025-01-13)
- [x] Аудит проекта - удаление избыточных props (2025-01-13)
- [x] Исправление Box компонентов (2025-01-13)
- [x] Galery интеграция в AddPlantPage (2025-01-14)
- [x] PlantCard кликабельна → переход на детальную (2025-01-12)
- [x] Кнопка "Связаться" в Telegram (2025-01-12)
- [x] Исследование MCP, RAG, MUI theming (2025-01-13)
- [x] Fix: price default 0 → '' (2025-01-13)

### 🏗️ В работе
*Сейчас ничего*

### 📈 Статистика
- **Всего задач:** 18 основных
- **Выполнено:** 13 (72%)
- **Осталось:** 5
- **Оценка до MVP:** ~10-12 часов работы

---

## 🗂️ Архив старых задач

> **Большой старый TODO перенесен в:** `docs/TODO_ARCHIVE.md`
>
> Включает:
> - Архитектурные решения (Base64 vs FormData, Button component)
> - Детальные планы рефакторинга (СТАДИЯ 1-5)
> - Исследования MCP, RAG, MUI Grid
> - SCSS cleanup checklist
> - Все остальные backlog задачи

**Когда смотреть архив:**
- Нужны детали по архитектурным решениям
- Планирую рефакторинг стилей
- Ищу старые исследования и выводы

---

## 📚 Ссылки на документацию

- **Организация времени и продуктивность:** [docs/PRODUCTIVITY.md](docs/PRODUCTIVITY.md)
- **Исследование MCP:** [docs/MCP_RESEARCH.md](docs/MCP_RESEARCH.md)
- **Исследование RAG:** [docs/RAG_RESEARCH.md](docs/RAG_RESEARCH.md)
- **Исследование MUI Theming:** [docs/MUI_THEMING_RESEARCH.md](docs/MUI_THEMING_RESEARCH.md)
- **Архив старых задач:** [docs/TODO_ARCHIVE.md](docs/TODO_ARCHIVE.md) *(создать при необходимости)*

---

## 📖 Как пользоваться этим файлом

### Для себя (работа без Claude)

**1. Найти задачу по времени:**
- Есть 10 минут? → смотри [⚡ Quick Wins](#-quick-wins--15-мин)
- Есть час? → смотри [🏃 Short Tasks](#-short-tasks-15-60-мин)
- Есть вечер? → смотри [🚀 Medium Tasks](#-medium-tasks-1-3-часа)
- Выходные? → смотри [🏔️ Large Tasks](#-large-tasks-3-часа)

**2. Отметить выполненную задачу:**
```markdown
# Было:
- [ ] Переместить telegramUsername в .env [5 мин]

# Стало:
- [x] Переместить telegramUsername в .env [5 мин]
```

**3. Добавить новую задачу:**

Используй специальные пометки для Claude:

| Пометка | Значение | Пример |
|---------|----------|--------|
| `🤖` | Задача для Claude (любая) | `[5м] 🤖 Fix lint errors` |
| `🤖📋` | Claude должен исследовать | `[45м] 🤖📋 Research deployment options` |
| `🤖⚙️` | Claude должен сгенерировать | `[20м] 🤖⚙️ Generate API types` |
| `🤖🔍` | Claude должен проанализировать | `[30м] 🤖🔍 Audit bundle size` |

**Добавляй в нужный раздел по времени:**
```markdown
## ⚡ Quick Wins (< 15 мин)
- [ ] Моя новая задача [10 мин] 🤖📋
  - Описание что нужно сделать
  - Файлы: component.tsx:42
```

**4. Добавить задачу с деталями:**
```markdown
## 🏃 Short Tasks (15-60 мин)
- [ ] Создать компонент SearchBar [45 мин]
  - См. #search-bar ниже

---

## 📖 Детали задач

<a name="search-bar"></a>
### #search-bar: Компонент поиска

**Приоритет:** 🟡 Средний
**Время:** 45 мин
**Тип:** Я делаю сам

**Checklist:**
- [ ] Создать SearchBar.tsx
- [ ] Добавить в Header
- [ ] Подключить к filter логике
```

**5. Как ставить emoji значки:**

На Mac:
- `Ctrl + Cmd + Space` → откроется панель эмодзи
- Или копируй из этого файла: 🤖 📋 ⚙️ 🔍 🔴 🟡 🟢 🔵 ⚡ 🏃 🚀 🏔️

На Windows:
- `Win + .` (точка) → откроется панель эмодзи
- Или копируй из этого файла

В VSCode:
- Расширение "Emoji" для быстрой вставки
- Или копируй из примеров

### Для работы с Claude

**Команда 1: Выполнить задачи из очереди**
```
Прочитай план и выполни задачи из очереди Claude
```
Claude найдет раздел [🤖 Задачи для Claude](#-задачи-для-claude) и выполнит помеченные задачи.

**Команда 2: Выполнить конкретную задачу**
```
Выполни задачу #deploy-backend из TODO
```
Claude найдет детали по якорю `<a name="deploy-backend">` и выполнит.

**Команда 3: Найти задачу на N минут**
```
Что я могу сделать за 30 минут? Посмотри TODO
```
Claude посмотрит "Short Tasks (15-60 мин)" и предложит варианты.

**Команда 4: Добавить результаты исследования**
```
Добавь результаты исследования Telegram Bot API в TODO
```
Claude обновит задачу в разделе [🤖 Задачи для Claude → 📋 Исследования](#-исследования-research).

---

## 🎯 Следующие шаги

**СЕЙЧАС (следующая задача):**
1. Выбрать задачу из [Quick Wins](#-quick-wins--15-мин) или [Short Tasks](#-short-tasks-15-60-мин)
2. Отметить как выполненную когда закончу
3. Двигаться к деплою!

**ДО КОНЦА НЕДЕЛИ:**
- [ ] Создать Telegram бота
- [ ] Запланировать деплой

**ДО КОНЦА МЕСЯЦА:**
- [ ] Задеплоить MVP
- [ ] Протестировать на реальных устройствах
- [ ] Получить первых пользователей!
