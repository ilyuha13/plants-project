import { TRPCError } from '@trpc/server'

import { cancelOrderTRPCInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const cancelOrderTrpcRoute = adminProcedure
  .input(cancelOrderTRPCInput)
  .mutation(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: { id: input.orderId },
      include: { items: true },
    })

    if (!order) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Заказ не найден',
      })
    }

    if (order.status === 'CANCELLED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Этот заказ уже отменён',
      })
    }

    if (order.status === 'SHIPPED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Заказ уже отправлен и не может быть отменён',
      })
    }

    if (order.status === 'DELIVERED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Заказ уже доставлен и не может быть отменён',
      })
    }

    const plantInstanceIds = order.items.map((item) => item.plantInstanceId)

    await ctx.prisma.$transaction(async (tx) => {
      await tx.plantInstance.updateMany({
        where: { id: { in: plantInstanceIds } },
        data: { status: 'AVAILABLE' },
      })

      await tx.order.update({
        where: { id: input.orderId },
        data: { status: 'CANCELLED' },
      })
    })
  })
