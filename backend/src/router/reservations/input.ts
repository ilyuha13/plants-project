import { z } from 'zod'

import { customerContactFields, hasCustomerContact } from '../../lib/customerContacts'
import { customerNameFields } from '../../lib/customerNames'

export const requestReservationInput = z
  .object({
    ...customerNameFields,
    ...customerContactFields,
    comment: z.string().trim().max(2000).default(''),
  })
  .refine(hasCustomerContact, {
    path: ['phone'],
    message: 'Укажите телефон, Telegram или ВКонтакте',
  })

export const confirmReservationInput = z
  .object({
    cartId: z.string().min(1),
    prepaidAmount: z
      .string()
      .regex(/^\d{1,10}(\.\d{1,2})?$/, 'Укажите сумму от 0 с точностью до копеек'),
    reservedUntil: z.date().nullable(),
    reviewAt: z
      .date()
      .refine(
        (date) => date.getTime() > Date.now(),
        'Дата напоминания должна быть в будущем',
      ),
    comment: z.string().trim().max(2000).default(''),
  })
  .refine((value) => !value.reservedUntil || value.reservedUntil.getTime() > Date.now(), {
    message: 'Срок брони должен быть в будущем',
    path: ['reservedUntil'],
  })

export const releaseReservationInput = z.object({
  cartId: z.string().min(1),
  acknowledgePrepayment: z.boolean().default(false),
})
