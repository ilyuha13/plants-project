import { TRPCError } from '@trpc/server'

import { zResetUserPasswordInput } from './input'
import { trpc } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'

export const resetUserPasswordTrpcRoute = trpc.procedure
  .input(zResetUserPasswordInput)
  .mutation(async ({ ctx, input }) => {
    // Проверка что пользователь - админ
    if (!ctx.me || ctx.me.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Доступ запрещён. Требуется роль администратора.',
      })
    }

    // Проверяем что пользователь существует
    const user = await ctx.prisma.user.findUnique({
      where: { id: input.userId },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Пользователь не найден',
      })
    }

    // Хешируем новый пароль
    const hashedPassword = await getPasswordHash(input.newPassword)

    // Обновляем пароль
    await ctx.prisma.user.update({
      where: { id: input.userId },
      data: {
        password: hashedPassword,
      },
    })

    return {
      success: true,
      message: `Пароль для пользователя ${user.nick} успешно изменён`,
    }
  })
