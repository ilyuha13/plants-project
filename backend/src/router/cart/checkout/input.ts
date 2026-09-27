import { zNonemptyString } from '@plants-project/shared'
import { z } from 'zod'

export const checkoutInput = z.object({
  contactInfo: z.object({
    name: zNonemptyString,
    phone: zNonemptyString,
    telegram: zNonemptyString,
  }),
})
