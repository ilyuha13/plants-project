import { withInventoryVisibility } from '../../../lib/inventoryVisibility'
import { protectedProcedure } from '../../../lib/trpc'

export const getCartTrpcRoute = protectedProcedure.query(async ({ ctx }) => {
  const prisma = ctx.prisma
  const cart = await prisma.cart.findUnique({
    where: { userId: ctx.me.id },
    omit: { adminComment: true },
    include: {
      items: {
        include: { plantInstance: { include: { plant: true } } },
      },
    },
  })
  return cart
    ? {
        ...cart,
        items: cart.items.map((item) => ({
          ...item,
          plantInstance: withInventoryVisibility(
            item.plantInstance,
            ctx.me.role === 'ADMIN',
          ),
        })),
      }
    : null
})
