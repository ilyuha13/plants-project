import { z } from 'zod'

export const zAddPlantTrpcInput = z.object({
  description: z.string(),
  price: z.number().min(0),
  varietyId: z.string().min(1),
  images: z
    .object({
      src: z.string(),
      name: z.string(),
    })
    .array(),
})
