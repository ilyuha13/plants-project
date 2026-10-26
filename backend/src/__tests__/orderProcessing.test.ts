import { describe, expect, it } from 'vitest'

import { callerFor, createInstance, createOrder, createUser, prisma } from './helpers'

const setup = async (
  deliveryType: 'PICKUP' | 'CITY' | 'POST' | 'OZON' | 'CDEK' | 'FIVEPOST' = 'POST',
) => {
  const admin = await createUser('ADMIN')
  const customer = await createUser()
  const instance = await createInstance('SOLD')
  const legacy = await createOrder(customer.id, instance.id, 'COLLECTING')
  const order = await prisma.order.update({
    where: { id: legacy.id },
    data: { paidAmount: '1250.50', deliveryType },
  })
  return { admin, customer, order, instance }
}

describe('Processing paid orders', () => {
  it('packs, ships and completes an order, preserving tracking, dates and sold inventory', async () => {
    const { admin, customer, order, instance } = await setup()
    const caller = callerFor(admin)
    await caller.advanceOrder({
      orderId: order.id,
      expectedStatus: 'COLLECTING',
      status: 'PACKED',
    })
    const packed = await prisma.order.findUniqueOrThrow({ where: { id: order.id } })
    expect(packed.packedAt).not.toBeNull()
    expect(packed.shippedAt).toBeNull()
    await caller.advanceOrder({
      orderId: order.id,
      expectedStatus: 'PACKED',
      status: 'SHIPPED',
      trackingNumber: ' TRACK-123 ',
    })
    await caller.advanceOrder({
      orderId: order.id,
      expectedStatus: 'SHIPPED',
      status: 'DELIVERED',
    })
    const result = (await callerFor(customer).getOrder({ orderId: order.id })).order!
    expect(result.status).toBe('DELIVERED')
    expect(result.packedAt).toEqual(packed.packedAt)
    expect(result.shippedAt).not.toBeNull()
    expect(result.deliveredAt).not.toBeNull()
    expect(result.trackingNumber).toBe('TRACK-123')
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('SOLD')
  })

  it.each(['COLLECTING', 'PACKED'] as const)(
    'completes pickup from %s without shipping',
    async (status) => {
      const { admin, order } = await setup('PICKUP')
      if (status === 'PACKED') {
        await callerFor(admin).advanceOrder({
          orderId: order.id,
          expectedStatus: 'COLLECTING',
          status: 'PACKED',
        })
      }
      await callerFor(admin).advanceOrder({
        orderId: order.id,
        expectedStatus: status,
        status: 'DELIVERED',
      })
      const result = await prisma.order.findUniqueOrThrow({ where: { id: order.id } })
      expect(result.deliveredAt).not.toBeNull()
      expect(result.shippedAt).toBeNull()
    },
  )

  it.each(['POST', 'OZON', 'CDEK', 'FIVEPOST'] as const)(
    'requires a tracking number for %s',
    async (deliveryType) => {
      const { admin, order } = await setup(deliveryType)
      await callerFor(admin).advanceOrder({
        orderId: order.id,
        expectedStatus: 'COLLECTING',
        status: 'PACKED',
      })
      await expect(
        callerFor(admin).advanceOrder({
          orderId: order.id,
          expectedStatus: 'PACKED',
          status: 'SHIPPED',
          trackingNumber: ' ',
        }),
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
      expect(
        (await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status,
      ).toBe('PACKED')
    },
  )

  it('allows city delivery without a tracking number', async () => {
    const { admin, order } = await setup('CITY')
    await callerFor(admin).advanceOrder({
      orderId: order.id,
      expectedStatus: 'COLLECTING',
      status: 'PACKED',
    })
    await callerFor(admin).advanceOrder({
      orderId: order.id,
      expectedStatus: 'PACKED',
      status: 'SHIPPED',
    })
    expect(
      (await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).shippedAt,
    ).not.toBeNull()
  })

  it('rejects skipping packing, delivery completion before shipping and backwards transitions', async () => {
    const { admin, order } = await setup()
    for (const status of ['SHIPPED', 'DELIVERED'] as const) {
      await expect(
        callerFor(admin).advanceOrder({
          orderId: order.id,
          expectedStatus: 'COLLECTING',
          status,
          trackingNumber: '123',
        }),
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    }
    await callerFor(admin).advanceOrder({
      orderId: order.id,
      expectedStatus: 'COLLECTING',
      status: 'PACKED',
    })
    await expect(
      callerFor(admin).advanceOrder({
        orderId: order.id,
        expectedStatus: 'PACKED',
        status: 'PACKED',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('rejects shipping a pickup order', async () => {
    const { admin, order } = await setup('PICKUP')
    await callerFor(admin).advanceOrder({
      orderId: order.id,
      expectedStatus: 'COLLECTING',
      status: 'PACKED',
    })
    await expect(
      callerFor(admin).advanceOrder({
        orderId: order.id,
        expectedStatus: 'PACKED',
        status: 'SHIPPED',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('allows only one of two concurrent transitions and does not rewrite its timestamp', async () => {
    const { admin, order } = await setup()
    const input = {
      orderId: order.id,
      expectedStatus: 'COLLECTING' as const,
      status: 'PACKED' as const,
    }
    const results = await Promise.allSettled([
      callerFor(admin).advanceOrder(input),
      callerFor(admin).advanceOrder(input),
    ])
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    const packedAt = (await prisma.order.findUniqueOrThrow({ where: { id: order.id } }))
      .packedAt
    await expect(callerFor(admin).advanceOrder(input)).rejects.toMatchObject({
      code: 'CONFLICT',
    })
    expect(
      (await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).packedAt,
    ).toEqual(packedAt)
  })

  it('rejects customer and anonymous actions, and excludes their access to the admin queue', async () => {
    const { customer, order } = await setup()
    const input = {
      orderId: order.id,
      expectedStatus: 'COLLECTING' as const,
      status: 'PACKED' as const,
    }
    await expect(callerFor(customer).advanceOrder(input)).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
    await expect(callerFor(null).advanceOrder(input)).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
    await expect(callerFor(customer).getOrders()).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
  })

  it('does not advance legacy orders with unrecorded payment', async () => {
    const { admin, order } = await setup()
    await prisma.order.update({ where: { id: order.id }, data: { paidAmount: null } })
    await expect(
      callerFor(admin).advanceOrder({
        orderId: order.id,
        expectedStatus: 'COLLECTING',
        status: 'PACKED',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it.each(['CANCELLED', 'DELIVERED'] as const)(
    'does not reopen %s orders',
    async (status) => {
      const { admin, order } = await setup()
      await prisma.order.update({ where: { id: order.id }, data: { status } })
      await expect(
        callerFor(admin).advanceOrder({
          orderId: order.id,
          expectedStatus: 'COLLECTING',
          status: 'PACKED',
        }),
      ).rejects.toMatchObject({ code: 'CONFLICT' })
    },
  )

  it('filters the admin queue by active and exact statuses, retaining legacy orders in all', async () => {
    const { admin, customer, order, instance } = await setup()
    const done = await createOrder(customer.id, instance.id, 'DELIVERED')
    await createOrder(customer.id, instance.id, 'PENDING')
    expect(
      (await callerFor(admin).getOrders({ filter: 'ACTIVE' })).orders.map(
        (item) => item.id,
      ),
    ).toEqual([order.id])
    expect(
      (await callerFor(admin).getOrders({ filter: 'DELIVERED' })).orders.map(
        (item) => item.id,
      ),
    ).toEqual([done.id])
    expect((await callerFor(admin).getOrders({ filter: 'ALL' })).orders).toHaveLength(3)
  })
})
