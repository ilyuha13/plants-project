import { z } from 'zod'

export const getCartInput = z.object({
  userId: z.string(),
})
