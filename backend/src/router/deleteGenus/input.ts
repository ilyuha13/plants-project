import { z } from 'zod'

export const zDeleteGenusTrpcInput = z.object({
  genusId: z.string(),
})
