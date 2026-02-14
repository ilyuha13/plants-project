import { TRPCError } from '@trpc/server'

import { removeFromCartInput } from './input'
import { publicProcedure } from '../../../lib/trpc'

export const removeFromCartTrpcRoute = publicProcedure
  .input(removeFromCartInput)
  .mutation(async ({ ctx, input }) => {
    const prisma = ctx.prisma
    await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: {
          id: input.cartItemId,
        },
        include: { cart: true },
      })
      if (!cartItem) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'элемент корзины не найден',
        })
      }

      if (cartItem.cart.userId !== input.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'элемент корзины не принадлежит пользователю',
        })
      }

      await tx.plantInstance.update({
        where: {
          id: cartItem.plantInstanceId,
        },
        data: {
          status: 'AVAILABLE',
        },
      })

      await tx.cartItem.delete({
        where: {
          id: input.cartItemId,
        },
      })
    })
  })
