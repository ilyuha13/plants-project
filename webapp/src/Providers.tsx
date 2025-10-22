import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './lib/ctx'
import { TrpcProvider } from './lib/trpc'
import { theme } from './theme/theme'

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
      </AppContextProvider>
    </TrpcProvider>
  )
}
