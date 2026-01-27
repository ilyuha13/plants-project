import { zGetPlantInstanceTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const getPlantInstanceTrpcRoute = trpc.procedure
  .input(zGetPlantInstanceTrpcInput)
  .query(async ({ ctx, input }) => {
    const instance = await ctx.prisma.plantInstance.findUnique({
      where: {
        id: input.id,
      },
      include: {
        plant: {
          select: {
            id: true,
            name: true,
            genus: true,
          },
        },
      },
    })

    if (!instance) {
      throw new Error('plant not found')
    }

    return { instance }
  })
