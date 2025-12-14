import { z } from 'zod'

export const zRequestPasswordResetInput = z.object({
  nick: z.string().min(1, 'Введите никнейм'),
  contactInfo: z.string().min(1, 'Введите контактные данные'),
})
