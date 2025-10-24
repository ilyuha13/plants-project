import { createTheme } from '@mui/material'

export const theme = createTheme({
  // Базовые настройки темы
  spacing: 8, // Базовая единица отступов (8px)
  shape: {
    borderRadius: 8, // Глобальный border-radius для Paper и других компонентов
  },

  // Палитра цветов
  palette: {
    primary: {
      main: '#5A806F', // Зеленый для растений
    },
    background: {
      default: '#9ED1BA', // Светло-зеленый фон
      paper: '#f5f5f5',
    },
  },

  // Типографика
  typography: {
    button: {
      textTransform: 'none', // Отключаем UPPERCASE для всех кнопок
      fontWeight: 500, // Средняя жирность текста
    },
  },

  // Настройки компонентов
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },

    MuiButton: {
      defaultProps: {
        color: 'primary',
        variant: 'contained',
        size: 'large', // По умолчанию крупные кнопки
      },
      styleOverrides: {
        root: {
          borderRadius: 1, // 1 * 8px = 8px (как у Paper)
          fontWeight: 500,
          padding: '10px 24px',
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
        sizeMedium: {
          padding: '8px 20px',
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 3, // По умолчанию средняя тень
      },
      styleOverrides: {
        root: {
          // borderRadius наследуется из shape.borderRadius (8px)
        },
        elevation3: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Более мягкая тень
        },
      },
    },

    MuiStack: {
      defaultProps: {
        spacing: 2, // По умолчанию 16px (2 * 8px) между элементами
      },
    },
  },
})
