import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { deliveryLabel } from '@plants-project/backend/src/lib/deliveryOptions'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getOrderDetailRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import { PaidOrderDialog } from '../PaidOrderDialog/PaidOrderDialog'

import type { TrpcRouterOutput } from '@plants-project/backend/src/router'

type Reservation = TrpcRouterOutput['getReservations'][number]
const localDate = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export const ReservationsManagement = () => {
  const { data, isLoading, error } = trpc.getReservations.useQuery(undefined, {
    refetchInterval: 60000,
  })
  const utils = trpc.useUtils()
  const navigate = useNavigate()
  const [paidCart, setPaidCart] = useState<Reservation | null>(null)
  const confirm = trpc.confirmReservation.useMutation()
  const release = trpc.releaseReservation.useMutation()
  const [filter, setFilter] = useState('requests')
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [action, setAction] = useState<'confirm' | 'release'>('confirm')
  const [amount, setAmount] = useState('0')
  const [until, setUntil] = useState('')
  const [review, setReview] = useState('')
  const [comment, setComment] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const due = (cart: Reservation) =>
    cart.reservationType !== 'RESERVED_PREPAID_REQUEST' &&
    [cart.reservedUntil, cart.reviewAt].some(
      (date) => date && new Date(date).getTime() <= Date.now(),
    )

  const open = (cart: Reservation, nextAction: 'confirm' | 'release') => {
    setSelected(cart)
    setAction(nextAction)
    setAmount(String(cart.prepaidAmount || 0))
    setUntil(cart.reservedUntil ? localDate(new Date(cart.reservedUntil)) : '')
    setReview(
      cart.reviewAt && new Date(cart.reviewAt) > new Date()
        ? localDate(new Date(cart.reviewAt))
        : localDate(new Date(Date.now() + 86400000)),
    )
    setComment(cart.adminComment || '')
    setAcknowledged(false)
    setMessage('')
  }
  const refresh = async () => {
    await Promise.all([
      utils.getReservations.invalidate(),
      utils.getPendingReservationRequests.invalidate(),
      utils.getAllUsers.invalidate(),
      utils.getCart.invalidate(),
      utils.getAllInstances.invalidate(),
      utils.getPlant.invalidate(),
      utils.getPlantInstance.invalidate(),
    ])
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selected) {
      return
    }
    setSaving(true)
    setMessage('')
    try {
      if (action === 'confirm') {
        await confirm.mutateAsync({
          cartId: selected.id,
          prepaidAmount: amount,
          reservedUntil: until ? new Date(until) : null,
          reviewAt: new Date(review),
          comment,
        })
      } else {
        await release.mutateAsync({
          cartId: selected.id,
          acknowledgePrepayment: acknowledged,
        })
      }
      setSelected(null)
      await refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Не удалось сохранить бронь')
    } finally {
      setSaving(false)
    }
  }
  if (isLoading) {
    return <Typography>Загрузка бронирований…</Typography>
  }
  if (error) {
    return <Alert severity="error">{error.message}</Alert>
  }
  const carts = data || []
  const requests = carts.filter(
    (cart) => cart.reservationType === 'RESERVED_PREPAID_REQUEST',
  )
  const attention = carts.filter(due)
  const visible = carts.filter(
    (cart) =>
      filter === 'all' ||
      (filter === 'requests'
        ? cart.reservationType === 'RESERVED_PREPAID_REQUEST'
        : filter === 'purchase'
          ? !!cart.purchaseRequestedAt
          : filter === 'attention'
            ? due(cart)
            : cart.reservationType !== 'RESERVED_PREPAID_REQUEST'),
  )

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">Бронирования</Typography>
      <TextField
        select
        label="Показать"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        sx={{ my: 2, minWidth: 260 }}
      >
        <MenuItem value="requests">Новые запросы ({requests.length})</MenuItem>
        <MenuItem value="purchase">
          Заявки на покупку ({carts.filter((cart) => cart.purchaseRequestedAt).length})
        </MenuItem>
        <MenuItem value="attention">Требуют внимания ({attention.length})</MenuItem>
        <MenuItem value="confirmed">Подтверждённые</MenuItem>
        <MenuItem value="all">Все</MenuItem>
      </TextField>
      <Stack spacing={2}>
        {!visible.length && <Typography>Бронирований в этом списке нет.</Typography>}
        {visible.map((cart) => {
          const total = cart.items.reduce(
            (sum, item) => sum + Number(item.plantInstance.price),
            0,
          )
          const paid = Number(cart.prepaidAmount || 0)
          return (
            <Paper key={cart.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography variant="h6">
                  {cart.customerName || cart.user.nick}
                </Typography>
                <Typography>
                  {cart.customerContact || 'Контакт не сохранён — уточните у клиента'}
                </Typography>
                <Typography>
                  Запрос:{' '}
                  {cart.requestedAt
                    ? new Date(cart.requestedAt).toLocaleString('ru-RU')
                    : 'старая бронь'}
                </Typography>
                {cart.purchaseRequestedAt && (
                  <Alert severity="info">
                    Заявка на покупку от{' '}
                    {new Date(cart.purchaseRequestedAt).toLocaleString('ru-RU')}
                  </Alert>
                )}
                <Typography>{cart.customerComment}</Typography>
                <Typography>
                  Доставка: {deliveryLabel(cart.deliveryType)} ·{' '}
                  {cart.pickupPoint || cart.deliveryAddress || ''}
                </Typography>
                {cart.deliveryNotes && <Typography>{cart.deliveryNotes}</Typography>}
                <Typography>
                  {cart.reservationType === 'RESERVED_PREPAID_REQUEST'
                    ? 'Ожидает решения'
                    : 'Бронь подтверждена'}
                </Typography>
                {cart.items.map(({ plantInstance: instance }) => (
                  <Typography key={instance.id}>
                    №{instance.inventoryNumber} · {instance.plant.name} ·{' '}
                    {String(instance.price)} ₽
                  </Typography>
                ))}
                {!cart.items.length && (
                  <Typography>Корзина пустая. Условия брони сохраняются.</Typography>
                )}
                <Typography>
                  Текущая сумма: {total.toFixed(2)} ₽ · Предоплата: {paid.toFixed(2)} ₽
                </Typography>
                {paid > total && (
                  <Alert severity="warning">
                    Переплата {(paid - total).toFixed(2)} ₽ — согласуйте с клиентом.
                  </Alert>
                )}
                {cart.reservationType !== 'RESERVED_PREPAID_REQUEST' && (
                  <>
                    <Typography>
                      Срок:{' '}
                      {cart.reservedUntil
                        ? new Date(cart.reservedUntil).toLocaleString('ru-RU')
                        : 'бессрочно'}
                    </Typography>
                    <Typography>
                      Напоминание:{' '}
                      {cart.reviewAt
                        ? new Date(cart.reviewAt).toLocaleString('ru-RU')
                        : 'не задано'}
                    </Typography>
                    {cart.adminComment && (
                      <Typography>
                        Комментарий администратора: {cart.adminComment}
                      </Typography>
                    )}
                  </>
                )}
                {due(cart) && (
                  <Alert severity="warning">
                    Требует внимания. Свяжитесь с клиентом; растения остаются
                    забронированы.
                  </Alert>
                )}
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => open(cart, 'confirm')}>
                    {cart.reservationType === 'RESERVED_PREPAID_REQUEST'
                      ? 'Подтвердить'
                      : 'Изменить условия'}
                  </Button>
                  <Button disabled={!cart.items.length} onClick={() => setPaidCart(cart)}>
                    Создать оплаченный заказ
                  </Button>
                  <Button color="error" onClick={() => open(cart, 'release')}>
                    Отклонить / освободить
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          )
        })}
      </Stack>
      <Dialog
        open={!!selected}
        onClose={saving ? undefined : () => setSelected(null)}
        fullWidth
      >
        <form onSubmit={(event) => void submit(event)}>
          <DialogTitle>
            {action === 'confirm' ? 'Условия бронирования' : 'Освободить бронь'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {action === 'confirm' ? (
                <>
                  <TextField
                    label="Фактически полученная предоплата, ₽"
                    type="number"
                    required
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    inputProps={{ min: 0, step: '0.01' }}
                  />
                  <Button
                    onClick={() => {
                      const date = new Date(Date.now() + 86400000)
                      setUntil(localDate(date))
                      setReview(localDate(date))
                      setAmount('0')
                    }}
                  >
                    Сутки бесплатно
                  </Button>
                  <TextField
                    label="Срок брони (пусто — бессрочно)"
                    type="datetime-local"
                    value={until}
                    onChange={(event) => setUntil(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Напомнить администратору"
                    type="datetime-local"
                    required
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Внутренний комментарий"
                    multiline
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                  />
                  <Alert severity="info">
                    После срока растения не освобождаются автоматически. Перенесите и
                    срок, и напоминание при продлении брони.
                  </Alert>
                </>
              ) : (
                <>
                  <Typography>
                    Все позиции будут удалены из корзины, свободные от других заказов
                    растения вернутся в продажу. Сообщение клиенту отправьте вручную.
                  </Typography>
                  {Number(selected?.prepaidAmount || 0) > 0 && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={acknowledged}
                          onChange={(event) => setAcknowledged(event.target.checked)}
                        />
                      }
                      label="Подтверждаю освобождение растений. Предоплата остаётся записанной до отдельного урегулирования; автоматического возврата нет."
                    />
                  )}
                </>
              )}
              {message && <Alert severity="error">{message}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button disabled={saving} onClick={() => setSelected(null)}>
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={
                saving ||
                (action === 'release' &&
                  Number(selected?.prepaidAmount || 0) > 0 &&
                  !acknowledged)
              }
            >
              {saving
                ? 'Сохранение…'
                : action === 'confirm'
                  ? 'Подтвердить'
                  : 'Освободить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {paidCart && (
        <PaidOrderDialog
          cart={paidCart}
          onClose={() => setPaidCart(null)}
          onCreated={async (orderId) => {
            setPaidCart(null)
            await Promise.all([
              refresh(),
              utils.getOrders.invalidate(),
              utils.getMyOrders.invalidate(),
            ])
            void navigate(getOrderDetailRoute({ orderId }))
          }}
        />
      )}
    </Box>
  )
}
