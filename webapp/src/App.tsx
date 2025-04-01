import { ThemeProvider } from '@mui/material'
import { Header } from './components/Header/Header'
import { TrpcProvider } from './lib/trpc'
import { PlantsList } from './pages/PlantsList/PlantsList'
import { theme } from './utils/theme/Theme'
import { useState } from 'react'

export const App = () => {
  const [currentTheme, changeCurrentTheme] = useState<'light' | 'dark'>('light')

  return (
    <TrpcProvider>
      <ThemeProvider theme={theme(currentTheme)}>
        <Header currentTheme={currentTheme} changeCurrentTheme={changeCurrentTheme} />
        <PlantsList />
      </ThemeProvider>
    </TrpcProvider>
  )
}
