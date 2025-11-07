import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isError, isSuccess } from '../../../utils/dbOperation'
import { checkout } from '../checkout'
import { createTestCart, createTestCartItem, createTestPlantInstance, createTestUser, mockPrisma } from './helpers'

// Мокируем модуль telegram
vi.mock('../../../lib/telegram', () => ({
  sendTelegramMessage: vi.fn().mockResolvedValue(true),
  formatOrderMessage: vi.fn().mockReturnValue('Test order message'),
}))

describe('checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('должен успешно оформить заказ', async () => {
    // ARRANGE
    const user = createTestUser()
    const cart = createTestCart({ userId: user.id })
    const plantInstance1 = createTestPlantInstance({ Id: 'plant-1', price: '500', status: 'IN_CART' })
    const plantInstance2 = createTestPlantInstance({ Id: 'plant-2', price: '300', status: 'IN_CART' })

    const cartItem1 = createTestCartItem({
      cartId: cart.id,
      plantInstanceId: plantInstance1.Id,
      plantInstance: {
        ...plantInstance1,
        plant: { plantId: 'p1', name: 'Монстера', description: '', imagesUrl: [], plantInstances: [] },
      },
    })

    const cartItem2 = createTestCartItem({
      cartId: cart.id,
      plantInstanceId: plantInstance2.Id,
      plantInstance: {
        ...plantInstance2,
        plant: { plantId: 'p2', name: 'Фикус', description: '', imagesUrl: [], plantInstances: [] },
      },
    })

    mockPrisma.cart.findUnique.mockResolvedValue({
      ...cart,
      items: [cartItem1, cartItem2],
    })

    mockPrisma.plantInstance.updateMany.mockResolvedValue({ count: 2 })
    mockPrisma.cartItem.deleteMany.mockResolvedValue({ count: 2 })

    const contactInfo = {
      name: 'Иван Иванов',
      phone: '+79991234567',
      telegram: 'ivanov',
    }

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await checkout({ userId: user.id, contactInfo }, mockPrisma as any)

    // ASSERT
    expect(result.success).toBe(true)

    if (isSuccess(result)) {
      expect(result.data.itemsCount).toBe(2)
      expect(result.data.total).toBe(800) // 500 + 300
      expect(result.data.orderId).toMatch(/^ORDER-\d+$/)
    }

    // Проверяем что растения помечены как SOLD
    expect(mockPrisma.plantInstance.updateMany).toHaveBeenCalledWith({
      where: {
        Id: {
          in: ['plant-1', 'plant-2'],
        },
      },
      data: {
        status: 'SOLD',
        reservedUntil: null,
      },
    })

    // Проверяем что корзина очищена
    expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { cartId: cart.id },
    })
  })

  it('должен вернуть ошибку если корзина не найдена', async () => {
    // ARRANGE
    const user = createTestUser()

    mockPrisma.cart.findUnique.mockResolvedValue(null)

    const contactInfo = {
      name: 'Иван Иванов',
      phone: '+79991234567',
    }

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await checkout({ userId: user.id, contactInfo }, mockPrisma as any)

    // ASSERT
    expect(isError(result)).toBe(true)
    //это лишенее
    if (isError(result)) {
      expect(result.error).toBe('CART_NOT_FOUND')
      expect(result.message).toBe('Корзина не найдена')
    }
  })

  it('должен вернуть ошибку если корзина пустая', async () => {
    // ARRANGE
    const user = createTestUser()
    const cart = createTestCart({ userId: user.id })

    mockPrisma.cart.findUnique.mockResolvedValue({
      ...cart,
      items: [],
    })

    const contactInfo = {
      name: 'Иван Иванов',
      phone: '+79991234567',
    }

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await checkout({ userId: user.id, contactInfo }, mockPrisma as any)

    // ASSERT
    expect(result).toEqual({
      success: false,
      error: 'EMPTY_CART',
      message: 'Корзина пуста',
    })
  })

  it('должен корректно посчитать итоговую сумму', async () => {
    // ARRANGE
    const user = createTestUser()
    const cart = createTestCart({ userId: user.id })
    const plantInstance1 = createTestPlantInstance({ Id: 'plant-1', price: '1000', status: 'IN_CART' })
    const plantInstance2 = createTestPlantInstance({ Id: 'plant-2', price: '2500', status: 'IN_CART' })
    const plantInstance3 = createTestPlantInstance({ Id: 'plant-3', price: '500', status: 'IN_CART' })

    const cartItem1 = createTestCartItem({
      cartId: cart.id,
      plantInstanceId: plantInstance1.Id,
      plantInstance: {
        ...plantInstance1,
        plant: { plantId: 'p1', name: 'Растение 1', description: '', imagesUrl: [], plantInstances: [] },
      },
    })

    const cartItem2 = createTestCartItem({
      cartId: cart.id,
      plantInstanceId: plantInstance2.Id,
      plantInstance: {
        ...plantInstance2,
        plant: { plantId: 'p2', name: 'Растение 2', description: '', imagesUrl: [], plantInstances: [] },
      },
    })

    const cartItem3 = createTestCartItem({
      cartId: cart.id,
      plantInstanceId: plantInstance3.Id,
      plantInstance: {
        ...plantInstance3,
        plant: { plantId: 'p3', name: 'Растение 3', description: '', imagesUrl: [], plantInstances: [] },
      },
    })

    mockPrisma.cart.findUnique.mockResolvedValue({
      ...cart,
      items: [cartItem1, cartItem2, cartItem3],
    })

    mockPrisma.plantInstance.updateMany.mockResolvedValue({ count: 3 })
    mockPrisma.cartItem.deleteMany.mockResolvedValue({ count: 3 })

    const contactInfo = {
      name: 'Иван Иванов',
      phone: '+79991234567',
    }

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await checkout({ userId: user.id, contactInfo }, mockPrisma as any)

    // ASSERT
    expect(result.success).toBe(true)

    if (isSuccess(result)) {
      expect(result.data.total).toBe(4000) // 1000 + 2500 + 500
      expect(result.data.itemsCount).toBe(3)
    }
  })

  describe('Database Errors', () => {
    it('должен обработать ошибку базы данных при поиске корзины', async () => {
      // ARRANGE
      mockPrisma.cart.findUnique.mockRejectedValue(new Error('DB Error'))

      const contactInfo = {
        name: 'Иван Иванов',
        phone: '+79991234567',
      }

      // ACT
      const result = await checkout(
        {
          userId: 'user-1',
          contactInfo,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockPrisma as any,
      )

      // ASSERT
      if (isError(result)) {
        expect(result.success).toBe(false)
        expect(result.error).toBe('DB_ERROR')
      }
    })

    it('должен обработать ошибку при обновлении статуса растений', async () => {
      // ARRANGE
      const user = createTestUser()
      const cart = createTestCart({ userId: user.id })
      const plantInstance = createTestPlantInstance({ status: 'IN_CART' })

      const cartItem = createTestCartItem({
        cartId: cart.id,
        plantInstanceId: plantInstance.Id,
        plantInstance: {
          ...plantInstance,
          plant: { plantId: 'p1', name: 'Монстера', description: '', imagesUrl: [], plantInstances: [] },
        },
      })

      mockPrisma.cart.findUnique.mockResolvedValue({
        ...cart,
        items: [cartItem],
      })

      mockPrisma.plantInstance.updateMany.mockRejectedValue(new Error('DB Error'))

      const contactInfo = {
        name: 'Иван Иванов',
        phone: '+79991234567',
      }

      // ACT
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await checkout({ userId: user.id, contactInfo }, mockPrisma as any)

      // ASSERT
      if (isError(result)) {
        expect(result.success).toBe(false)
        expect(result.error).toBe('DB_ERROR')
      }
    })
  })
})
