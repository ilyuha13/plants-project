import { zAddPlantInstanceTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const addPlantInstanceTrpcRoute = adminProcedure
  .input(zAddPlantInstanceTrpcInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.plantInstance.create({
      data: input,
    })
    return true
  })
