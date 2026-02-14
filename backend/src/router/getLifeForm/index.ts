import { publicProcedure } from '../../lib/trpc'

export const getLifeFormTrpcRoute = publicProcedure.query(async ({ ctx }) => {
  const lifeForm = await ctx.prisma.lifeForm.findMany({
    include: {
      plants: {
        select: {
          id: true,
        },
      },
    },
  })

  return { lifeForm }
})
