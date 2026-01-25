import { Box, Button, Paper, Stack } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { OrdersMenagement } from '../../components/OrdersMenagement/OrdersMenagement'
import { UsersManagement } from '../../components/UsersManagement/UsersManagement'
import {
  getAddGenusPageRoute,
  getAddLifeFormPageRoute,
  getAddPlantInstsancePageRoute,
  getAddPlantPageRoute,
  getAddVariegationPageRoute,
  getOrderDetailRoute,
} from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const AdminPage = () => {
  const { data, isLoading, isError } = trpc.getOrders.useQuery()

  const navigate = useNavigate()

  if (isError) {
    return <Box>error</Box>
  }
  if (isLoading) {
    return <Box>...loading</Box>
  }

  const orders = data?.orders
  const ordersMenagementData = orders?.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    status: order.status,
    createdAt: order.createdAt,
  }))

  const navigateToOrder = (orderId: string) => {
    void navigate(getOrderDetailRoute({ orderId: orderId }))
  }

  return (
    <Box>
      <Paper
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          minHeight: '70vh',
        }}
      >
        <Stack
          sx={{
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Button
            component={RouterLink}
            to={getAddGenusPageRoute()}
            sx={{ minWidth: 140 }}
          >
            добавить род
          </Button>
          <Button
            component={RouterLink}
            to={getAddVariegationPageRoute()}
            sx={{ minWidth: 140 }}
          >
            добавить вариегатность
          </Button>
          <Button
            component={RouterLink}
            to={getAddLifeFormPageRoute()}
            sx={{ minWidth: 140 }}
          >
            добавить жизненную форму
          </Button>
          <Button
            component={RouterLink}
            to={getAddPlantPageRoute()}
            sx={{ minWidth: 140 }}
          >
            добавить растение
          </Button>
          <Button
            component={RouterLink}
            to={getAddPlantInstsancePageRoute()}
            sx={{ minWidth: 140 }}
          >
            добавить экземпляр
          </Button>
        </Stack>

        <UsersManagement />
        {ordersMenagementData && (
          <OrdersMenagement
            navigateToOrder={navigateToOrder}
            orders={ordersMenagementData}
          />
        )}
      </Paper>
    </Box>
  )
}
