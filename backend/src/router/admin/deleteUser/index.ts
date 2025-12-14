import { TRPCError } from '@trpc/server'

import { zDeleteUserInput } from './input'
import { trpc } from '../../../lib/trpc'

export const deleteUserTrpcRoute = trpc.procedure.input(zDeleteUserInput).mutation(async ({ ctx, input }) => {
  // Проверка что пользователь - админ
  if (!ctx.me || ctx.me.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Доступ запрещён. Требуется роль администратора.',
    })
  }

  // Нельзя удалить самого себя
  if (ctx.me.id === input.userId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Нельзя удалить собственный аккаунт',
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

  // Удаляем пользователя (каскадное удаление cart, orders настроено в schema)
  await ctx.prisma.user.delete({
    where: { id: input.userId },
  })

  return {
    success: true,
    message: `Пользователь ${user.nick} успешно удалён`,
  }
})
