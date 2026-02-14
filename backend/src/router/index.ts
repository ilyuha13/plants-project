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
import { getCartTrpcRoute } from './cart/getCart'
import { removeFromCartTrpcRoute } from './cart/removeFromCart'
import { deleteGenusTrpcRoute } from './deleteGenus'
import { deleteLifeFormTrpcRoute } from './deleteLifeForm'
import { deletePlantTrpcRoute } from './deletePlant'
import { deletePlantInstanceTrpcRoute } from './deletePlantInstance'
import { deleteVariegationTrpcRoute } from './deleteVariegation'
import { editGenusTrpcRoute } from './editGenus'
import { editLifeFormTrpcRoute } from './editLifeForm'
import { editPlantTrpcRoute } from './editPlant'
import { editPlantInstanceTrpcRoute } from './editPlantInstance'
import { editVariegationTrpcRoute } from './editVariegation'
import { getAllInstancesTrpcRoute } from './getAllInstances'
import { getGenusTrpcRoute } from './getGenus'
import { getGenusByIdTrpcRoute } from './getGenusById'
import { getLifeFormTrpcRoute } from './getLifeForm'
import { getLifeFormByIdTrpcRoute } from './getLifeFormById'
import { getMeTrpcRoute } from './getMe'
import { getOrderTrpcRoute } from './getOrder'
import { getOrdersTrpcRoute } from './getOrders'
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
import { createTrpcRouter } from '../lib/trpc'

export const trpcRouter = createTrpcRouter({
  //@index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  addGenus: addGenusTrpcRoute,
  addLifeForm: addLifeFormTrpcRoute,
  addPlant: addPlantTrpcRoute,
  addPlantInstance: addPlantInstanceTrpcRoute,
  addVariegation: addVariegationTrpcRoute,
  deleteUser: deleteUserTrpcRoute,
  generatePasswordResetToken: generatePasswordResetTokenTrpcRoute,
  getAllUsers: getAllUsersTrpcRoute,
  resetUserPassword: resetUserPasswordTrpcRoute,
  addToCart: addToCartTrpcRoute,
  checkout: checkoutTrpcRoute,
  getCart: getCartTrpcRoute,
  removeFromCart: removeFromCartTrpcRoute,
  deleteGenus: deleteGenusTrpcRoute,
  deleteLifeForm: deleteLifeFormTrpcRoute,
  deletePlant: deletePlantTrpcRoute,
  deletePlantInstance: deletePlantInstanceTrpcRoute,
  deleteVariegation: deleteVariegationTrpcRoute,
  editGenus: editGenusTrpcRoute,
  editLifeForm: editLifeFormTrpcRoute,
  editPlant: editPlantTrpcRoute,
  editPlantInstance: editPlantInstanceTrpcRoute,
  editVariegation: editVariegationTrpcRoute,
  getAllInstances: getAllInstancesTrpcRoute,
  getGenus: getGenusTrpcRoute,
  getGenusById: getGenusByIdTrpcRoute,
  getLifeForm: getLifeFormTrpcRoute,
  getLifeFormById: getLifeFormByIdTrpcRoute,
  getMe: getMeTrpcRoute,
  getOrder: getOrderTrpcRoute,
  getOrders: getOrdersTrpcRoute,
  getPlant: getPlantTrpcRoute,
  getPlantInstance: getPlantInstanceTrpcRoute,
  getPlantInstances: getPlantInstancesTrpcRoute,
  getPlants: getPlantsTrpcRoute,
  getUploadSignature: getUploadSignatureTrpcRoute,
  getVariegation: getVariegationTrpcRoute,
  getVariegationById: getVariegationByIdTrpcRoute,
  requestPasswordReset: requestPasswordResetTrpcRoute,
  resetPasswordWithToken: resetPasswordWithTokenTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  //@endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
