import { getCart } from './getCart'
import { getCartInput } from './input'
import { trpc } from '../../../lib/trpc'

export const getCartTrpcRoute = trpc.procedure.input(getCartInput).query(async ({ ctx, input }) => {
  const cart = await getCart({ userId: input.userId }, ctx.prisma)
  return cart
})
