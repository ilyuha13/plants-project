import { zAddVariegationTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const addVariegationTrpcRoute = adminProcedure
  .input(zAddVariegationTrpcInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.variegation.create({
      data: input,
    })
    return true
  })
