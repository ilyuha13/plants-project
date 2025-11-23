import { z } from 'zod'

export const zGetLifeFormByIdTrpcInput = z.object({
  lifeFormId: z.string(),
})
