import { createTheme } from '@mui/material'

export const theme = createTheme({
  // Базовые настройки темы
  shape: {
    borderRadius: 8, // Глобальный border-radius (дефолт MUI = 4)
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
    fontFamily: ['Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),

    // Заголовки (кастомные размеры)
    h1: {
      fontSize: '2.5rem', // 40px
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem', // 32px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem', // 28px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.4,
    },

    // Кнопки
    button: {
      textTransform: 'none', // Отключаем UPPERCASE (дефолт = 'uppercase')
    },

    // Дополнительно
    subtitle1: {
      fontWeight: 500, // Дефолт = 400
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
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius * 0.5, // 8px * 0.5 = 4px
          padding: '10px 24px',
          // Анимация children при hover
          '& > *': {
            transition: 'transform 0.2s ease',
          },
          '&:hover > *': {
            transform: 'scale(1.02)',
          },
        }),
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
        sizeMedium: {
          padding: '8px 20px',
        },
        // Отдельные стили для текстовых кнопок
        text: {
          padding: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        textSizeLarge: {
          padding: '6px 12px',
        },
        textSizeMedium: {
          padding: '4px 8px',
        },
      },
    },

    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          '& > *': {
            transition: 'transform 0.2s ease',
          },
          '&:hover > *': {
            transform: 'scale(1.1)',
            color: theme.palette.primary.dark,
          },
        }),
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 3, // По умолчанию средняя тень
      },
      styleOverrides: {
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
