import { z } from 'zod'

import {
  deliveryCodes,
  deliveryNeedsAddress,
  deliveryNeedsRecipient,
  hasRecipientName,
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
    customerName: z.string().trim().min(1).max(200),
    customerContact: z.string().trim().min(1).max(500),
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
      if (!hasRecipientName(value.customerName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customerName'],
          message: 'Укажите фамилию, имя и отчество получателя (если есть)',
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
