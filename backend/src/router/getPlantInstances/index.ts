import { trpc } from '../../lib/trpc'

export const getPlantInstancesTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const instances = await ctx.prisma.plantInstance.findMany({
    where: {
      status: 'AVAILABLE',
    },
    select: {
      id: true,
      inventoryNumber: true,
      plant: true,
      price: true,
      createdAt: true,
      description: true,
      imagesUrl: true,
      status: true,
    },
  })

  return { instances }
})
