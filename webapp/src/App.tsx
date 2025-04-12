import { ThemeProvider } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AddPlantPage } from './pages/AddPlantPage/AddPlantPage'
import { PlantProfile } from './pages/PlantProfile/PlantProfile'
import { PlantsList } from './pages/PlantsList/PlantsList'
import { useAppStore } from './store/AppStoreProvider'
import { theme } from './utils/theme/Theme'
import './styles/global.scss'

export const App = observer(() => {
  const themeState = useAppStore()
  return (
    <TrpcProvider>
      <ThemeProvider theme={theme(themeState.curentTheme)}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path={routes.getPlantsListRoute()} element={<PlantsList />} />
              <Route path={routes.getAddPlantPageRoute()} element={<AddPlantPage />} />
              <Route path={routes.getPlantProfileRoute({ plantId: ':plantId' })} element={<PlantProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TrpcProvider>
  )
})
