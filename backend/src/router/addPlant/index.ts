import { zAddPlantTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const addPlantTrpcRoute = adminProcedure
  .input(zAddPlantTrpcInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.plant.create({
      data: input,
    })
    return true
  })
