import { z } from 'zod'

import {
  deliveryCodes,
  deliveryNeedsAddress,
  deliveryNeedsRecipient,
  hasRecipientPhone,
  deliveryNeedsPickupPoint,
} from '../../lib/deliveryOptions'

export const moneyInput = z
  .string()
  .regex(/^\d{1,10}(\.\d{1,2})?$/, 'Укажите неотрицательную сумму с точностью до копеек')
export const deliveryTypeInput = z.enum(deliveryCodes)
export const createPaidOrderInput = z
  .object({
    cartId: z.string().min(1),
    expectedUpdatedAt: z.date(),
    customerFirstName: z.string().trim().min(1, 'Укажите имя').max(100),
    customerLastName: z.string().trim().max(100).default(''),
    customerPatronymic: z.string().trim().max(100).default(''),
    customerContact: z.string().trim().min(1).max(1200),
    customerPhone: z.string().trim().max(100).default(''),
    deliveryType: deliveryTypeInput,
    deliveryAddress: z.string().trim().max(2000).default(''),
    pickupPoint: z.string().trim().max(2000).default(''),
    deliveryNotes: z.string().trim().max(2000).default(''),
    deliveryCost: moneyInput,
    paidAmount: moneyInput,
    items: z
      .array(z.object({ cartItemId: z.string().min(1), unitPrice: moneyInput }))
      .min(1),
  })
  .superRefine((value, ctx) => {
    if (deliveryNeedsRecipient(value.deliveryType)) {
      if (!value.customerLastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customerLastName'],
          message: 'Укажите фамилию получателя',
        })
      }
      if (!hasRecipientPhone(value.customerPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customerPhone'],
          message: 'Укажите номер телефона получателя с кодом страны или города',
        })
      }
    }

    if (deliveryNeedsPickupPoint(value.deliveryType) && !value.pickupPoint) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pickupPoint'],
        message: 'Укажите ПВЗ',
      })
    }
    if (deliveryNeedsAddress(value.deliveryType) && !value.deliveryAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['deliveryAddress'],
        message: 'Укажите адрес доставки',
      })
    }
  })
