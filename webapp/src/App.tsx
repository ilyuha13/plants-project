import { Outlet, Route, Routes } from 'react-router-dom'

import { Cart } from './components/Cart/Cart'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { useCartSync } from './hooks/useCartSync'
import { Layout } from './layout/Layout'
import * as routes from './lib/routes'
import { AddPlantInstancePage } from './pages/AddPlantInstancePage/AddPlantInstancePage'
import { AddPlantPage } from './pages/AddPlantPage/AddPlantPage'
import { InstanceDetailPage } from './pages/InstanceDetailPage/InstanceDetailPage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'
import { PlantDetailPage } from './pages/PlantDetailPage/PlantDetailPage'
import { PlantsListPage } from './pages/PlantsListPage/PlantsListPage'
import { SignUpPage } from './pages/SignUp/SignUpPage'
import { SignInPage } from './pages/signInPage/SignInPage'
import { SignOutPage } from './pages/signOutPage/SignOutPage'

export const App = () => {
  // Синхронизация корзины с сервером
  useCartSync()

  return (
    <Routes>
      <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
      <Route element={<Layout header={<Header />} mainContent={<Outlet />} cart={<Cart />} footer={<Footer />} />}>
        <Route path={routes.getPlantsListRoute()} element={<PlantsListPage />} />
        <Route path={routes.getAddPlantPageRoute()} element={<AddPlantPage />} />
        <Route path={routes.getPlantDetailRoute()} element={<PlantDetailPage />} />
        <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
        <Route path={routes.getSignInRoute()} element={<SignInPage />} />
        <Route path={routes.getAddPlantInstsancePageRoute()} element={<AddPlantInstancePage />} />
        <Route path={routes.getInstanceDetailRoute()} element={<InstanceDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
