import { z } from 'zod'

export const checkoutInput = z.object({
  userId: z.string(),
  contactInfo: z.object({
    name: z.string(),
    phone: z.string(),
    telegram: z.string().optional(),
  }),
})
