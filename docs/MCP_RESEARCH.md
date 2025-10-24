# MCP (Model Context Protocol) - Исследование

**Дата:** 2025-01-24
**Статус:** Требует изучения и решения о внедрении

---

## 📖 Что такое MCP?

**Model Context Protocol (MCP)** - это открытый стандарт от Anthropic (ноябрь 2024), который позволяет подключать AI-ассистентов к внешним инструментам и источникам данных.

**Аналогия:** MCP для AI = USB-C для устройств. Единый стандарт подключения вместо кастомных интеграций для каждого инструмента.

---

## ✅ Преимущества MCP

### 1. Стандартизация
- Универсальный протокол для подключения AI к разным источникам данных
- Устраняет необходимость создавать кастомную интеграцию для каждого датасета
- Сокращает время разработки и сложность

### 2. Расширение возможностей AI
- AI получает доступ к актуальной информации (не только training data)
- Может взаимодействовать с внешними системами
- Выполнять специфические функции, невозможные через текст

### 3. Безопасность и контроль
- Шифрование и контроль доступа
- User approvals для AI-инициированных действий
- Можно хостить MCP серверы внутри своей инфраструктуры (за firewall)

### 4. Гибкость и интероперабельность
- Vendor-neutral интерфейс
- Можно менять AI модель или инструмент - если оба поддерживают MCP, интеграция работает
- Open-source, community-driven

### 5. Демократизация AI (2025)
- Zero-code подход для non-technical пользователей
- Sophisticated AI workflows без dedicated technical resources

---

## 🌐 Adoption в 2025

**Платформы:** Replit, Codeium, Sourcegraph, OpenAI, Google DeepMind

**Use cases:**
- AI-powered research
- Enterprise knowledge management
- DevOps
- Real-time data retrieval для принятия решений

---

## 🛠️ Как установить MCP серверы в Claude Code

### Базовая команда

```bash
# Добавить MCP сервер
claude mcp add <name> --scope user

# HTTP серверы (удаленные сервисы)
claude mcp add --transport http <name> <url>

# Stdio серверы (локальные процессы)
claude mcp add --transport stdio <name> <command> [args...]
```

### Примеры установки

```bash
# Playwright MCP
claude mcp add playwright -s user -- npx -y @executeautomation/playwright-mcp-server

# DigitalOcean MCP
claude mcp add digitalocean-mcp-local \
  -e DIGITALOCEAN_API_TOKEN=YOUR_TOKEN \
  -- npx "@digitalocean/mcp"
```

### Управление серверами

```bash
claude mcp list          # Список установленных серверов
claude mcp remove [name] # Удалить сервер
claude mcp get [name]    # Протестировать сервер
```

### Конфигурационные файлы

**Рекомендация 2025:** Использовать `~/.claude.json` как primary configuration location.

**Альтернативные локации:**
- Project-scoped: `.mcp.json` (в корне проекта, version-controlled)
- Project-specific: `.claude/settings.local.json`
- User-specific: `~/.claude/settings.local.json`

### Верификация

```bash
# Debug режим для диагностики
claude --mcp-debug

# Проверить статус подключения
/mcp  # внутри Claude Code
```

Показывает "connected" или "failed" для каждого сервера.

---

## 🔍 MCP vs WebSearch

**ВАЖНО:** MCP и WebSearch это НЕ конкуренты!

MCP - это **механизм**, который ВКЛЮЧАЕТ web search.

### Web Search через MCP

Web search в Claude Code **реализуется через MCP серверы**.

#### Бесплатные варианты (без API ключа):
- **Web Search MCP** - scraping Google HTML
- **Open-WebSearch MCP** - scraping SERP
- ⚠️ Уязвимы к rate limiting и изменениям layout

#### API-based варианты (платные, но надежные):
- **Brave Search MCP** - официальный от Anthropic
- Более стабильно и быстро
- Требует API quotas

---

## 📚 Полезные MCP серверы для Plants Project

### Database Management

**Postgres MCP Pro:**
- Index tuning, explain plans, health checks
- Safe SQL execution
- Требует `DATABASE_URI` env variable

**Supabase MCP:**
- Стандартизированное взаимодействие с Supabase (PostgreSQL-compatible)

**Google's MCP Toolbox for Databases:**
- Поддержка PostgreSQL, MySQL, Cloud SQL, AlloyDB
- Connection pooling, authentication

### React Development

**React Docs MCP Server:**
- AI-powered semantic search по React документации
- Для Claude, Cursor и других MCP clients

**React Bits MCP Server:**
- Доступ к React Bits components, blocks, charts, hooks
- Browse, search, retrieve React code examples

### Material UI (ОФИЦИАЛЬНЫЙ!) ⭐

**Material UI MCP Server (@mui/mcp):**
- ✅ **ОФИЦИАЛЬНЫЙ MCP от Material UI**
- Прямой доступ к MUI docs и code examples
- AI assistants получают accurate, up-to-date информацию
- Direct reference к official docs (no hallucinations!)

**Установка в Claude Code:**
```bash
claude mcp add mui-mcp -- npx -y @mui/mcp@latest
```

**Возможности:**
- 📚 Component browsing (50+ React components)
- 🔍 Search components by use case
- 🎨 Customization guides
- ⚙️ Setup instructions
- 🎯 Accurate answers без hallucinations

**Почему это важно:**
> "AI coding assistants often hallucinate links, cite non-existent documentation, or provide answers that are hard to verify when faced with deeper, more complex questions"

MUI MCP решает эту проблему - прямое подключение к trusted source.

**Документация:**
- https://mui.com/material-ui/getting-started/mcp/
- https://mui.com/x/introduction/mcp/

**GitHub:**
- https://github.com/jgentes/mui-mcp-cloudflare
- Zed extension: https://zed.dev/extensions/mcp-server-mui

**Статус:** Официально поддерживается Material UI (2025)

### Codebase Understanding (RAG)

**Claude Context:**
- Semantic code search для Claude Code
- Глубокий контекст всего codebase
- Интеграция с vector DB (Milvus)

**mcp-ragex:**
- Интеллектуальный code search
- Semantic (RAG) + symbolic (tree-sitter) + regex (ripgrep)

**Qdrant's MCP server:**
- Подключение документации и codebase к Claude Code
- Vector search

---

## 🎯 Best Practices для MCP (2025)

### Configuration

1. **--mcp-debug флаг:**
   ```bash
   claude --mcp-debug
   ```
   Помогает идентифицировать проблемы конфигурации

2. **Прямое редактирование config файла:**
   - Больше контроля и гибкости
   - Лучше чем CLI wizard

3. **Scope рекомендации:**
   - User scope для personal tooling (избегает дублирования)
   - Project scope для team-specific инструментов

### CLAUDE.md файлы

**САМАЯ ВАЖНАЯ оптимизация** - создать comprehensive `CLAUDE.md` в project root.

Это не просто документация - это **контекст**, который делает Claude Code экспоненциально эффективнее.

### Custom Slash Commands

Для повторяющихся workflows создать `.claude/commands/*.md` файлы.

Становятся доступны через `/` меню. Можно комитить в git для всей команды.

### Production Environments

1. **Headless mode:**
   ```bash
   claude --output-format stream-json
   ```
   Для automated code reviews и deployments

2. **Environment variables:**
   Использовать для sensitive credentials вместо hardcode API keys

---

## ❓ Вопросы для принятия решения

### Нужно ли подключать MCP к Plants Project?

**Потенциальные MCP серверы:**

1. ⭐ **Material UI MCP (@mui/mcp)** - ОФИЦИАЛЬНЫЙ!
   - Польза: Accurate MUI docs, no hallucinations, 50+ components
   - Установка: `claude mcp add mui-mcp -- npx -y @mui/mcp@latest`
   - Приоритет: **ВЫСОКИЙ** (особенно если делаем theme рефакторинг)
   - ⚡ **РЕКОМЕНДУЕТСЯ установить сейчас!**

2. ✅ **PostgreSQL MCP** (Postgres MCP Pro / Supabase MCP)
   - Польза: Index tuning, explain plans, health checks
   - Приоритет: СРЕДНИЙ (для production optimization)

3. ✅ **React Docs MCP**
   - Польза: Semantic search по React docs
   - Приоритет: НИЗКИЙ (WebSearch покрывает большинство нужд)

4. ✅ **Claude Context (RAG для codebase)**
   - Польза: Глубокое понимание всего кодбейса
   - Приоритет: ВЫСОКИЙ (если проект растет)
   - ⚠️ Но: добавляет сложность setup

### MCP vs WebSearch?

**WebSearch сейчас:**
- ✅ Работает out-of-the-box
- ✅ Покрывает ~80% потребностей
- ✅ Не требует настройки

**MCP Web Search:**
- ✅ Более надежный (API-based)
- ✅ Меньше rate limits
- ❌ Требует setup и API keys (Brave Search)

**Вердикт:** Оставить WebSearch для текущей фазы. MCP рассмотреть для production.

---

## 🚀 План действий

### Фаза 1: Изучение (ТЕКУЩАЯ)
- [x] Провести WebSearch по MCP
- [x] Изучить available MCP servers
- [x] Понять преимущества и use cases
- [ ] **Решить:** Подключать ли MCP сейчас или после MVP?

### Фаза 2: Setup (если решим подключить)
- [ ] Установить базовый MCP сервер (Brave Search или PostgreSQL)
- [ ] Настроить `~/.claude.json`
- [ ] Протестировать с `--mcp-debug`
- [ ] Верифицировать через `/mcp` команду

### Фаза 3: Expansion (опционально)
- [ ] Добавить React Docs MCP
- [ ] Добавить Claude Context для RAG по кодбейсу
- [ ] Создать custom slash commands для workflows

---

## 📖 Источники

- Anthropic MCP docs: https://docs.claude.com/en/docs/mcp
- MCPcat setup guide: https://mcpcat.io/guides/adding-an-mcp-server-to-claude-code/
- Anthropic blog: https://www.anthropic.com/news/model-context-protocol
- Claude MCP Community: https://www.claudemcp.com/
- Best practices: https://www.anthropic.com/engineering/claude-code-best-practices
- Medium articles: AI Rabbit, Tech Wanderer
- DigitalOcean tutorial
- Stack Overflow, LogRocket, GitHub awesome-mcp-servers

---

## 💭 Заметки и мысли

**Про правило WebSearch перед инструментами:**
- Да, стоит делать WebSearch перед использованием инструментов для проверки best practices
- Добавить это правило в global `~/.claude/CLAUDE.md`

**Текущий статус проекта:**
- MVP фаза, приоритет - бизнес-ценность
- MCP может подождать до production phase
- WebSearch + встроенные инструменты покрывают текущие нужды
