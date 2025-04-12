import { Button } from '@mui/material'
import s from './toolbar.module.scss'

export const Toolbar = () => {
  return (
    <div className={s.container}>
      <Button className={s.loginButton} variant="outlined" color="secondary">
        login
      </Button>
      <Button className={s.searchButton} variant="outlined" color="secondary">
        search
      </Button>
    </div>
  )
}
