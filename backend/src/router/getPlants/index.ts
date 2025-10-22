import { trpc } from '../../lib/trpc'

export const getPlantsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const plants = await ctx.prisma.plant.findMany({
    select: {
      plantId: true,
      description: true,
      createdAt: true,
      price: true,
      imagesUrl: true,
      variety: {
        select: {
          name: true,
          description: true,
          lifeForm: true,
          variegation: true,
          imagesUrl: true,
        },
      },
    },
  })

  return { plants }
})
