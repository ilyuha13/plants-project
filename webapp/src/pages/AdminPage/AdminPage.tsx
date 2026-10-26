import { Box, Button, Paper, Stack } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { OrdersMenagement } from '../../components/OrdersMenagement/OrdersMenagement'
import { ReservationsManagement } from '../../components/ReservationsManagement/ReservationsManagement'
import { UsersManagement } from '../../components/UsersManagement/UsersManagement'
import {
  getAddGenusPageRoute,
  getAddLifeFormPageRoute,
  getAddPlantInstsancePageRoute,
  getAddPlantPageRoute,
  getAddVariegationPageRoute,
  getOrderDetailRoute,
} from '../../lib/routes'

export const AdminPage = () => {
  const navigate = useNavigate()

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

        <ReservationsManagement />
        <UsersManagement />
        <OrdersMenagement navigateToOrder={navigateToOrder} />
      </Paper>
    </Box>
  )
}
