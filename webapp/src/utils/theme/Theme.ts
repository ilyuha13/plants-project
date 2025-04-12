import { createTheme } from '@mui/material'
import { alpha } from '@mui/material'
import { grey, orange, yellow } from '@mui/material/colors'

const violetBase = '#7F00FF'

declare module '@mui/material/styles' {
  interface Palette {
    custom: Palette['primary']
  }

  interface PaletteOptions {
    custom?: PaletteOptions['primary']
  }
}

export const theme = (currentTheme: 'dark' | 'light') =>
  createTheme({
    palette: {
      custom: {},
      primary: {
        main: currentTheme === 'light' ? '#fff' : orange[500],
      },
      secondary: {
        main: currentTheme === 'light' ? grey[700] : yellow[500],
      },
      background: {
        default: currentTheme === 'light' ? alpha(violetBase, 0.9) : alpha(violetBase, 0.3),
      },
    },
    components: {
      MuiButton: { defaultProps: { disableRipple: true } },
    },
  })
