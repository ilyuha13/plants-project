import { TRPCError } from '@trpc/server'

import { rejectReservationRequestTRPCInput } from './input'
import { logger } from '../../lib/logger'
import { adminProcedure } from '../../lib/trpc'

export const rejectReservationRequestTrpcRoute = adminProcedure
  .input(rejectReservationRequestTRPCInput)
  .mutation(async ({ ctx, input }) => {
    const cart = await ctx.prisma.cart.findUnique({
      where: { id: input.cartId },
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
        message: 'Невозможно отклонить предоплату для этой корзины',
      })
    }

    await ctx.prisma.cart.update({
      where: { id: input.cartId },
      data: {
        reservationType: 'AUTOMATIC',
        prepaidAmount: null,
        reservedUntil: null,
        requestedAt: null,
      },
    })

    logger.info(
      'reservation',
      `администратор отклонил предоплату для корзины${input.reason ? `: ${input.reason}` : ''}`,
      { cartId: input.cartId },
    )
  })
