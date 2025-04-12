import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { getPlantsListRoute } from '../../lib/routes'
import { Logo } from '../Logo/Logo'
import styles from './footer.module.scss'

export const Footer = () => {
  return (
    <Box className={styles.footer} sx={{ bgcolor: 'secondary.main' }}>
      <Link to={getPlantsListRoute()}>
        <Logo />
      </Link>
    </Box>
  )
}
