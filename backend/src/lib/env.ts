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
  TELEGRAM_BOT_USERNAME: zNonemptyTrimmed.optional(),
  TELEGRAM_BOT_TOKEN: zNonemptyTrimmed.optional(),
  TELEGRAM_ADMIN_CHAT_ID: zNonemptyTrimmed.optional(),
})
export const env = envSchema.parse(process.env)
