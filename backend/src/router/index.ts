import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { addCategoriesTrpcRoute } from './addCategories'
import { addPlantTrpcRoute } from './addPlant'
import { getCategoriesTrpcRoute } from './getCategories'
import { getMeTrpcRoute } from './getMe'
import { getPlantTrpcRoute } from './getPlant'
import { getPlantsTrpcRoute } from './getPlants'
import { signInTrpcRoute } from './signIn'
import { signUpTrpcRoute } from './signUp'
import { updatePlantTrpcRoute } from './updatePlant'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  addCategories: addCategoriesTrpcRoute,
  addPlant: addPlantTrpcRoute,
  getCategories: getCategoriesTrpcRoute,
  getMe: getMeTrpcRoute,
  getPlant: getPlantTrpcRoute,
  getPlants: getPlantsTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updatePlant: updatePlantTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
