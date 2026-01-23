import { z } from 'zod'

export const zSignUpTrpcInput = z.object({
  nick: z
    .string()
    .min(5, 'минимум 5 символов')
    .regex(/^[A-Za-z0-9-]+$/, 'только буква латинского алфавита, цифры и тире'),
  password: z.string().min(5),
})
