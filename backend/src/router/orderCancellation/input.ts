import { z } from 'zod'

import { moneyInput } from '../paidOrders/input'

const itemIds = z
  .array(z.string().min(1))
  .max(1000)
  .refine((ids) => new Set(ids).size === ids.length, 'Позиции не должны повторяться')
export const cancelPaidOrderInput = z
  .object({
    orderId: z.string().min(1),
    expectedUpdatedAt: z.date(),
    requestId: z.string().uuid(),
    reason: z.string().trim().min(1, 'Укажите причину отмены').max(2000),
    refundAmount: moneyInput.default('0'),
    refundConfirmed: z.boolean().default(false),
    releaseItemIds: itemIds.default([]),
  })
  .refine((value) => Number(value.refundAmount) === 0 || value.refundConfirmed, {
    path: ['refundConfirmed'],
    message: 'Подтвердите, что деньги уже возвращены вручную',
  })
export const recordOrderRefundInput = z.object({
  orderId: z.string().min(1),
  requestId: z.string().uuid(),
  amount: moneyInput.refine(
    (value) => Number(value) > 0,
    'Сумма возврата должна быть больше нуля',
  ),
  confirmed: z.literal(true),
  note: z.string().trim().max(2000).default(''),
})
export const releaseOrderItemsInput = z.object({
  orderId: z.string().min(1),
  itemIds: itemIds.refine((ids) => ids.length > 0, 'Выберите растения'),
})
