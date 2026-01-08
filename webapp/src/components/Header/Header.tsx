import { AppBar, Box, Toolbar } from '@mui/material'
import { useEffect, useState } from 'react'

import { MenuButton } from '../MenuButton/MenuButton'
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
        bgcolor: 'hsla(0, 0%, 100%, 0.60);',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? 2 : 0,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <Toolbar>
        <MenuButton />

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ flexGrow: 1 }} />
        <UserPanel />
      </Toolbar>
    </AppBar>
  )
}
