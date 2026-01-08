import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import {
  getAllInstancePageRoute,
  getAllPlantsPageRoute,
  getCatalogPageRoute,
} from '../../lib/routes'
import { useMenuStore } from '../../stores/menuStore'

export const Menu = () => {
  const isOpen = useMenuStore((state) => state.isOpen)
  const closeMenu = useMenuStore((state) => state.closeMenu)

  return (
    <>
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={closeMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5">Меню</Typography>
          <IconButton onClick={closeMenu}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Stack spacing={2} sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
          <Button component={RouterLink} onClick={closeMenu} to={getCatalogPageRoute()}>
            каталог
          </Button>
          <Button
            component={RouterLink}
            onClick={closeMenu}
            to={getAllInstancePageRoute()}
          >
            все экземпляры
          </Button>
          <Button component={RouterLink} onClick={closeMenu} to={getAllPlantsPageRoute()}>
            все сорта
          </Button>
        </Stack>
      </Drawer>
    </>
  )
}
