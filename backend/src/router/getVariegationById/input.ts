import { z } from 'zod'

export const zGetVariegationByIdTrpcInput = z.object({
  variegationId: z.string(),
})
