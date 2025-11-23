import { AppBar, Box, Toolbar, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { Logo } from '../Logo/Logo'
import { UserPanel } from '../UserPanel/UserPanel'

export const Header = () => {
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

        <Box sx={{ flexGrow: 1 }} />
        <UserPanel />
      </Toolbar>
    </AppBar>
  )
}
