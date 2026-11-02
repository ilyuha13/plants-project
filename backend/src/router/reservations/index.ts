import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import {
  confirmReservationInput,
  releaseReservationInput,
  requestReservationInput,
} from './input'
import { formatCustomerContacts } from '../../lib/customerContacts'
import { formatCustomerName } from '../../lib/customerNames'
import { sendTelegramMessage } from '../../lib/telegram'
import { adminProcedure, protectedProcedure } from '../../lib/trpc'

export const requestReservationTrpcRoute = protectedProcedure
  .input(requestReservationInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.$transaction(async (tx) => {
      await tx.cart.upsert({
        where: { userId: ctx.me.id },
        create: { userId: ctx.me.id },
        update: {},
      })
      const changed = await tx.cart.updateMany({
        where: {
          userId: ctx.me.id,
          reservationType: 'AUTOMATIC',
          OR: [{ reservedUntil: null }, { reservedUntil: { gt: new Date() } }],
        },
        data: {
          reservationType: 'RESERVED_PREPAID_REQUEST',
          requestedAt: new Date(),
          reservedUntil: null,
          customerName: formatCustomerName(input),
          customerFirstName: input.firstName,
          customerLastName: input.lastName,
          customerPatronymic: input.patronymic,
          customerContact: formatCustomerContacts(input),
          customerPhone: input.phone,
          customerTelegram: input.telegram,
          customerVk: input.vk,
          customerComment: input.comment,
        },
      })
      if (changed.count !== 1) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Корзина отсутствует, срок автоброни истёк или запрос уже отправлен',
        })
      }
      await tx.user.update({
        where: { id: ctx.me.id },
        data: {
          customerName: formatCustomerName(input),
          customerFirstName: input.firstName,
          customerLastName: input.lastName,
          customerPatronymic: input.patronymic,
          customerContact: formatCustomerContacts(input),
          customerPhone: input.phone,
          customerTelegram: input.telegram,
          customerVk: input.vk,
          reservationComment: input.comment,
        },
      })
    })
    await sendTelegramMessage(
      'Новый запрос бронирования. Контакты и состав доступны в разделе «Бронирования» в админке.',
    )
    return { success: true }
  })

export const getReservationsTrpcRoute = adminProcedure.query(async ({ ctx }) => {
  return ctx.prisma.cart.findMany({
    where: { reservationType: { not: 'AUTOMATIC' } },
    include: {
      user: { select: { nick: true } },
      items: {
        include: { plantInstance: { include: { plant: { select: { name: true } } } } },
      },
    },
    orderBy: [{ requestedAt: 'asc' }, { createdAt: 'asc' }],
  })
})

export const confirmReservationTrpcRoute = adminProcedure
  .input(confirmReservationInput)
  .mutation(async ({ ctx, input }) => {
    const changed = await ctx.prisma.cart.updateMany({
      where: { id: input.cartId, reservationType: { not: 'AUTOMATIC' } },
      data: {
        reservationType: 'RESERVED_PREPAID_CONFIRMED',
        prepaidAmount: new Prisma.Decimal(input.prepaidAmount),
        reservedUntil: input.reservedUntil,
        reviewAt: input.reviewAt,
        adminComment: input.comment,
      },
    })
    if (changed.count !== 1) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Запрос бронирования не найден или уже закрыт',
      })
    }
    return { success: true }
  })

export const releaseReservationTrpcRoute = adminProcedure
  .input(releaseReservationInput)
  .mutation(async ({ ctx, input }) =>
    ctx.prisma.$transaction(async (tx) => {
      // Lock the cart before reading its current contents or changing reservation terms.
      const changed = await tx.cart.updateMany({
        where: { id: input.cartId, reservationType: { not: 'AUTOMATIC' } },
        data: { updatedAt: new Date() },
      })
      if (changed.count !== 1) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Бронь уже закрыта или не найдена',
        })
      }
      const cart = await tx.cart.findUniqueOrThrow({
        where: { id: input.cartId },
        include: { items: true },
      })
      if (cart.prepaidAmount?.gt(0) && !input.acknowledgePrepayment) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Есть предоплата. Подтвердите освобождение растений; сумма останется записанной',
        })
      }
      const ids = cart.items.map((item) => item.plantInstanceId)
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      await tx.plantInstance.updateMany({
        where: {
          id: { in: ids },
          status: 'IN_CART',
          cartItems: { none: {} },
          orderItems: { none: { order: { status: { not: 'CANCELLED' } } } },
        },
        data: { status: 'AVAILABLE' },
      })
      // Preserve contacts, agreed prepayment and comments for manual settlement.
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          reservationType: 'AUTOMATIC',
          reservedUntil: null,
          reviewAt: null,
          requestedAt: null,
          purchaseRequestedAt: null,
        },
      })
      return { success: true }
    }),
  )
