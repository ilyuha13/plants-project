import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { deliveryNeedsRecipient } from '@plants-project/backend/src/lib/deliveryOptions'
import { orderTransitions } from '@plants-project/backend/src/lib/orderProcessing'
import { useState } from 'react'

import { trpc } from '../../lib/trpc'

import type { ProcessingTarget } from '@plants-project/backend/src/lib/orderProcessing'
import type { TrpcRouterOutput } from '@plants-project/backend/src/router'

type Order = NonNullable<TrpcRouterOutput['getOrder']['order']>
type ActiveStatus = 'COLLECTING' | 'PACKED' | 'SHIPPED'
const labels: Record<ProcessingTarget, string> = {
  PACKED: 'Отметить упаковку',
  SHIPPED: 'Отметить отправку',
  DELIVERED: 'Завершить заказ',
}

export const OrderProcessing = ({ order }: { order: Order }) => {
  const advance = trpc.advanceOrder.useMutation()
  const utils = trpc.useUtils()
  const [selected, setSelected] = useState<{
    from: ActiveStatus
    target: ProcessingTarget
  } | null>(null)
  const [tracking, setTracking] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  if (order.paidAmount === null) {
    return (
      <Alert severity="info">
        Старый заказ: оплата не зафиксирована. Для перехода на новый процесс потребуется
        отдельно разобрать его данные.
      </Alert>
    )
  }
  const actions = orderTransitions(order.status, order.deliveryType)
  const open = (target: ProcessingTarget) => {
    if (
      order.status !== 'COLLECTING' &&
      order.status !== 'PACKED' &&
      order.status !== 'SHIPPED'
    ) {
      return
    }
    setSelected({ from: order.status, target })
    setTracking(order.trackingNumber || '')
    setError('')
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selected || saving) {
      return
    }
    setSaving(true)
    setError('')
    try {
      await advance.mutateAsync({
        orderId: order.id,
        expectedStatus: selected.from,
        status: selected.target,
        trackingNumber: tracking,
      })
      setSelected(null)
      await Promise.all([
        utils.getOrder.invalidate({ orderId: order.id }),
        utils.getOrders.invalidate(),
        utils.getMyOrders.invalidate(),
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось изменить статус')
    } finally {
      setSaving(false)
    }
  }
  return (
    <>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {actions.map((target) => (
          <Button key={target} variant="outlined" onClick={() => open(target)}>
            {labels[target]}
          </Button>
        ))}
      </Stack>
      <Dialog
        open={!!selected}
        onClose={saving ? undefined : () => setSelected(null)}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={(event) => void submit(event)}>
          <DialogTitle>{selected ? labels[selected.target] : ''}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {selected?.target === 'PACKED' && (
                <Typography>
                  Растения собраны и упакованы? Дата упаковки сохранится в заказе.
                </Typography>
              )}
              {selected?.target === 'SHIPPED' && (
                <>
                  <Typography>
                    Подтвердите, что заказ передан в доставку. Дата отправки сохранится в
                    заказе.
                  </Typography>
                  <TextField
                    label={
                      deliveryNeedsRecipient(order.deliveryType)
                        ? 'Трек-номер отправления'
                        : 'Трек-номер (если есть)'
                    }
                    required={deliveryNeedsRecipient(order.deliveryType)}
                    value={tracking}
                    onChange={(event) => setTracking(event.target.value)}
                    inputProps={{ maxLength: 200 }}
                  />
                </>
              )}
              {selected?.target === 'DELIVERED' && (
                <Typography>
                  {order.deliveryType === 'PICKUP'
                    ? 'Подтвердите, что покупатель забрал растения.'
                    : 'Подтвердите, что покупатель получил заказ.'}{' '}
                  Дата завершения сохранится.
                </Typography>
              )}
              {error && <Alert severity="error">{error}</Alert>}
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
                (selected?.target === 'SHIPPED' &&
                  deliveryNeedsRecipient(order.deliveryType) &&
                  !tracking.trim())
              }
            >
              {saving ? 'Сохранение…' : 'Подтвердить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
