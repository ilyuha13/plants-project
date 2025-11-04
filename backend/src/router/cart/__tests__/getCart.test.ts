import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCart } from '../getCart'
import { createTestCart, createTestCartItem, createTestPlantInstance, createTestUser, mockPrisma } from './helpers'

describe('getCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('должен вернуть пустую корзину для пользователя без корзины', async () => {
    // ARRANGE
    const user = createTestUser()
    mockPrisma.cart.findUnique.mockResolvedValue(null)
    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await getCart({ userId: user.id }, mockPrisma as any)
    // ASSERT
    expect(mockPrisma.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: user.id },
      include: { items: true },
    })
    expect(result).toEqual({ id: null, items: [] })
  })

  it('должен вернуть существующую корзину с элементами', async () => {
    // ARRANGE
    const user = createTestUser()
    const plantInstance = createTestPlantInstance()
    const cartItem = createTestCartItem({ plantInstanceId: plantInstance.Id })
    const cart = createTestCart({ items: [cartItem] })

    mockPrisma.cart.findUnique.mockResolvedValue(cart)

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await getCart({ userId: user.id }, mockPrisma as any)

    // ASSERT
    expect(mockPrisma.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: user.id },
      include: { items: true },
    })
    expect(result).toEqual(cart)
  })
})
