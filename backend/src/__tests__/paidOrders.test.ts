import { describe, expect, it } from 'vitest'

import {
  callerFor,
  createCart,
  createInstance,
  createOrder,
  createUser,
  prisma,
} from './helpers'

const contactInfo = {
  name: 'Иванов Иван Иванович',
  phone: '+7 (999) 123-45-67',
  telegram: '@customer',
}
const prepared = async () => {
  const user = await createUser()
  const admin = await createUser('ADMIN')
  const instance = await createInstance('IN_CART')
  await createCart(user.id, instance.id)
  await callerFor(user).checkout({
    contactInfo,
    deliveryType: 'FIVEPOST',
    pickupPoint: 'ПВЗ на Лесной',
  })
  const cart = (await callerFor(user).getCart())!
  const input = {
    cartId: cart.id,
    expectedUpdatedAt: cart.updatedAt,
    customerName: 'Иванов Иван Иванович',
    customerPhone: '+7 (999) 123-45-67',
    customerContact: '@customer',
    deliveryType: 'FIVEPOST' as const,
    pickupPoint: 'ПВЗ на Лесной',
    deliveryCost: '250.25',
    paidAmount: '1500.75',
    items: cart.items.map((item) => ({ cartItemId: item.id, unitPrice: '1250.50' })),
  }
  return { user, admin, instance, cart, input }
}

describe('Paid orders', () => {
  it('creates an order with exact totals, delivery and snapshots, then clears the cart', async () => {
    const { admin, user, instance, input } = await prepared()
    const { orderId } = await callerFor(admin).createPaidOrder(input)
    const order = (await callerFor(admin).getOrder({ orderId })).order!
    expect(order.status).toBe('COLLECTING')
    expect(String(order.totalAmount)).toBe('1500.75')
    expect(String(order.paidAmount)).toBe('1500.75')
    expect(String(order.deliveryCost)).toBe('250.25')
    expect(order.pickupPoint).toBe(input.pickupPoint)
    expect(order.deliveryType).toBe('FIVEPOST')
    expect(order.items[0].inventoryNumber).toBe(instance.inventoryNumber)
    expect(String(order.items[0].unitPrice)).toBe('1250.5')
    expect((await callerFor(user).getCart())?.items).toHaveLength(0)
    expect((await callerFor(user).getCart())?.purchaseRequestedAt).toBeNull()
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('SOLD')
  })

  it('hides both snapshot and live inventory numbers from the customer', async () => {
    const { admin, user, instance, input } = await prepared()
    const { orderId } = await callerFor(admin).createPaidOrder(input)
    const customerOrder = (await callerFor(user).getOrder({ orderId })).order!
    expect(customerOrder.items[0]).not.toHaveProperty('inventoryNumber')
    expect(customerOrder.items[0].plantInstance).not.toHaveProperty('inventoryNumber')
    const adminOrder = (await callerFor(admin).getOrder({ orderId })).order!
    expect(adminOrder.items[0].inventoryNumber).toBe(instance.inventoryNumber)
    expect(adminOrder.items[0].plantInstance.inventoryNumber).toBe(
      instance.inventoryNumber,
    )
  })

  it('creates exactly one paid order for concurrent admin confirmations', async () => {
    const { admin, input } = await prepared()
    const results = await Promise.allSettled([
      callerFor(admin).createPaidOrder(input),
      callerFor(admin).createPaidOrder(input),
    ])
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    expect(await prisma.order.count()).toBe(1)
    expect(await prisma.orderItem.count()).toBe(1)
  })

  it('rejects incomplete payment and keeps the entire cart unchanged', async () => {
    const { admin, user, cart, input } = await prepared()
    await expect(
      callerFor(admin).createPaidOrder({ ...input, paidAmount: '1500.74' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    expect(await prisma.order.count()).toBe(0)
    expect((await callerFor(user).getCart())?.updatedAt).toEqual(cart.updatedAt)
    expect((await callerFor(user).getCart())?.items).toHaveLength(1)
  })

  it('rejects stale forms after the customer changes the contents', async () => {
    const { admin, user, input } = await prepared()
    const added = await createInstance()
    await callerFor(user).addToCart({ plantInstanceId: added.id })
    await expect(callerFor(admin).createPaidOrder(input)).rejects.toMatchObject({
      code: 'CONFLICT',
    })
    expect(await prisma.order.count()).toBe(0)
    expect((await callerFor(user).getCart())?.items).toHaveLength(2)
  })

  it('rejects missing, duplicated or foreign cart items', async () => {
    const { admin, input } = await prepared()
    await expect(
      callerFor(admin).createPaidOrder({
        ...input,
        items: [...input.items, ...input.items],
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
    await expect(
      callerFor(admin).createPaidOrder({
        ...input,
        items: [{ cartItemId: 'foreign', unitPrice: '0' }],
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
    expect(await prisma.order.count()).toBe(0)
  })

  it('rolls back if a plant is already in another non-cancelled order', async () => {
    const { admin, user, instance, input } = await prepared()
    await createOrder(user.id, instance.id)
    await expect(callerFor(admin).createPaidOrder(input)).rejects.toMatchObject({
      code: 'CONFLICT',
    })
    expect(await prisma.order.count()).toBe(1)
    expect(await prisma.cartItem.count()).toBe(1)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('IN_CART')
  })

  it('keeps agreed prices and names when live plant data changes', async () => {
    const { admin, instance, input } = await prepared()
    const { orderId } = await callerFor(admin).createPaidOrder({
      ...input,
      items: [{ ...input.items[0], unitPrice: '1200' }],
    })
    const before = (await callerFor(admin).getOrder({ orderId })).order!
    await prisma.plantInstance.update({
      where: { id: instance.id },
      data: {
        price: '9999',
        inventoryNumber: 'changed',
        plant: { update: { name: 'Changed plant' } },
      },
    })
    const after = (await callerFor(admin).getOrder({ orderId })).order!
    expect(after.items[0].plantName).toBe(before.items[0].plantName)
    expect(after.items[0].inventoryNumber).toBe(instance.inventoryNumber)
    expect(String(after.items[0].unitPrice)).toBe('1200')
    expect(String(after.totalAmount)).toBe('1450.25')
    expect(String(after.paidAmount)).toBe('1500.75')
  })

  it('allows order access only to its owner or an admin', async () => {
    const { admin, user, input } = await prepared()
    const stranger = await createUser()
    await expect(callerFor(user).createPaidOrder(input)).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
    const { orderId } = await callerFor(admin).createPaidOrder(input)
    expect((await callerFor(stranger).getOrder({ orderId })).order).toBeNull()
    expect((await callerFor(stranger).getMyOrders()).orders).toHaveLength(0)
    expect((await callerFor(user).getMyOrders()).orders).toHaveLength(1)
    await expect(callerFor(null).getOrder({ orderId })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
  })

  it('does not use legacy cancellation to automatically release paid plants', async () => {
    const { admin, input, instance } = await prepared()
    const { orderId } = await callerFor(admin).createPaidOrder(input)
    await expect(callerFor(admin).cancelOrder({ orderId })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('SOLD')
  })

  it('moves prepayment into the paid order without counting it twice', async () => {
    const { admin, user, cart, input } = await prepared()
    const updated = await prisma.cart.update({
      where: { id: cart.id },
      data: { prepaidAmount: '500' },
    })
    const { orderId } = await callerFor(admin).createPaidOrder({
      ...input,
      expectedUpdatedAt: updated.updatedAt,
    })
    const order = (await callerFor(user).getOrder({ orderId })).order!
    expect(String(order.prepaidAmount)).toBe('500')
    expect(String(order.paidAmount)).toBe('1500.75')
    expect((await callerFor(user).getCart())?.prepaidAmount).toBeNull()
  })

  it('rolls back every plant when one item has become unavailable', async () => {
    const { admin, instance, cart, input } = await prepared()
    const sold = await createInstance('SOLD')
    const item = await prisma.cartItem.create({
      data: { cartId: cart.id, plantInstanceId: sold.id },
    })
    await expect(
      callerFor(admin).createPaidOrder({
        ...input,
        paidAmount: '3000',
        items: [...input.items, { cartItemId: item.id, unitPrice: '1250.50' }],
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
    expect(await prisma.order.count()).toBe(0)
    expect(await prisma.cartItem.count()).toBe(2)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('IN_CART')
  })

  it('requires a PVZ or address when that delivery type is selected', async () => {
    const { admin, input } = await prepared()
    await expect(
      callerFor(admin).createPaidOrder({ ...input, pickupPoint: '' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    await expect(
      callerFor(admin).createPaidOrder({
        ...input,
        deliveryType: 'POST',
        deliveryAddress: '',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })
})

describe('Purchase request for a confirmed reservation', () => {
  it('preserves terms and prepayment while recording delivery and intent to buy', async () => {
    const user = await createUser()
    const admin = await createUser('ADMIN')
    const instance = await createInstance('IN_CART')
    const cart = await createCart(user.id, instance.id)
    await callerFor(user).requestReservation({ name: 'Customer', contact: '@customer' })
    const reviewAt = new Date(Date.now() + 86400000)
    await callerFor(admin).confirmReservation({
      cartId: cart.id,
      prepaidAmount: '500',
      reservedUntil: null,
      reviewAt,
    })
    await callerFor(user).checkout({ contactInfo })
    const held = await callerFor(user).getCart()
    expect(held?.reservationType).toBe('RESERVED_PREPAID_CONFIRMED')
    expect(held?.reservedUntil).toBeNull()
    expect(held?.reviewAt).toEqual(reviewAt)
    expect(String(held?.prepaidAmount)).toBe('500')
    expect(await prisma.order.count()).toBe(0)
  })
})
