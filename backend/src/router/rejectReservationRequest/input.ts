import { zNonemptyString } from '@plants-project/shared'
import { z } from 'zod'

export const rejectReservationRequestTRPCInput = z.object({
  cartId: zNonemptyString,
  reason: z.string().optional(),
})
