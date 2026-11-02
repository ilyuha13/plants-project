import { describe, expect, it } from 'vitest'

import {
  callerFor,
  createCart,
  createInstance,
  createOrder,
  createUser,
  prisma,
} from './helpers'
import { clearExpiredAutomaticCarts } from '../lib/cron'

const request = { firstName: 'Клиент', telegram: '@customer', comment: 'До весны' }
const future = () => new Date(Date.now() + 86400000)
const past = () => new Date(Date.now() - 60000)

describe('Reservation requests', () => {
  it('stores contacts, holds the cart and does not reset the first request on repeat', async () => {
    const user = await createUser()
    const instance = await createInstance('IN_CART')
    const cart = await createCart(user.id, instance.id)
    await callerFor(user).requestReservation(request)
    const held = await prisma.cart.findUniqueOrThrow({ where: { id: cart.id } })
    expect(held).toMatchObject({
      reservationType: 'RESERVED_PREPAID_REQUEST',
      reservedUntil: null,
      customerName: request.firstName,
      customerContact: `Telegram: ${request.telegram}`,
      customerComment: request.comment,
    })
    expect(held.requestedAt).not.toBeNull()
    await expect(callerFor(user).requestReservation(request)).rejects.toMatchObject({
      code: 'CONFLICT',
    })
    expect(
      (await prisma.cart.findUniqueOrThrow({ where: { id: cart.id } })).requestedAt,
    ).toEqual(held.requestedAt)
    await clearExpiredAutomaticCarts({ prisma }, new Date(Date.now() + 7 * 86400000))
    expect(await prisma.cartItem.count()).toBe(1)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('IN_CART')
  })

  it('requires authentication and contact information', async () => {
    await expect(callerFor(null).requestReservation(request)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
    const user = await createUser()
    await expect(
      callerFor(user).requestReservation({ ...request, telegram: ' ' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('cannot reserve an expired cart or another user cart', async () => {
    const user = await createUser()
    const stranger = await createUser()
    const instance = await createInstance('IN_CART')
    const cart = await createCart(user.id, instance.id)
    await callerFor(stranger).requestReservation(request)
    expect((await callerFor(user).getCart())?.reservationType).toBe('AUTOMATIC')
    await prisma.cart.update({ where: { id: cart.id }, data: { reservedUntil: past() } })
    await expect(callerFor(user).requestReservation(request)).rejects.toMatchObject({
      code: 'CONFLICT',
    })
  })

  it('supports a new empty cart and adding plants later without creating an expiry', async () => {
    const user = await createUser()
    await callerFor(user).requestReservation(request)
    const instance = await createInstance()
    await callerFor(user).addToCart({ plantInstanceId: instance.id })
    expect(await callerFor(user).getCart()).toMatchObject({
      reservationType: 'RESERVED_PREPAID_REQUEST',
      reservedUntil: null,
      items: [{ plantInstanceId: instance.id }],
    })
  })
})

describe('Confirming and releasing reservations', () => {
  it('supports zero prepayment, indefinite terms, edits and changing the contents', async () => {
    const user = await createUser()
    const admin = await createUser('ADMIN')
    const instance = await createInstance('IN_CART')
    const cart = await createCart(user.id, instance.id)
    await callerFor(user).requestReservation(request)
    const reviewAt = future()
    await callerFor(admin).confirmReservation({
      cartId: cart.id,
      prepaidAmount: '0',
      reservedUntil: null,
      reviewAt,
    })
    const added = await createInstance()
    await callerFor(user).addToCart({ plantInstanceId: added.id })
    for (const item of (await callerFor(user).getCart())!.items) {
      await callerFor(user).removeFromCart({ cartItemId: item.id })
    }
    expect(await callerFor(user).getCart()).toMatchObject({
      reservationType: 'RESERVED_PREPAID_CONFIRMED',
      reservedUntil: null,
      reviewAt,
      items: [],
    })
    await callerFor(admin).confirmReservation({
      cartId: cart.id,
      prepaidAmount: '500.25',
      reservedUntil: future(),
      reviewAt,
    })
    await callerFor(user).addToCart({ plantInstanceId: added.id })
    expect(String((await callerFor(user).getCart())?.prepaidAmount)).toBe('500.25')
    expect((await callerFor(user).getCart())?.reservedUntil).not.toBeNull()
  })

  it('never automatically releases a confirmed overdue reservation', async () => {
    const user = await createUser()
    const instance = await createInstance('IN_CART')
    const cart = await createCart(user.id, instance.id)
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        reservationType: 'RESERVED_PREPAID_CONFIRMED',
        reservedUntil: past(),
        reviewAt: past(),
        prepaidAmount: '0',
      },
    })
    await clearExpiredAutomaticCarts({ prisma })
    expect(await prisma.cartItem.count()).toBe(1)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('IN_CART')
  })

  it('restricts admin actions and queue access', async () => {
    const user = await createUser()
    await expect(callerFor(user).getReservations()).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
    await expect(
      callerFor(user).confirmReservation({
        cartId: 'unknown',
        prepaidAmount: '0',
        reservedUntil: null,
        reviewAt: future(),
      }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    await expect(
      callerFor(user).releaseReservation({ cartId: 'unknown' }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('rejects negative money and requires a future reminder for an indefinite reservation', async () => {
    const admin = await createUser('ADMIN')
    await expect(
      callerFor(admin).confirmReservation({
        cartId: 'unknown',
        prepaidAmount: '-1',
        reservedUntil: null,
        reviewAt: future(),
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    await expect(
      callerFor(admin).confirmReservation({
        cartId: 'unknown',
        prepaidAmount: '0',
        reservedUntil: null,
        reviewAt: past(),
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('releases a request and preserves contacts, without releasing plants in active orders', async () => {
    const user = await createUser()
    const admin = await createUser('ADMIN')
    const instance = await createInstance('IN_CART')
    const second = await createInstance('IN_CART')
    const cart = await createCart(user.id, instance.id)
    await prisma.cartItem.create({
      data: { cartId: cart.id, plantInstanceId: second.id },
    })
    await createOrder(user.id, second.id)
    await callerFor(user).requestReservation(request)
    await callerFor(admin).releaseReservation({ cartId: cart.id })
    expect(await prisma.cartItem.count()).toBe(0)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('AVAILABLE')
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: second.id } })).status,
    ).toBe('IN_CART')
    expect(await callerFor(user).getCart()).toMatchObject({
      reservationType: 'AUTOMATIC',
      customerContact: `Telegram: ${request.telegram}`,
    })
  })

  it('requires explicit acknowledgement of prepayment and preserves the recorded money', async () => {
    const admin = await createUser('ADMIN')
    const instance = await createInstance('IN_CART')
    const cart = await createCart(admin.id, instance.id)
    await callerFor(admin).requestReservation(request)
    await callerFor(admin).confirmReservation({
      cartId: cart.id,
      prepaidAmount: '500',
      reservedUntil: null,
      reviewAt: future(),
    })
    await expect(
      callerFor(admin).releaseReservation({ cartId: cart.id }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    expect(await prisma.cartItem.count()).toBe(1)
    await callerFor(admin).releaseReservation({
      cartId: cart.id,
      acknowledgePrepayment: true,
    })
    expect(String((await callerFor(admin).getCart())?.prepaidAmount)).toBe('500')
  })
})

describe('Automatic cleanup', () => {
  it('clears only expired automatic carts', async () => {
    const user = await createUser()
    const instance = await createInstance('IN_CART')
    const cart = await createCart(user.id, instance.id)
    await prisma.cart.update({ where: { id: cart.id }, data: { reservedUntil: past() } })
    await clearExpiredAutomaticCarts({ prisma })
    expect(await prisma.cartItem.count()).toBe(0)
    expect(
      (await prisma.plantInstance.findUniqueOrThrow({ where: { id: instance.id } }))
        .status,
    ).toBe('AVAILABLE')
  })

  it('does not clear a request submitted while cleanup starts', async () => {
    const user = await createUser()
    const instance = await createInstance('IN_CART')
    await createCart(user.id, instance.id)
    await Promise.all([
      callerFor(user).requestReservation(request),
      clearExpiredAutomaticCarts({ prisma }),
    ])
    const cart = await callerFor(user).getCart()
    expect(cart?.reservationType).toBe('RESERVED_PREPAID_REQUEST')
    expect(cart?.items).toHaveLength(1)
  })
  it('rechecks an expired scan after the cart was renewed and requested', async () => {
    const user = await createUser()
    const instance = await createInstance('IN_CART')
    const added = await createInstance()
    const cart = await createCart(user.id, instance.id)
    await prisma.cart.update({ where: { id: cart.id }, data: { reservedUntil: past() } })
    const scanningPrisma = prisma.$extends({
      query: {
        cart: {
          async findMany({ args, query }) {
            const scanned = await query(args)
            await callerFor(user).addToCart({ plantInstanceId: added.id })
            await callerFor(user).requestReservation(request)
            return scanned
          },
        },
      },
    })
    await clearExpiredAutomaticCarts({ prisma: scanningPrisma })
    expect((await callerFor(user).getCart())?.items).toHaveLength(2)
    expect((await callerFor(user).getCart())?.reservationType).toBe(
      'RESERVED_PREPAID_REQUEST',
    )
  })
})
