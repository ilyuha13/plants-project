import { Outlet, Route, Routes } from 'react-router-dom'

import { Cart } from './components/Cart/Cart'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { Menu } from './components/Menu/Menu'
import { useCartSync } from './hooks/useCartSync'
import { Layout } from './layout/Layout'
import * as routes from './lib/routes'
import { AddGenusPage } from './pages/AddGenusPage/AddGenusPage'
import { AddLifeFormPage } from './pages/AddLifeFormPage/AddLifeFormPage'
import { AddPlantInstancePage } from './pages/AddPlantInstancePage/AddPlantInstancePage'
import { AddPlantPage } from './pages/AddPlantPage/AddPlantPage'
import { AddVariegationPage } from './pages/AddVariegationPage/AddVariegationPage'
import { AdminPage } from './pages/AdminPage/AdminPage'
import { AllInstancePage } from './pages/AllInstancePage/AllInstancePage'
import { AllPlantsPage } from './pages/AllPlantsPage/AllPlantsPage'
import { CatalogPage } from './pages/CatalogPage/CatalogPage'
import { GenusDetailPage } from './pages/GenusDetailPage/GenusDetailPage'
import { InstanceDetailPage } from './pages/InstanceDetailPage/InstanceDetailPage'
import { LifeFormDetailPage } from './pages/LifeFormDetailPage/LifeFormDetailPage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'
import { PlantDetailPage } from './pages/PlantDetailPage/PlantDetailPage'
import { PlantsListPage } from './pages/PlantsListPage/PlantsListPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage/ResetPasswordPage'
import { SignUpPage } from './pages/SignUp/SignUpPage'
import { VariegationDetailPage } from './pages/VariegationDetailPage/VariegationDetailPage'
import { SignInPage } from './pages/signInPage/SignInPage'
import { SignOutPage } from './pages/signOutPage/SignOutPage'

export const App = () => {
  // Синхронизация корзины с сервером
  useCartSync()

  return (
    <Routes>
      <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
      <Route
        element={
          <Layout
            header={<Header />}
            mainContent={<Outlet />}
            menu={<Menu />}
            cart={<Cart />}
            footer={<Footer />}
          />
        }
      >
        <Route path={routes.getPlantsListRoute()} element={<PlantsListPage />} />
        <Route path={routes.getAddPlantPageRoute()} element={<AddPlantPage />} />
        <Route
          path={routes.getPlantDetailRoute(routes.plantDetailRouteParams)}
          element={<PlantDetailPage />}
        />
        <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
        <Route path={routes.getSignInRoute()} element={<SignInPage />} />
        <Route path={routes.getResetPasswordRoute()} element={<ResetPasswordPage />} />
        <Route
          path={routes.getAddPlantInstsancePageRoute()}
          element={<AddPlantInstancePage />}
        />
        <Route
          path={routes.getInstanceDetailRoute(routes.instanceDetailRouteParams)}
          element={<InstanceDetailPage />}
        />
        <Route path={routes.getAddGenusPageRoute()} element={<AddGenusPage />} />
        <Route
          path={routes.getGenusDetailRoute(routes.genusDetailRouteParams)}
          element={<GenusDetailPage />}
        />
        <Route path={routes.getAddLifeFormPageRoute()} element={<AddLifeFormPage />} />
        <Route
          path={routes.getLifeFormDetailRoute(routes.lifeFormDetailRouteParams)}
          element={<LifeFormDetailPage />}
        />
        <Route
          path={routes.getAddVariegationPageRoute()}
          element={<AddVariegationPage />}
        />
        <Route
          path={routes.getVariegationDetailRoute(routes.variegationDetailRouteParams)}
          element={<VariegationDetailPage />}
        />
        <Route path={routes.getAdminPageRoute()} element={<AdminPage />} />
        <Route path={routes.getCatalogPageRoute()} element={<CatalogPage />} />
        <Route path={routes.getAllInstancePageRoute()} element={<AllInstancePage />} />
        <Route path={routes.getAllPlantsPageRoute()} element={<AllPlantsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
