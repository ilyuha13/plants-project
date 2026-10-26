import { zGetOrderTrpcInput } from './input'
import { withInventoryVisibility } from '../../lib/inventoryVisibility'
import { protectedProcedure } from '../../lib/trpc'

export const getOrderTrpcRoute = protectedProcedure
  .input(zGetOrderTrpcInput)
  .query(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findFirst({
      where: {
        id: input.orderId,
        ...(ctx.me.role === 'ADMIN' ? {} : { userId: ctx.me.id }),
      },
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

    const isAdmin = ctx.me.role === 'ADMIN'
    return {
      order: order
        ? {
            ...order,
            items: order.items.map((item) => ({
              ...withInventoryVisibility(item, isAdmin),
              plantInstance: withInventoryVisibility(item.plantInstance, isAdmin),
            })),
          }
        : null,
    }
  })
