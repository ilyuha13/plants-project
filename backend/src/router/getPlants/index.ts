import { trpc } from '../../lib/trpc'

export const getPlantsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const plants = await ctx.prisma.plant.findMany({
    select: {
      plantId: true,
      variety: true,
      genus: true,
      description: true,
      createdAt: true,
      imagesUrl: true,
      price: true,
    },
  })

  return { plants }
})
