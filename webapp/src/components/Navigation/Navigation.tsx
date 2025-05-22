import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import * as routes from '../../lib/routes'
import { useAppStore } from '../../store/AppStoreProvider'
import s from './navigation.module.scss'

export const Navigation = () => {
  const themeState = useAppStore()
  return (
    <div className={s.container}>
      <Link to={routes.getAddPlantPageRoute()}>
        <Button variant="outlined" color="secondary">
          add plant
        </Button>
      </Link>

      <Button variant="outlined" color="secondary">
        button
      </Button>

      <Button
        color="secondary"
        variant="outlined"
        onClick={() => {
          themeState.toggleTheme()
        }}
      >
        theme
      </Button>
      <Link to={routes.getAddCategoriesRoute()}>
        <Button variant="outlined" color="secondary">
          add categories
        </Button>
      </Link>

      <Button variant="outlined" color="secondary">
        test 2
      </Button>
    </div>
  )
}
