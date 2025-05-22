import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getPlantTrpcRoute = trpc.procedure
  .input(
    z.object({
      plantId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const plant = await ctx.prisma.plant.findUnique({
      where: {
        plantId: input.plantId,
      },
    })

    if (!plant) {
      throw new Error('plant not found')
    }

    return { plant }
  })
