import { zNonemptyString } from '@plants-project/shared'
import { z } from 'zod'

export const zGetPlantInstanceTrpcInput = z.object({
  id: zNonemptyString,
})
