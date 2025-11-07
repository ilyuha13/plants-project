import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const zNonemptyTrimmed = z.string().trim().min(1)
// const zNonemptyTrimmedRequiredOnNotLocal = zNonemptyTrimmed
//   .optional()
//   .refine((val) => process.env.HOST_ENV === 'local' || !!val, 'Required on local host')

const envSchema = z.object({
  PORT: zNonemptyTrimmed,
  HOST_ENV: z.enum(['local', 'production']),
  DATABASE_URL: zNonemptyTrimmed,
  JWT_SECRET: zNonemptyTrimmed,
  PASSWORD_SALT: zNonemptyTrimmed,
})
export const env = envSchema.parse(process.env)
