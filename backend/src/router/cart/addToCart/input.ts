import { z } from 'zod'

export const addToCartInput = z.object({
  userId: z.string(),
  plantInstanceId: z.string(),
})
