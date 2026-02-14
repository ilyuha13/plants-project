import crypto from 'crypto'

import { TRPCError } from '@trpc/server'

import { zGeneratePasswordResetTokenTrpcInput } from './input'
import { env } from '../../../lib/env'
import { adminProcedure } from '../../../lib/trpc'

export const generatePasswordResetTokenTrpcRoute = adminProcedure
  .input(zGeneratePasswordResetTokenTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: input.userId },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Пользователь не найден',
      })
    }

    // Генерируем уникальный токен с помощью crypto.randomUUID()
    // UUID гарантирует уникальность и безопасность (невозможно угадать)
    const token = crypto.randomUUID()

    // Устанавливаем срок действия токена - 24 часа с текущего момента
    // После этого времени токен станет недействительным
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Сохраняем токен в базу данных
    await ctx.prisma.passwordResetToken.create({
      data: {
        token,
        userId: input.userId,
        expiresAt,
        used: false, // По умолчанию токен не использован
      },
    })

    // Формируем ссылку для пользователя
    // FRONTEND_URL берем из environment переменных
    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`

    return {
      success: true,
      resetLink,
      expiresAt: expiresAt.toISOString(),
      message: `Ссылка для сброса пароля пользователя ${user.nick} создана`,
    }
  })
