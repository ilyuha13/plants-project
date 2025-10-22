import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { AppBar, Box, Toolbar, IconButton, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Logo } from '../Logo/Logo'
import { UserPanel } from '../UserPanel/UserPanel'
import VersatilePlantCard from '../VersatilePlantCard'

const testPlant = {
  type: 'instance' as const,
  name: 'Test Plant',
  description: 'This is a test plant description.',
  images: ['http://localhost:3000/images/1757685998673.png'],
  onTitleClick: () => {},
  price: 1234,
}

export const Header = () => {
  const [show, setShow] = useState(false)
  const [heightMenu, setHeightMenu] = useState(false)
  const isAdmin = false
  const onButtonClick = () => {
    if (show) {
      setHeightMenu((prev) => !prev)
      setTimeout(() => {
        setShow((prev) => !prev)
      }, 1000)
    } else {
      setShow((prev) => !prev)
      setTimeout(() => {
        setHeightMenu((prev) => !prev)
      }, 20)
    }
  }
  return (
    <Box>
      <AppBar position="sticky" sx={{ bgcolor: 'transparent', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <IconButton component={RouterLink} to={'/'}>
            <Logo color="primary.main" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Toolbar sx={{ justifyContent: 'center', flexDirection: 'column', gap: 0.5 }}>
            <Button
              onClick={onButtonClick}
              sx={{ minWidth: 140 }}
              startIcon={<KeyboardArrowDownIcon fontSize="large" />}
            >
              каталог
            </Button>

            {isAdmin && (
              <Button sx={{ minWidth: 140 }} startIcon={<KeyboardArrowDownIcon fontSize="large" />}>
                добавить
              </Button>
            )}
          </Toolbar>

          <Box sx={{ flexGrow: 1 }} />
          <UserPanel />
        </Toolbar>
      </AppBar>
      {show && (
        <Box
          sx={{
            alignItems: 'center',
            width: '100%',
            height: `${heightMenu ? '100vh' : '0.5px'}`,
            transition: 'height 1s ease',
            overflow: 'hidden',
            borderRadius: 1,
            bgcolor: 'primary.light',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <Stack gap={5} direction={'column'}>
            <Stack justifyContent={'center'} gap={5} direction={'row'}>
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
            </Stack>
            <Stack justifyContent={'center'} gap={5} direction={'row'}>
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
            </Stack>
            <Stack justifyContent={'center'} gap={5} direction={'row'}>
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
              <VersatilePlantCard {...testPlant} />
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
