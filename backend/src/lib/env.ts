import { zNonemptyTrimmed, zNonemptyTrimmedRequiredOnNotLocal } from '@plants-project/shared'
import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: zNonemptyTrimmed,
  HOST_ENV: z.enum(['local', 'production']),
  DATABASE_URL: zNonemptyTrimmed,
  JWT_SECRET: zNonemptyTrimmed,
  FRONTEND_URL: zNonemptyTrimmed, // URL фронтенда для генерации ссылок сброса пароля
  // PASSWORD_SALT больше не нужен - bcrypt генерирует соль автоматически
  CLOUDINARY_API_KEY: zNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_SECRET: zNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_CLOUD_NAME: zNonemptyTrimmed,
})
export const env = envSchema.parse(process.env)
