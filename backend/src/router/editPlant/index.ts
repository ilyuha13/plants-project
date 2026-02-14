import { TRPCError } from '@trpc/server'

import { zEditPlantTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const editPlantTrpcRoute = adminProcedure
  .input(zEditPlantTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input
    const plant = await ctx.prisma.plant.findUnique({
      where: {
        id,
      },
    })

    if (!plant) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Растение не найдено',
      })
    }

    const updatedPlant = await ctx.prisma.plant.update({
      where: {
        id,
      },
      data: updateData,
    })
    return updatedPlant
  })
