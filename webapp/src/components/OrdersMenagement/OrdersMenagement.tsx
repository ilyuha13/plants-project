import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { deliveryLabel } from '@plants-project/backend/src/lib/deliveryOptions'
import {
  orderStatuses,
  orderStatusLabel,
} from '@plants-project/backend/src/lib/orderProcessing'
import { useState } from 'react'

import { trpc } from '../../lib/trpc'

type Filter = 'ACTIVE' | 'ALL' | (typeof orderStatuses)[number]
export const OrdersMenagement = ({
  navigateToOrder,
}: {
  navigateToOrder: (id: string) => void
}) => {
  const [filter, setFilter] = useState<Filter>('ACTIVE')
  const { data, error, isLoading } = trpc.getOrders.useQuery(
    { filter },
    { refetchInterval: 60000 },
  )
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">Заказы</Typography>
      <TextField
        select
        label="Показать"
        value={filter}
        onChange={(event) => setFilter(event.target.value as Filter)}
        sx={{ my: 2, minWidth: 260 }}
      >
        <MenuItem value="ACTIVE">В работе</MenuItem>
        {orderStatuses.map((status) => (
          <MenuItem key={status} value={status}>
            {orderStatusLabel[status]}
          </MenuItem>
        ))}
        <MenuItem value="ALL">Все заказы</MenuItem>
      </TextField>
      {isLoading && <Typography>Загрузка заказов…</Typography>}
      {error && <Alert severity="error">{error.message}</Alert>}
      {data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Покупатель</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Доставка</TableCell>
                <TableCell>Трек-номер</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {!data.orders.length && (
                <TableRow>
                  <TableCell colSpan={7}>Заказов в этом списке нет.</TableCell>
                </TableRow>
              )}
              {data.orders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  onClick={() => navigateToOrder(order.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{orderStatusLabel[order.status]}</TableCell>
                  <TableCell>{deliveryLabel(order.deliveryType)}</TableCell>
                  <TableCell>{order.trackingNumber || '—'}</TableCell>
                  <TableCell>{String(order.totalAmount)} ₽</TableCell>
                  <TableCell>
                    <Button
                      onClick={(event) => {
                        event.stopPropagation()
                        navigateToOrder(order.id)
                      }}
                    >
                      Открыть
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
