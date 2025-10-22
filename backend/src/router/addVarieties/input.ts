import { z } from 'zod'

export const zAddVarietiesTrpcInput = z.object({
  speciesId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  variegation: z.string().min(1),
  lifeForm: z.string().min(1),
  images: z
    .object({
      src: z.string(),
      name: z.string(),
    })
    .array(),
})
