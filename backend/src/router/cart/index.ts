import { trpc } from '../../lib/trpc'
import { addToCart } from './addToCart'
import { checkout } from './checkout'
import { clearCart } from './clearCart'
import { getCart } from './getCart'
import { addToCartInput, checkoutInput, clearCartInput, getCartInput, removeFromCartInput } from './input'
import { removeFromCart } from './removeFromCart'

export const getCartTrpcRoute = trpc.procedure.input(getCartInput).query(async ({ ctx, input }) => {
  const cart = await getCart({ userId: input.userId }, ctx.prisma)
  return cart
})

export const addToCartTrpcRoute = trpc.procedure.input(addToCartInput).mutation(async ({ ctx, input }) => {
  const result = await addToCart({ userId: input.userId, plantInstanceId: input.plantInstanceId }, ctx.prisma)
  return result
})

export const removeFromCartTrpcRoute = trpc.procedure.input(removeFromCartInput).mutation(async ({ ctx, input }) => {
  const result = await removeFromCart({ userId: input.userId, cartItemId: input.cartItemId }, ctx.prisma)
  return result
})

export const clearCartTrpcRoute = trpc.procedure.input(clearCartInput).mutation(async ({ ctx, input }) => {
  const result = await clearCart({ userId: input.userId }, ctx.prisma)
  return result
})

export const checkoutTrpcRoute = trpc.procedure.input(checkoutInput).mutation(async ({ ctx, input }) => {
  const result = await checkout({ userId: input.userId, contactInfo: input.contactInfo }, ctx.prisma)
  return result
})
