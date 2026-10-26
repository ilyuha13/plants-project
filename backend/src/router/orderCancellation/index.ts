import { createHash } from 'node:crypto'

import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import {
  cancelPaidOrderInput,
  recordOrderRefundInput,
  releaseOrderItemsInput,
} from './input'
import { adminProcedure } from '../../lib/trpc'

import type { AppContext } from '../../lib/ctx'

type CancellationTx = Pick<
  AppContext['prisma'],
  'order' | 'orderItem' | 'plantInstance' | 'orderRefund'
>

const releaseSelected = async (
  tx: CancellationTx,
  orderId: string,
  ids: string[],
  actorId: string,
) => {
  if (!ids.length) {
    return
  }
  const items = await tx.orderItem.findMany({ where: { orderId, id: { in: ids } } })
  if (items.length !== ids.length) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Выбрана позиция другого заказа',
    })
  }
  const pending = items.filter((item) => !item.releasedAt)
  if (!pending.length) {
    return
  }
  const released = await tx.plantInstance.updateMany({
    where: {
      id: { in: pending.map((item) => item.plantInstanceId) },
      status: 'SOLD',
      cartItems: { none: {} },
      orderItems: { none: { order: { status: { not: 'CANCELLED' } } } },
    },
    data: { status: 'AVAILABLE' },
  })
  if (released.count !== pending.length) {
    throw new TRPCError({
      code: 'CONFLICT',
      message:
        'Некоторые растения заняты другой корзиной или заказом либо уже изменили статус. Снимите их выделение и проверьте данные',
    })
  }
  await tx.orderItem.updateMany({
    where: { orderId, id: { in: pending.map((item) => item.id) }, releasedAt: null },
    data: { releasedAt: new Date(), releasedById: actorId },
  })
}

const saveRefund = async (
  tx: CancellationTx,
  input: { orderId: string; requestId: string; amount: string; note: string },
  actor: { id: string; nick: string },
) => {
  const amount = new Prisma.Decimal(input.amount)
  const previous = await tx.orderRefund.findUnique({ where: { id: input.requestId } })
  if (previous) {
    if (
      previous.orderId !== input.orderId ||
      !previous.amount.equals(amount) ||
      previous.note !== input.note
    ) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Этот запрос уже записан с другими данными',
      })
    }
    return
  }
  const order = await tx.order.findUniqueOrThrow({ where: { id: input.orderId } })
  if (
    order.paidAmount === null ||
    order.refundedAmount.plus(amount).gt(order.paidAmount)
  ) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Возврат превышает остаток фактически полученной оплаты',
    })
  }
  await tx.orderRefund.create({
    data: {
      id: input.requestId,
      orderId: order.id,
      amount,
      note: input.note,
      actorId: actor.id,
      actorNick: actor.nick,
    },
  })
  await tx.order.update({
    where: { id: order.id },
    data: { refundedAmount: { increment: amount } },
  })
}

export const cancelPaidOrderTrpcRoute = adminProcedure
  .input(cancelPaidOrderInput)
  .mutation(async ({ ctx, input }) =>
    ctx.prisma.$transaction(async (tx) => {
      // Serialize cancellation with shipping, refunds and later item release.
      await tx.$queryRaw`SELECT "id" FROM "Order" WHERE "id" = ${input.orderId} FOR UPDATE`
      const order = await tx.order.findUnique({ where: { id: input.orderId } })
      if (!order) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Заказ не найден' })
      }
      const hash = createHash('sha256')
        .update(
          JSON.stringify({
            reason: input.reason,
            refund: new Prisma.Decimal(input.refundAmount).toString(),
            items: [...input.releaseItemIds].sort(),
          }),
        )
        .digest('hex')
      if (order.cancellationRequestId === input.requestId) {
        if (order.cancellationPayloadHash !== hash) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Отмена уже выполнена с другими данными',
          })
        }
        return { success: true }
      }
      if (order.updatedAt.getTime() !== input.expectedUpdatedAt.getTime()) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Заказ изменился. Обновите его перед отменой',
        })
      }
      if (order.paidAmount === null || !['COLLECTING', 'PACKED'].includes(order.status)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Можно отменить только оплаченный заказ до отправки',
        })
      }
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: input.reason,
          cancellationRequestId: input.requestId,
          cancellationPayloadHash: hash,
        },
      })
      if (new Prisma.Decimal(input.refundAmount).gt(0)) {
        await saveRefund(
          tx,
          {
            orderId: order.id,
            requestId: input.requestId,
            amount: input.refundAmount,
            note: input.reason,
          },
          ctx.me,
        )
      }
      await releaseSelected(tx, order.id, input.releaseItemIds, ctx.me.id)
      return { success: true }
    }),
  )

export const recordOrderRefundTrpcRoute = adminProcedure
  .input(recordOrderRefundInput)
  .mutation(async ({ ctx, input }) =>
    ctx.prisma.$transaction(async (tx) => {
      const locked = await tx.order.updateMany({
        where: { id: input.orderId, status: 'CANCELLED', paidAmount: { not: null } },
        data: { updatedAt: new Date() },
      })
      if (!locked.count) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Возврат записывается только для отменённого оплаченного заказа',
        })
      }
      await saveRefund(tx, { ...input, note: input.note }, ctx.me)
      return { success: true }
    }),
  )

export const releaseOrderItemsTrpcRoute = adminProcedure
  .input(releaseOrderItemsInput)
  .mutation(async ({ ctx, input }) =>
    ctx.prisma.$transaction(async (tx) => {
      const locked = await tx.order.updateMany({
        where: { id: input.orderId, status: 'CANCELLED', paidAmount: { not: null } },
        data: { updatedAt: new Date() },
      })
      if (!locked.count) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Освобождение доступно только для отменённого оплаченного заказа',
        })
      }
      await releaseSelected(tx, input.orderId, input.itemIds, ctx.me.id)
      return { success: true }
    }),
  )
