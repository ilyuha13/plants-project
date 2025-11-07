import { z } from 'zod'

export const zEnv = z.object({
  VITE_BACKEND_TRPC_URL: z.string().trim().min(1),
  VITE_BACKEND_URL: z.string().trim().min(1),
  VITE_TELEGRAM_BOT_USERNAME: z.string().trim().min(1),
  VITE_CLAUDINARY_CLOUDE_NAME: z.string().trim().min(1),
})

export const env = zEnv.parse(import.meta.env)
