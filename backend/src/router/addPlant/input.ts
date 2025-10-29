import { z } from 'zod'

export const zAddPlantTrpcInput = z.object({
  name: z.string().min(1),
  description: z.string(),
  images: z.string().array(),
})
