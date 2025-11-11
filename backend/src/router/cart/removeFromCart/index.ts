import { removeFromCartInput } from './input'
import { removeFromCart } from './removeFromCart'
import { trpc } from '../../../lib/trpc'

export const removeFromCartTrpcRoute = trpc.procedure.input(removeFromCartInput).mutation(async ({ ctx, input }) => {
  const result = await removeFromCart({ userId: input.userId, cartItemId: input.cartItemId }, ctx.prisma)
  return result
})
