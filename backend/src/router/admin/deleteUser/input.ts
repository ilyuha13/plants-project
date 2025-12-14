import { z } from 'zod'

export const zDeleteUserInput = z.object({
  userId: z.string().uuid('Некорректный ID пользователя'),
})
