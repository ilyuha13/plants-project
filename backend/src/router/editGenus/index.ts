import { zEditGenusTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const editGenusTrpcRoute = trpc.procedure.input(zEditGenusTrpcInput).mutation(async ({ input, ctx }) => {
  const genus = await ctx.prisma.genus.findUnique({
    where: {
      id: input.id,
    },
  })

  if (!genus) {
    throw new Error('Genus not found')
  }
  const updatedGenus = await ctx.prisma.genus.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      description: input.description,
      imagesUrl: input.imagesUrl,
    },
  })

  return updatedGenus
})
