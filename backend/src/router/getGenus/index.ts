import { publicProcedure } from '../../lib/trpc'

export const getGenusTrpcRoute = publicProcedure.query(async ({ ctx }) => {
  const genus = await ctx.prisma.genus.findMany({
    include: {
      plants: {
        select: {
          id: true,
        },
      },
    },
  })

  return { genus }
})
