import { z } from 'zod'

export const getCartInput = z.object({
  userId: z.string(),
})

export const addToCartInput = z.object({
  userId: z.string(),
  plantInstanceId: z.string(),
})

export const removeFromCartInput = z.object({
  userId: z.string(),
  cartItemId: z.string(),
})

export const clearCartInput = z.object({
  userId: z.string(),
})

export const checkoutInput = z.object({
  userId: z.string(),
  contactInfo: z.object({
    name: z.string(),
    phone: z.string(),
    telegram: z.string().optional(),
  }),
})
