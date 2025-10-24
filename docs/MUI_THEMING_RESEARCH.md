# Material UI Theming & Styling - Исследование

**Дата:** 2025-01-24
**Статус:** Требует применения в проекте

---

## 🎨 Проблема: sx prop перегружает компоненты

**Текущая ситуация в Plants Project:**
```tsx
<Button
  variant="outlined"
  size="large"
  onClick={() => navigate(-1)}
  sx={{ flex: { xs: 1, sm: 0 } }}
>
  ← Назад
</Button>

<Button
  variant="contained"
  size="large"
  component="a"
  href={telegramLink}
  target="_blank"
  rel="noopener noreferrer"
  sx={{ flex: { xs: 1, sm: 1 } }}
>
  Связаться в Telegram
</Button>
```

**Проблемы:**
- ❌ Код перегружен стилями
- ❌ Каждая кнопка стилизуется отдельно
- ❌ Нет consistency между компонентами
- ❌ Hard to maintain при росте проекта

---

## 📊 sx Prop vs Theme Customization vs styled()

### 1. **sx Prop** - Для one-off кастомизаций

**Когда использовать:**
- ✅ Быстрые inline кастомизации
- ✅ One-off компоненты (Navigation, уникальные layouts)
- ✅ Когда нужен width, height, margin для конкретного случая

**Когда НЕ использовать:**
- ❌ Large-scale или complex styling
- ❌ Reusable компоненты
- ❌ Когда нужна consistency across app

**Performance:**
- Runtime generation - slight performance impact
- Для <5 CSS properties разница незначительна
- Для 1,000 элементов overhead только 0.2ms per component

**Проблема consistency:**
> "You cannot have that consistency if you're relying heavily on the sx prop without manually copy/pasting exactly the same props"

### 2. **Theme Customization** - Для app-wide consistency

**Когда использовать:**
- ✅ Создание своей design system
- ✅ Consistency across всего приложения
- ✅ Центральная точка для styling
- ✅ Default props и styles для всех компонентов

**Как работает:**
```tsx
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium'
      },
      styleOverrides: {
        root: {
          // Стили для ВСЕХ кнопок
          minWidth: 100,
          padding: '8px 16px'
        },
        containedPrimary: {
          // Стили для variant="contained" color="primary"
          backgroundColor: '#custom-color'
        }
      },
      variants: [
        {
          props: { variant: 'dashed' },
          style: {
            border: '1px dashed gray'
          }
        }
      ]
    }
  }
})
```

**Преимущества:**
- ✅ Один файл - все стили
- ✅ Automatic consistency
- ✅ Better maintainability
- ✅ TypeScript support

### 3. **styled()** - Для reusable styled компонентов

**Когда использовать:**
- ✅ Reusable компоненты с tight coupling стилей
- ✅ Когда нужен full control над стилями
- ✅ Custom компоненты (не MUI базовые)

```tsx
import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const CustomButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}))
```

---

## 🎯 Best Practices 2025

### Иерархия подходов:

1. **Theme customization** (первый выбор)
   - Default props для всех компонентов
   - styleOverrides для base styles
   - variants для conditional styling

2. **styled()** (для custom компонентов)
   - Когда нужен tight coupling
   - Для reusable styled components

3. **sx prop** (последний выбор)
   - Только для quick inline adjustments
   - One-off customizations
   - Избегать overuse

### Цитата из best practices:
> "Avoid using sx for large-scale or complex styling that's better organized in styled() or custom components, and avoid overusing it for reusable components, as it can make it hard to maintain styles."

---

## 🔧 styleOverrides - Детали

### Структура:

```tsx
const theme = createTheme({
  components: {
    MuiComponentName: {
      styleOverrides: {
        slotName: {
          // CSS properties
        }
      }
    }
  }
})
```

**Slots:**
- `root` - targets outer-most element (самый используемый)
- Другие slots зависят от компонента (см. MUI docs)

### Доступ к theme в styleOverrides:

```tsx
styleOverrides: {
  root: ({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1)
    }
  })
}
```

### Conditional styling через variants:

```tsx
variants: [
  {
    props: { variant: 'dashed' },
    style: {
      border: '1px dashed gray'
    }
  },
  {
    props: { variant: 'dashed', color: 'secondary' },
    style: {
      border: '1px dashed blue'
    }
  }
]
```

**Variants как callback:**
```tsx
variants: [
  {
    props: (props) => props.variant === 'custom' && props.size === 'large',
    style: {
      fontSize: '2rem'
    }
  }
]
```

---

## 💡 Рефакторинг Plants Project

### Текущий подход (проблемный):

```tsx
// PlantDetailPage.tsx
<Button
  variant="outlined"
  size="large"
  onClick={() => navigate(-1)}
  sx={{ flex: { xs: 1, sm: 0 } }}
>
  ← Назад
</Button>

<Button
  variant="contained"
  size="large"
  component="a"
  href={telegramLink}
  sx={{ flex: { xs: 1, sm: 1 } }}
>
  Связаться
</Button>
```

**Проблемы:**
- Много повторяющихся sx
- Разные sizes (large, medium)
- Inconsistent spacing

### Рекомендуемый подход:

**1. Создать theme с defaults:**

```tsx
// webapp/src/theme/theme.ts
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
        size: 'large',
        disableElevation: true
      },
      styleOverrides: {
        root: ({ theme }) => ({
          minWidth: 120,
          padding: theme.spacing(1.5, 3),
          borderRadius: theme.spacing(1),
          textTransform: 'none', // НЕ КАПС
          fontWeight: 500
        }),
        sizeLarge: {
          padding: '12px 24px'
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 3
      }
    },
    MuiStack: {
      defaultProps: {
        spacing: 2
      }
    }
  },
  palette: {
    primary: {
      main: '#2e7d32' // Зеленый для растений
    }
  },
  spacing: 8 // 1 unit = 8px
})
```

**2. Обернуть App в ThemeProvider:**

```tsx
// webapp/src/main.tsx
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme/theme'

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

**3. Упрощенные компоненты:**

```tsx
// PlantDetailPage.tsx - ПОСЛЕ рефакторинга
<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
  <Button onClick={() => navigate(-1)}>
    ← Назад к каталогу
  </Button>

  <Button
    variant="contained"
    component="a"
    href={telegramLink}
  >
    Связаться в Telegram
  </Button>
</Stack>
```

**Результат:**
- ✅ Чистый код
- ✅ Consistency автоматически
- ✅ Меньше повторений
- ✅ Easy to maintain

---

## 🚀 План миграции для Plants Project

### Фаза 1: Setup theme

- [ ] Создать `webapp/src/theme/theme.ts`
- [ ] Настроить базовые компоненты (Button, Paper, Stack)
- [ ] Обернуть App в ThemeProvider

### Фаза 2: Рефакторинг компонентов

**Приоритет: ВЫСОКИЙ**
- [ ] PlantDetailPage - убрать sx, использовать theme
- [ ] AddPlantPage - убрать лишние sx
- [ ] PlantCard - consistency стилей
- [ ] Header, Footer - унифицировать

### Фаза 3: Cleanup

- [ ] Удалить избыточные sx props
- [ ] Проверить consistency визуально
- [ ] Update documentation

### Фаза 4: Advanced (опционально)

- [ ] Создать custom variants (если нужны)
- [ ] Dark mode support
- [ ] Responsive breakpoints fine-tuning

---

## 📚 Источники

- **MUI Official Docs:**
  - https://mui.com/material-ui/customization/theme-components/
  - https://mui.com/material-ui/customization/how-to-customize/
  - https://mui.com/material-ui/customization/theming/

- **Medium Articles:**
  - "Mastering Material UI Customization in React" by Sushmitha Dhummi Thrilochana (Stackademic)
  - "We're Too sx-y for Our Code" by Anthony Trama (ASHTech)
  - "How to Set Up Material-UI Theming" by bchirag

- **Stack Overflow:**
  - "Material-UI Styling Best Practices"
  - "Is there a performance difference between sx and makeStyles?"
  - "When should I use style instead of sx prop?"

- **Other:**
  - Headway blog: "Global CSS - Material-UI Theme Overrides"
  - DEV Community: Material UI Customization TypeScript

---

## 💭 Выводы и рекомендации

### Для Plants Project:

**Текущая проблема:**
- ✅ Исследование подтвердило: sx overuse = bad practice
- ✅ Код действительно перегружен
- ✅ Нет consistency между компонентами

**Решение:**
1. **Создать theme.ts** с default props и styleOverrides
2. **Рефакторить компоненты** - убрать большинство sx
3. **Оставить sx** только для truly one-off cases

**Приоритет:** ВЫСОКИЙ (после MVP, но до production)

**Оценка времени:** 2-3 часа
- 1 час - setup theme
- 1-2 часа - рефакторинг компонентов

**Польза:**
- 🎨 Consistency across app
- 🧹 Cleaner code
- 🔧 Easier maintenance
- 🚀 Better performance (fewer runtime styles)

---

## 🔗 Связь с MUI MCP

После создания theme будет проще работать с MUI MCP сервером:
- Claude Code сможет лучше предлагать MUI компоненты
- Меньше hallucinations про несуществующие props
- Better understanding MUI patterns

См. также: [MCP_RESEARCH.md](MCP_RESEARCH.md) - секция про MUI MCP сервер
