import { zNonemptyString } from '@plants-project/shared'
import { z } from 'zod'

export const zGetOrderTrpcInput = z.object({
  orderId: zNonemptyString,
})
