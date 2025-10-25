import { TRPCError } from '@trpc/server'
import { trpc } from '../../lib/trpc'
import { zDeletePlantTrpcInput } from './input'

export const deletePlantTrpcRoute = trpc.procedure.input(zDeletePlantTrpcInput).mutation(async ({ ctx, input }) => {
  const { plantId } = input

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
    where: { plantId },
  })

  return { success: true }
})
