import { TRPCError } from '@trpc/server'

import { zDeleteVariegationTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const deleteVariegationTrpcRoute = trpc.procedure
  .input(zDeleteVariegationTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { variegationId } = input

    if (!ctx.me) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Необходима авторизация для удаления вариегатности',
      })
    }

    if (ctx.me.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Только администратор может удалять вариегатности',
      })
    }

    await ctx.prisma.variegation.delete({
      where: { id: variegationId },
    })

    return { success: true }
  })
