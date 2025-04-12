import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { getPlantsListRoute } from '../../lib/routes'
import { BurgerMenu } from '../BurgerMenu/BurgerMenu'
import { Logo } from '../Logo/Logo'
import { Navigation } from '../Navigation/Navigation'
import { Toolbar } from '../Toolbar/Toolbar'
import s from './Header.module.scss'

export const Header = () => {
  return (
    <Box className={s.header} sx={{ bgcolor: 'primary.main' }}>
      <Link className={s.burgerLink} to={getPlantsListRoute()}>
        <BurgerMenu />
      </Link>
      <Link className={s.logoLink} to={getPlantsListRoute()}>
        <Logo />
      </Link>
      <Navigation />
      <Toolbar />
    </Box>
  )
}
