import { z } from 'zod'

export const clearCartInput = z.object({
  userId: z.string(),
})
