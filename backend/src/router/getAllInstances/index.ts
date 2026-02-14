import { publicProcedure } from '../../lib/trpc'

export const getAllInstancesTrpcRoute = publicProcedure.query(async ({ ctx }) => {
  const isAdmin = ctx.me?.role === 'ADMIN'
  const instances = await ctx.prisma.plantInstance.findMany({
    where: isAdmin
      ? {}
      : {
          status: 'AVAILABLE',
        },
    include: {
      plant: {
        select: {
          name: true,
        },
      },
    },
    omit: isAdmin
      ? {}
      : {
          status: true,
        },
  })

  return {
    instances: instances.map((instance) => {
      return {
        name: instance.plant.name,
        ...instance,
      }
    }),
  }
})
