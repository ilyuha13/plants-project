import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, Tooltip } from '@mui/material'

import { useMenuStore } from '../../stores/menuStore'

export function MenuButton() {
  const isOpen = useMenuStore((state) => state.isOpen)
  const openMenu = useMenuStore((state) => state.openMenu)
  const closeMenu = useMenuStore((state) => state.closeMenu)

  const handleClick = () => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  return (
    <Tooltip title="Меню">
      <IconButton onClick={handleClick} color="primary">
        <MenuIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  )
}
