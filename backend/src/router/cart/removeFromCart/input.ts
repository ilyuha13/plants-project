import { z } from 'zod'

export const removeFromCartInput = z.object({
  cartItemId: z.string(),
})
