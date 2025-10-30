import { AppBar, Box, Toolbar, IconButton, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import { getAddPlantInstsancePageRoute, getAddPlantPageRoute } from '../../lib/routes'
import { Logo } from '../Logo/Logo'
import { UserPanel } from '../UserPanel/UserPanel'

export const Header = () => {
  const me = useMe()
  const isAdmin: boolean = me?.role === 'ADMIN'

  return (
    //{TODO: positon sticki, copacity}
    <Box>
      <AppBar position="sticky" sx={{ bgcolor: 'transparent', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <IconButton component={RouterLink} to={'/'}>
            <Logo color="primary.main" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {isAdmin && (
            <Toolbar>
              <Button component={RouterLink} to={getAddPlantPageRoute()} sx={{ minWidth: 140 }}>
                добавить растение
              </Button>
              <Button component={RouterLink} to={getAddPlantInstsancePageRoute()} sx={{ minWidth: 140 }}>
                добавить экземпляр
              </Button>
            </Toolbar>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <UserPanel />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
