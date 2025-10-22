import { z } from 'zod'

export const zAddSpeciesTrpcInput = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  images: z
    .object({
      src: z.string(),
      name: z.string(),
    })
    .array(),
})
