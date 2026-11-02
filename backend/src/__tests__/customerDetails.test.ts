import { describe, expect, it } from 'vitest'

import { callerFor, createCart, createInstance, createUser, prisma } from './helpers'

describe('Saved customer details', () => {
  it('saves reservation contacts and returns them only to their owner', async () => {
    const user = await createUser()
    const stranger = await createUser()
    await callerFor(user).requestReservation({
      firstName: 'Иван',
      phone: '+79991234567',
      comment: 'До весны',
    })
    const { me } = await callerFor(user).getMe()
    expect(me).toMatchObject({
      customerName: 'Иван',
      customerPhone: '+79991234567',
      customerContact: '+79991234567',
      reservationComment: 'До весны',
    })
    expect(me).not.toHaveProperty('password')
    expect((await callerFor(stranger).getMe()).me?.customerPhone).toBeNull()
    expect((await callerFor(null).getMe()).me).toBeNull()
  })

  it('saves three independent contacts and supports clearing a field', async () => {
    const user = await createUser()
    await prisma.user.update({
      where: { id: user.id },
      data: { customerPhone: '+79991234567' },
    })
    await callerFor(user).requestReservation({
      firstName: 'Иван',
      telegram: '@ivan',
      vk: 'https://vk.com/ivan',
    })
    expect((await callerFor(user).getMe()).me).toMatchObject({
      customerPhone: '',
      customerTelegram: '@ivan',
      customerVk: 'https://vk.com/ivan',
    })
  })

  it('updates contacts and delivery on purchase without overwriting another user or reservation comments', async () => {
    const user = await createUser()
    const stranger = await createUser()
    const instance = await createInstance('IN_CART')
    await createCart(user.id, instance.id)
    await callerFor(user).requestReservation({
      firstName: 'Иван',
      telegram: '@old',
      comment: 'Зимняя бронь',
    })
    await callerFor(user).checkout({
      contactInfo: {
        firstName: 'Иван',
        lastName: 'Иванов',
        phone: '+79991234567',
        telegram: '@new',
        vk: 'https://vk.com/new',
      },
      deliveryType: 'CDEK',
      pickupPoint: 'ПВЗ на Лесной',
      deliveryAddress: 'Адрес',
      deliveryNotes: 'Позвонить',
    })
    expect((await callerFor(user).getMe()).me).toMatchObject({
      customerName: 'Иванов Иван',
      customerFirstName: 'Иван',
      customerLastName: 'Иванов',
      customerPatronymic: '',
      customerPhone: '+79991234567',
      customerTelegram: '@new',
      customerVk: 'https://vk.com/new',
      deliveryType: 'CDEK',
      pickupPoint: 'ПВЗ на Лесной',
      deliveryAddress: 'Адрес',
      deliveryNotes: 'Позвонить',
      reservationComment: 'Зимняя бронь',
    })
    expect((await callerFor(stranger).getMe()).me?.customerName).toBeNull()
  })

  it('does not save data from rejected requests', async () => {
    const user = await createUser()
    await callerFor(user).requestReservation({ firstName: 'Иван', telegram: '@ivan' })
    await expect(
      callerFor(user).requestReservation({ firstName: 'Другой', telegram: '@other' }),
    ).rejects.toThrow()
    await expect(
      callerFor(user).checkout({
        contactInfo: { firstName: 'Другой', phone: '+79991234567' },
      }),
    ).rejects.toThrow('Корзина пуста')
    expect((await callerFor(user).getMe()).me).toMatchObject({
      customerName: 'Иван',
      customerContact: 'Telegram: @ivan',
    })
  })
})

it('accepts VK alone for reservation and pickup but still requires a phone for carriers', async () => {
  const user = await createUser()
  const instance = await createInstance('IN_CART')
  await createCart(user.id, instance.id)
  await callerFor(user).requestReservation({
    firstName: 'Иван',
    vk: 'https://vk.com/ivan',
  })
  expect((await callerFor(user).getCart())?.customerVk).toBe('https://vk.com/ivan')
  await expect(
    callerFor(user).checkout({
      contactInfo: { firstName: 'Иван', lastName: 'Иванов', vk: 'https://vk.com/ivan' },
      deliveryType: 'CDEK',
      pickupPoint: 'ПВЗ',
    }),
  ).rejects.toThrow()
  await callerFor(user).checkout({
    contactInfo: { firstName: 'Иван', vk: 'https://vk.com/ivan' },
    deliveryType: 'PICKUP',
  })
  expect((await callerFor(user).getMe()).me?.customerVk).toBe('https://vk.com/ivan')
})
