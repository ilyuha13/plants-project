import { TRPCError } from '@trpc/server'

import { zResetPasswordWithTokenInput } from './input'
import { publicProcedure } from '../../lib/trpc'
import { getPasswordHash } from '../../utils/getPasswordHash'

// Это ПУБЛИЧНЫЙ роут - он не требует авторизации (ctx.me может быть null)
// Пользователь переходит по ссылке из email/мессенджера и сам меняет пароль
export const resetPasswordWithTokenTrpcRoute = publicProcedure
  .input(zResetPasswordWithTokenInput)
  .mutation(async ({ ctx, input }) => {
    // Ищем токен в базе данных
    const resetToken = await ctx.prisma.passwordResetToken.findUnique({
      where: { token: input.token },
      include: { user: true }, // Подтягиваем данные пользователя
    })

    // Проверка 1: Токен существует
    if (!resetToken) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Токен не найден. Возможно ссылка недействительна.',
      })
    }

    // Проверка 2: Токен уже был использован
    if (resetToken.used) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Этот токен уже был использован. Запросите новую ссылку.',
      })
    }

    // Проверка 3: Токен не истёк (expiresAt > текущее время)
    if (resetToken.expiresAt < new Date()) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Срок действия токена истёк. Ссылка действительна 24 часа.',
      })
    }

    // Хешируем новый пароль с помощью bcrypt
    const hashedPassword = await getPasswordHash(input.newPassword)

    // Обновляем пароль пользователя
    await ctx.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    })

    // Помечаем токен как использованный
    // Это важно чтобы его нельзя было использовать повторно
    await ctx.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    })

    return {
      success: true,
      message: `Пароль для пользователя ${resetToken.user.nick} успешно изменён`,
    }
  })
