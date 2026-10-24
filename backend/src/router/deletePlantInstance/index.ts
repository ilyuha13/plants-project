import { TRPCError } from '@trpc/server'

import { zDeletePlantInstanceTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const deletePlantInstanceTrpcRoute = adminProcedure
  .input(zDeletePlantInstanceTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const instance = await ctx.prisma.plantInstance.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        _count: {
          select: {
            cartItems: true,
            orderItems: true,
          },
        },
      },
    })

    if (!instance) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Экземпляр не найден',
      })
    }

    if (instance._count.orderItems > 0) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Экземпляр нельзя удалить, потому что он присутствует в истории заказа',
      })
    }

    if (instance._count.cartItems > 0) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Экземпляр нельзя удалить, пока он находится в корзине',
      })
    }

    await ctx.prisma.plantInstance.delete({
      where: { id: input.id },
    })

    return { success: true }
  })
