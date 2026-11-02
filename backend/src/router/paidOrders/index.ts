import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createPaidOrderInput } from './input'
import { formatCustomerName } from '../../lib/customerNames'
import { deliveryNeedsAddress, deliveryNeedsPickupPoint } from '../../lib/deliveryOptions'
import { adminProcedure, protectedProcedure } from '../../lib/trpc'

export const createPaidOrderTrpcRoute = adminProcedure
  .input(createPaidOrderInput)
  .mutation(async ({ ctx, input }) =>
    ctx.prisma.$transaction(async (tx) => {
      const claimed = await tx.cart.updateMany({
        where: {
          id: input.cartId,
          updatedAt: input.expectedUpdatedAt,
          reservationType: { not: 'AUTOMATIC' },
        },
        data: { updatedAt: new Date() },
      })
      if (claimed.count !== 1) {
        throw new TRPCError({
          code: 'CONFLICT',
          message:
            'Корзина изменилась или бронь закрыта. Обновите список и проверьте состав заново',
        })
      }
      const cart = await tx.cart.findUniqueOrThrow({
        where: { id: input.cartId },
        include: { items: { include: { plantInstance: { include: { plant: true } } } } },
      })
      const prices = new Map(
        input.items.map((item) => [item.cartItemId, new Prisma.Decimal(item.unitPrice)]),
      )
      if (
        !cart.items.length ||
        prices.size !== input.items.length ||
        prices.size !== cart.items.length ||
        cart.items.some((item) => !prices.has(item.id))
      ) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Состав заказа не совпадает с корзиной. Откройте форму заново',
        })
      }
      const deliveryCost = new Prisma.Decimal(input.deliveryCost)
      const total = cart.items.reduce(
        (sum, item) => sum.plus(prices.get(item.id)!),
        deliveryCost,
      )
      const paidAmount = new Prisma.Decimal(input.paidAmount)
      if (paidAmount.lt(total) || paidAmount.lt(cart.prepaidAmount || 0)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Полученная сумма должна покрывать заказ с доставкой и ранее записанную предоплату',
        })
      }
      const sold = await tx.plantInstance.updateMany({
        where: {
          id: { in: cart.items.map((item) => item.plantInstanceId) },
          status: 'IN_CART',
          orderItems: { none: { order: { status: { not: 'CANCELLED' } } } },
          cartItems: { none: { cartId: { not: cart.id } } },
        },
        data: { status: 'SOLD' },
      })
      if (sold.count !== cart.items.length) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Некоторые растения уже недоступны или связаны с другим заказом',
        })
      }
      const order = await tx.order.create({
        data: {
          userId: cart.userId,
          sourceCartId: cart.id,
          status: 'COLLECTING',
          customerName: formatCustomerName({
            firstName: input.customerFirstName,
            lastName: input.customerLastName,
            patronymic: input.customerPatronymic,
          }),
          customerFirstName: input.customerFirstName,
          customerLastName: input.customerLastName,
          customerPatronymic: input.customerPatronymic,
          customerContact: input.customerContact,
          customerPhone: input.customerPhone,
          customerAddress: deliveryNeedsAddress(input.deliveryType)
            ? input.deliveryAddress
            : '',
          pickupPoint: deliveryNeedsPickupPoint(input.deliveryType)
            ? input.pickupPoint
            : '',
          deliveryType: input.deliveryType,
          deliveryCost,
          deliveryNotes: input.deliveryNotes,
          customerNotes: cart.customerComment,
          totalAmount: total,
          paidAmount,
          prepaidAmount: cart.prepaidAmount || new Prisma.Decimal(0),
          items: {
            create: cart.items.map((item) => ({
              plantInstanceId: item.plantInstanceId,
              plantName: item.plantInstance.plant.name,
              inventoryNumber: item.plantInstance.inventoryNumber,
              unitPrice: prices.get(item.id)!,
              imagesUrl: item.plantInstance.imagesUrl,
            })),
          },
        },
      })
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          reservationType: 'AUTOMATIC',
          reservedUntil: null,
          reviewAt: null,
          requestedAt: null,
          purchaseRequestedAt: null,
          prepaidAmount: null,
          customerName: null,
          customerFirstName: null,
          customerLastName: null,
          customerPatronymic: null,
          customerContact: null,
          customerTelegram: null,
          customerVk: null,
          customerComment: null,
          adminComment: null,
          customerPhone: null,
          deliveryType: null,
          deliveryAddress: null,
          pickupPoint: null,
          deliveryNotes: null,
        },
      })
      return { orderId: order.id }
    }),
  )

export const getMyOrdersTrpcRoute = protectedProcedure.query(async ({ ctx }) => ({
  orders: await ctx.prisma.order.findMany({
    where: { userId: ctx.me.id, status: { notIn: ['CANCELLED', 'DELIVERED'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, createdAt: true, totalAmount: true, status: true },
  }),
}))
