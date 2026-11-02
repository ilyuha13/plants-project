import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  deliveryOptions,
  deliveryNeedsAddress,
  deliveryNeedsRecipient,
  hasRecipientPhone,
  deliveryNeedsPickupPoint,
} from '@plants-project/backend/src/lib/deliveryOptions'
import { deliveryTypeInput } from '@plants-project/backend/src/router/paidOrders/input'
import { moneyInput } from '@plants-project/backend/src/router/paidOrders/input'
import { useState } from 'react'

import { trpc } from '../../lib/trpc'

import type { DeliveryCode } from '@plants-project/backend/src/lib/deliveryOptions'
import type { TrpcRouterOutput } from '@plants-project/backend/src/router'

type Cart = TrpcRouterOutput['getReservations'][number]
type Delivery = DeliveryCode | ''

const cents = (value: string) =>
  moneyInput.safeParse(value).success ? Math.round(Number(value) * 100) : null

export const PaidOrderDialog = ({
  cart,
  onClose,
  onCreated,
}: {
  cart: Cart
  onClose: () => void
  onCreated: (orderId: string) => Promise<void>
}) => {
  const createOrder = trpc.createPaidOrder.useMutation()
  const [firstName, setFirstName] = useState(cart.customerFirstName || '')
  const [lastName, setLastName] = useState(cart.customerLastName || '')
  const [patronymic, setPatronymic] = useState(cart.customerPatronymic || '')
  const [contact, setContact] = useState(cart.customerContact || '')
  const [phone, setPhone] = useState(cart.customerPhone || '')
  const savedDelivery = deliveryTypeInput.safeParse(cart.deliveryType)
  const [delivery, setDelivery] = useState<Delivery>(
    savedDelivery.success ? savedDelivery.data : '',
  )
  const [address, setAddress] = useState(cart.deliveryAddress || '')
  const [pvz, setPvz] = useState(cart.pickupPoint || '')
  const [notes, setNotes] = useState(cart.deliveryNotes || '')
  const [cost, setCost] = useState('0')
  const [paid, setPaid] = useState(String(cart.prepaidAmount || 0))
  const [confirmed, setConfirmed] = useState(false)
  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(
      cart.items.map((item) => [item.id, String(item.plantInstance.price)]),
    ),
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const itemAmounts = cart.items.map((item) => cents(prices[item.id] || ''))
  const deliveryAmount = cents(cost)
  const receivedAmount = cents(paid)
  const totalCents = itemAmounts.reduce<number>(
    (sum, amount) => sum + (amount ?? 0),
    deliveryAmount ?? 0,
  )
  const total = totalCents / 100
  const blockedReason = !cart.items.length
    ? 'Добавьте растения в корзину.'
    : !delivery
      ? 'Выберите способ получения.'
      : itemAmounts.some((amount) => amount === null) ||
          deliveryAmount === null ||
          receivedAmount === null
        ? 'Заполните цены, доставку и полученную сумму: от 0, не более двух знаков после запятой.'
        : receivedAmount < totalCents
          ? `До полной оплаты не хватает ${((totalCents - receivedAmount) / 100).toFixed(2)} ₽. Укажите всю полученную сумму, включая предоплату.`
          : receivedAmount < Math.round(Number(cart.prepaidAmount || 0) * 100)
            ? 'Полученная сумма не может быть меньше уже записанной предоплаты.'
            : !firstName.trim() || !contact.trim()
              ? 'Заполните имя покупателя и контакт.'
              : deliveryNeedsRecipient(delivery) && !lastName.trim()
                ? 'Укажите ФИО получателя: фамилию, имя и отчество (если есть).'
                : deliveryNeedsRecipient(delivery) && !hasRecipientPhone(phone)
                  ? 'Укажите номер телефона получателя — мессенджер не заменяет телефон.'
                  : deliveryNeedsPickupPoint(delivery) && !pvz.trim()
                    ? 'Укажите пункт выдачи.'
                    : deliveryNeedsAddress(delivery) && !address.trim()
                      ? 'Укажите адрес доставки.'
                      : !confirmed
                        ? 'Отметьте галочку «Полная оплата получена, состав и доставка согласованы» внизу формы.'
                        : null
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (blockedReason || saving) {
      setError(blockedReason || 'Заказ уже создаётся')
      return
    }
    setError('')
    setSaving(true)
    try {
      const result = await createOrder.mutateAsync({
        cartId: cart.id,
        expectedUpdatedAt: cart.updatedAt,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerPatronymic: patronymic,
        customerContact: contact,
        customerPhone: phone,
        deliveryType: deliveryTypeInput.parse(delivery),
        deliveryAddress: address,
        pickupPoint: pvz,
        deliveryNotes: notes,
        deliveryCost: cost,
        paidAmount: paid,
        items: cart.items.map((item) => ({
          cartItemId: item.id,
          unitPrice: prices[item.id],
        })),
      })
      await onCreated(result.orderId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать заказ')
    } finally {
      setSaving(false)
    }
  }
  return (
    <Dialog open onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={(event) => void submit(event)}>
        <DialogTitle>Создать оплаченный заказ</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="info">
              Проверьте окончательный состав, цены и доставку. Сохранится заказ на сборку,
              корзина очистится.
            </Alert>
            {!cart.customerFirstName && cart.customerName && (
              <Alert severity="info">
                Ранее указано: {cart.customerName}. Уточните ФИО в отдельных полях.
              </Alert>
            )}
            <TextField
              label="Имя"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Фамилия"
              required={deliveryNeedsRecipient(delivery)}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Отчество (необязательно)"
              value={patronymic}
              onChange={(e) => setPatronymic(e.target.value)}
            />
            <TextField
              label="Контакт: телефон или мессенджер"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <TextField
              label={
                deliveryNeedsRecipient(delivery)
                  ? 'Телефон получателя'
                  : 'Телефон (если известен)'
              }
              required={deliveryNeedsRecipient(delivery)}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {cart.items.map((item) => (
              <TextField
                key={item.id}
                label={`№${item.plantInstance.inventoryNumber} · ${item.plantInstance.plant.name}, ₽`}
                required
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                value={prices[item.id]}
                onChange={(e) => setPrices({ ...prices, [item.id]: e.target.value })}
              />
            ))}
            <TextField
              select
              label="Способ получения"
              value={delivery}
              onChange={(e) => setDelivery(e.target.value as Delivery)}
            >
              <MenuItem value="" disabled>
                Выберите способ получения
              </MenuItem>
              {deliveryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {deliveryNeedsPickupPoint(delivery) && (
              <TextField
                label="Адрес ПВЗ и номер пункта (если известен)"
                required
                value={pvz}
                onChange={(e) => setPvz(e.target.value)}
              />
            )}
            {deliveryNeedsAddress(delivery) && (
              <TextField
                label={
                  delivery === 'POST'
                    ? 'Почтовый адрес с индексом'
                    : 'Адрес доставки по городу'
                }
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            )}
            <TextField
              label="Стоимость доставки, ₽"
              required
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <TextField
              label="Комментарий к доставке"
              multiline
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Typography>Итого с доставкой: {total.toFixed(2)} ₽</Typography>
            <Typography>
              Ранее записанная предоплата: {String(cart.prepaidAmount || 0)} ₽
            </Typography>
            <TextField
              label="Всего фактически получено, включая предоплату, ₽"
              required
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
            />
            {Number(paid) > total && (
              <Alert severity="warning">
                Переплата: {(Number(paid) - total).toFixed(2)} ₽. Сумма сохранится в
                заказе.
              </Alert>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
              }
              label="Полная оплата получена, состав и доставка согласованы"
            />
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack sx={{ width: '100%' }} spacing={1}>
            {blockedReason && (
              <Alert severity="info" role="status">
                {blockedReason}
              </Alert>
            )}
            <Stack direction="row" justifyContent="flex-end">
              <Button disabled={saving} onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={saving || !!blockedReason}>
                {saving ? 'Создание…' : 'Создать заказ на сборку'}
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  )
}
