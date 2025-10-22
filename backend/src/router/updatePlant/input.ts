import { z } from 'zod'
import { zAddPlantTrpcInput } from '../addPlant/input'

export const zUpdatePlantTrpcInput = zAddPlantTrpcInput
  .extend({
    plantId: z.string(),
  })
  .partial()
