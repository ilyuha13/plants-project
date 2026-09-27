import { z } from 'zod'

export const addToCartInput = z.object({
  plantInstanceId: z.string(),
})
