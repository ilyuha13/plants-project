import { zNonemptyString } from '@plants-project/shared'

import { zAddPlantInstanceTrpcInput } from '../addPlantInstance/input'

const zEditPlantInstanceTrpcInput = zAddPlantInstanceTrpcInput.extend({
  id: zNonemptyString,
})

export { zEditPlantInstanceTrpcInput }
