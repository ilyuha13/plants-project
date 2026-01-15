import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'

import { InstanceCard, ReferenceCard } from './interfaces'
import { Galery } from '../Galery/Galery'

interface InstanceDetailCard extends InstanceCard {
  addButtonText: string
}

type DetailCard = ReferenceCard | InstanceDetailCard

export const DetailCard = (props: DetailCard) => {
  const { onDeleteClick, onEditClick, imagesUrl, name, description, type } = props
  const onAddToCart = type === 'instance' ? props.onAddToCart : undefined
  const addButtonText = type === 'instance' ? props.addButtonText : undefined
  return (
    <Paper
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        minHeight: '70vh',
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Galery imageUrls={imagesUrl} alt={name} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ height: '100%' }}>
            {type === 'instance' && props.inventoryNumber && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Инвентарный номер
                </Typography>
                <Typography variant="body2">#{props.inventoryNumber}</Typography>
              </Box>
            )}
            <Typography variant="h3">{name}</Typography>
            {description && (
              <Typography variant="body1" paragraph>
                {description}
              </Typography>
            )}
            <Box flex="1" />
            {type === 'instance' && props.createdAt && (
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                Добавлено: {new Date(props.createdAt).toLocaleDateString()}
              </Typography>
            )}
            {type === 'instance' && props.price && (
              <Typography variant="h5" sx={{ mb: 2 }}>
                {props.price} ₽
              </Typography>
            )}

            {onAddToCart && (
              <Button onClick={() => void onAddToCart()} sx={{ minWidth: 200 }}>
                {addButtonText}
              </Button>
            )}
            {onDeleteClick && (
              <Button color="error" onClick={() => onDeleteClick()} fullWidth>
                Удалить
              </Button>
            )}
            {onEditClick && (
              <Button
                variant="contained"
                onClick={() => onEditClick()}
                fullWidth
                sx={{ mt: 2 }}
              >
                Редактировать
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}
