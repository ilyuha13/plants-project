import { z } from 'zod'

export const requestReservationInput = z.object({
  name: z.string().trim().min(1).max(200),
  contact: z.string().trim().min(1, 'Укажите телефон или мессенджер').max(500),
  comment: z.string().trim().max(2000).default(''),
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
