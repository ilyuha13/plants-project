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
        refunds: {
          select: {
            id: true,
            amount: true,
            createdAt: true,
            note: ctx.me.role === 'ADMIN',
            actorNick: ctx.me.role === 'ADMIN',
          },
          orderBy: { createdAt: 'asc' },
        },
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
            cancellationPayloadHash: undefined,
            cancellationRequestId: undefined,
            items: order.items.map((item) => ({
              ...withInventoryVisibility(item, isAdmin),
              releasedById: isAdmin ? item.releasedById : undefined,
              plantInstance: withInventoryVisibility(item.plantInstance, isAdmin),
            })),
          }
        : null,
    }
  })
