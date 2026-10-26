import { TRPCError } from '@trpc/server'

import { zGetPlantInstanceTrpcInput } from './input'
import { withInventoryVisibility } from '../../lib/inventoryVisibility'
import { publicProcedure } from '../../lib/trpc'

export const getPlantInstanceTrpcRoute = publicProcedure
  .input(zGetPlantInstanceTrpcInput)
  .query(async ({ ctx, input }) => {
    const instance = await ctx.prisma.plantInstance.findUnique({
      where: {
        id: input.id,
      },
      include: {
        plant: {
          select: {
            id: true,
            name: true,
            genus: true,
          },
        },
      },
    })

    if (!instance) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Экземпляр растения не найден',
      })
    }

    return { instance: withInventoryVisibility(instance, ctx.me?.role === 'ADMIN') }
  })
