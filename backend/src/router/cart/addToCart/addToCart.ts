import { PrismaClient } from '@prisma/client'

import { dbOperation } from '../../../utils/dbOperation'

export async function addToCart(
  { userId, plantInstanceId }: { userId: string; plantInstanceId: string },
  prisma: PrismaClient,
) {
  const plantInstanceResult = await dbOperation(
    () =>
      prisma.plantInstance.findUnique({
        where: { Id: plantInstanceId },
      }),
    'addToCart - find plantInstance',
  )

  if (!plantInstanceResult.success) {
    return plantInstanceResult
  }

  if (!plantInstanceResult.data) {
    return { success: false, error: 'PLANT_NOT_FOUND', message: 'Растение не найдено' }
  }
  const plantInstance = plantInstanceResult.data

  if (plantInstance.status !== 'AVAILABLE') {
    return { success: false, error: 'PLANT_NOT_AVAILABLE', message: 'Растение недоступно' }
  }

  const cartResult = await dbOperation(
    () =>
      prisma.cart.findUnique({
        where: { userId },
      }),
    'addToCart - find cart',
  )

  if (!cartResult.success) {
    return cartResult
  }
  let cart = cartResult.data

  if (!cart) {
    const newCartResult = await dbOperation(
      () =>
        prisma.cart.create({
          data: {
            userId,
          },
        }),
      'addToCart - create cart',
    )

    if (!newCartResult.success) {
      return newCartResult
    }

    cart = newCartResult.data
  }
  // возможно не нужно
  const checkItemResult = await dbOperation(
    () =>
      prisma.cartItem.findUnique({
        where: { cartId_plantInstanceId: { cartId: cart.id, plantInstanceId } },
      }),
    'addToCart - check existing cart item',
  )

  if (!checkItemResult.success) {
    return checkItemResult
  }

  if (checkItemResult.data) {
    return { success: false, error: 'ALREADY_IN_CART', message: 'Растение уже в корзине' }
  }

  const reservResult = await dbOperation(
    () =>
      prisma.plantInstance.update({
        where: { Id: plantInstanceId },
        data: {
          status: 'IN_CART',
          reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      }),
    'addToCart - reserve plant instance',
  )

  if (!reservResult.success) {
    return reservResult
  }

  const createCartItemResult = await dbOperation(
    () =>
      prisma.cartItem.create({
        data: {
          cartId: cart.id,
          plantInstanceId,
        },
      }),
    'addToCart - create cart item',
  )

  if (!createCartItemResult.success) {
    // сделать откат с помошью транзакций?
    await dbOperation(
      () =>
        prisma.plantInstance.update({
          where: { Id: plantInstanceId },
          data: {
            status: 'AVAILABLE',
            reservedUntil: null,
          },
        }),
      'addToCart - rollback plant instance reservation',
    )
    return createCartItemResult
  }

  return { success: true }
}
