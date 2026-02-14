import { TRPCError } from '@trpc/server'

import { zDeleteUserInput } from './input'
import { adminProcedure } from '../../../lib/trpc'

export const deleteUserTrpcRoute = adminProcedure
  .input(zDeleteUserInput)
  .mutation(async ({ ctx, input }) => {
    if (ctx.me.id === input.userId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Нельзя удалить собственный аккаунт',
      })
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: input.userId },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Пользователь не найден',
      })
    }

    await ctx.prisma.user.delete({
      where: { id: input.userId },
    })

    return {
      success: true,
      message: `Пользователь ${user.nick} успешно удалён`,
    }
  })
