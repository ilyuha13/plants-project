import { zNonemptyString } from '@plants-project/shared'
import { z } from 'zod'

export const zGetPlantTrpcInput = z.object({
  id: zNonemptyString,
})
