import { z } from 'zod'

export const getCartTRPCInput = z.object({
  userId: z.string(),
})
