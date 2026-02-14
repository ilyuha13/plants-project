import { zAddLifeFormTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const addLifeFormTrpcRoute = adminProcedure
  .input(zAddLifeFormTrpcInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.lifeForm.create({
      data: input,
    })
    return true
  })
