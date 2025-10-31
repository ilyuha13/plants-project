export const getPlantsListRoute = () => '/'

export const getAddPlantPageRoute = () => '/plants/add'

export const getPlantDetailRoute = (plantId?: string) => (plantId ? `/plants/${plantId}` : '/plants/:plantId')

export const getSignUpRoute = () => '/singUp'

export const getSignInRoute = () => '/signIn'

export const getSignOutRoute = () => '/signOut'

export const getAddPlantInstsancePageRoute = () => '/plants/instance/add'

export const getInstanceDetailRoute = (instanceId?: string) =>
  instanceId ? `/plants/instance/${instanceId}` : '/plants/instance/:instanceId'
