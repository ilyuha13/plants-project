import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { deliveryNeedsRecipient } from '../../lib/deliveryOptions'
import { orderTransitions } from '../../lib/orderProcessing'
import { adminProcedure } from '../../lib/trpc'

export const advanceOrderTrpcRoute = adminProcedure
  .input(
    z.object({
      orderId: z.string().min(1),
      expectedStatus: z.enum(['COLLECTING', 'PACKED', 'SHIPPED']),
      status: z.enum(['PACKED', 'SHIPPED', 'DELIVERED']),
      trackingNumber: z.string().trim().max(200).default(''),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({ where: { id: input.orderId } })
    if (!order) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Заказ не найден' })
    }
    if (order.paidAmount === null) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Оплата старого заказа не зафиксирована. Сначала требуется его разбор',
      })
    }
    if (order.status !== input.expectedStatus) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Статус уже изменился. Обновите заказ',
      })
    }
    if (!orderTransitions(order.status, order.deliveryType).includes(input.status)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Недопустимый переход статуса заказа',
      })
    }
    if (
      input.status === 'SHIPPED' &&
      deliveryNeedsRecipient(order.deliveryType) &&
      !input.trackingNumber
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Укажите трек-номер отправления',
      })
    }
    const now = new Date()
    const changed = await ctx.prisma.order.updateMany({
      where: { id: order.id, status: input.expectedStatus, paidAmount: { not: null } },
      data: {
        status: input.status,
        ...(input.status === 'PACKED' ? { packedAt: now } : {}),
        ...(input.status === 'SHIPPED'
          ? { shippedAt: now, trackingNumber: input.trackingNumber || null }
          : {}),
        ...(input.status === 'DELIVERED' ? { deliveredAt: now } : {}),
      },
    })
    if (changed.count !== 1) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Статус уже изменился. Обновите заказ',
      })
    }
    return { success: true }
  })
