import { clearCart } from './clearCart'
import { clearCartInput } from './input'
import { trpc } from '../../../lib/trpc'

export const clearCartTrpcRoute = trpc.procedure.input(clearCartInput).mutation(async ({ ctx, input }) => {
  const result = await clearCart({ userId: input.userId }, ctx.prisma)
  return result
})
