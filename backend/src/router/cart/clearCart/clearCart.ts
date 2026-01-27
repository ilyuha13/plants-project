import { PrismaClient } from '@prisma/client'

import { dbOperation } from '../../../utils/dbOperation'

export async function clearCart({ userId }: { userId: string }, prisma: PrismaClient) {
  // 1. Найти корзину пользователя
  const cartResult = await dbOperation(
    () =>
      prisma.cart.findUnique({
        where: { userId },
      }),
    'clearCart - find cart',
  )

  if (!cartResult.success) {
    return cartResult
  }

  if (!cartResult.data) {
    return {
      success: false,
      error: 'CART_NOT_FOUND',
      message: 'Корзина не найдена',
    }
  }

  const cart = cartResult.data

  // 2. Получить все элементы корзины
  const cartItemsResult = await dbOperation(
    () =>
      prisma.cartItem.findMany({
        where: { cartId: cart.id },
      }),
    'clearCart - find cart items',
  )

  if (!cartItemsResult.success) {
    return cartItemsResult
  }

  const cartItems = cartItemsResult.data

  // 3. Если есть элементы - освободить растения
  if (cartItems.length > 0) {
    const plantInstanceIds = cartItems.map((item) => item.plantInstanceId)

    const releaseResult = await dbOperation(
      () =>
        prisma.plantInstance.updateMany({
          where: {
            id: {
              in: plantInstanceIds,
            },
          },
          data: {
            status: 'AVAILABLE',
            reservedUntil: null,
          },
        }),
      'clearCart - release plant instances',
    )

    if (!releaseResult.success) {
      return releaseResult
    }
  }

  // 4. Удалить все элементы корзины
  // тоже стоит обернуть в транзакцию
  const deleteResult = await dbOperation(
    () =>
      prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      }),
    'clearCart - delete cart items',
  )

  if (!deleteResult.success) {
    return deleteResult
  }

  return { success: true }
}
