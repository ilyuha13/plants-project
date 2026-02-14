import { zNonemptyString } from '@plants-project/shared'
import { z } from 'zod'

export const requestReservationPrepaidTRPCInput = z.object({
  cartId: zNonemptyString,
  name: zNonemptyString,
  phone: zNonemptyString,
  telegramm: z.string().optional(),
})
