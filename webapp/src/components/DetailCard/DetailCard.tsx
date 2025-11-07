import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useMe } from '../../lib/ctx'
import { env } from '../../lib/env'
import { trpc } from '../../lib/trpc'
import { Galery } from '../Galery/Galery'

type BasePlantDetailProps = {
  type: 'plant'
  data: {
    plantId: string
    name: string
    description: string
    imagesUrl: string[]
  }
  onDelete?: () => Promise<void>
  isDeleting?: boolean
}

type PlantInstanceDetailProps = {
  type: 'instance'
  data: {
    Id: string
    inventoryNumber: string
    plant: {
      plantId: string
      name: string
    }
    price: string
    description?: string | null
    imagesUrl: string[]
    createdAt: Date
    status: 'AVAILABLE' | 'SOLD' | 'IN_CART'
  }
  onDelete?: () => Promise<void>
  isDeleting?: boolean
}

type DetailCardProps = BasePlantDetailProps | PlantInstanceDetailProps

export const DetailCard = (props: DetailCardProps) => {
  const me = useMe()
  const { type, data, onDelete, isDeleting } = props
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const addToCart = trpc.addToCart.useMutation()

  const utils = trpc.useUtils()

  const imageUrls = data.imagesUrl.map((url) => `${env.VITE_BACKEND_URL}/${url.replace('public/', '')}`)

  const handleDeleteClick = async () => {
    if (onDelete) {
      await onDelete()
      setDeleteDialogOpen(false)
    }
  }

  if (type === 'plant') {
    return (
      <>
        <Paper
          sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            minHeight: '70vh',
          }}
        >
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Galery imageUrls={imageUrls} alt={data.name} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3} sx={{ height: '100%' }}>
                <Typography variant="h3" component="div" fontWeight="bold">
                  {data.name}
                </Typography>

                <Box>
                  <Typography variant="body1" paragraph>
                    {data.description}
                  </Typography>
                </Box>

                <Box flex="1" />

                {me?.role === 'ADMIN' && onDelete && (
                  <Button color="error" onClick={() => setDeleteDialogOpen(true)} fullWidth>
                    Удалить растение
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {onDelete && (
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <Typography>
                Вы уверены что хотите удалить "{data.name}"?
                <br />
                Это действие нельзя отменить.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
              <Button onClick={handleDeleteClick} color="error" disabled={isDeleting}>
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    )
  }

  if (type === 'instance') {
    return (
      <>
        <Paper
          sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            minHeight: '70vh',
          }}
        >
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Galery imageUrls={imageUrls} alt={`${data.plant.name} - экземпляр #${data.inventoryNumber}`} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3} sx={{ height: '100%' }}>
                {me?.role === 'ADMIN' && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Инвентарный номер
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      #{data.inventoryNumber}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {data.plant.name}
                  </Typography>
                </Box>

                {data.description && (
                  <Box>
                    <Typography variant="body1" paragraph>
                      {data.description}
                    </Typography>
                  </Box>
                )}

                <Box flex="1" />

                <Paper
                  sx={{
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    marginTop: 'auto',
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {data.price} ₽
                  </Typography>
                  {me && (
                    <Button
                      variant="contained"
                      disabled={data.status !== 'AVAILABLE' || addToCart.isPending}
                      onClick={async () => {
                        await addToCart.mutateAsync({ userId: me.id, plantInstanceId: data.Id })
                        await utils.getCart.invalidate()
                        await utils.getPlantInstance.invalidate()
                      }}
                      sx={{ minWidth: 200 }}
                    >
                      {addToCart.isPending
                        ? 'Добавление...'
                        : data.status === 'IN_CART'
                          ? 'В корзине'
                          : data.status === 'SOLD'
                            ? 'Продано'
                            : 'Добавить в корзину'}
                    </Button>
                  )}
                </Paper>

                {me?.role === 'ADMIN' && onDelete && (
                  <Button color="error" onClick={() => setDeleteDialogOpen(true)} fullWidth>
                    Удалить экземпляр
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {onDelete && (
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <Typography>
                Вы уверены что хотите удалить экземпляр #{data.inventoryNumber}?
                <br />
                Это действие нельзя отменить.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
              <Button onClick={handleDeleteClick} color="error" disabled={isDeleting}>
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    )
  }

  return null
}
