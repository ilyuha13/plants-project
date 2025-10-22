import { trpc } from '../../lib/trpc'

export const getSpeciesTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const species = await ctx.prisma.species.findMany({
    select: {
      name: true,
      description: true,
      imagesUrl: true,
      speciesId: true,
    },
  })

  if (!species) {
    throw new Error('species not found')
  }

  return { species }
})
