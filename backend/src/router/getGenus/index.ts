import { trpc } from '../../lib/trpc'

export const getGenusTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const genus = await ctx.prisma.genus.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imagesUrl: true,
    },
  })

  return { genus }
})
