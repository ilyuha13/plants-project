import { Outlet, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { Layout } from './layout/Layout'
import * as routes from './lib/routes'
//import { AddCategory } from './pages/AddCategory/AddCategory'
//import { AddPlantPage } from './pages/AddPlantInstancePage/AddPlantInstancePage'
//import { EditPlantPage } from './pages/EditPlantPage/EditPlantPage'
//import { PlantProfile } from './pages/PlantProfile/PlantProfile'
import { PlantsList } from './pages/PlantsList/PlantsList'
import { SignUpPage } from './pages/SignUp/SignUpPage'
import { SignInPage } from './pages/signInPage/SignInPage'
import { SignOutPage } from './pages/signOutPage/SignOutPage'
// eslint-disable-next-line import/order
import { AddSpeciesPage } from './pages/AddSpeciesPage/AddSpeciesPage'

export const App = () => {
  return (
    <Routes>
      <Route path={routes.getSignOutRout()} element={<SignOutPage />} />
      <Route element={<Layout header={<Header />} mainContent={<Outlet />} footer={<Footer />} />}>
        <Route path={routes.getPlantsListRoute()} element={<PlantsList />} />
        {/* <Route path={routes.getAddPlantPageRoute()} element={<AddPlantPage />} /> */}
        {/* <Route path={routes.getPlantProfileRoute({ plantId: ':plantId' })} element={<PlantProfile />} /> */}
        <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
        <Route path={routes.getSignInRoute()} element={<SignInPage />} />
        {/* <Route path={routes.getAddCategoriesRoute()} element={<AddCategory />} /> */}
        {/* <Route path={routes.getEditPlantRoute({ plantId: ':plantId' })} element={<EditPlantPage />} /> */}
        <Route path={routes.getAddSpeciesPageRoute()} element={<AddSpeciesPage />} />
      </Route>
    </Routes>
  )
}
