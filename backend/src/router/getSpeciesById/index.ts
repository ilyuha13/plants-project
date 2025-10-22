import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getSpeciesByIdTrpcRoute = trpc.procedure
  .input(z.object({ speciesId: z.string() }))
  .query(async ({ ctx, input }) => {
    const species = await ctx.prisma.species.findUnique({
      where: {
        speciesId: input.speciesId,
      },
      select: {
        name: true,
        description: true,
        imagesUrl: true,
      },
    })

    if (!species) {
      throw new Error('species not found')
    }

    return { species }
  })
