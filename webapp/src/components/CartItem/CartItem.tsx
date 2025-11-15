import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, Card, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material'

import { useMe } from '../../lib/ctx'
import { trpc } from '../../lib/trpc'

export const CartItem = ({
  imageUrl,
  id,
  name,
  price,
}: {
  imageUrl: string
  id: string
  name: string
  price: string
}) => {
  const removeItem = trpc.removeFromCart.useMutation()
  const me = useMe()
  const utils = trpc.useUtils()

  if (!me) {
    return null
  }

  const handleRemove = async () => {
    try {
      await removeItem.mutateAsync({ userId: me.id, cartItemId: id })
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
            image={imageUrl}
            alt={name}
            sx={{
              width: 60,
              height: 60,
              borderRadius: 1,
              objectFit: 'cover',
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={500}>
              {name}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {price} ₽
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
