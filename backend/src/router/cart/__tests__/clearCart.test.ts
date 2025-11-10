import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearCart } from '../clearCart'
import { createTestCart, createTestCartItem, createTestPlantInstance, createTestUser, mockPrisma } from './helpers'

describe('clearCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('должен успешно очистить корзину с товарами', async () => {
    // ARRANGE
    const user = createTestUser()
    const cart = createTestCart({ userId: user.id })
    const plantInstance1 = createTestPlantInstance({ Id: 'plant-1', status: 'IN_CART' })
    const plantInstance2 = createTestPlantInstance({ Id: 'plant-2', status: 'IN_CART' })
    const cartItem1 = createTestCartItem({ cartId: cart.id, plantInstanceId: plantInstance1.Id })
    const cartItem2 = createTestCartItem({ cartId: cart.id, plantInstanceId: plantInstance2.Id })

    mockPrisma.cart.findUnique.mockResolvedValue(cart)
    mockPrisma.cartItem.findMany.mockResolvedValue([cartItem1, cartItem2])
    mockPrisma.cartItem.deleteMany.mockResolvedValue({ count: 2 })
    mockPrisma.plantInstance.updateMany.mockResolvedValue({ count: 2 })

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await clearCart({ userId: user.id }, mockPrisma as any)

    // ASSERT
    expect(result.success).toBe(true)
    expect(mockPrisma.cartItem.findMany).toHaveBeenCalledWith({
      where: { cartId: cart.id },
    })
    expect(mockPrisma.plantInstance.updateMany).toHaveBeenCalledWith({
      where: {
        Id: {
          in: [plantInstance1.Id, plantInstance2.Id],
        },
      },
      data: {
        status: 'AVAILABLE',
        reservedUntil: null,
      },
    })
    expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { cartId: cart.id },
    })
  })

  it('должен успешно обработать пустую корзину', async () => {
    // ARRANGE
    const user = createTestUser()
    const cart = createTestCart({ userId: user.id })

    mockPrisma.cart.findUnique.mockResolvedValue(cart)
    mockPrisma.cartItem.findMany.mockResolvedValue([])
    mockPrisma.cartItem.deleteMany.mockResolvedValue({ count: 0 })

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await clearCart({ userId: user.id }, mockPrisma as any)

    // ASSERT
    expect(result.success).toBe(true)
    expect(mockPrisma.plantInstance.updateMany).not.toHaveBeenCalled()
    expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { cartId: cart.id },
    })
  })

  it('должен вернуть ошибку, если корзина не найдена', async () => {
    // ARRANGE
    const user = createTestUser()

    mockPrisma.cart.findUnique.mockResolvedValue(null)

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await clearCart({ userId: user.id }, mockPrisma as any)

    // ASSERT
    expect(result).toEqual({
      success: false,
      error: 'CART_NOT_FOUND',
      message: 'Корзина не найдена',
    })
  })

  describe('Database Errors', () => {
    it('должен обработать ошибку базы данных', async () => {
      // ARRANGE
      mockPrisma.cart.findUnique.mockRejectedValue(new Error('DB Error'))

      // ACT
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await clearCart({ userId: 'user-1' }, mockPrisma as any)

      // ASSERT
      expect(result.success).toBe(false)
      expect(result.error).toBe('DB_ERROR')
    })
  })
})
