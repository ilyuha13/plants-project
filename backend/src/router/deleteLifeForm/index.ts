import { TRPCError } from '@trpc/server'

import { zDeleteLifeFormTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const deleteLifeFormTrpcRoute = trpc.procedure
  .input(zDeleteLifeFormTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { lifeFormId } = input

    if (!ctx.me) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Необходима авторизация для удаления жизненной формы',
      })
    }

    if (ctx.me.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Только администратор может удалять жизненные формы',
      })
    }

    await ctx.prisma.lifeForm.delete({
      where: { id: lifeFormId },
    })

    return { success: true }
  })
