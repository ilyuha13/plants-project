import { Box, Button, Paper, Typography } from '@mui/material'

import { DetailLayout } from './shared/DetailLayout'

interface PlantInstanceDetailCardProps {
  imageUrls: string[]
  name: string
  inventoryNumber?: string
  description?: string | null
  price: string

  // Add button
  showAddButton: boolean
  addButtonText: string
  addButtonLoading?: boolean
  onAddToCart?: () => Promise<void>

  // Delete button
  showDeleteButton: boolean
  deleteButtonLoading?: boolean
  onDelete?: () => void
}

export const PlantInstanceDetailCard = ({
  imageUrls,
  name,
  inventoryNumber,
  description,
  price,
  showAddButton,
  addButtonText,
  addButtonLoading = false,
  onAddToCart,
  showDeleteButton,
  deleteButtonLoading = false,
  onDelete,
}: PlantInstanceDetailCardProps) => {
  return (
    <DetailLayout imageUrls={imageUrls} imageAlt={inventoryNumber ? `${name} - экземпляр #${inventoryNumber}` : name}>
      {inventoryNumber && (
        <Box>
          <Typography variant="caption" color="text.secondary">
            Инвентарный номер
          </Typography>
          <Typography variant="body2">#{inventoryNumber}</Typography>
        </Box>
      )}

      <Typography variant="h3">{name}</Typography>

      {description && (
        <Typography variant="body1" paragraph>
          {description}
        </Typography>
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
        <Typography variant="h5">{price} ₽</Typography>
        {showAddButton && onAddToCart && (
          <Button disabled={addButtonLoading} onClick={() => void onAddToCart()} sx={{ minWidth: 200 }}>
            {addButtonLoading ? 'Добавление...' : addButtonText}
          </Button>
        )}
      </Paper>

      {showDeleteButton && onDelete && (
        <Button color="error" onClick={() => void onDelete()} disabled={deleteButtonLoading} fullWidth>
          {deleteButtonLoading ? 'Удаление...' : 'Удалить экземпляр'}
        </Button>
      )}
    </DetailLayout>
  )
}
