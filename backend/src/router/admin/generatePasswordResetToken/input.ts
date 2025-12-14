import { zNonemptyString } from '@plants-project/shared'
import { z } from 'zod'

export const zGeneratePasswordResetTokenTrpcInput = z.object({
  userId: zNonemptyString,
})
