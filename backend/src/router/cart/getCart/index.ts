import { getCartTRPCInput } from './input'
import { publicProcedure } from '../../../lib/trpc'

export const getCartTrpcRoute = publicProcedure
  .input(getCartTRPCInput)
  .query(async ({ ctx, input }) => {
    const prisma = ctx.prisma
    const cart = await prisma.cart.findUnique({
      where: { userId: input.userId },
      include: {
        items: {
          include: { plantInstance: { include: { plant: true } } },
        },
      },
    })
    return cart
  })
