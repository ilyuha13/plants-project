import { z } from 'zod'

export const zAddPlantInstanceTrpcInput = z.object({
  inventoryNumber: z.string().min(1).regex(/^\d+$/),
  plantId: z.string().min(1),
  price: z.string().min(1).regex(/^\d+$/),
  description: z.string(),
  images: z.string().array(),
})
