import { z } from 'zod'

import { trpc } from '../../lib/trpc'

export const getPlantTrpcRoute = trpc.procedure
  .input(
    z.object({
      plantId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx.me?.role === 'ADMIN'
    const plant = await ctx.prisma.plant.findUnique({
      where: {
        plantId: input.plantId,
      },
      select: {
        plantInstances: {
          where: isAdmin ? {} : { status: 'AVAILABLE' },
        },
        plantId: true,
        name: true,
        description: true,
        imagesUrl: true,
      },
    })

    if (!plant) {
      throw new Error('plant not found')
    }

    return { plant }
  })
