const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getPlantsListRoute = () => '/'

export const plantProfileRouteParams = getRouteParams({ plantId: true })

export type TplantProfileRouteParams = typeof plantProfileRouteParams
export const getPlantProfileRoute = ({ plantId }: TplantProfileRouteParams) => `/plantProfile/${plantId}`

export const getAddPlantPageRoute = () => '/plants/add'
