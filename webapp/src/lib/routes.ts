const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getPlantsListRoute = () => '/'

export const plantProfileRouteParams = getRouteParams({ plantId: true })
export type TplantProfileRouteParams = typeof plantProfileRouteParams
export const getPlantProfileRoute = ({ plantId }: TplantProfileRouteParams) => `/plantProfile/${plantId}`

export const editPlantParams = getRouteParams({ plantId: true })
export type TeditPlantParams = typeof editPlantParams
export const getEditPlantRoute = ({ plantId }: TeditPlantParams) => `/plants/${plantId}/edit`

export const getAddPlantPageRoute = () => '/plants/add'

export const getSignUpRoute = () => '/singUp'

export const getSignInRoute = () => '/signIn'

export const getSignOutRout = () => '/signOut'

export const getAddCategoriesRoute = () => '/addCategories'
