import { beforeEach, describe, expect, it, vi } from 'vitest'

import { removeFromCart } from '../removeFromCart'
import { createTestCart, createTestCartItem, createTestPlantInstance, createTestUser, mockPrisma } from './helpers'

describe('removeFromcart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('должен успешно удалить растение из корзины', async () => {
    // ARRANGE
    const user = createTestUser()
    const cart = createTestCart({ userId: user.id })
    const plantInstance = createTestPlantInstance({ status: 'IN_CART' })
    const cartItem = createTestCartItem({ cartId: cart.id, cart: cart, plantInstanceId: plantInstance.Id })

    mockPrisma.cartItem.findUnique.mockResolvedValue(cartItem)
    mockPrisma.plantInstance.update.mockResolvedValue({
      ...plantInstance,
      status: 'AVAILABLE',
      reservedUntil: null,
    })
    mockPrisma.cartItem.delete.mockResolvedValue(cartItem)

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await removeFromCart({ userId: user.id, cartItemId: cartItem.id }, mockPrisma as any)
    // ASSERT
    expect(result.success).toBe(true)
    expect(mockPrisma.plantInstance.update).toHaveBeenCalledWith({
      where: { Id: plantInstance.Id },
      data: {
        status: 'AVAILABLE',
        reservedUntil: null,
      },
    })
    expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({
      where: { id: cartItem.id },
    })
  })
  it('должен вернуть ошибку, если элемент корзины не найден', async () => {
    // ARRANGE
    const user = createTestUser()

    mockPrisma.cartItem.findUnique.mockResolvedValue(null)

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await removeFromCart({ userId: user.id, cartItemId: 'non-existent-id' }, mockPrisma as any)

    // ASSERT
    expect(result).toEqual({
      success: false,
      error: 'CART_ITEM_NOT_FOUND',
      message: 'Элемент корзины не найден',
    })
  })
  it('должен вернуть ошибку, если пользователь не владеет элементом корзины', async () => {
    // ARRANGE
    const user = createTestUser()
    const anotherUser = createTestUser({ id: 'another-user-id' })
    const cart = createTestCart({ userId: anotherUser.id })
    const plantInstance = createTestPlantInstance({ status: 'IN_CART' })
    const cartItem = createTestCartItem({ cartId: cart.id, cart: cart, plantInstanceId: plantInstance.Id })

    mockPrisma.cartItem.findUnique.mockResolvedValue(cartItem)

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await removeFromCart({ userId: user.id, cartItemId: cartItem.id }, mockPrisma as any)

    // ASSERT
    expect(result).toEqual({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Нет доступа к этому элементу корзины',
    })
  })
  describe('Database Errors', () => {
    it('должен обработать ошибку базы данных', async () => {
      // ARRANGE
      mockPrisma.cartItem.findUnique.mockRejectedValue(new Error('DB Error'))
      // ACT
      const result = await removeFromCart(
        {
          userId: 'user-1',
          cartItemId: 'item-1',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockPrisma as any,
      )
      // ASSERT
      expect(result.success).toBe(false)
      expect(result.error).toBe('DB_ERROR')
    })
  })
})
