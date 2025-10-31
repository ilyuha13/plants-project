import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getPlantInstanceTrpcRoute = trpc.procedure
  .input(
    z.object({
      Id: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const instance = await ctx.prisma.plantInstance.findUnique({
      where: {
        Id: input.Id,
      },
      select: {
        Id: true,
        inventoryNumber: true,
        plant: true,
        price: true,
        createdAt: true,
        description: true,
        imagesUrl: true,
      },
    })

    if (!instance) {
      throw new Error('plant not found')
    }

    return { instance }
  })
