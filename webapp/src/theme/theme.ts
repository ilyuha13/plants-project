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
    fontFamily: ['Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),

    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    // Заголовки
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

    // Основной текст
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
    },

    // Кнопки
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      textTransform: 'none', // Отключаем UPPERCASE для всех кнопок
      letterSpacing: '0.02em',
    },

    // Подписи
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.4,
    },

    // Дополнительно
    subtitle1: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.5,
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
          borderRadius: theme.shape.borderRadius * 0.5, // Берем из theme.shape.borderRadius (8px * 0.5 = 4px)
          fontWeight: 500,
          padding: '10px 24px',
          // Для анимации children при hover
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
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '& > *': {
            transition: 'transform 0.2s ease',
          },
          '&:hover > *': {
            transform: 'scale(1.1)',
          },
        }),
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
