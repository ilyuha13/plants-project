import { zNonemptyTrimmed, zNonemptyTrimmedRequiredOnNotLocal } from '@plants-project/shared'
import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: zNonemptyTrimmed,
  HOST_ENV: z.enum(['local', 'production']),
  DATABASE_URL: zNonemptyTrimmed,
  JWT_SECRET: zNonemptyTrimmed,
  PASSWORD_SALT: zNonemptyTrimmed,
  CLAUDINARY_API_KEY: zNonemptyTrimmedRequiredOnNotLocal,
  CLAUDINARY_API_SECRET: zNonemptyTrimmedRequiredOnNotLocal,
  CLAUDINARY_CLOUDE_NAME: zNonemptyTrimmed,
})
export const env = envSchema.parse(process.env)
