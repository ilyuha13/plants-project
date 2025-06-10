import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import { getSignInRoute, getSignOutRout, getSignUpRoute } from '../../lib/routes'
import s from './toolbar.module.scss'

export const Toolbar = () => {
  const me = useMe()

  return (
    <div className={s.container}>
      {me ? (
        <>
          <Button className={s.searchButton} variant="outlined" color="secondary">
            search
          </Button>
          <Link to={getSignOutRout()}>
            <Button className={s.searchButton} variant="outlined" color="secondary">
              log out ({me.nick})
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link to={getSignInRoute()}>
            <Button className={s.loginButton} variant="outlined" color="secondary">
              Sign in
            </Button>
          </Link>
          <Link to={getSignUpRoute()}>
            <Button className={s.loginButton} variant="outlined" color="secondary">
              Sign up
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}
