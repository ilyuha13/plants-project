import { TRPCError } from '@trpc/server'

import { zConfirmPrepaidPaymentTRPCInput } from './input'
import { logger } from '../../lib/logger'
import { adminProcedure } from '../../lib/trpc'

export const confirmPrepaidPaymentTrpcRoute = adminProcedure
  .input(zConfirmPrepaidPaymentTRPCInput)
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

    if (cart.reservationType !== 'RESERVED_PREPAID_REQUEST') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Невозможно подтвердить предоплату для этой корзины',
      })
    }

    if (input.prepaidAmount <= '0') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Сумма предоплаты должна быть больше нуля',
      })
    }

    await ctx.prisma.cart.update({
      where: { id: input.cartId },
      data: {
        reservationType: 'RESERVED_PREPAID_CONFIRMED',
        prepaidAmount: input.prepaidAmount,
        reservedUntil: input.daysCount
          ? new Date(Date.now() + input.daysCount * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    logger.info(
      'reservation',
      'администратор подтвердил предоплату и забронировал корзину',
      { cartId: input.cartId },
    )
  })
