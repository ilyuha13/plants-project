import { protectedProcedure } from '../../../lib/trpc'

export const getCartTrpcRoute = protectedProcedure.query(async ({ ctx }) => {
  const prisma = ctx.prisma
  const cart = await prisma.cart.findUnique({
    where: { userId: ctx.me.id },
    include: {
      items: {
        include: { plantInstance: { include: { plant: true } } },
      },
    },
  })
  return cart
})
