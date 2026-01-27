import { zEditPlantInstanceTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const editPlantInstanceTrpcRoute = trpc.procedure
  .input(zEditPlantInstanceTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const plantInstance = await ctx.prisma.plantInstance.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!plantInstance) {
      throw new Error('Plant instance not found')
    }
    try {
      const updatedPlantInstance = await ctx.prisma.plantInstance.update({
        where: {
          id: input.id,
        },
        data: {
          plantId: input.plantId,
          description: input.description,
          price: input.price,
          inventoryNumber: input.inventoryNumber,
          imagesUrl: input.imagesUrl,
        },
      })
      return updatedPlantInstance
    } catch (error) {
      console.error('Error updating plant instance:', error)
      throw new Error('Failed to update plant instance')
    }
  })
