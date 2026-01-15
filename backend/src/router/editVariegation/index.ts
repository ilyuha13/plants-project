import { zEditVariegationTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const editVariegationTrpcRoute = trpc.procedure
  .input(zEditVariegationTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const varegation = await ctx.prisma.variegation.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!varegation) {
      throw new Error('Variegation not found')
    }
    const updatedVariegation = await ctx.prisma.variegation.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        description: input.description,
        imagesUrl: input.imagesUrl,
      },
    })

    return updatedVariegation
  })
