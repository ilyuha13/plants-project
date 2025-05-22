import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { getSignInRoute, getSignOutRout, getSignUpRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import s from './toolbar.module.scss'

export const Toolbar = () => {
  const { data, isError, isFetching, isLoading } = trpc.getMe.useQuery()

  return (
    <div className={s.container}>
      {isLoading || isFetching || isError || !data ? null : data.me ? (
        <>
          <Button className={s.searchButton} variant="outlined" color="secondary">
            search
          </Button>
          <Link to={getSignOutRout()}>
            <Button className={s.searchButton} variant="outlined" color="secondary">
              log out ({data.me.nick})
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
