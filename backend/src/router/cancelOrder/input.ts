import { z } from 'zod'

export const cancelOrderTRPCInput = z.object({
  orderId: z.string(),
})
