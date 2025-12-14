import { z } from 'zod'

export const zResetPasswordWithTokenInput = z.object({
  token: z.string().uuid('Некорректный токен'),
  newPassword: z.string().min(4, 'Пароль должен быть минимум 4 символа'),
})
