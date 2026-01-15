import { z } from 'zod'

import { trpc } from '../../lib/trpc'

export const getPlantTrpcRoute = trpc.procedure
  .input(
    z.object({
      plantId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
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
          genusId: true,
          variegationId: true,
          lifeFormId: true,
        },
      })

      if (!plant) {
        throw new Error('plant not found')
      }

      return { plant }
    } catch (error) {
      console.error('Error fetching plant:', error)
      throw new Error('Failed to fetch plant')
    }
  })
