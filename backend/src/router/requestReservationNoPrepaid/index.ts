import { TRPCError } from '@trpc/server'

import { requestReservationNoPrepaidTRPCInput } from './input'
import { logger } from '../../lib/logger'
import { formatReservationRequestMessage, sendTelegramMessage } from '../../lib/telegram'
import { protectedProcedure } from '../../lib/trpc'

export const requestReservationNoPrepaidTrpcRoute = protectedProcedure
  .input(requestReservationNoPrepaidTRPCInput)
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

    if (cart.reservationType !== 'AUTOMATIC') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Невозможно запросить бронирование для этой корзины',
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
        reservationType: 'RESERVED_NO_PREPAID',
        reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        requestedAt: new Date(),
      },
    })

    logger.info(
      'reservation',
      'пользователь запросил резервирование корзины без предоплаты',
      { cartId: input.cartId, userId: ctx.me.id },
    )

    const message = await sendTelegramMessage(
      formatReservationRequestMessage('no-prepaid', {
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
        'не удалось отправить уведомление в телеграм о резервировании корзины без предоплаты',
        { cartId: input.cartId, userId: ctx.me.id },
      )
    }
  })
