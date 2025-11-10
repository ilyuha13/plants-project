import { vi } from 'vitest'

interface MockPrismaClient {
  cart: {
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
  }
  cartItem: {
    create: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
    findMany: ReturnType<typeof vi.fn>
    deleteMany: ReturnType<typeof vi.fn>
  }
  plantInstance: {
    findUnique: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    updateMany: ReturnType<typeof vi.fn>
  }
}

export const mockPrisma: MockPrismaClient = {
  cart: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  cartItem: {
    create: vi.fn(),
    delete: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  plantInstance: {
    findUnique: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
}

export const createTestCart = (overrides = {}) => ({
  id: 'test-cart-id',
  userId: 'test-user-id',
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createTestCartItem = (overrides = {}) => ({
  id: 'test-cart-item-id',
  cartId: 'test-cart-id',
  plantInstanceId: 'test-plant-instance-id',
  addedAt: new Date(),
  cart: createTestCart(),
  ...overrides,
})

export const createTestPlantInstance = (overrides = {}) => ({
  Id: 'test-plant-instance-id',
  inventoryNumber: '001',
  plantId: 'test-plant-id',
  description: 'A beautiful plant',
  imagesUrl: ['http://example.com/plant.jpg'],
  price: '19.99',
  status: 'AVAILABLE' as const,
  reservedUntil: null,
  createdAt: new Date(),
  cartItems: [],
  ...overrides,
})

export const createTestUser = (overrides = {}) => ({
  id: 'test-user-id',
  nick: 'testuser',
  password: 'hashedpassword',
  createdAt: new Date(),
  role: 'USER' as const,
  ...overrides,
})
