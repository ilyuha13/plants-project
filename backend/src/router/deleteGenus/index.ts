import { zDeleteGenusTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const deleteGenusTrpcRoute = adminProcedure
  .input(zDeleteGenusTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { genusId } = input

    await ctx.prisma.genus.delete({
      where: { id: genusId },
    })

    return { success: true }
  })
