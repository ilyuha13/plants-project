import { z } from 'zod'

export const removeFromCartInput = z.object({
  userId: z.string(),
  cartItemId: z.string(),
})
