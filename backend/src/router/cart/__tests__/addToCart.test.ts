import { beforeEach, describe, expect, it, vi } from 'vitest'

import { addToCart } from '../addToCart'
import { createTestCart, createTestCartItem, createTestPlantInstance, createTestUser, mockPrisma } from './helpers'

describe('addToCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('должен успешно добавить доступное растение в корзину', async () => {
    // ARRANGE
    const user = createTestUser()
    const cart = createTestCart({ userId: user.id })
    const plantInstance = createTestPlantInstance({ status: 'AVAILABLE' })

    mockPrisma.plantInstance.findUnique.mockResolvedValue(plantInstance)
    mockPrisma.cart.findUnique.mockResolvedValue(cart)
    mockPrisma.cartItem.findUnique.mockResolvedValue(null)
    mockPrisma.plantInstance.update.mockResolvedValue({
      ...plantInstance,
      status: 'IN_CART',
      reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    mockPrisma.cartItem.create.mockResolvedValue({
      id: 'new-cart-item-id',
      cartId: cart.id,
      plantInstanceId: plantInstance.Id,
      addedAt: new Date(),
    })

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await addToCart({ userId: user.id, plantInstanceId: plantInstance.Id }, mockPrisma as any)

    // ASSERT
    expect(result.success).toBe(true)
    expect(mockPrisma.plantInstance.update).toHaveBeenCalledWith({
      where: { Id: plantInstance.Id },
      data: {
        status: 'IN_CART',
        reservedUntil: expect.any(Date),
      },
    })
    expect(mockPrisma.cartItem.create).toHaveBeenCalledWith({
      data: {
        cartId: cart.id,
        plantInstanceId: plantInstance.Id,
      },
    })
  })
  it('должен создать новую корзину, если у пользователя нет корзины', async () => {
    // ARRANGE
    const user = createTestUser()
    const plantInstance = createTestPlantInstance({ status: 'AVAILABLE' })

    mockPrisma.plantInstance.findUnique.mockResolvedValue(plantInstance)
    mockPrisma.cart.findUnique.mockResolvedValue(null)
    mockPrisma.cart.create.mockResolvedValue(createTestCart({ id: 'new-cart-id', userId: user.id }))
    mockPrisma.cartItem.findUnique.mockResolvedValue(null)
    mockPrisma.plantInstance.update.mockResolvedValue({
      ...plantInstance,
      status: 'IN_CART',
      reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    mockPrisma.cartItem.create.mockResolvedValue({
      id: 'new-cart-item-id',
      cartId: 'new-cart-id',
      plantInstanceId: plantInstance.Id,
      addedAt: new Date(),
    })

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await addToCart({ userId: user.id, plantInstanceId: plantInstance.Id }, mockPrisma as any)

    // ASSERT
    expect(result.success).toBe(true)
    expect(mockPrisma.cart.create).toHaveBeenCalledWith({
      data: {
        userId: user.id,
      },
    })
    expect(mockPrisma.plantInstance.update).toHaveBeenCalledWith({
      where: { Id: plantInstance.Id },
      data: {
        status: 'IN_CART',
        reservedUntil: expect.any(Date),
      },
    })
    expect(mockPrisma.cartItem.create).toHaveBeenCalledWith({
      data: {
        cartId: 'new-cart-id',
        plantInstanceId: plantInstance.Id,
      },
    })
  })
  it('должен вернуть ошибку если растение не найдено', async () => {
    // ARRANGE
    const user = createTestUser()
    const plantInstanceId = 'non-existent-plant-id'

    mockPrisma.plantInstance.findUnique.mockResolvedValue(null)
    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await addToCart({ userId: user.id, plantInstanceId }, mockPrisma as any)

    // ASSERT
    expect(result).toEqual({
      success: false,
      error: 'PLANT_NOT_FOUND',
      message: 'Растение не найдено',
    })
  })
  it('должен вернуть ошибку если растение уже зарезервировано', async () => {
    // ARRANGE
    const user = createTestUser()
    const plantInstance = createTestPlantInstance({ status: 'IN_CART' })

    mockPrisma.plantInstance.findUnique.mockResolvedValue(plantInstance)
    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await addToCart({ userId: user.id, plantInstanceId: plantInstance.Id }, mockPrisma as any)

    // ASSERT
    expect(result).toEqual({
      success: false,
      error: 'PLANT_NOT_AVAILABLE',
      message: 'Растение недоступно',
    })
  })
  it('должен вернуть ошибку если растение уже продано', async () => {
    // ARRANGE
    const user = createTestUser()
    const plantInstance = createTestPlantInstance({ status: 'SOLD' })

    mockPrisma.plantInstance.findUnique.mockResolvedValue(plantInstance)
    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await addToCart({ userId: user.id, plantInstanceId: plantInstance.Id }, mockPrisma as any)

    // ASSERT
    expect(result).toEqual({
      success: false,
      error: 'PLANT_NOT_AVAILABLE',
      message: 'Растение недоступно',
    })
  })
  it('должен вернуть ошибку если растение уже в корзине', async () => {
    // ARRANGE
    const user = createTestUser()
    const cart = createTestCart({ userId: user.id })
    const plantInstance = createTestPlantInstance({ status: 'AVAILABLE' })
    const cartItem = createTestCartItem({ cartId: cart.id, plantInstanceId: plantInstance.Id })

    mockPrisma.plantInstance.findUnique.mockResolvedValue(plantInstance)
    mockPrisma.cart.findUnique.mockResolvedValue(cart)
    mockPrisma.cartItem.findUnique.mockResolvedValue(cartItem)

    // ACT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await addToCart({ userId: user.id, plantInstanceId: plantInstance.Id }, mockPrisma as any)

    // ASSERT
    expect(result).toEqual({
      success: false,
      error: 'ALREADY_IN_CART',
      message: 'Растение уже в корзине',
    })
  })
  describe('Database errors', () => {
    it('должен обработать ошибку базы данных', async () => {
      // ARRANGE
      const user = createTestUser()
      const plantInstanceId = 'some-plant-id'

      mockPrisma.plantInstance.findUnique.mockRejectedValue(new Error('DB failure'))

      // ACT
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await addToCart({ userId: user.id, plantInstanceId }, mockPrisma as any)
      // ASSERT
      expect(result).toEqual({
        success: false,
        message: 'Произошла ошибка при работе с базой данных',
        error: 'DB_ERROR',
      })
    })
  })
})
