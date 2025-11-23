import { z } from 'zod'

export const zDeleteVariegationTrpcInput = z.object({
  variegationId: z.string(),
})
