import { ThemeProvider } from '@mui/material'
import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { getPlantProfileRoute, getPlantsListRoute } from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { PlantProfile } from './pages/PlantProfile/PlantProfile'
import { PlantsList } from './pages/PlantsList/PlantsList'
import { theme } from './utils/theme/Theme'

export const App = () => {
  const [currentTheme, changeCurrentTheme] = useState<'light' | 'dark'>('light')

  return (
    <TrpcProvider>
      <ThemeProvider theme={theme(currentTheme)}>
        <BrowserRouter>
          <Routes>
            <Route
              path={getPlantsListRoute()}
              element={<PlantsList currentTheme={currentTheme} changeCurrentTheme={changeCurrentTheme} />}
            />
            <Route
              path={getPlantProfileRoute({ plantId: ':plantId' })}
              element={<PlantProfile currentTheme={currentTheme} changeCurrentTheme={changeCurrentTheme} />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TrpcProvider>
  )
}
