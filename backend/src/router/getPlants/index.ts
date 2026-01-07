import { trpc } from '../../lib/trpc'

export const getPlantsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const plants = await ctx.prisma.plant.findMany({
    select: {
      plantId: true,
      genus: true,
      lifeForm: true,
      variegation: true,
      name: true,
      description: true,
      imagesUrl: true,
    },
  })

  return {
    plants: plants.map((plant) => ({
      id: plant.plantId,
      ...plant,
    })),
  }
})
