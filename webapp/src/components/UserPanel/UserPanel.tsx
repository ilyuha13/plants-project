import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { IconButton, Toolbar, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import { getSignInRoute, getSignOutRoute } from '../../lib/routes'

export const UserPanel = () => {
  const me = useMe()
  return (
    <Toolbar disableGutters>
      {!me ? (
        <Tooltip title="войти">
          <IconButton component={Link} to={getSignInRoute()} color="primary">
            <LoginIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="выйти">
          <IconButton component={Link} to={getSignOutRoute()} color="primary">
            <LogoutIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}
