import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { Badge, IconButton, Tooltip } from '@mui/material'
import { useCartStore } from '../../stores/cartStore'

export function CartButton() {
  const itemsCount = useCartStore((state) => state.items.length)
  const isOpen = useCartStore((state) => state.isOpen)
  const openCart = useCartStore((state) => state.openCart)
  const closeCart = useCartStore((state) => state.closeCart)

  const handleClick = () => {
    if (isOpen) {
      closeCart()
    } else {
      openCart()
    }
  }

  return (
    <Tooltip title="Корзина">
      <IconButton onClick={handleClick} color="primary">
        <Badge badgeContent={itemsCount} color="secondary">
          <ShoppingCartOutlinedIcon fontSize="large" />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}
