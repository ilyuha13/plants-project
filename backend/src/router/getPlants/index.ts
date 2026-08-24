import { publicProcedure } from '../../lib/trpc'

export const getPlantsTrpcRoute = publicProcedure.query(async ({ ctx }) => {
  const plants = await ctx.prisma.plant.findMany({
    include: {
      plantInstances: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  })

  return { plants }
})
