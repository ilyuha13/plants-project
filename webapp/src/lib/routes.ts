const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getCatalogPageRoute = () => '/'

export const getPlantsListRoute = () => '/plantsList'

export const getAddPlantPageRoute = () => '/plants/add'

export const plantDetailRouteParams = getRouteParams({ plantId: true })
export type PlantDetailRouteParams = typeof plantDetailRouteParams
export const getPlantDetailRoute = ({ plantId }: PlantDetailRouteParams) => `/plants/${plantId}`

export const getSignUpRoute = () => '/singUp'

export const getSignInRoute = () => '/signIn'

export const getSignOutRoute = () => '/signOut'

export const getResetPasswordRoute = () => '/reset-password'

export const getAddPlantInstsancePageRoute = () => '/plants/instance/add'

export const instanceDetailRouteParams = getRouteParams({ instanceId: true })
export type InstanceDetailRouteParams = typeof instanceDetailRouteParams
export const getInstanceDetailRoute = ({ instanceId }: InstanceDetailRouteParams) => `/plants/instance/${instanceId}`

export const getAddGenusPageRoute = () => '/genus/add'

export const genusDetailRouteParams = getRouteParams({ genusId: true })
export type GenusDetailRouteParams = typeof genusDetailRouteParams
export const getGenusDetailRoute = ({ genusId }: GenusDetailRouteParams) => `/genus/${genusId}`

export const getAddVariegationPageRoute = () => '/variegation/add'

export const variegationDetailRouteParams = getRouteParams({ variegationId: true })
export type VariegationDatailRouteParams = typeof variegationDetailRouteParams
export const getVariegationDetailRoute = ({ variegationId }: VariegationDatailRouteParams) =>
  `/variegation/${variegationId}`

export const getAddLifeFormPageRoute = () => '/lifeForm/add'
export const lifeFormDetailRouteParams = getRouteParams({ lifeFormId: true })
export type LifeFormDetailRouteParams = typeof lifeFormDetailRouteParams
export const getLifeFormDetailRoute = ({ lifeFormId }: LifeFormDetailRouteParams) => `/lifeForm/${lifeFormId}`

export const getAdminPageRoute = () => '/admin'
