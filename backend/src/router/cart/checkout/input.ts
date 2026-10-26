import { z } from 'zod'

import {
  deliveryNeedsAddress,
  deliveryNeedsRecipient,
  hasRecipientName,
  hasRecipientPhone,
  deliveryNeedsPickupPoint,
} from '../../../lib/deliveryOptions'
import { deliveryTypeInput } from '../../paidOrders/input'

export const checkoutInput = z
  .object({
    contactInfo: z
      .object({
        name: z.string().trim().min(1).max(200),
        phone: z.string().trim().max(100).default(''),
        telegram: z.string().trim().max(500).default(''),
      })
      .refine((value) => value.phone || value.telegram, {
        path: ['phone'],
        message: 'Укажите телефон или мессенджер',
      }),
    deliveryType: deliveryTypeInput.nullable().default(null),
    deliveryAddress: z.string().trim().max(2000).default(''),
    pickupPoint: z.string().trim().max(2000).default(''),
    deliveryNotes: z.string().trim().max(2000).default(''),
  })
  .superRefine((value, ctx) => {
    if (deliveryNeedsRecipient(value.deliveryType)) {
      if (!hasRecipientName(value.contactInfo.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contactInfo', 'name'],
          message: 'Укажите фамилию, имя и отчество получателя (если есть)',
        })
      }
      if (!hasRecipientPhone(value.contactInfo.phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contactInfo', 'phone'],
          message: 'Укажите номер телефона получателя с кодом страны или города',
        })
      }
    }

    if (deliveryNeedsPickupPoint(value.deliveryType) && !value.pickupPoint) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pickupPoint'],
        message: 'Укажите адрес ПВЗ',
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
