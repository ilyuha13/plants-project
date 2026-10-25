import { TRPCError } from '@trpc/server'

import { removeFromCartInput } from './input'
import { protectedProcedure } from '../../../lib/trpc'

export const removeFromCartTrpcRoute = protectedProcedure
  .input(removeFromCartInput)
  .mutation(async ({ ctx, input }) => {
    const prisma = ctx.prisma
    await prisma.$transaction(async (tx) => {
      await tx.cart.updateMany({
        where: { userId: ctx.me.id },
        data: { updatedAt: new Date() },
      })
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

      if (cartItem.cart.userId !== ctx.me.id) {
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
