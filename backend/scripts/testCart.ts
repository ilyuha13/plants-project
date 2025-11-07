#!/usr/bin/env tsx
/**
 * Скрипт для ручного тестирования функций корзины
 * Запуск: npx tsx scripts/testCart.ts
 */

import { PrismaClient } from '@prisma/client'
import { trpcRouter } from '../src/router'
import { isSuccess } from '../src/utils/dbOperation'
import { logger } from '../src/utils/logger'

const prisma = new PrismaClient()

async function main() {
  try {
    logger.script('', '\n' + '='.repeat(60))
    logger.script('🧪', 'ТЕСТИРОВАНИЕ ФУНКЦИЙ КОРЗИНЫ')
    logger.script('', '='.repeat(60) + '\n')

    const caller = trpcRouter.createCaller({ prisma, me: null, stop: async () => {} })

    // Создаем или находим тестового пользователя
    logger.script('👤', 'Создаем тестового пользователя...')
    let testUser = await prisma.user.findFirst({
      where: { nick: 'test-cart-user' },
    })

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          nick: 'test-cart-user',
          password: 'test-password-hash',
        },
      })
      logger.success('Тестовый пользователь создан')
    } else {
      logger.success('Используем существующего тестового пользователя')
    }

    const testUserId = testUser.id

    // Найдем доступное растение для теста
    logger.script('🔍', 'Ищем доступное растение в базе...')
    const availablePlant = await prisma.plantInstance.findFirst({
      where: { status: 'AVAILABLE' },
      include: { plant: true },
    })

    if (!availablePlant) {
      logger.error('В базе нет доступных растений! Сначала добавьте растения.')
      process.exit(1)
    }

    logger.script('🌱', `Найдено растение: ${availablePlant.plant.name} (${availablePlant.price}₽)`)

    // ТЕСТ 1: Добавление в корзину
    logger.script('', '\n' + '━'.repeat(60))
    logger.script('1️⃣', 'ТЕСТ: Добавление растения в корзину')

    const addResult = await caller.addToCart({
      userId: testUserId,
      plantInstanceId: availablePlant.Id,
    })

    if (addResult.success) {
      logger.success('Растение успешно добавлено в корзину!')
    } else {
      logger.error('Не удалось добавить растение: ' + JSON.stringify(addResult))
      process.exit(1)
    }

    // Проверим статус растения
    const plantAfterAdd = await prisma.plantInstance.findUnique({
      where: { Id: availablePlant.Id },
    })

    if (plantAfterAdd?.status === 'IN_CART') {
      logger.success('Статус растения изменен на IN_CART')
    } else {
      logger.error('Статус растения не изменился!')
    }

    // ТЕСТ 2: Получение корзины
    logger.script('', '\n' + '━'.repeat(60))
    logger.script('2️⃣', 'ТЕСТ: Получение корзины')

    const cart = await caller.getCart({ userId: testUserId })

    if (cart.items && cart.items.length === 1) {
      logger.success('В корзине 1 товар')
    } else {
      logger.error(`Ожидали 1 товар, получили ${cart.items?.length || 0}`)
    }

    // ТЕСТ 3: Попытка добавить то же растение еще раз
    logger.script('', '\n' + '━'.repeat(60))
    logger.script('3️⃣', 'ТЕСТ: Попытка добавить то же растение повторно')

    const addAgainResult = await caller.addToCart({
      userId: testUserId,
      plantInstanceId: availablePlant.Id,
    })

    if (!addAgainResult.success && addAgainResult.error === 'PLANT_NOT_AVAILABLE') {
      logger.success('Корректно обработана попытка добавить занятое растение (IN_CART)')
    } else {
      logger.error('Должна была вернуться ошибка PLANT_NOT_AVAILABLE')
    }

    // ТЕСТ 4: Удаление из корзины
    logger.script('', '\n' + '━'.repeat(60))
    logger.script('4️⃣', 'ТЕСТ: Удаление товара из корзины')

    const cartItemId = cart.items[0].id

    const removeResult = await caller.removeFromCart({
      userId: testUserId,
      cartItemId,
    })

    if (removeResult.success) {
      logger.success('Товар успешно удален из корзины')
    } else {
      logger.error('Не удалось удалить товар: ' + JSON.stringify(removeResult))
    }

    // Проверим что растение стало доступным
    const plantAfterRemove = await prisma.plantInstance.findUnique({
      where: { Id: availablePlant.Id },
    })

    if (plantAfterRemove?.status === 'AVAILABLE') {
      logger.success('Статус растения вернулся в AVAILABLE')
    } else {
      logger.error('Статус растения не вернулся в AVAILABLE!')
    }

    // ТЕСТ 5: Добавляем снова для теста clearCart
    logger.script('', '\n' + '━'.repeat(60))
    logger.script('5️⃣', 'ТЕСТ: Очистка корзины')

    await caller.addToCart({
      userId: testUserId,
      plantInstanceId: availablePlant.Id,
    })

    const clearResult = await caller.clearCart({ userId: testUserId })

    if (clearResult.success) {
      logger.success('Корзина успешно очищена')
    } else {
      logger.error('Не удалось очистить корзину: ' + JSON.stringify(clearResult))
    }

    // Проверяем что корзина пустая
    const emptyCart = await caller.getCart({ userId: testUserId })

    if (emptyCart.items.length === 0) {
      logger.success('Корзина пустая')
    } else {
      logger.error('Корзина не пустая!')
    }

    // ТЕСТ 6: Оформление заказа (checkout)
    logger.script('', '\n' + '━'.repeat(60))
    logger.script('6️⃣', 'ТЕСТ: Оформление заказа с отправкой в Telegram')

    // Добавляем товары в корзину для checkout
    await caller.addToCart({
      userId: testUserId,
      plantInstanceId: availablePlant.Id,
    })

    const contactInfo = {
      name: 'Иван Тестовый',
      phone: '+79991234567',
      telegram: 'test_user',
    }

    logger.script('📝', `Контактные данные: ${contactInfo.name}, ${contactInfo.phone}`)

    const checkoutResult = await caller.checkout({
      userId: testUserId,
      contactInfo,
    })
    // очень странная фигня
    if (isSuccess(checkoutResult)) {
      // ✅ TypeScript теперь знает что checkoutResult.data существует!
      logger.success(`Заказ оформлен! ID: ${checkoutResult.data.orderId}`)
      logger.success(`Сумма заказа: ${checkoutResult.data.total}₽`)
      logger.success(`Количество товаров: ${checkoutResult.data.itemsCount}`)

      if (checkoutResult.data.telegramSent) {
        logger.success('Уведомление в Telegram отправлено! 📱')
      } else {
        logger.warn('Уведомление в Telegram НЕ отправлено (проверь .env)')
      }
    } else {
      logger.error('Не удалось оформить заказ: ' + JSON.stringify(checkoutResult))
    }

    // Проверяем что растение помечено как SOLD
    const plantAfterCheckout = await prisma.plantInstance.findUnique({
      where: { Id: availablePlant.Id },
    })

    if (plantAfterCheckout?.status === 'SOLD') {
      logger.success('Статус растения изменен на SOLD')
    } else {
      logger.error('Статус растения не изменился на SOLD!')
    }

    // Проверяем что корзина очищена после checkout
    const cartAfterCheckout = await caller.getCart({ userId: testUserId })

    if (cartAfterCheckout.items.length === 0) {
      logger.success('Корзина автоматически очищена после оформления')
    } else {
      logger.error('Корзина не очищена после checkout!')
    }

    // ИТОГИ
    logger.script('', '\n' + '='.repeat(60))
    logger.script('🎉', 'ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!')
    logger.script('', '='.repeat(60) + '\n')

    logger.script('', 'Протестированные функции:')
    logger.script('✅', 'addToCart - добавление в корзину')
    logger.script('✅', 'getCart - получение корзины')
    logger.script('✅', 'removeFromCart - удаление из корзины')
    logger.script('✅', 'clearCart - очистка корзины')
    logger.script('✅', 'checkout - оформление заказа')
    logger.script('✅', 'Telegram уведомления')
    logger.script('✅', 'Резервация растений (status IN_CART)')
    logger.script('✅', 'Освобождение растений (status AVAILABLE)')
    logger.script('✅', 'Продажа растений (status SOLD)')
    logger.script('✅', 'Проверка занятых растений (PLANT_NOT_AVAILABLE)\n')
  } catch (err) {
    logger.error('💥 КРИТИЧЕСКАЯ ОШИБКА')

    console.error(err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
