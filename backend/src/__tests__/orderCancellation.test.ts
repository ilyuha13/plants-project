import { randomUUID } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import {
  callerFor,
  createCart,
  createInstance,
  createOrder,
  createUser,
  prisma,
} from './helpers'

const setup = async () => {
  const admin = await createUser('ADMIN')
  const customer = await createUser()
  const first = await createInstance('SOLD')
  const second = await createInstance('SOLD')
  const created = await createOrder(customer.id, first.id, 'COLLECTING')
  await prisma.orderItem.create({
    data: { orderId: created.id, plantInstanceId: second.id },
  })
  const order = await prisma.order.update({
    where: { id: created.id },
    data: { paidAmount: '2501', totalAmount: '2501', deliveryType: 'POST' },
    include: { items: true },
  })
  const input = {
    orderId: order.id,
    expectedUpdatedAt: order.updatedAt,
    requestId: randomUUID(),
    reason: 'Покупатель передумал',
  }
  return { admin, customer, first, second, order, input }
}
const stored = (id: string) =>
  prisma.order.findUniqueOrThrow({
    where: { id },
    include: { items: true, refunds: true },
  })

describe('Cancelling paid orders', () => {
  it('preserves the order, payments and all plants when none are selected', async () => {
    const { admin, order, input } = await setup()
    await callerFor(admin).cancelPaidOrder(input)
    const result = await stored(order.id)
    expect(result.status).toBe('CANCELLED')
    expect(result.cancelledAt).not.toBeNull()
    expect(result.cancellationReason).toBe(input.reason)
    expect(String(result.paidAmount)).toBe('2501')
    expect(String(result.refundedAmount)).toBe('0')
    expect(result.items).toHaveLength(2)
    expect(result.refunds).toHaveLength(0)
    expect(await prisma.plantInstance.count({ where: { status: 'SOLD' } })).toBe(2)
  })

  it('releases only selected plants and records who released them', async () => {
    const { admin, order, input } = await setup()
    const chosen = order.items[0]
    await callerFor(admin).cancelPaidOrder({ ...input, releaseItemIds: [chosen.id] })
    const result = await stored(order.id)
    expect(result.items.find((item) => item.id === chosen.id)?.releasedById).toBe(
      admin.id,
    )
    expect(result.items.find((item) => item.id === chosen.id)?.releasedAt).not.toBeNull()
    expect(await prisma.plantInstance.count({ where: { status: 'AVAILABLE' } })).toBe(1)
    expect(await prisma.plantInstance.count({ where: { status: 'SOLD' } })).toBe(1)
  })

  it('records an initial refund and hides internal refund details from the customer', async () => {
    const { admin, customer, order, input } = await setup()
    await callerFor(admin).cancelPaidOrder({
      ...input,
      refundAmount: '1000.25',
      refundConfirmed: true,
    })
    const result = await stored(order.id)
    expect(String(result.refundedAmount)).toBe('1000.25')
    expect(result.refunds).toHaveLength(1)
    expect(result.refunds[0].actorId).toBe(admin.id)
    const customerView = (await callerFor(customer).getOrder({ orderId: order.id }))
      .order!
    expect(customerView.refunds[0]).not.toHaveProperty('note')
    expect(customerView.refunds[0]).not.toHaveProperty('actorNick')
    expect(customerView.refunds[0]).not.toHaveProperty('actorId')
    expect(
      (await callerFor(admin).getOrder({ orderId: order.id })).order?.refunds[0].note,
    ).toBe(input.reason)
  })

  it('rolls back the cancellation if the refund exceeds received payment', async () => {
    const { admin, order, input } = await setup()
    await expect(
      callerFor(admin).cancelPaidOrder({
        ...input,
        refundAmount: '2501.01',
        refundConfirmed: true,
        releaseItemIds: [order.items[0].id],
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    const result = await stored(order.id)
    expect(result.status).toBe('COLLECTING')
    expect(result.cancelledAt).toBeNull()
    expect(result.refunds).toHaveLength(0)
    expect(await prisma.plantInstance.count({ where: { status: 'SOLD' } })).toBe(2)
  })

  it('makes a repeated cancellation request idempotent without duplicate refunds', async () => {
    const { admin, order, input } = await setup()
    const request = {
      ...input,
      refundAmount: '500',
      refundConfirmed: true,
      releaseItemIds: [order.items[0].id],
    }
    await Promise.all([
      callerFor(admin).cancelPaidOrder(request),
      callerFor(admin).cancelPaidOrder(request),
    ])
    const first = await stored(order.id)
    await callerFor(admin).cancelPaidOrder(request)
    const repeated = await stored(order.id)
    expect(repeated.cancelledAt).toEqual(first.cancelledAt)
    expect(repeated.refunds).toHaveLength(1)
    expect(String(repeated.refundedAmount)).toBe('500')
    await expect(
      callerFor(admin).cancelPaidOrder({ ...request, reason: 'Другая причина' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('rejects cancelling a stale form', async () => {
    const { admin, order, input } = await setup()
    await callerFor(admin).advanceOrder({
      orderId: order.id,
      expectedStatus: 'COLLECTING',
      status: 'PACKED',
    })
    await expect(callerFor(admin).cancelPaidOrder(input)).rejects.toMatchObject({
      code: 'CONFLICT',
    })
  })

  it.each(['SHIPPED', 'DELIVERED'] as const)(
    'does not cancel a %s order',
    async (status) => {
      const { admin, order, input } = await setup()
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status },
      })
      await expect(
        callerFor(admin).cancelPaidOrder({
          ...input,
          expectedUpdatedAt: updated.updatedAt,
        }),
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    },
  )

  it('does not cancel an unpaid legacy order using the paid-order action', async () => {
    const { admin, order, input } = await setup()
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { paidAmount: null },
    })
    await expect(
      callerFor(admin).cancelPaidOrder({
        ...input,
        expectedUpdatedAt: updated.updatedAt,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('requires confirmation when recording an actual refund', async () => {
    const { admin, input } = await setup()
    await expect(
      callerFor(admin).cancelPaidOrder({ ...input, refundAmount: '100' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('cannot both ship and cancel the same order concurrently', async () => {
    const { admin, order, input } = await setup()
    await callerFor(admin).advanceOrder({
      orderId: order.id,
      expectedStatus: 'COLLECTING',
      status: 'PACKED',
    })
    const packed = await stored(order.id)
    const results = await Promise.allSettled([
      callerFor(admin).cancelPaidOrder({ ...input, expectedUpdatedAt: packed.updatedAt }),
      callerFor(admin).advanceOrder({
        orderId: order.id,
        expectedStatus: 'PACKED',
        status: 'SHIPPED',
        trackingNumber: 'TRACK',
      }),
    ])
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    expect(['CANCELLED', 'SHIPPED']).toContain((await stored(order.id)).status)
  })
})

describe('Refund ledger', () => {
  it('records multiple partial refunds and keeps the original payment', async () => {
    const { admin, order, input } = await setup()
    await callerFor(admin).cancelPaidOrder(input)
    expect((await callerFor(admin).getOrders({ filter: 'REFUNDS' })).orders).toHaveLength(
      1,
    )
    for (const amount of ['1000.25', '1500.75']) {
      await callerFor(admin).recordOrderRefund({
        orderId: order.id,
        requestId: randomUUID(),
        amount,
        confirmed: true,
        note: 'Ручной перевод',
      })
    }
    const result = await stored(order.id)
    expect(String(result.refundedAmount)).toBe('2501')
    expect(String(result.paidAmount)).toBe('2501')
    expect(result.refunds).toHaveLength(2)
    expect((await callerFor(admin).getOrders({ filter: 'REFUNDS' })).orders).toHaveLength(
      0,
    )
    expect(await prisma.plantInstance.count({ where: { status: 'SOLD' } })).toBe(2)
  })

  it('allows returning the actual overpayment rather than limiting refunds to the order total', async () => {
    const { admin, order, input } = await setup()
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { paidAmount: '3000' },
    })
    await callerFor(admin).cancelPaidOrder({
      ...input,
      expectedUpdatedAt: updated.updatedAt,
      refundAmount: '3000',
      refundConfirmed: true,
    })
    expect(String((await stored(order.id)).refundedAmount)).toBe('3000')
    expect(String((await stored(order.id)).totalAmount)).toBe('2501')
  })

  it('does not count a retried refund twice, and rejects changed payloads with the same key', async () => {
    const { admin, order, input } = await setup()
    await callerFor(admin).cancelPaidOrder(input)
    const refund = {
      orderId: order.id,
      requestId: randomUUID(),
      amount: '500',
      confirmed: true as const,
      note: 'Перевод',
    }
    await Promise.all([
      callerFor(admin).recordOrderRefund(refund),
      callerFor(admin).recordOrderRefund(refund),
    ])
    expect(String((await stored(order.id)).refundedAmount)).toBe('500')
    expect(await prisma.orderRefund.count()).toBe(1)
    await expect(
      callerFor(admin).recordOrderRefund({ ...refund, amount: '501' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('prevents concurrent refunds from exceeding the received amount', async () => {
    const { admin, order, input } = await setup()
    await callerFor(admin).cancelPaidOrder(input)
    const results = await Promise.allSettled(
      [1, 2].map(() =>
        callerFor(admin).recordOrderRefund({
          orderId: order.id,
          requestId: randomUUID(),
          amount: '2000',
          confirmed: true,
        }),
      ),
    )
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    expect(String((await stored(order.id)).refundedAmount)).toBe('2000')
    expect(await prisma.orderRefund.count()).toBe(1)
  })

  it('rejects refund recording for active orders and zero amounts', async () => {
    const { admin, order } = await setup()
    await expect(
      callerFor(admin).recordOrderRefund({
        orderId: order.id,
        requestId: randomUUID(),
        amount: '100',
        confirmed: true,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    await expect(
      callerFor(admin).recordOrderRefund({
        orderId: order.id,
        requestId: randomUUID(),
        amount: '0',
        confirmed: true,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })
})

describe('Releasing cancelled items', () => {
  it('allows release later and never releases a resold plant on retry', async () => {
    const { admin, customer, order, input } = await setup()
    await callerFor(admin).cancelPaidOrder(input)
    const item = order.items[0]
    await callerFor(admin).releaseOrderItems({ orderId: order.id, itemIds: [item.id] })
    const releasedAt = (await stored(order.id)).items.find(
      (entry) => entry.id === item.id,
    )!.releasedAt
    await prisma.plantInstance.update({
      where: { id: item.plantInstanceId },
      data: { status: 'SOLD' },
    })
    await createOrder(customer.id, item.plantInstanceId, 'COLLECTING')
    await callerFor(admin).releaseOrderItems({ orderId: order.id, itemIds: [item.id] })
    expect(
      (
        await prisma.plantInstance.findUniqueOrThrow({
          where: { id: item.plantInstanceId },
        })
      ).status,
    ).toBe('SOLD')
    expect(
      (await stored(order.id)).items.find((entry) => entry.id === item.id)!.releasedAt,
    ).toEqual(releasedAt)
  })

  it('rolls back cancellation and refund when a selected plant belongs to another active order', async () => {
    const { admin, customer, order, input } = await setup()
    const item = order.items[0]
    await createOrder(customer.id, item.plantInstanceId)
    await expect(
      callerFor(admin).cancelPaidOrder({
        ...input,
        refundAmount: '500',
        refundConfirmed: true,
        releaseItemIds: [item.id],
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
    expect((await stored(order.id)).status).toBe('COLLECTING')
    expect(await prisma.orderRefund.count()).toBe(0)
    await callerFor(admin).cancelPaidOrder(input)
    await expect(
      callerFor(admin).releaseOrderItems({ orderId: order.id, itemIds: [item.id] }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('does not free plants held by a cart', async () => {
    const { admin, customer, order, input } = await setup()
    const item = order.items[0]
    await prisma.plantInstance.update({
      where: { id: item.plantInstanceId },
      data: { status: 'IN_CART' },
    })
    await createCart(customer.id, item.plantInstanceId)
    await callerFor(admin).cancelPaidOrder(input)
    await expect(
      callerFor(admin).releaseOrderItems({ orderId: order.id, itemIds: [item.id] }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
    expect(await prisma.cartItem.count()).toBe(1)
  })

  it('rejects foreign positions and active-order release', async () => {
    const { admin, order, input } = await setup()
    await expect(
      callerFor(admin).releaseOrderItems({
        orderId: order.id,
        itemIds: [order.items[0].id],
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    await expect(
      callerFor(admin).cancelPaidOrder({ ...input, releaseItemIds: ['foreign'] }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    expect((await stored(order.id)).status).toBe('COLLECTING')
  })

  it('restricts all three actions to administrators', async () => {
    const { customer, order, input } = await setup()
    for (const caller of [callerFor(customer), callerFor(null)]) {
      await expect(caller.cancelPaidOrder(input)).rejects.toMatchObject({
        code: 'FORBIDDEN',
      })
      await expect(
        caller.recordOrderRefund({
          orderId: order.id,
          requestId: randomUUID(),
          amount: '100',
          confirmed: true,
        }),
      ).rejects.toMatchObject({ code: 'FORBIDDEN' })
      await expect(
        caller.releaseOrderItems({ orderId: order.id, itemIds: [order.items[0].id] }),
      ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    }
  })
})
