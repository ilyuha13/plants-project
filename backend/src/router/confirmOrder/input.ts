import { z } from 'zod'

export const confirmOrderTRPCInput = z.object({
  orderId: z.string(),
})
