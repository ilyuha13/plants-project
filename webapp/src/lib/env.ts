import { zNonemptyTrimmed } from '@plants-project/shared'
import { z } from 'zod'

export const zEnv = z.object({
  MODE: z.enum(['development', 'production']),
  VITE_BACKEND_TRPC_URL: zNonemptyTrimmed,
  VITE_BACKEND_URL: zNonemptyTrimmed,
  VITE_TELEGRAM_BOT_USERNAME: zNonemptyTrimmed,
  VITE_CLOUDINARY_CLOUD_NAME: zNonemptyTrimmed,
})

export const env = zEnv.parse(import.meta.env)
