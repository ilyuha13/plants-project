import { zGetOrderTrpcInput } from './input'
import { publicProcedure } from '../../lib/trpc'

export const getOrderTrpcRoute = publicProcedure
  .input(zGetOrderTrpcInput)
  .query(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: { id: input.orderId },
      include: {
        items: {
          include: {
            plantInstance: {
              include: {
                plant: true,
              },
            },
          },
        },
      },
    })

    return { order }
  })
