import { Outlet, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { Layout } from './layout/Layout'
import * as routes from './lib/routes'
import { AddPlantInstancePage } from './pages/AddPlantInstancePage/AddPlantInstancePage'
import { AddPlantPage } from './pages/AddPlantPage/AddPlantPage'
import { PlantDetailPage } from './pages/PlantDetailPage/PlantDetailPage'
import { PlantsListPage } from './pages/PlantsListPage/PlantsListPage'
import { SignUpPage } from './pages/SignUp/SignUpPage'
import { SignInPage } from './pages/signInPage/SignInPage'
import { SignOutPage } from './pages/signOutPage/SignOutPage'

export const App = () => {
  return (
    <Routes>
      <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
      <Route element={<Layout header={<Header />} mainContent={<Outlet />} footer={<Footer />} />}>
        <Route path={routes.getPlantsListRoute()} element={<PlantsListPage />} />
        <Route path={routes.getAddPlantPageRoute()} element={<AddPlantPage />} />
        <Route path={routes.getPlantDetailRoute()} element={<PlantDetailPage />} />
        <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
        <Route path={routes.getSignInRoute()} element={<SignInPage />} />
        <Route path={routes.getAddPlantInstsancePageRoute()} element={<AddPlantInstancePage />} />
      </Route>
    </Routes>
  )
}
