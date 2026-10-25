import { randomUUID } from 'node:crypto'

import { type PlantStatus, type Role, type User, type OrderStatus } from '@prisma/client'

import { createPrismaClient } from '../lib/prisma'
import { createTrpcRouter } from '../lib/trpc'
import { cancelOrderTrpcRoute } from '../router/cancelOrder'
import { addToCartTrpcRoute } from '../router/cart/addToCart'
import { checkoutTrpcRoute } from '../router/cart/checkout'
import { getCartTrpcRoute } from '../router/cart/getCart'
import { removeFromCartTrpcRoute } from '../router/cart/removeFromCart'
import { deletePlantInstanceTrpcRoute } from '../router/deletePlantInstance'

export const prisma = createPrismaClient()
const router = createTrpcRouter({
  addToCart: addToCartTrpcRoute,
  checkout: checkoutTrpcRoute,
  getCart: getCartTrpcRoute,
  removeFromCart: removeFromCartTrpcRoute,
  cancelOrder: cancelOrderTrpcRoute,
  deletePlantInstance: deletePlantInstanceTrpcRoute,
})
export const callerFor = (me: User | null) =>
  router.createCaller({
    prisma,
    me,
    stop: async () => {
      await prisma.$disconnect()
    },
  })
export const createUser = (role: Role = 'USER') =>
  prisma.user.create({
    data: { nick: `test-${randomUUID()}`, password: 'unused-test-password', role },
  })
export const createInstance = async (status: PlantStatus = 'AVAILABLE') => {
  const suffix = randomUUID()
  return prisma.plantInstance.create({
    data: {
      inventoryNumber: suffix,
      price: '1250.50',
      status,
      imagesUrl: [],
      plant: {
        create: {
          name: `Plant ${suffix}`,
          description: 'Test plant',
          imagesUrl: [],
          genus: { create: { name: suffix, imagesUrl: [] } },
          variegation: { create: { name: suffix, imagesUrl: [] } },
          lifeForm: { create: { name: suffix, imagesUrl: [] } },
        },
      },
    },
  })
}
export const createCart = (userId: string, plantInstanceId: string) =>
  prisma.cart.create({
    data: {
      userId,
      reservedUntil: new Date(Date.now() + 3600000),
      items: { create: { plantInstanceId } },
    },
    include: { items: true },
  })
export const createOrder = (
  userId: string,
  plantInstanceId: string,
  status: OrderStatus = 'PENDING',
) =>
  prisma.order.create({
    data: {
      userId,
      status,
      customerName: 'Test customer',
      customerPhone: '000',
      totalAmount: '1250.50',
      items: { create: { plantInstanceId } },
    },
  })
