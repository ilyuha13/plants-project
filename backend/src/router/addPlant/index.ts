import { trpc } from '../../lib/trpc'
import { zAddPlantTrpcInput } from './input'

export const addPlantTrpcRoute = trpc.procedure.input(zAddPlantTrpcInput).mutation(async ({ ctx, input }) => {
  const exPlant = await ctx.prisma.plant.findMany({
    where: {
      genus: input.genus,
      species: input.species,
    },
  })
  if (exPlant.length > 0) {
    throw Error('такое уже есть')
  }
  await ctx.prisma.plant.create({
    data: input,
  })
  return true
})
