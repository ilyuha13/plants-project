import { TRPCError } from '@trpc/server'

import { confirmOrderTRPCInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const confirmOrderTrpcRoute = adminProcedure
  .input(confirmOrderTRPCInput)
  .mutation(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: { id: input.orderId },
    })

    if (!order) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Заказ не найден',
      })
    }

    if (order.status !== 'PENDING') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Невозможно подтвердить этот заказ',
      })
    }

    await ctx.prisma.order.update({
      where: { id: input.orderId },
      data: { status: 'AWAITING_PAYMENT' },
    })
  })
