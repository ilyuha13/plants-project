import { createTheme } from '@mui/material'
import { green, orange, purple, yellow } from '@mui/material/colors'

export const theme = (currentTheme: 'dark' | 'light') =>
  createTheme({
    palette: {
      primary: {
        main: currentTheme === 'dark' ? purple[500] : orange[500],
      },
      secondary: {
        main: currentTheme === 'dark' ? green[500] : yellow[500],
      },
      background: {
        default: currentTheme === 'dark' ? '#000' : '#fff',
      },
    },
    components: {
      MuiButton: { defaultProps: { disableRipple: true } },
    },
  })
