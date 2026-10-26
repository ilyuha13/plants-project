import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { moneyInput } from '@plants-project/backend/src/router/paidOrders/input'
import { useState } from 'react'

import { trpc } from '../../lib/trpc'

import type { TrpcRouterOutput } from '@plants-project/backend/src/router'

type Order = NonNullable<TrpcRouterOutput['getOrder']['order']>
type Mode = 'cancel' | 'refund' | 'release'
const titles = {
  cancel: 'Отменить оплаченный заказ',
  refund: 'Записать фактический возврат',
  release: 'Вернуть растения в продажу',
}

export const OrderCancellation = ({ order }: { order: Order }) => {
  const cancel = trpc.cancelPaidOrder.useMutation()
  const refund = trpc.recordOrderRefund.useMutation()
  const release = trpc.releaseOrderItems.useMutation()
  const utils = trpc.useUtils()
  const [mode, setMode] = useState<Mode | null>(null)
  const [version, setVersion] = useState(order.updatedAt)
  const [requestId, setRequestId] = useState('')
  const [reason, setReason] = useState('')
  const [amount, setAmount] = useState('0')
  const [confirmed, setConfirmed] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  if (order.paidAmount === null) {
    return null
  }
  const remainingCents =
    Math.round(Number(order.paidAmount) * 100) -
    Math.round(Number(order.refundedAmount) * 100)
  const amountValid = moneyInput.safeParse(amount).success
  const enteredCents = amountValid ? Math.round(Number(amount) * 100) : -1
  const pendingItems = order.items.filter((item) => !item.releasedAt)
  const open = (nextMode: Mode) => {
    setMode(nextMode)
    setVersion(order.updatedAt)
    setRequestId(crypto.randomUUID())
    setReason('')
    setAmount(nextMode === 'refund' ? '' : '0')
    setConfirmed(false)
    setSelected([])
    setError('')
  }
  const blocked =
    mode === 'release'
      ? !selected.length
        ? 'Выберите растения для возврата в продажу.'
        : null
      : !amountValid || (mode === 'refund' && enteredCents <= 0)
        ? 'Укажите корректную сумму фактически выполненного возврата.'
        : enteredCents > remainingCents
          ? 'Сумма превышает остаток полученной оплаты.'
          : mode === 'cancel' && !reason.trim()
            ? 'Укажите причину отмены.'
            : enteredCents > 0 && !confirmed
              ? 'Подтвердите, что деньги уже возвращены вручную.'
              : null
  const refresh = async () =>
    Promise.all([
      utils.getOrder.invalidate({ orderId: order.id }),
      utils.getOrders.invalidate(),
      utils.getMyOrders.invalidate(),
      utils.getAllInstances.invalidate(),
      utils.getPlant.invalidate(),
      utils.getPlants.invalidate(),
      utils.getPlantInstance.invalidate(),
      utils.getPlantInstances.invalidate(),
    ])
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!mode || blocked || saving) {
      return
    }
    setSaving(true)
    setError('')
    try {
      if (mode === 'cancel') {
        await cancel.mutateAsync({
          orderId: order.id,
          expectedUpdatedAt: version,
          requestId,
          reason,
          refundAmount: amount,
          refundConfirmed: confirmed,
          releaseItemIds: selected,
        })
      } else if (mode === 'refund') {
        await refund.mutateAsync({
          orderId: order.id,
          requestId,
          amount,
          confirmed: true,
          note: reason,
        })
      } else {
        await release.mutateAsync({ orderId: order.id, itemIds: selected })
      }
      setMode(null)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить действие')
    } finally {
      setSaving(false)
    }
  }
  return (
    <>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {['COLLECTING', 'PACKED'].includes(order.status) && (
          <Button color="error" onClick={() => open('cancel')}>
            Отменить заказ
          </Button>
        )}
        {order.status === 'CANCELLED' && (
          <>
            <Button disabled={remainingCents <= 0} onClick={() => open('refund')}>
              Записать возврат денег
            </Button>
            <Button disabled={!pendingItems.length} onClick={() => open('release')}>
              Вернуть растения в продажу
            </Button>
          </>
        )}
      </Stack>
      <Dialog
        open={!!mode}
        onClose={saving ? undefined : () => setMode(null)}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={(event) => void submit(event)}>
          <DialogTitle>{mode ? titles[mode] : ''}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Alert severity="info">
                Деньги переводятся клиенту вручную. Здесь фиксируются выполненные
                действия. История и исходная оплата сохраняются.
              </Alert>
              {mode !== 'release' && (
                <>
                  <Typography>
                    Получено: {String(order.paidAmount)} ₽ · Уже возвращено:{' '}
                    {String(order.refundedAmount)} ₽ · Остаток:{' '}
                    {(remainingCents / 100).toFixed(2)} ₽
                  </Typography>
                  <TextField
                    label={
                      mode === 'cancel'
                        ? 'Причина отмены (видна покупателю)'
                        : 'Внутренняя заметка к возврату'
                    }
                    required={mode === 'cancel'}
                    multiline
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    inputProps={{ maxLength: 2000 }}
                  />
                  <TextField
                    label="Фактически возвращено сейчас, ₽"
                    required
                    type="number"
                    inputProps={{ min: 0, step: '0.01' }}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    helperText={
                      mode === 'cancel'
                        ? 'Оставьте 0, если возврат ещё не выполнен. Записать его можно после отмены.'
                        : 'Это дополнительная сумма, а не общий итог всех возвратов.'
                    }
                  />
                  {enteredCents > 0 && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={confirmed}
                          onChange={(event) => setConfirmed(event.target.checked)}
                        />
                      }
                      label="Указанная сумма уже возвращена клиенту вручную"
                    />
                  )}
                </>
              )}
              {mode !== 'refund' && (
                <>
                  <Typography>
                    Отметьте только растения, которые готовы снова продаваться. Без
                    отметки растение останется недоступным.
                  </Typography>
                  {pendingItems.map((item) => (
                    <FormControlLabel
                      key={item.id}
                      control={
                        <Checkbox
                          checked={selected.includes(item.id)}
                          onChange={(event) =>
                            setSelected(
                              event.target.checked
                                ? [...selected, item.id]
                                : selected.filter((id) => id !== item.id),
                            )
                          }
                        />
                      }
                      label={`№${item.inventoryNumber || item.plantInstance.inventoryNumber} · ${item.plantName || item.plantInstance.plant.name}`}
                    />
                  ))}
                  {!pendingItems.length && (
                    <Typography>Все растения уже возвращены в продажу.</Typography>
                  )}
                </>
              )}
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack sx={{ width: '100%' }} spacing={1}>
              {blocked && <Alert severity="info">{blocked}</Alert>}
              <Stack direction="row" justifyContent="flex-end">
                <Button disabled={saving} onClick={() => setMode(null)}>
                  Закрыть
                </Button>
                <Button
                  type="submit"
                  color={mode === 'cancel' ? 'error' : 'primary'}
                  disabled={saving || !!blocked}
                >
                  {saving
                    ? 'Сохранение…'
                    : mode === 'cancel'
                      ? 'Подтвердить отмену'
                      : 'Сохранить'}
                </Button>
              </Stack>
            </Stack>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
