import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import { getSignInRoute, getSignOutRout, getSignUpRoute } from '../../lib/routes'

export const ToolbarActions = () => {
  const me = useMe()

  return (
    <div>
      {me ? (
        <>
          <Button variant="outlined" color="secondary">
            search
          </Button>
          <Link to={getSignOutRout()}>
            <Button variant="outlined" color="secondary">
              log out ({me.nick})
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link to={getSignInRoute()}>
            <Button variant="outlined" color="secondary">
              Sign in
            </Button>
          </Link>
          <Link to={getSignUpRoute()}>
            <Button variant="outlined" color="secondary">
              Sign up
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}
