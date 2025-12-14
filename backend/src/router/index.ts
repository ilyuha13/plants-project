import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { addGenusTrpcRoute } from './addGenus'
import { addLifeFormTrpcRoute } from './addLifeForm'
import { addPlantTrpcRoute } from './addPlant'
import { addPlantInstanceTrpcRoute } from './addPlantInstance'
import { addVariegationTrpcRoute } from './addVariegation'
import { deleteUserTrpcRoute } from './admin/deleteUser'
import { generatePasswordResetTokenTrpcRoute } from './admin/generatePasswordResetToken'
import { getAllUsersTrpcRoute } from './admin/getAllUsers'
import { resetUserPasswordTrpcRoute } from './admin/resetUserPassword'
import { addToCartTrpcRoute } from './cart/addToCart'
import { checkoutTrpcRoute } from './cart/checkout'
import { clearCartTrpcRoute } from './cart/clearCart'
import { getCartTrpcRoute } from './cart/getCart'
import { removeFromCartTrpcRoute } from './cart/removeFromCart'
import { deleteGenusTrpcRoute } from './deleteGenus'
import { deleteLifeFormTrpcRoute } from './deleteLifeForm'
import { deletePlantTrpcRoute } from './deletePlant'
import { deletePlantInstanceTrpcRoute } from './deletePlantInstance'
import { deleteVariegationTrpcRoute } from './deleteVariegation'
import { getGenusTrpcRoute } from './getGenus'
import { getGenusByIdTrpcRoute } from './getGenusById'
import { getLifeFormTrpcRoute } from './getLifeForm'
import { getLifeFormByIdTrpcRoute } from './getLifeFormById'
import { getMeTrpcRoute } from './getMe'
import { getPlantTrpcRoute } from './getPlant'
import { getPlantInstanceTrpcRoute } from './getPlantInstance'
import { getPlantInstancesTrpcRoute } from './getPlantInstances'
import { getPlantsTrpcRoute } from './getPlants'
import { getUploadSignatureTrpcRoute } from './getUploadSignature'
import { getVariegationTrpcRoute } from './getVariegation'
import { getVariegationByIdTrpcRoute } from './getVariegationById'
import { requestPasswordResetTrpcRoute } from './requestPasswordReset'
import { resetPasswordWithTokenTrpcRoute } from './resetPasswordWithToken'
import { signInTrpcRoute } from './signIn'
import { signUpTrpcRoute } from './signUp'
// @endindex
import { trpc } from '../lib/trpc'

export const trpcRouter = trpc.router({
  //@index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  addGenus: addGenusTrpcRoute,
  addLifeForm: addLifeFormTrpcRoute,
  addPlant: addPlantTrpcRoute,
  addPlantInstance: addPlantInstanceTrpcRoute,
  addVariegation: addVariegationTrpcRoute,
  addToCart: addToCartTrpcRoute,
  checkout: checkoutTrpcRoute,
  clearCart: clearCartTrpcRoute,
  getCart: getCartTrpcRoute,
  removeFromCart: removeFromCartTrpcRoute,
  deletePlant: deletePlantTrpcRoute,
  deletePlantInstance: deletePlantInstanceTrpcRoute,
  deleteGenus: deleteGenusTrpcRoute,
  deleteVariegation: deleteVariegationTrpcRoute,
  deleteLifeForm: deleteLifeFormTrpcRoute,
  getGenus: getGenusTrpcRoute,
  getGenusById: getGenusByIdTrpcRoute,
  getLifeForm: getLifeFormTrpcRoute,
  getLifeFormById: getLifeFormByIdTrpcRoute,
  getMe: getMeTrpcRoute,
  getPlant: getPlantTrpcRoute,
  getPlantInstance: getPlantInstanceTrpcRoute,
  getPlantInstances: getPlantInstancesTrpcRoute,
  getPlants: getPlantsTrpcRoute,
  getUploadSignature: getUploadSignatureTrpcRoute,
  getVariegation: getVariegationTrpcRoute,
  getVariegationById: getVariegationByIdTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  //@endindex

  // Admin routes
  getAllUsers: getAllUsersTrpcRoute,
  deleteUser: deleteUserTrpcRoute,
  resetUserPassword: resetUserPasswordTrpcRoute,
  generatePasswordResetToken: generatePasswordResetTokenTrpcRoute,

  // Public routes
  resetPasswordWithToken: resetPasswordWithTokenTrpcRoute,
  requestPasswordReset: requestPasswordResetTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
