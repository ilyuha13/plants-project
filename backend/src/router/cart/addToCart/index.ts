import { TRPCError } from '@trpc/server'

import { addToCartInput } from './input'
import { publicProcedure } from '../../../lib/trpc'

export const addToCartTrpcRoute = publicProcedure
  .input(addToCartInput)
  .mutation(async ({ ctx, input }) => {
    const prisma = ctx.prisma
    const plantInstance = await prisma.plantInstance.findUnique({
      where: {
        id: input.plantInstanceId,
      },
    })

    if (!plantInstance) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'не найден экземпляр растения',
      })
    }

    if (plantInstance.status !== 'AVAILABLE') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'растение недоступно',
      })
    }

    await prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({
        where: {
          userId: input.userId,
        },
      })

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId: input.userId,
          },
        })
      }

      await tx.plantInstance.update({
        where: {
          id: input.plantInstanceId,
        },
        data: {
          status: 'IN_CART',
        },
      })

      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          plantInstanceId: input.plantInstanceId,
        },
      })

      const now = new Date()
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

      if (
        cart.reservationType === 'AUTOMATIC' ||
        !cart.reservedUntil ||
        cart.reservedUntil < oneHourLater
      ) {
        await tx.cart.update({
          where: {
            id: cart.id,
          },
          data: {
            reservedUntil: oneHourLater,
          },
        })
      }
    })
  })
