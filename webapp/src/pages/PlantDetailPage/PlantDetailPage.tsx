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
import { useNavigate, useParams } from 'react-router-dom'
import { Galery } from '../../components/Galery/Galery'
import { useMe } from '../../lib/ctx'
import { env } from '../../lib/env'
import { getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

type PlantDetailParams = {
  plantId: string
}

export const PlantDetailPage = () => {
  const { plantId } = useParams<PlantDetailParams>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const me = useMe()

  // Fetch plant data
  const { data, isLoading, isError, error } = trpc.getPlant.useQuery({ plantId: plantId! }, { enabled: !!plantId })

  // Fetch current user to check if admin

  // Delete mutation
  const deletePlant = trpc.deletePlant.useMutation()

  const handleDelete = async () => {
    try {
      await deletePlant.mutateAsync({ plantId: plantId! })
      navigate(getPlantsListRoute())
    } catch (error) {
      console.error('Failed to delete plant:', error)
      alert('Не удалось удалить растение')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Загрузка...</Typography>
      </Box>
    )
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5" color="error">
          Ошибка: {error?.message || 'Не удалось загрузить растение'}
        </Typography>
      </Box>
    )
  }

  // Not found state
  if (!data?.plant) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Растение не найдено</Typography>
      </Box>
    )
  }

  const { plant } = data

  // Prepare image URLs
  const imageUrls = plant.imagesUrl.map((url) => `${env.VITE_BACKEND_URL}/${url.replace('public/', '')}`)

  // Telegram contact link
  const telegramUsername = 'your_bot_username' // TODO: Move to env variables
  const telegramMessage = encodeURIComponent(
    `Здравствуйте! Интересует растение "${plant.variety}" (${plant.genus}). Цена: ${plant.price} ₽`,
  )
  const telegramLink = `https://t.me/${telegramUsername}?text=${telegramMessage}`

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: { xs: 2, sm: 3, md: 4 },
        minHeight: '80vh',
      }}
    >
      {/* Main Card - почти на весь экран */}
      <Paper
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          minHeight: '70vh',
        }}
      >
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* LEFT COLUMN - Галерея фото */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Galery imageUrls={imageUrls} alt={plant.variety} />
          </Grid>

          {/* RIGHT COLUMN - Контент */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {/* Вид (genus) */}
              <Box>
                <Typography variant="h6" color="text.secondary">
                  {plant.genus}
                </Typography>
              </Box>

              {/* Сорт (variety) */}
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {plant.variety}
                </Typography>
              </Box>

              {/* Описание */}
              <Box>
                <Typography variant="body1" paragraph>
                  {plant.description}
                </Typography>
              </Box>
              <Box flex="1"></Box>

              {/* Цена и кнопка связи - внутри карточки, смещены вправо */}
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
                  {plant.price} ₽
                </Typography>
                <Button component="a" href={telegramLink} target="_blank" rel="noopener noreferrer">
                  Связаться в Telegram
                </Button>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Кнопка назад под Paper */}
      <Button onClick={() => navigate(-1)} fullWidth sx={{ marginTop: 3 }}>
        ← Назад к каталогу
      </Button>

      {/* Кнопка удаления (только для админов) */}
      {me?.role === 'ADMIN' && (
        <Button color="error" onClick={() => setDeleteDialogOpen(true)} fullWidth sx={{ marginTop: 1 }}>
          Удалить растение
        </Button>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены что хотите удалить "{plant.variety}"?
            <br />
            Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDelete} color="error" disabled={deletePlant.isPending}>
            {deletePlant.isPending ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
