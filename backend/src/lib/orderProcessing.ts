export const orderStatuses = [
  'PENDING',
  'AWAITING_PAYMENT',
  'COLLECTING',
  'PACKED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const
export const orderStatusLabel: Record<string, string> = {
  PENDING: 'Заявка (старый процесс)',
  AWAITING_PAYMENT: 'Ожидает оплаты (старый процесс)',
  COLLECTING: 'Сборка',
  PACKED: 'Упакован',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Завершён',
  CANCELLED: 'Отменён',
}
export type ProcessingTarget = 'PACKED' | 'SHIPPED' | 'DELIVERED'
export const orderTransitions = (
  status: string,
  deliveryType: string | null,
): ProcessingTarget[] => {
  if (status === 'COLLECTING') {
    return deliveryType === 'PICKUP' ? ['PACKED', 'DELIVERED'] : ['PACKED']
  }
  if (status === 'PACKED') {
    return deliveryType === 'PICKUP' ? ['DELIVERED'] : ['SHIPPED']
  }
  if (status === 'SHIPPED' && deliveryType !== 'PICKUP') {
    return ['DELIVERED']
  }
  return []
}
