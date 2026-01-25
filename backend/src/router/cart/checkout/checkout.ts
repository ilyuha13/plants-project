import { PrismaClient } from '@prisma/client'

import { formatOrderMessage, sendTelegramMessage } from '../../../lib/telegram'
import { dbOperation } from '../../../utils/dbOperation'
import { logger } from '../../../utils/logger'

interface ContactInfo {
  name: string
  phone: string
  telegram?: string
}

interface CheckoutSuccessResult {
  success: true
  data: {
    orderId: string
    total: number
    itemsCount: number
    telegramSent: boolean
  }
}

interface CheckoutErrorResult {
  success: false
  error: string
  message: string
}

export type CheckoutResult = CheckoutSuccessResult | CheckoutErrorResult

export async function checkout(
  { userId, contactInfo }: { userId: string; contactInfo: ContactInfo },
  prisma: PrismaClient,
): Promise<CheckoutResult> {
  // 1. Получить корзину пользователя
  const cartResult = await dbOperation(
    () =>
      prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              plantInstance: {
                include: {
                  plant: true,
                },
              },
            },
          },
        },
      }),
    'checkout - find cart',
  )

  if (!cartResult.success) {
    return cartResult
  }

  const cart = cartResult.data

  if (!cart) {
    return {
      success: false,
      error: 'CART_NOT_FOUND',
      message: 'Корзина не найдена',
    }
  }

  if (cart.items.length === 0) {
    return {
      success: false,
      error: 'EMPTY_CART',
      message: 'Корзина пуста',
    }
  }

  // 2. Пометить все растения как SOLD
  const plantInstanceIds = cart.items.map((item) => item.plantInstanceId)

  const soldResult = await dbOperation(
    () =>
      prisma.plantInstance.updateMany({
        where: {
          Id: {
            in: plantInstanceIds,
          },
        },
        data: {
          status: 'SOLD',
          reservedUntil: null,
        },
      }),
    'checkout - mark plants as sold',
  )

  if (!soldResult.success) {
    return soldResult
  }

  // 3. Посчитать итоговую сумму
  const total = cart.items.reduce((sum, item) => {
    return sum + parseInt(item.plantInstance.price || '0', 10)
  }, 0)

  // 4. Создать заказ (опционально, можно добавить модель Order позже)
  const order = await prisma.order.create({
    data: {
      customerName: contactInfo.name,
      totalAmount: total + '',
      customerPhone: contactInfo.phone,
      userId: userId,
      items: {
        createMany: {
          data: cart.items.map((item) => ({ plantInstanceId: item.plantInstanceId })),
        },
      },
    },
  })
  const orderId = order.id

  // 5. Отправить уведомление в Telegram
  const orderMessage = formatOrderMessage({
    orderId,
    customerName: contactInfo.name,
    customerPhone: contactInfo.phone,
    customerTelegram: contactInfo.telegram,
    items: cart.items.map((item) => ({
      name: item.plantInstance.plant.name,
      price: item.plantInstance.price,
    })),
    total,
  })

  const telegramSent = await sendTelegramMessage(orderMessage)

  if (!telegramSent) {
    logger.warn('Telegram notification failed, but order is processed')
  }

  // 6. Очистить корзину
  const clearResult = await dbOperation(
    () =>
      prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      }),
    'checkout - clear cart',
  )

  if (!clearResult.success) {
    return clearResult
  }

  return {
    success: true,
    data: {
      orderId,
      total,
      itemsCount: cart.items.length,
      telegramSent,
    },
  }
}
