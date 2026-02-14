import { zDeleteVariegationTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const deleteVariegationTrpcRoute = adminProcedure
  .input(zDeleteVariegationTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { variegationId } = input

    await ctx.prisma.variegation.delete({
      where: { id: variegationId },
    })

    return { success: true }
  })
