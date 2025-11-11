import { checkout } from './checkout'
import { checkoutInput } from './input'
import { trpc } from '../../../lib/trpc'

export const checkoutTrpcRoute = trpc.procedure.input(checkoutInput).mutation(async ({ ctx, input }) => {
  const result = await checkout({ userId: input.userId, contactInfo: input.contactInfo }, ctx.prisma)
  return result
})
