import { zEditPlantTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const editPlantTrpcRoute = trpc.procedure
  .input(zEditPlantTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const plant = await ctx.prisma.plant.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!plant) {
      throw new Error('Plant not found')
    }
    try {
      const updatedPlant = await ctx.prisma.plant.update({
        where: {
          id: input.id,
        },
        data: {
          genusId: input.genusId,
          variegationId: input.variegationId,
          lifeFormId: input.lifeFormId,
          name: input.name,
          description: input.description,
          imagesUrl: input.imagesUrl,
        },
      })
      return updatedPlant
    } catch (error) {
      console.error('Error updating plant:', error)
      throw new Error('Failed to update plant')
    }
  })
