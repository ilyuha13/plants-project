import { TRPCError } from '@trpc/server'

import { zDeletePlantTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const deletePlantTrpcRoute = trpc.procedure
  .input(zDeletePlantTrpcInput)
  .mutation(async ({ ctx, input }) => {
    // Check if user is authenticated
    if (!ctx.me) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to delete plants',
      })
    }

    // Check if user is admin
    if (ctx.me.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only admins can delete plants',
      })
    }

    // Delete plant
    await ctx.prisma.plant.delete({
      where: { id: input.id },
    })

    return { success: true }
  })
