import { createTheme } from '@mui/material'
import { alpha } from '@mui/material'
import { green, orange, purple, yellow } from '@mui/material/colors'

const violetBase = '#7F00FF'

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
        default: currentTheme === 'dark' ? alpha(violetBase, 0.9) : alpha(violetBase, 0.3),
      },
    },
    components: {
      MuiButton: { defaultProps: { disableRipple: true } },
    },
  })
