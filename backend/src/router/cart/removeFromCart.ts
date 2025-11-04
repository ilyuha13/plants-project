import { PrismaClient } from '@prisma/client'
import { dbOperation } from '../../utils/dbOperation'

export async function removeFromCart(
  { userId, cartItemId }: { userId: string; cartItemId: string },
  prisma: PrismaClient,
) {
  const cartItemResult = await dbOperation(
    () =>
      prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
      }),
    'removeFromCart - find cartItem',
  )
  if (!cartItemResult.success) {
    return cartItemResult
  }

  const cartItem = cartItemResult.data

  if (!cartItem) {
    return { success: false, error: 'CART_ITEM_NOT_FOUND', message: 'Элемент корзины не найден' }
  }

  if (cartItem.cart.userId !== userId) {
    return { success: false, error: 'UNAUTHORIZED', message: 'Нет доступа к этому элементу корзины' }
  }

  const plantInstanceResult = await dbOperation(
    () =>
      prisma.plantInstance.update({
        where: { Id: cartItem.plantInstanceId },
        data: {
          status: 'AVAILABLE',
          reservedUntil: null,
        },
      }),
    'removeFromCart - update plantInstance',
  )

  if (!plantInstanceResult.success) {
    return plantInstanceResult
  }

  const deleteCartItemResult = await dbOperation(
    () =>
      prisma.cartItem.delete({
        where: { id: cartItemId },
      }),
    'removeFromCart - delete cartItem',
  )

  if (!deleteCartItemResult.success) {
    return deleteCartItemResult
  }

  return { success: true }
}
