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

export const editVariegationRouteParams = getRouteParams({ variegationId: true })
export type EditVariegationRouteParams = typeof editVariegationRouteParams
export const getEditVariegationRoute = ({ variegationId }: EditVariegationRouteParams) =>
  `/variegation/edit/${variegationId}`

export const editPlantRouteParams = getRouteParams({ plantId: true })
export type EditPlantRouteParams = typeof editPlantRouteParams
export const getEditPlantRoute = ({ plantId }: EditPlantRouteParams) => `/plants/edit/${plantId}`

export const editGenusRouteParams = getRouteParams({ genusId: true })
export type EditGenusRouteParams = typeof editGenusRouteParams
export const getEditGenusRoute = ({ genusId }: EditGenusRouteParams) => `/genus/edit/${genusId}`

export const editLifeFormRouteParams = getRouteParams({ lifeFormId: true })
export type EditLifeFormRouteParams = typeof editLifeFormRouteParams
export const getEditLifeFormRoute = ({ lifeFormId }: EditLifeFormRouteParams) => `/lifeForm/edit/${lifeFormId}`

export const editPlantInstanceRouteParams = getRouteParams({ instanceId: true })
export type EditPlantInstanceRouteParams = typeof editPlantInstanceRouteParams
export const getEditPlantInstanceRoute = ({ instanceId }: EditPlantInstanceRouteParams) =>
  `/instances/edit/${instanceId}`

export const getAdminPageRoute = () => '/admin'
