import { zGetOrderTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const getOrderTrpcRoute = trpc.procedure
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
