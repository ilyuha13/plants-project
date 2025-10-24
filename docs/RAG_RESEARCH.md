# RAG (Retrieval-Augmented Generation) - Исследование

**Дата:** 2025-01-24
**Статус:** Требует изучения и решения о применении

---

## 📖 Что такое RAG?

**RAG (Retrieval-Augmented Generation)** - это гибридный фреймворк, который интегрирует:
1. **Retrieval механизм** - извлекает релевантную внешнюю информацию
2. **Generative модель** - использует извлеченную информацию для генерации ответов

**Ключевая фишка:** В отличие от обычных LLM, которые полагаются только на pre-trained данные, RAG **динамически интегрирует внешние знания** в процесс генерации, получая актуальную информацию в реальном времени.

---

## ✅ Преимущества RAG

### 1. Снижение галлюцинаций
- Улучшает фактическую точность, опираясь на реальные документы
- Ответы основаны на retrieved context, а не на "фантазиях" модели

### 2. Актуальность знаний
- Доступ к real-time информации из внешних источников
- Не нужно переобучать модель для обновления знаний - достаточно обновить knowledge base

### 3. Доверие и верифицируемость
- Предоставляет citations и sources
- Можно проверить откуда AI взял информацию
- Более trustworthy ответы

### 4. Специализация без переобучения
- Можно интегрировать proprietary knowledge bases
- AI становится экспертом в конкретных областях без expensive retraining

---

## 🎯 Use Cases для RAG

### Реальные применения:

1. **Legal document analysis**
   - Извлечение key information из длинных юридических текстов и контрактов

2. **Customer support**
   - Детальные ответы используя информацию из больших мануалов
   - Automation поддержки

3. **Content generation**
   - Суммаризация или извлечение insights из книг и статей

4. **Knowledge management**
   - Эффективное извлечение и синтез информации из enterprise knowledge bases
   - Enterprise search

5. **Open-domain question answering**
   - Требуется real-time information retrieval

---

## 🏗️ Архитектуры RAG 2025

### Traditional RAG
Базовый подход: Query → Retrieval → Generation

### Advanced архитектуры:

1. **Long RAG** - для работы с длинными документами
2. **Self-RAG** - самостоятельная коррекция retrieval
3. **Corrective RAG** - исправление ошибок retrieval
4. **Adaptive RAG** - динамическая адаптация retrieval стратегии
5. **GraphRAG** - использование graph structures для knowledge
6. **Golden-Retriever RAG** - оптимизированный retrieval
7. **Multimodal RAG** - работа с разными типами данных

**Тренд 2025:** Статичный RAG ушел в прошлое. Сейчас - adaptive, multimodal, self-correcting системы.

---

## 📊 Best Practices 2025

### Ключевые факторы качества RAG:

1. **Language model size** - размер модели
2. **Prompt design** - дизайн промптов
3. **Document chunk size** - размер кусков документов
4. **Knowledge base size** - размер базы знаний
5. **Retrieval stride** - шаг retrieval
6. **Query expansion techniques** - техники расширения запросов
7. **Multilingual knowledge bases** - мультиязычные базы
8. **Focus Mode** - retrieval на sentence-level

### Рекомендации:

**Для enterprise:**
- Начать с **hybrid search**
- Добавлять advanced методы (GraphRAG) по мере роста сложности

**Retrieval enhancements:**
- Query augmentation
- Metadata filtering
- **Reranking** - КРИТИЧНО для качества

**Real-time data:**
- Интегрировать real-time data feeds
- Динамический retrieval самой свежей информации

---

## ⚠️ Ограничения RAG

### Проблемы Retrieval фазы:

1. **Ambiguity (многозначность):**
   - Слова с multiple meanings → retrieval неправильной информации

2. **Broad matching:**
   - Матчинг по общим сходствам, а не по specific details
   - Сложно различать closely related topics в больших датасетах

3. **Multi-hop questions:**
   - Один round retrieval не может ответить на multi-hop вопросы

### Проблемы Augmentation & Generation:

1. **Поверхностные ответы:**
   - Naive RAG плохо контекстуализирует retrieved data
   - Результат не capture full scope информации

2. **Отсутствие итеративного reasoning:**
   - RAG не может полностью понять насколько релевантна retrieved информация

3. **Галлюцинации:**
   - Даже с accurate retrieval, модель может hallucinate
   - Генерирует plausible-sounding, но фактически неверный контент

### Data & Infrastructure зависимости:

1. **Quality зависит от data структуры:**
   - Перформанс сильно зависит от организации underlying data
   - Semantic similarity query к data

2. **Garbage in, garbage out:**
   - Если retriever извлекает incomplete/irrelevant/low-quality data → плохие результаты

3. **Lossiness (потери):**
   - ВСЕ RAG процессы **lossy** (теряют информацию)
   - Chunking, embedding limits, top_k limits, content length restrictions

### Технические ограничения:

1. **Token limits:**
   - Ограничивают количество chunks в промпте

2. **Rate limits:**
   - Влияют на latency системы

3. **Merging issues:**
   - LLM может смешивать outdated и updated информацию misleading образом

---

## 🚫 Когда НЕ использовать RAG

### RAG не подходит когда:

1. **Нужна specialized domain expertise:**
   - Fine-tuning лучше для глубоких domain знаний
   - RAG может не fully customize writing style или behavior

2. **Static, specialized knowledge:**
   - Fine-tuning на static knowledge (законы, regulations, patterns)
   - Если knowledge не меняется - fine-tuning эффективнее

3. **Critical consistent style/tone:**
   - RAG может не автоматически адаптировать linguistic style
   - Fine-tuning лучше для consistent tone

4. **Low latency критична:**
   - Retrieval из больших databases добавляет latency

---

## 🔄 RAG vs Fine-Tuning

### Когда использовать RAG:

✅ Приложение нуждается в **dynamic, up-to-date knowledge**
✅ Доступ к domain-specific knowledge из external sources
✅ Нужны citations и verifiability
✅ Knowledge часто обновляется
✅ Нет budget на retraining модели

### Когда использовать Fine-Tuning:

✅ Deeply specialize модель на **fixed task** с curated data
✅ Нужна **очень высокая accuracy** на domain-specific задачах
✅ **Lower latency** критична (модель уже trained)
✅ Consistent terminology и solutions aligned с training examples
✅ Static knowledge base

### Hybrid подход: RAFT

**RAFT (Retrieval-Augmented Fine-Tuning)** - растущий тренд 2025:
- Fine-tuned модель на specialized domain data
- Deployed в RAG архитектуре
- Domain expertise для retrieval наиболее релевантной информации

**Вердикт:** В реальных кейсах **комбинация обоих** дает лучшие результаты.

---

## 🔧 RAG с Claude Code - Имплементация

### Claude Code и RAG

**Важный факт:** Claude Code **НЕ использует RAG по умолчанию**!

Вместо этого использует grep line-by-line для "agentic search" без semantics или structure.

**Цитата инженера Claude (Hacker News):**
> "Claude Code doesn't use RAG at all by default, instead using grep"

### Почему это проблема:

- **Сжигает tokens** - grep читает весь код line-by-line
- **Нет semantic понимания** - не понимает структуру кода
- **Inefficient** - может сжечь на 40% больше tokens

### Решение: MCP серверы с RAG

Несколько open-source MCP серверов добавляют RAG capabilities:

#### 1. Claude Context
- **Что:** MCP plugin для semantic code search
- **Как:** Интегрируется с Claude Code и другими AI coding agents
- **Архитектура:**
  - Claude Code (agentic coding assistant)
  - claude-context (MCP server bridge)
  - Milvus (local vector database)
  - Ollama (local embedding model)

**Setup процесс:**
1. Index codebase (проходит через code files)
2. Split на chunks
3. Generate embeddings (local embedding model)
4. Store embeddings в Milvus
5. Semantic search при queries

**Преимущество:** Deep context всего codebase

#### 2. mcp-ragex
- **Что:** MCP сервер для intelligent code search
- **Modes:**
  - Semantic (RAG)
  - Symbolic (tree-sitter)
  - Regex (ripgrep)
- **Для:** Claude Code и AI coding assistants

#### 3. Qdrant's MCP server
- **Что:** Подключение documentation и codebase к AI agents
- **Поддержка:** Claude Code, Cursor, Windsurf, любой MCP-compatible agent

### Результаты использования RAG:

- ⚡ **Debug быстрее**
- 💰 **Cut token costs на 40%**
- 🧠 **AI понимает codebase по-настоящему**

---

## 🎯 RAG для Plants Project - Применимость

### Потенциальные use cases:

#### 1. ❌ Customer support (НЕ актуально сейчас)
- У нас пока нет большой базы FAQ
- Telegram бот пока просто forwarding

#### 2. ❌ Documentation search (НЕ актуально)
- Проект маленький, документация минимальная
- WebSearch по MUI/React docs достаточно

#### 3. ✅ Codebase understanding (ПОТЕНЦИАЛЬНО полезно)
- **Если проект вырастет** - RAG поможет Claude понимать весь код
- Semantic search вместо grep
- Но: пока проект маленький (~50 файлов), grep достаточно

#### 4. ❌ Real-time plant info (НЕ актуально)
- У нас простая PostgreSQL база
- Нет external plant databases для retrieval

### Вердикт для Plants Project:

**Текущая фаза (MVP):** ❌ **НЕ нужен RAG**
- Проект маленький
- Grep/search по файлам достаточно
- Добавление RAG = overkill и сложность

**Будущее (Scale-up):** ✅ **Может быть полезен**
- Если codebase вырастет >200 файлов
- Если добавим external plant databases
- Если нужен AI assistant для новых разработчиков

---

## 📝 План изучения RAG

### Фаза 1: Теоретическое понимание (ТЕКУЩАЯ)
- [x] WebSearch по RAG concepts
- [x] Изучить use cases и best practices
- [x] Понять ограничения и когда НЕ использовать
- [x] RAG vs Fine-Tuning
- [ ] **Решить:** Нужен ли RAG для Plants Project?

### Фаза 2: Практическое изучение (ОПЦИОНАЛЬНО)
- [ ] Попробовать Claude Context MCP для codebase
- [ ] Настроить local vector DB (Milvus)
- [ ] Измерить token usage: grep vs RAG
- [ ] Оценить benefit vs complexity

### Фаза 3: Production использование (ЕСЛИ РЕШИМ)
- [ ] Выбрать RAG архитектуру (Traditional vs Adaptive)
- [ ] Setup production vector DB
- [ ] Implement chunking strategy
- [ ] Configure reranking
- [ ] Monitor quality metrics

---

## 📚 Источники

### General RAG:
- EdenAI: 2025 Guide to RAG
- arXiv: "Enhancing RAG: A Study of Best Practices" (2501.07391)
- Medium: Mehulpratapsingh, Sandi Besen
- Domo, Chitika, Collabnix guides
- Squirro: "RAG in 2025: Bridging Knowledge and Generative AI"
- Humanloop: "8 RAG Architectures You Should Know"

### RAG Limitations:
- Medium: Simeon Emanuilov, Kelvin Lu
- Towards Data Science: Sandi Besen
- arXiv: "Seven Failure Points in RAG" (2401.05856)
- BrightData, CloudKitect, UnfoldAI blogs

### RAG vs Fine-Tuning:
- DigitalOcean, IBM, Red Hat, Oracle guides
- Medium: Bijit Ghosh, Harsha Srivatsa
- MonteCarloData, Addepto, Fingoweb, SuperAnnotate

### Claude Code + RAG:
- Qdrant webinar: "Vibe Coding RAG with MCP"
- Arsturn: "Local RAG Guide for Claude Code"
- Milvus blog: "Why I'm Against Grep-Only Retrieval"
- GitHub: claude-context, mcp-ragex, claude-code-rag-vector-db
- Zilliz blog: "Cut Token Waste by 40%"

### Tutorials:
- MongoDB: RAG with Claude 3 Opus
- TigerData: RAG with Claude, PostgreSQL, Python on AWS
- Simon Willison: Search-based RAG with Claude
- Medium: Building RAG with Claude 3 and Hugging Face

---

## 💭 Выводы и рекомендации

### Для Plants Project:

**Текущий момент:**
- ❌ RAG **НЕ нужен** на MVP фазе
- Проект слишком маленький
- Complexity не оправдана

**Когда пересмотреть:**
- Codebase > 200 файлов
- Добавление external databases (plant catalogs, scientific data)
- Onboarding новых developers (AI assistant для понимания кода)
- Token costs становятся проблемой

### General learning:

✅ **RAG стоит изучить** как концепцию для будущего
✅ **Понимание trade-offs** поможет принимать решения
✅ **MCP + RAG** - мощная комбинация для coding assistants

**Приоритет изучения:** НИЗКИЙ (после устройства на работу и production деплоя)

### Правило WebSearch:

✅ **Добавить в ~/.claude/CLAUDE.md:**
```markdown
## 🔍 Правило WebSearch перед инструментами

Перед использованием новых инструментов/библиотек/подходов:
1. Провести WebSearch для best practices 2025
2. Изучить trade-offs и limitations
3. Принять informed решение
4. Документировать в TODO.md или docs/
```
