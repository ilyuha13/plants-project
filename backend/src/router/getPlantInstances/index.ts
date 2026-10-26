import { withInventoryVisibility } from '../../lib/inventoryVisibility'
import { publicProcedure } from '../../lib/trpc'

export const getPlantInstancesTrpcRoute = publicProcedure.query(async ({ ctx }) => {
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

  return {
    instances: instances.map((instance) =>
      withInventoryVisibility(instance, ctx.me?.role === 'ADMIN'),
    ),
  }
})
