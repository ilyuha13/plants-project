import { Box, Button, Grid, ImageList, ImageListItem, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { env } from '../../lib/env'
import { trpc } from '../../lib/trpc'

type PlantDetailParams = {
  plantId: string
}

export const PlantDetailPage = () => {
  const { plantId } = useParams<PlantDetailParams>()
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Fetch plant data
  const { data, isLoading, isError, error } = trpc.getPlant.useQuery({ plantId: plantId! }, { enabled: !!plantId })

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
            <Stack>
              {/* Главное изображение */}
              {imageUrls.length > 0 && (
                <Box
                  component="img"
                  src={imageUrls[selectedImageIndex]}
                  alt={`${plant.variety} - фото ${selectedImageIndex + 1}`}
                  sx={{
                    width: '100%',
                    height: { xs: '300px', sm: '400px', md: '500px' },
                    borderRadius: 1, // 1 * 8px = 8px (соответствует theme.shape.borderRadius)
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onClick={() => {
                    // TODO: Открывать в полноэкранном режиме
                  }}
                />
              )}

              {/* Миниатюры */}
              {imageUrls.length > 1 && (
                <ImageList
                  cols={4}
                  gap={8}
                  sx={{
                    margin: 0,
                    overflow: 'hidden',
                  }}
                >
                  {imageUrls.map((url, index) => (
                    <ImageListItem
                      key={url}
                      sx={{
                        cursor: 'pointer',
                        opacity: selectedImageIndex === index ? 1 : 0.6,
                        border: selectedImageIndex === index ? 2 : 0,
                        borderColor: 'primary.main',
                        borderRadius: 1,
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        '&:hover': {
                          opacity: 1,
                          transform: 'scale(1.05)',
                        },
                      }}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={url}
                        alt={`${plant.variety} - миниатюра ${index + 1}`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Stack>
          </Grid>

          {/* RIGHT COLUMN - Контент */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Сорт */}
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {plant.variety}
                </Typography>
              </Box>

              {/* Вид */}
              <Box>
                <Typography variant="h5" color="text.secondary">
                  {plant.genus}
                </Typography>
              </Box>

              {/* Описание */}
              <Box>
                <Typography variant="body1" paragraph>
                  {plant.description}
                </Typography>
              </Box>

              {/* Цена - стилизованная */}
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  padding: 3,
                  textAlign: 'center',
                  marginTop: 'auto',
                  // borderRadius наследуется из theme.shape.borderRadius автоматически
                }}
              >
                <Typography variant="h3" component="div" fontWeight="bold">
                  {plant.price} ₽
                </Typography>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Кнопки под Paper */}
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ marginTop: 3 }}>
        <Button onClick={() => navigate(-1)} sx={{ flex: { xs: 1, sm: 1 } }}>
          ← Назад к каталогу
        </Button>

        <Button
          component="a"
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ flex: { xs: 1, sm: 1 } }}
        >
          Связаться в Telegram
        </Button>
      </Stack>
    </Box>
  )
}
