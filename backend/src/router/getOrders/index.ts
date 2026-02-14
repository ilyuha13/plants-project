import { adminProcedure } from '../../lib/trpc'

export const getOrdersTrpcRoute = adminProcedure.query(async ({ ctx }) => {
  const orders = await ctx.prisma.order.findMany({
    select: {
      customerName: true,
      createdAt: true,
      items: {
        select: {
          plantInstance: {
            select: {
              plant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      status: true,
      id: true,
    },
  })

  return { orders }
})
