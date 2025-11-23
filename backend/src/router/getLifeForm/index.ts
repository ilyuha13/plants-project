import { trpc } from '../../lib/trpc'

export const getLifeFormTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const lifeForm = await ctx.prisma.lifeForm.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imagesUrl: true,
    },
  })

  return { lifeForm }
})
