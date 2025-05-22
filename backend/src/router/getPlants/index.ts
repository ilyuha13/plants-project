import { trpc } from '../../lib/trpc'

export const getPlantsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const plants = await ctx.prisma.plant.findMany({
    select: {
      plantId: true,
      genus: true,
      species: true,
      description: true,
      createdAt: true,
      categoryId: true,
      imageSrc: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return { plants }
})
