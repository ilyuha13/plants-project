import { trpc } from '../../lib/trpc'

export const getPlantsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const plants = await ctx.prisma.plant.findMany({
    select: {
      plantId: true,
      name: true,
      description: true,
      imagesUrl: true,
    },
  })

  return { plants }
})
