import { trpc } from '../../lib/trpc'

export const getAllInstancesTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const instances = await ctx.prisma.plantInstance.findMany({
    select: {
      status: true,
      orderItems: true,
      plantId: true,
      reservedUntil: true,
      cartItems: true,
      Id: true,
      price: true,
      inventoryNumber: true,
      createdAt: true,
      updatedAt: true,
      plant: {
        select: {
          name: true,
        },
      },
      description: true,
      imagesUrl: true,
    },
  })

  return {
    instances: instances.map((instance) => {
      return {
        id: instance.Id,
        name: instance.plant.name,
        ...instance,
      }
    }),
  }
})
