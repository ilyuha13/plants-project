import { zGetPlantTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const getPlantTrpcRoute = trpc.procedure
  .input(zGetPlantTrpcInput)
  .query(async ({ ctx, input }) => {
    try {
      const isAdmin = ctx.me?.role === 'ADMIN'
      const plant = await ctx.prisma.plant.findUnique({
        where: {
          id: input.id,
        },
        select: {
          plantInstances: {
            where: isAdmin ? {} : { status: 'AVAILABLE' },
          },
          id: true,
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
