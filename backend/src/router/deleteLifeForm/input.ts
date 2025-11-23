import { z } from 'zod'

export const zDeleteLifeFormTrpcInput = z.object({
  lifeFormId: z.string(),
})
