import { z } from 'zod'

export const zResetUserPasswordInput = z.object({
  userId: z.string().uuid('Некорректный ID пользователя'),
  newPassword: z.string().min(4, 'Пароль должен быть минимум 4 символа'),
})
