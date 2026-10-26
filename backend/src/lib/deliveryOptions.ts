export const deliveryCodes = [
  'PICKUP',
  'CITY',
  'FIVEPOST',
  'CDEK',
  'POST',
  'OZON',
] as const
export type DeliveryCode = (typeof deliveryCodes)[number]

export const deliveryOptions: { value: DeliveryCode; label: string }[] = [
  { value: 'PICKUP', label: 'Самовывоз' },
  { value: 'CITY', label: 'Доставка по городу' },
  { value: 'FIVEPOST', label: '5Post' },
  { value: 'CDEK', label: 'СДЭК' },
  { value: 'POST', label: 'Почта' },
  { value: 'OZON', label: 'Ozon' },
]
export const deliveryNeedsPickupPoint = (type: string | null) =>
  type === 'FIVEPOST' || type === 'CDEK' || type === 'OZON'
export const deliveryNeedsAddress = (type: string | null) =>
  type === 'CITY' || type === 'POST'

export const deliveryLabel = (type: string | null) => {
  if (!type) {
    return 'Не согласовано'
  }
  const current = deliveryOptions.find((option) => option.value === type)
  if (current) {
    return current.label
  }
  // Keep old orders readable without guessing their delivery provider.
  return (
    (
      {
        PVZ: 'Пункт выдачи (служба не записана)',
        ADDRESS: 'По адресу (служба не записана)',
        OTHER: 'Не согласовано',
      } as Record<string, string>
    )[type] || type
  )
}

export const deliveryNeedsRecipient = (type: string | null) =>
  type === 'POST' || type === 'OZON' || type === 'CDEK' || type === 'FIVEPOST'

// A patronymic is optional; surname and given name are required for a recipient.
export const hasRecipientName = (name: string) => name.trim().split(/\s+/).length >= 2
export const hasRecipientPhone = (phone: string) =>
  /^[+\d\s()-]+$/.test(phone.trim()) && /^\d{10,15}$/.test(phone.replace(/\D/g, ''))
