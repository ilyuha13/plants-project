import { zDeleteLifeFormTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const deleteLifeFormTrpcRoute = adminProcedure
  .input(zDeleteLifeFormTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { lifeFormId } = input

    await ctx.prisma.lifeForm.delete({
      where: { id: lifeFormId },
    })

    return { success: true }
  })
