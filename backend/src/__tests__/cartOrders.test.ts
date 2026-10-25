import { describe, expect, it } from 'vitest'

import {
  callerFor,
  createCart,
  createInstance,
  createOrder,
  createUser,
  prisma,
} from './helpers'

const contactInfo = { name: 'Test customer', phone: '000', telegram: 'test' }

describe('Cart ownership', () => {
  it('requires authentication', async () => {
    await expect(callerFor(null).getCart()).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
  })

  it('returns only the current user cart and rejects removing another user item', async () => {
    const owner = await createUser()
    const stranger = await createUser()
    const instance = await createInstance('IN_CART')
    const cart = await createCart(owner.id, instance.id)
    expect((await callerFor(owner).getCart())?.id).toBe(cart.id)
    expect(await callerFor(stranger).getCart()).toBeNull()
    await expect(
      callerFor(stranger).removeFromCart({ cartItemId: cart.items[0].id }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    expect(await prisma.cartItem.count()).toBe(1)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('IN_CART')
  })

  it('reserves one instance for exactly one of two competing users', async () => {
    const users = await Promise.all([createUser(), createUser()])
    const instance = await createInstance()
    const results = await Promise.allSettled(
      users.map((user) => callerFor(user).addToCart({ plantInstanceId: instance.id })),
    )
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1)
    expect(await prisma.cartItem.count({ where: { plantInstanceId: instance.id } })).toBe(
      1,
    )
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('IN_CART')
  })
})

describe('Checkout', () => {
  it('creates exactly one order for concurrent checkout requests', async () => {
    const user = await createUser()
    const instance = await createInstance('IN_CART')
    await createCart(user.id, instance.id)
    const caller = callerFor(user)
    const results = await Promise.allSettled([
      caller.checkout({ contactInfo }),
      caller.checkout({ contactInfo }),
    ])
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1)
    expect(await prisma.order.count()).toBe(1)
    expect(
      await prisma.orderItem.count({ where: { plantInstanceId: instance.id } }),
    ).toBe(1)
    expect(await prisma.cartItem.count()).toBe(0)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('SOLD')
    await expect(caller.checkout({ contactInfo })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
    expect(await prisma.order.count()).toBe(1)
  })

  it('rolls back the whole checkout if one item is no longer reserved', async () => {
    const user = await createUser()
    const reserved = await createInstance('IN_CART')
    const sold = await createInstance('SOLD')
    const cart = await createCart(user.id, reserved.id)
    await prisma.cartItem.create({ data: { cartId: cart.id, plantInstanceId: sold.id } })
    await expect(callerFor(user).checkout({ contactInfo })).rejects.toMatchObject({
      code: 'CONFLICT',
    })
    expect(await prisma.order.count()).toBe(0)
    expect(await prisma.cartItem.count()).toBe(2)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: reserved.id } }))
        .status,
    ).toBe('IN_CART')
  })
})

describe('Deleting instances', () => {
  it('allows an admin to delete an unused instance', async () => {
    const admin = await createUser('ADMIN')
    const instance = await createInstance()
    await expect(
      callerFor(admin).deletePlantInstance({ id: instance.id }),
    ).resolves.toEqual({ success: true })
    expect(
      await prisma.plantInstance.findUnique({ where: { id: instance.id } }),
    ).toBeNull()
  })

  it('rejects deleting an instance in an order, including cancelled history', async () => {
    const admin = await createUser('ADMIN')
    const instance = await createInstance()
    await createOrder(admin.id, instance.id, 'CANCELLED')
    await expect(
      callerFor(admin).deletePlantInstance({ id: instance.id }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
    expect(await prisma.orderItem.count()).toBe(1)
    expect(await prisma.plantInstance.count()).toBe(1)
  })

  it('rejects deleting an instance in a cart', async () => {
    const admin = await createUser('ADMIN')
    const instance = await createInstance('IN_CART')
    await createCart(admin.id, instance.id)
    await expect(
      callerFor(admin).deletePlantInstance({ id: instance.id }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
    expect(await prisma.cartItem.count()).toBe(1)
    expect(await prisma.plantInstance.count()).toBe(1)
  })

  it('rejects deleting by a regular user', async () => {
    const user = await createUser()
    const instance = await createInstance()
    await expect(
      callerFor(user).deletePlantInstance({ id: instance.id }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    expect(await prisma.plantInstance.count()).toBe(1)
  })
})

describe('Cancelling orders', () => {
  it('releases an instance while preserving order history', async () => {
    const admin = await createUser('ADMIN')
    const instance = await createInstance('SOLD')
    const order = await createOrder(admin.id, instance.id)
    await callerFor(admin).cancelOrder({ orderId: order.id })
    expect(
      (await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status,
    ).toBe('CANCELLED')
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('AVAILABLE')
    expect(await prisma.orderItem.count()).toBe(1)
  })

  it('does not release an instance belonging to another active order', async () => {
    const admin = await createUser('ADMIN')
    const instance = await createInstance('SOLD')
    const first = await createOrder(admin.id, instance.id)
    const second = await createOrder(admin.id, instance.id)
    await callerFor(admin).cancelOrder({ orderId: first.id })
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('SOLD')
    expect(
      (await prisma.order.findUniqueOrThrow({ where: { id: second.id } })).status,
    ).toBe('PENDING')
    expect(await prisma.orderItem.count()).toBe(2)
  })

  it('does not release an instance held in a cart', async () => {
    const admin = await createUser('ADMIN')
    const instance = await createInstance('IN_CART')
    const order = await createOrder(admin.id, instance.id)
    await createCart(admin.id, instance.id)
    await callerFor(admin).cancelOrder({ orderId: order.id })
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('IN_CART')
    expect(await prisma.cartItem.count()).toBe(1)
  })
})
