import { Box, Button, Paper, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { UsersManagement } from '../../components/UsersManagement/UsersManagement'
import {
  getAddGenusPageRoute,
  getAddLifeFormPageRoute,
  getAddPlantInstsancePageRoute,
  getAddPlantPageRoute,
  getAddVariegationPageRoute,
} from '../../lib/routes'

export const AdminPage = () => {
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
          <Button component={RouterLink} to={getAddGenusPageRoute()} sx={{ minWidth: 140 }}>
            добавить род
          </Button>
          <Button component={RouterLink} to={getAddVariegationPageRoute()} sx={{ minWidth: 140 }}>
            добавить вариегатность
          </Button>
          <Button component={RouterLink} to={getAddLifeFormPageRoute()} sx={{ minWidth: 140 }}>
            добавить жизненную форму
          </Button>
          <Button component={RouterLink} to={getAddPlantPageRoute()} sx={{ minWidth: 140 }}>
            добавить растение
          </Button>
          <Button component={RouterLink} to={getAddPlantInstsancePageRoute()} sx={{ minWidth: 140 }}>
            добавить экземпляр
          </Button>
        </Stack>

        <UsersManagement />
      </Paper>
    </Box>
  )
}
