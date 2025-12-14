import { TRPCError } from '@trpc/server'

import { trpc } from '../../../lib/trpc'

export const getAllUsersTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  // Проверка что пользователь - админ
  if (!ctx.me || ctx.me.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Доступ запрещён. Требуется роль администратора.',
    })
  }

  // Получаем всех пользователей
  const users = await ctx.prisma.user.findMany({
    select: {
      id: true,
      nick: true,
      role: true,
      createdAt: true,
      // Пароль НЕ возвращаем (безопасность!)
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return users
})
