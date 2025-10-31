import { AppBar, Box, Toolbar, IconButton, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import { getAddPlantInstsancePageRoute, getAddPlantPageRoute } from '../../lib/routes'
import { Logo } from '../Logo/Logo'
import { UserPanel } from '../UserPanel/UserPanel'

export const Header = () => {
  const me = useMe()
  const isAdmin: boolean = me?.role === 'ADMIN'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AppBar
      component="header"
      position="sticky"
      sx={{
        top: 0,
        bgcolor: 'hsla(0, 0%, 100%, 0.6);',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? 2 : 0,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <Toolbar>
        <IconButton component={RouterLink} to={'/'}>
          <Logo color="primary.main" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        {isAdmin && (
          <Toolbar sx={{ gap: 2 }}>
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
  )
}
