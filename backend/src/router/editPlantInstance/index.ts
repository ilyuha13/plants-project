import { TRPCError } from '@trpc/server'

import { zEditPlantInstanceTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const editPlantInstanceTrpcRoute = adminProcedure
  .input(zEditPlantInstanceTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input
    const plantInstance = await ctx.prisma.plantInstance.findUnique({
      where: {
        id,
      },
    })

    if (!plantInstance) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Экземпляр растения не найден' })
    }

    const updatedPlantInstance = await ctx.prisma.plantInstance.update({
      where: {
        id,
      },
      data: updateData,
    })

    return updatedPlantInstance
  })
