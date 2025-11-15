import { trpc } from '../../lib/trpc'

export const getPlantsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const plants = await ctx.prisma.plant.findMany({
    select: {
      plantId: true,
      genus: true, // Род растения для сортировки
      name: true,
      description: true,
      imagesUrl: true,
    },
    orderBy: {
      genus: 'asc', // Сортировка по роду (алфавитный порядок)
    },
  })

  return { plants }
})
