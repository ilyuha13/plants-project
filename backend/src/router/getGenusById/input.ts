import { z } from 'zod'

export const zGetGenusByIdTrpcInput = z.object({
  genusId: z.string(),
})
