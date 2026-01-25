import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

interface OrderTable {
  id: string
  customerName: string
  status:
    | 'PENDING'
    | 'AWAITING_PAYMENT'
    | 'CANCELLED'
    | 'COLLECTING'
    | 'PACKED'
    | 'SHIPPED'
    | 'DELIVERED'
  createdAt: Date
}

export const OrdersMenagement = ({
  orders,
  navigateToOrder,
}: {
  navigateToOrder: (orderId: string) => void
  orders: OrderTable[]
}) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Дата создания</TableCell>
            <TableCell>Имя покупателя</TableCell>
            <TableCell>Статус заказа</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              component={'tr'}
              key={order.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => navigateToOrder(order.id)}
            >
              <TableCell>
                {order.createdAt.toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell align="right">
                что то
                {/* <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleGenerateResetLinkClick(user.id, user.nick)}
                  title="Сгенерировать ссылку для сброса пароля"
                >
                  <KeyIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(user.id, user.nick)}
                  title="Удалить пользователя"
                >
                  <DeleteIcon />
                </IconButton> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
