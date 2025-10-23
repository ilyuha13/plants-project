import { z } from 'zod'

export const zAddPlantTrpcInput = z.object({
  variety: z.string(),
  genus: z.string().min(1),
  description: z.string(),
  images: z.string().array(),
  price: z.number().min(1),
})
