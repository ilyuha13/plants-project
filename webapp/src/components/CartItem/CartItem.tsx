import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, Card, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material'

import { useMe } from '../../lib/ctx'
import { env } from '../../lib/env'
import { trpc } from '../../lib/trpc'

import type { TCartItem } from '../../stores/cartStore'

export const CartItem = ({ item }: { item: TCartItem }) => {
  const removeItem = trpc.removeFromCart.useMutation()
  const me = useMe()
  const utils = trpc.useUtils()
  const imagesUrl = `${env.VITE_BACKEND_URL}/${item.plantInstance.plant.imagesUrl[0].replace('public/', '')}`

  if (!me) {
    return null
  }

  const handleRemove = async () => {
    try {
      await removeItem.mutateAsync({ userId: me.id, cartItemId: item.id })
      await utils.getCart.invalidate()
      await utils.getPlantInstance.invalidate()
    } catch (error) {
      console.error('Failed to remove item:', error)
      // Можно добавить toast/notification
    }
  }
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CardMedia
            component="img"
            image={imagesUrl}
            alt={item.plantInstance.plant.name}
            sx={{
              width: 60,
              height: 60,
              borderRadius: 1,
              objectFit: 'cover',
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={500}>
              {item.plantInstance.plant.name}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {item.plantInstance.price} ₽
            </Typography>
          </Box>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              handleRemove().catch(console.error)
            }}
            disabled={removeItem.isPending}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  )
}
