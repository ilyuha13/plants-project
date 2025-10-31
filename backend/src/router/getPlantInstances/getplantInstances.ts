import { trpc } from '../../lib/trpc'

export const getPlantInstancesTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const instances = await ctx.prisma.plantInstance.findMany({
    select: {
      Id: true,
      inventoryNumber: true,
      plant: true,
      price: true,
      createdAt: true,
      description: true,
      imagesUrl: true,
    },
  })

  return { instances }
})
