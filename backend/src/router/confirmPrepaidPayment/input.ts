import { zNonemptyString } from '@plants-project/shared'
import { z } from 'zod'

export const zConfirmPrepaidPaymentTRPCInput = z.object({
  cartId: zNonemptyString,
  prepaidAmount: zNonemptyString,
  daysCount: z.number().int().positive().optional(),
})
