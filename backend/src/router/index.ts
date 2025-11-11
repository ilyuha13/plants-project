import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { addPlantTrpcRoute } from './addPlant'
import { addPlantInstanceTrpcRoute } from './addPlantInstance'
import { addToCartTrpcRoute } from './cart/addToCart'
import { checkoutTrpcRoute } from './cart/checkout'
import { clearCartTrpcRoute } from './cart/clearCart'
import { getCartTrpcRoute } from './cart/getCart'
import { removeFromCartTrpcRoute } from './cart/removeFromCart'
import { deletePlantTrpcRoute } from './deletePlant'
import { deletePlantInstanceTrpcRoute } from './deletePlantInstance'
import { getMeTrpcRoute } from './getMe'
import { getPlantTrpcRoute } from './getPlant'
import { getPlantInstanceTrpcRoute } from './getPlantInstance'
import { getPlantInstancesTrpcRoute } from './getPlantInstances'
import { getPlantsTrpcRoute } from './getPlants'
import { getUploadSignatureTrpcRoute } from './getUploadSignature'
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
  getCart: getCartTrpcRoute,
  removeFromCart: removeFromCartTrpcRoute,
  deletePlant: deletePlantTrpcRoute,
  deletePlantInstance: deletePlantInstanceTrpcRoute,
  getMe: getMeTrpcRoute,
  getPlant: getPlantTrpcRoute,
  getPlantInstance: getPlantInstanceTrpcRoute,
  getPlantInstances: getPlantInstancesTrpcRoute,
  getPlants: getPlantsTrpcRoute,
  getUploadSignature: getUploadSignatureTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
