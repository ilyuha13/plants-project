import { zDeletePlantTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const deletePlantTrpcRoute = adminProcedure
  .input(zDeletePlantTrpcInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.plant.delete({
      where: { id: input.id },
    })

    return { success: true }
  })
