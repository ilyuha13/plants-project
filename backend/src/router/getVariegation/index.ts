import { trpc } from '../../lib/trpc'

export const getVariegationTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const variegation = await ctx.prisma.variegation.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imagesUrl: true,
      plants: {
        select: {
          id: true,
        },
      },
    },
  })

  return { variegation }
})
