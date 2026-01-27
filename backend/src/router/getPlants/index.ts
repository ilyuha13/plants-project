import { trpc } from '../../lib/trpc'

export const getPlantsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const plants = await ctx.prisma.plant.findMany({
    select: {
      id: true,
      genus: true,
      lifeForm: true,
      variegation: true,
      name: true,
      description: true,
      imagesUrl: true,
      plantInstances: {
        select: {
          id: true,
        },
      },
    },
  })

  return { plants }
})
