import { z } from 'zod'
import { zAddPlantTrpcInput } from '../addPlant/input'

// export const zUpdatePlantTrpcInput = z.object({
//   genus: z.string().min(3, 'слишком коротко').optional(),
//   species: z.string().optional(),
//   description: z.string().optional(),
//   categoryId: z.string().optional(),
//   imageSrc: z.string().optional(),
//   plantId: z.string().min(1),
// })
export const zUpdatePlantTrpcInput = zAddPlantTrpcInput
  .extend({
    plantId: z.string(),
  })
  .partial()
