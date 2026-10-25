import { TRPCError } from '@trpc/server'

import { addToCartInput } from './input'
import { protectedProcedure } from '../../../lib/trpc'

export const addToCartTrpcRoute = protectedProcedure
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

    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId: ctx.me.id },
        create: { userId: ctx.me.id },
        update: { updatedAt: new Date() },
      })

      const reserved = await tx.plantInstance.updateMany({
        where: {
          id: input.plantInstanceId,
          status: 'AVAILABLE',
        },
        data: {
          status: 'IN_CART',
        },
      })

      if (reserved.count !== 1) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'растение уже недоступно',
        })
      }

      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          plantInstanceId: input.plantInstanceId,
        },
      })

      const now = new Date()
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

      if (cart.reservationType === 'AUTOMATIC') {
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
