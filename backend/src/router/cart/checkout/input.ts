import { z } from 'zod'

import { customerContactFields, hasCustomerContact } from '../../../lib/customerContacts'
import { customerNameFields } from '../../../lib/customerNames'
import {
  deliveryNeedsAddress,
  deliveryNeedsRecipient,
  hasRecipientPhone,
  deliveryNeedsPickupPoint,
} from '../../../lib/deliveryOptions'
import { deliveryTypeInput } from '../../paidOrders/input'

export const checkoutInput = z
  .object({
    contactInfo: z
      .object({
        ...customerNameFields,
        ...customerContactFields,
      })
      .refine(hasCustomerContact, {
        path: ['phone'],
        message: 'Укажите телефон, Telegram или ВКонтакте',
      }),
    deliveryType: deliveryTypeInput.nullable().default(null),
    deliveryAddress: z.string().trim().max(2000).default(''),
    pickupPoint: z.string().trim().max(2000).default(''),
    deliveryNotes: z.string().trim().max(2000).default(''),
  })
  .superRefine((value, ctx) => {
    if (deliveryNeedsRecipient(value.deliveryType)) {
      if (!value.contactInfo.lastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contactInfo', 'lastName'],
          message: 'Укажите фамилию получателя',
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
