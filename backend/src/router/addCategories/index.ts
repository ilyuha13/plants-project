import { trpc } from '../../lib/trpc'
import { zAddCategoriesTrpcInput } from './input'

export const addCategoriesTrpcRoute = trpc.procedure.input(zAddCategoriesTrpcInput).mutation(async ({ ctx, input }) => {
  const exCategory = await ctx.prisma.category.findMany({
    where: {
      name: input.name,
    },
  })
  if (exCategory.length > 0) {
    throw Error('такое уже есть')
  }
  await ctx.prisma.category.create({
    data: input,
  })
  return true
})
