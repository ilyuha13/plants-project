import { TRPCError } from '@trpc/server'

import { addToCartInput } from './input'
import { publicProcedure } from '../../../lib/trpc'
import { signJWT } from '../../../utils/signJWT'

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

    return prisma.$transaction(async (tx) => {
      // Проверка доступности и резервирование выполняются одним запросом.
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

      let userId = ctx.me?.id
      let token = ''

      if (!userId) {
        const randomNick = Math.random().toString(36).substring(2, 15)
        const user = await tx.user.create({
          data: {
            nick: randomNick,
            password: 'password',
            isGuest: true,
          },
        })
        userId = user.id
        token = signJWT(userId)
      }

      let cart = await tx.cart.findUnique({
        where: {
          userId,
        },
      })

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId,
          },
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
      return { token }
    })
  })
