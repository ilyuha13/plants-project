import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#5A806F',
    },
    secondary: {
      main: '#7BF4F5',
    },
    background: {
      default: '#9ED1BA',
      paper: '#f5f5f5',
    },
  },
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
      },
    },
  },
})
