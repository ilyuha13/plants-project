import { trpc } from '../../lib/trpc'
export const getCategoriesTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const categories = await ctx.prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  })

  return { categories }
})
