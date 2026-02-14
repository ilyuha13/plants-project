import { publicProcedure } from '../../lib/trpc'

export const getVariegationTrpcRoute = publicProcedure.query(async ({ ctx }) => {
  const variegation = await ctx.prisma.variegation.findMany({
    include: {
      plants: {
        select: {
          id: true,
        },
      },
    },
  })

  return { variegation }
})
