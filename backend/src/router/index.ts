import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { deletePlantInstanceTrpcRoute } from './DeletePlantInstance'
import { addPlantTrpcRoute } from './addPlant'
import { addPlantInstanceTrpcRoute } from './addPlantInstance'
import { addToCartTrpcRoute, checkoutTrpcRoute, clearCartTrpcRoute, getCartTrpcRoute, removeFromCartTrpcRoute } from './cart'
import { deletePlantTrpcRoute } from './deletePlant'
import { getMeTrpcRoute } from './getMe'
import { getPlantTrpcRoute } from './getPlant'
import { getPlantInstanceTrpcRoute } from './getPlantInstance/getPlantinstance'
import { getPlantsTrpcRoute } from './getPlants'
import { signInTrpcRoute } from './signIn'
import { signUpTrpcRoute } from './signUp'
import { trpc } from '../lib/trpc'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  addPlant: addPlantTrpcRoute,
  addPlantInstance: addPlantInstanceTrpcRoute,
  addToCart: addToCartTrpcRoute,
  checkout: checkoutTrpcRoute,
  clearCart: clearCartTrpcRoute,
  deletePlant: deletePlantTrpcRoute,
  deletePlantInstance: deletePlantInstanceTrpcRoute,
  getCart: getCartTrpcRoute,
  getMe: getMeTrpcRoute,
  getPlant: getPlantTrpcRoute,
  getPlantInstance: getPlantInstanceTrpcRoute,
  getPlants: getPlantsTrpcRoute,
  removeFromCart: removeFromCartTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
