import { addToCart } from './addToCart'
import { addToCartInput } from './input'
import { trpc } from '../../../lib/trpc'

export const addToCartTrpcRoute = trpc.procedure.input(addToCartInput).mutation(async ({ ctx, input }) => {
  try {
    const result = await addToCart({ userId: input.userId, plantInstanceId: input.plantInstanceId }, ctx.prisma)
    return result
  } catch {
    console.error('addToCart error')
  }
})
