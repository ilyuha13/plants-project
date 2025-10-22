import LoginIcon from '@mui/icons-material/Login'
import { IconButton, Toolbar, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import { getSignInRoute } from '../../lib/routes'

export const UserPanel = () => {
  const me = useMe()
  return (
    !me && (
      <Toolbar disableGutters>
        <Tooltip title="войти">
          <IconButton component={Link} to={getSignInRoute()} color="primary">
            <LoginIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    )
  )
}
