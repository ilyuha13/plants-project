import { TRPCError } from '@trpc/server'

import { requestReservationPrepaidTRPCInput } from './input'
import { logger } from '../../lib/logger'
import { formatReservationRequestMessage, sendTelegramMessage } from '../../lib/telegram'
import { protectedProcedure } from '../../lib/trpc'

export const requestReservationPrepaidTrpcRoute = protectedProcedure
  .input(requestReservationPrepaidTRPCInput)
  .mutation(async ({ ctx, input }) => {
    const cart = await ctx.prisma.cart.findUnique({
      where: { id: input.cartId },
      include: { items: true },
    })

    if (!cart) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Корзина не найдена',
      })
    }

    if (cart.userId !== ctx.me.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Нет доступа к этой корзине',
      })
    }

    if (cart.reservedUntil && cart.reservedUntil < new Date()) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Срок резервации корзины истек',
      })
    }

    await ctx.prisma.cart.update({
      where: { id: input.cartId },
      data: {
        reservationType: 'RESERVED_PREPAID_REQUEST',
        requestedAt: new Date(),
      },
    })

    logger.info(
      'reservation',
      'пользователь запросил резервирование корзины с предоплатой',
      { cartId: input.cartId, userId: ctx.me.id },
    )

    const message = await sendTelegramMessage(
      formatReservationRequestMessage('prepaid', {
        cartId: input.cartId,
        userId: ctx.me.id,
        customerName: input.name,
        customerPhone: input.phone,
        customerTelegram: input.telegramm,
      }),
    )

    if (!message) {
      logger.error(
        'reservation',
        'не удалось отправить сообщение в Telegram о запросе резервирования корзины с предоплатой',
        { cartId: input.cartId, userId: ctx.me.id },
      )
    }
  })
