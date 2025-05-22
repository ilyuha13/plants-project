import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: z.string().trim().min(1),
  DATABASE_URL: z.string().trim().min(1),
  JWT_SECRET: z.string().trim().min(1),
  PASSWORD_SALT: z.string().trim().min(1),
})
export const env = envSchema.parse(process.env)
