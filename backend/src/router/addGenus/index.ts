import { zAddGenusTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const addGenusTrpcRoute = adminProcedure
  .input(zAddGenusTrpcInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.genus.create({
      data: input,
    })
    return true
  })
