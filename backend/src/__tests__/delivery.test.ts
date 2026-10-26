import { describe, expect, it } from 'vitest'

import { checkoutInput } from '../router/cart/checkout/input'
import { createPaidOrderInput } from '../router/paidOrders/input'

const contactInfo = {
  name: 'Иванов Иван Иванович',
  phone: '+7 (999) 123-45-67',
  telegram: '',
}
const paid = {
  cartId: 'cart',
  expectedUpdatedAt: new Date(),
  customerName: 'Иванов Иван Иванович',
  customerPhone: '+7 (999) 123-45-67',
  customerContact: '000',
  deliveryCost: '0',
  paidAmount: '100',
  items: [{ cartItemId: 'item', unitPrice: '100' }],
}

describe('Delivery fields', () => {
  it.each(['FIVEPOST', 'CDEK', 'OZON'] as const)(
    '%s requires a pickup-point address in requests and paid orders',
    (deliveryType) => {
      expect(checkoutInput.safeParse({ contactInfo, deliveryType }).success).toBe(false)
      expect(createPaidOrderInput.safeParse({ ...paid, deliveryType }).success).toBe(
        false,
      )
      const address = { deliveryType, pickupPoint: 'Адрес пункта выдачи' }
      expect(checkoutInput.safeParse({ contactInfo, ...address }).success).toBe(true)
      expect(createPaidOrderInput.safeParse({ ...paid, ...address }).success).toBe(true)
      expect(
        createPaidOrderInput.safeParse({ ...paid, deliveryType, pickupPoint: ' ' })
          .success,
      ).toBe(false)
    },
  )

  it.each(['CITY', 'POST'] as const)(
    '%s requires a delivery address in requests and paid orders',
    (deliveryType) => {
      expect(checkoutInput.safeParse({ contactInfo, deliveryType }).success).toBe(false)
      expect(createPaidOrderInput.safeParse({ ...paid, deliveryType }).success).toBe(
        false,
      )
      const address = { deliveryType, deliveryAddress: 'Индекс, город, улица, дом' }
      expect(checkoutInput.safeParse({ contactInfo, ...address }).success).toBe(true)
      expect(createPaidOrderInput.safeParse({ ...paid, ...address }).success).toBe(true)
      expect(
        createPaidOrderInput.safeParse({ ...paid, deliveryType, deliveryAddress: ' ' })
          .success,
      ).toBe(false)
    },
  )

  it('does not require an address for pickup', () => {
    expect(checkoutInput.safeParse({ contactInfo, deliveryType: 'PICKUP' }).success).toBe(
      true,
    )
    expect(
      createPaidOrderInput.safeParse({ ...paid, deliveryType: 'PICKUP' }).success,
    ).toBe(true)
  })

  it('allows an undecided purchase request but requires a specific service for a paid order', () => {
    expect(checkoutInput.safeParse({ contactInfo }).success).toBe(true)
    expect(createPaidOrderInput.safeParse({ ...paid }).success).toBe(false)
    for (const deliveryType of ['OTHER', 'PVZ', 'ADDRESS']) {
      expect(createPaidOrderInput.safeParse({ ...paid, deliveryType }).success).toBe(
        false,
      )
    }
  })
  it.each(['POST', 'OZON', 'CDEK', 'FIVEPOST'] as const)(
    '%s requires full recipient name and a separate phone number',
    (deliveryType) => {
      const delivery = { deliveryType, deliveryAddress: 'Адрес', pickupPoint: 'ПВЗ' }
      expect(checkoutInput.safeParse({ contactInfo, ...delivery }).success).toBe(true)
      expect(createPaidOrderInput.safeParse({ ...paid, ...delivery }).success).toBe(true)
      expect(
        checkoutInput.safeParse({
          ...delivery,
          contactInfo: { ...contactInfo, name: 'Иван' },
        }).success,
      ).toBe(false)
      expect(
        createPaidOrderInput.safeParse({ ...paid, ...delivery, customerName: 'Иван' })
          .success,
      ).toBe(false)
      for (const phone of ['', ' ', '@telegram', '123']) {
        expect(
          checkoutInput.safeParse({
            ...delivery,
            contactInfo: { ...contactInfo, phone, telegram: '@contact' },
          }).success,
        ).toBe(false)
        expect(
          createPaidOrderInput.safeParse({
            ...paid,
            ...delivery,
            customerPhone: phone,
            customerContact: '@contact',
          }).success,
        ).toBe(false)
      }
      // A person without a patronymic can still receive a delivery.
      expect(
        checkoutInput.safeParse({
          ...delivery,
          contactInfo: { ...contactInfo, name: 'Иванов Иван' },
        }).success,
      ).toBe(true)
    },
  )

  it.each(['PICKUP', 'CITY'] as const)(
    '%s keeps the existing name and messenger contact rules',
    (deliveryType) => {
      expect(
        checkoutInput.safeParse({
          deliveryType,
          deliveryAddress: 'Адрес',
          contactInfo: { name: 'Иван', phone: '', telegram: '@contact' },
        }).success,
      ).toBe(true)
      expect(
        createPaidOrderInput.safeParse({
          ...paid,
          deliveryType,
          deliveryAddress: 'Адрес',
          customerName: 'Иван',
          customerPhone: '',
        }).success,
      ).toBe(true)
    },
  )
})
