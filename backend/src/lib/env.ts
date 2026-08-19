import {
  zNonemptyTrimmed,
  zNonemptyTrimmedRequiredOnNotLocal,
} from '@plants-project/shared'
import { z } from 'zod'

const envSchema = z.object({
  PORT: zNonemptyTrimmed,
  HOST_ENV: z.enum(['local', 'production']),
  DATABASE_URL: zNonemptyTrimmed,
  JWT_SECRET: zNonemptyTrimmed,
  FRONTEND_URL: zNonemptyTrimmed,
  CLOUDINARY_API_KEY: zNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_SECRET: zNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_CLOUD_NAME: zNonemptyTrimmed,
  DEBUG: zNonemptyTrimmed,
  TELEGRAM_PROXY_URL: zNonemptyTrimmed.optional(),
  TELEGRAM_PROXY_SECRET: zNonemptyTrimmed.optional(),
})
export const env = envSchema.parse(process.env)
