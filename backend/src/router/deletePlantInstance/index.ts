import { zDeletePlantInstanceTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const deletePlantInstanceTrpcRoute = adminProcedure
  .input(zDeletePlantInstanceTrpcInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.plantInstance.delete({
      where: { id: input.id },
    })

    return { success: true }
  })
