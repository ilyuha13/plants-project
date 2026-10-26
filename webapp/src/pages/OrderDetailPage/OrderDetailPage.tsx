import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { deliveryLabel } from '@plants-project/backend/src/lib/deliveryOptions'
import { orderStatusLabel } from '@plants-project/backend/src/lib/orderProcessing'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { OrderCancellation } from '../../components/OrderCancellation/OrderCancellation'
import { OrderProcessing } from '../../components/OrderProcessing/OrderProcessing'
import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'
import { useMe } from '../../lib/ctx'
import { OrderDetailRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const OrderDetailPage = () => {
  const isAdmin = useMe()?.role === 'ADMIN'
  const [photo, setPhoto] = useState<{ id: string; name: string } | null>(null)
  const { orderId } = useParams() as OrderDetailRouteParams
  const { data, isError, isLoading, error } = trpc.getOrder.useQuery(
    { orderId },
    { enabled: !!orderId, refetchInterval: 60000 },
  )
  if (isError) {
    return <Alert severity="error">{error.message}</Alert>
  }
  if (isLoading) {
    return <Typography>Загрузка заказа…</Typography>
  }
  if (!data?.order) {
    return <Alert severity="warning">Заказ не найден или недоступен.</Alert>
  }
  const order = data.order
  const legacy = order.items.some((item) => item.unitPrice === null)
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Заказ №{order.id}</Typography>
          <Typography>
            {new Date(order.createdAt).toLocaleString('ru-RU')} ·{' '}
            {orderStatusLabel[order.status]}
          </Typography>
          {isAdmin && <OrderProcessing order={order} />}
          {isAdmin && <OrderCancellation order={order} />}
          {order.cancelledAt && (
            <Alert severity="warning">
              Заказ отменён {new Date(order.cancelledAt).toLocaleString('ru-RU')}.
              Причина: {order.cancellationReason}
            </Alert>
          )}
          {order.packedAt && (
            <Typography>
              Упакован: {new Date(order.packedAt).toLocaleString('ru-RU')}
            </Typography>
          )}
          {order.shippedAt && (
            <Typography>
              Отправлен: {new Date(order.shippedAt).toLocaleString('ru-RU')}
            </Typography>
          )}
          {order.trackingNumber && (
            <Typography>
              Трек-номер:{' '}
              <Box component="span" sx={{ userSelect: 'all', fontWeight: 'bold' }}>
                {order.trackingNumber}
              </Box>
            </Typography>
          )}
          {order.deliveredAt && (
            <Typography>
              Завершён: {new Date(order.deliveredAt).toLocaleString('ru-RU')}
            </Typography>
          )}
          <Typography>Покупатель: {order.customerName}</Typography>
          <Typography>Контакт: {order.customerContact || order.customerPhone}</Typography>
          {order.customerPhone &&
            order.customerContact &&
            order.customerPhone !== order.customerContact && (
              <Typography>Телефон: {order.customerPhone}</Typography>
            )}
          {legacy && (
            <Alert severity="warning">
              Старый заказ: исторические цены и названия не сохранены. Для таких позиций
              показаны данные текущих карточек.
            </Alert>
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Фото</TableCell>
                {isAdmin && <TableCell>Инвентарный номер</TableCell>}
                <TableCell>Растение</TableCell>
                <TableCell align="right">Цена</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {(item.imagesUrl[0] || item.plantInstance.imagesUrl[0]) && (
                      <ButtonBase
                        aria-label={`Увеличить фото: ${item.plantName || item.plantInstance.plant.name}`}
                        onClick={() =>
                          setPhoto({
                            id: item.imagesUrl[0] || item.plantInstance.imagesUrl[0],
                            name: item.plantName || item.plantInstance.plant.name,
                          })
                        }
                        sx={{ borderRadius: 1, overflow: 'hidden', cursor: 'zoom-in' }}
                      >
                        <Box
                          component="img"
                          src={getCloudinaryUrl(
                            item.imagesUrl[0] || item.plantInstance.imagesUrl[0],
                            'medium',
                          )}
                          alt={item.plantName || item.plantInstance.plant.name}
                          sx={{
                            width: { xs: 120, sm: 180 },
                            height: { xs: 120, sm: 180 },
                            objectFit: 'contain',
                          }}
                        />
                      </ButtonBase>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      {item.inventoryNumber || item.plantInstance.inventoryNumber}
                      {item.releasedAt && (
                        <Typography variant="caption" display="block">
                          Возвращён в продажу{' '}
                          {new Date(item.releasedAt).toLocaleString('ru-RU')}
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  <TableCell>{item.plantName || item.plantInstance.plant.name}</TableCell>
                  <TableCell align="right">
                    {String(item.unitPrice ?? item.plantInstance.price)} ₽
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography>Получение: {deliveryLabel(order.deliveryType)}</Typography>
          {order.pickupPoint && <Typography>ПВЗ: {order.pickupPoint}</Typography>}
          {order.customerAddress && (
            <Typography>Адрес: {order.customerAddress}</Typography>
          )}
          {order.deliveryNotes && (
            <Typography>Доставка: {order.deliveryNotes}</Typography>
          )}
          <Typography>Стоимость доставки: {String(order.deliveryCost ?? 0)} ₽</Typography>
          {order.customerNotes && (
            <Typography>Комментарий клиента: {order.customerNotes}</Typography>
          )}
          <Typography variant="h6">Итого: {String(order.totalAmount)} ₽</Typography>
          {order.status === 'CANCELLED' && order.paidAmount !== null && (
            <>
              <Typography>Возвращено: {String(order.refundedAmount)} ₽</Typography>
              <Typography>
                Остаток полученной суммы:{' '}
                {(
                  (Math.round(Number(order.paidAmount) * 100) -
                    Math.round(Number(order.refundedAmount) * 100)) /
                  100
                ).toFixed(2)}{' '}
                ₽
              </Typography>
              {order.refunds.map((refund) => (
                <Typography key={refund.id}>
                  {new Date(refund.createdAt).toLocaleString('ru-RU')} · Возврат{' '}
                  {String(refund.amount)} ₽{isAdmin && refund.note && ` · ${refund.note}`}
                  {isAdmin && refund.actorNick && ` · ${refund.actorNick}`}
                </Typography>
              ))}
            </>
          )}
          {order.paidAmount !== null ? (
            <>
              <Typography>Получено всего: {String(order.paidAmount)} ₽</Typography>
              <Typography>
                Из них ранее внесённая предоплата: {String(order.prepaidAmount ?? 0)} ₽
              </Typography>
              {Number(order.paidAmount) > Number(order.totalAmount) && (
                <Alert severity="warning">
                  Переплата:{' '}
                  {(Number(order.paidAmount) - Number(order.totalAmount)).toFixed(2)} ₽
                </Alert>
              )}
            </>
          ) : (
            <Typography>Полученная оплата в старом заказе не зафиксирована.</Typography>
          )}
        </Stack>
      </Paper>
      <Dialog open={!!photo} onClose={() => setPhoto(null)} maxWidth="lg" fullWidth>
        <DialogTitle>{photo?.name}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {photo && (
            <Box
              component="img"
              src={getCloudinaryUrl(photo.id, 'full')}
              alt={photo.name}
              sx={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhoto(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
