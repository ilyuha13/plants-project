import { TRPCError } from '@trpc/server'

import { checkoutInput } from './input'
import { logger } from '../../../lib/logger'
import { formatCheckoutOrderMessage, sendTelegramMessage } from '../../../lib/telegram'
import { publicProcedure } from '../../../lib/trpc'

export const checkoutTrpcRoute = publicProcedure
  .input(checkoutInput)
  .mutation(async ({ ctx, input }) => {
    const prisma = ctx.prisma
    const cart = await prisma.cart.findUnique({
      where: { userId: input.userId },
      include: { items: { include: { plantInstance: { include: { plant: true } } } } },
    })
    if (!cart || cart.items.length === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Корзина пуста',
      })
    }
    const plantInstanceIds = cart.items.map((item) => item.plantInstanceId)
    if (cart.reservedUntil && cart.reservedUntil < new Date()) {
      await prisma.plantInstance.updateMany({
        where: {
          id: {
            in: plantInstanceIds,
          },
        },
        data: {
          status: 'AVAILABLE',
        },
      })
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      })

      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          reservationType: 'AUTOMATIC',
          reservedUntil: null,
        },
      })

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Срок резервации корзины истек',
      })
    }

    const result = await ctx.prisma.$transaction(async (tx) => {
      await tx.plantInstance.updateMany({
        where: {
          id: {
            in: plantInstanceIds,
          },
        },
        data: {
          status: 'SOLD',
        },
      })
      const total = cart.items.reduce(
        (sum, item) => sum + Number(item.plantInstance.price),
        0,
      )
      const order = await tx.order.create({
        data: {
          userId: input.userId,
          customerName: input.contactInfo.name,
          totalAmount: total.toString(),
          customerPhone: input.contactInfo.phone,
          items: {
            createMany: {
              data: cart.items.map((item) => ({
                plantInstanceId: item.plantInstanceId,
              })),
            },
          },
        },
      })

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      })

      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          reservationType: 'AUTOMATIC',
          reservedUntil: null,
          prepaidAmount: null,
          requestedAt: null,
        },
      })
      return {
        order,
        total,
        prepaidAmount: cart.prepaidAmount,
      }
    })
    const orderMessage = formatCheckoutOrderMessage({
      orderId: result.order.id,
      customerName: input.contactInfo.name,
      customerPhone: input.contactInfo.phone,
      customerTelegram: input.contactInfo.telegram,
      items: cart.items.map((item) => ({
        name: item.plantInstance.plant.name,
        price: String(item.plantInstance.price),
      })),
      total: result.total,
      prepaidAmount: result.prepaidAmount ? Number(result.prepaidAmount) : undefined,
    })
    const telegramSend = await sendTelegramMessage(orderMessage)

    if (!telegramSend) {
      logger.info(
        'telegramm',
        `не отправлено уведомление о заказе ${result.order.id} в телеграм`,
      )
    } else {
      logger.info('telegramm', `отправлено уведомление о заказе `, { orderMessage })
    }
    return { orderId: result.order.id }
  })
