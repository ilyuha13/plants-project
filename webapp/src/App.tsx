import { ThemeProvider } from '@mui/material'
import { DialogsProvider } from '@toolpad/core/useDialogs'
import { observer } from 'mobx-react-lite'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AppContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AddCategory } from './pages/AddCategory/AddCategory'
import { AddPlantPage } from './pages/AddPlantPage/AddPlantPage'
import { EditPlantPage } from './pages/EditPlantPage/EditPlantPage'
import { PlantProfile } from './pages/PlantProfile/PlantProfile'
import { PlantsList } from './pages/PlantsList/PlantsList'
import { SignUpPage } from './pages/SignUp/SignUpPage'
import { SignInPage } from './pages/signInPage/SignInPage'
import { SignOutPage } from './pages/signOutPage/SignOutPage'
import { useAppStore } from './store/AppStoreProvider'
import { theme } from './utils/theme/Theme'
import './styles/global.scss'

export const App = observer(() => {
  const themeState = useAppStore()
  return (
    <TrpcProvider>
      <AppContextProvider>
        <ThemeProvider theme={theme(themeState.curentTheme)}>
          <DialogsProvider>
            <BrowserRouter>
              <Routes>
                <Route path={routes.getSignOutRout()} element={<SignOutPage />} />
                <Route element={<Layout />}>
                  <Route path={routes.getPlantsListRoute()} element={<PlantsList />} />
                  <Route path={routes.getAddPlantPageRoute()} element={<AddPlantPage />} />
                  <Route path={routes.getPlantProfileRoute({ plantId: ':plantId' })} element={<PlantProfile />} />
                  <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
                  <Route path={routes.getSignInRoute()} element={<SignInPage />} />
                  <Route path={routes.getAddCategoriesRoute()} element={<AddCategory />} />
                  <Route path={routes.getEditPlantRoute({ plantId: ':plantId' })} element={<EditPlantPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </DialogsProvider>
        </ThemeProvider>
      </AppContextProvider>
    </TrpcProvider>
  )
})
