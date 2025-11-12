import { Box, Button, Typography } from '@mui/material'

import { DetailLayout } from './shared/DetailLayout'

interface PlantDetailCardProps {
  imagesUrl: string[]
  name: string
  description: string

  // Delete button
  showDeleteButton: boolean
  deleteButtonLoading?: boolean
  onDelete?: () => void
}

export const PlantDetailCard = ({
  imagesUrl,
  name,
  description,
  showDeleteButton,
  deleteButtonLoading = false,
  onDelete,
}: PlantDetailCardProps) => {
  return (
    <DetailLayout imagesUrl={imagesUrl} imageAlt={name}>
      <Typography variant="h3">{name}</Typography>

      <Typography variant="body1" paragraph>
        {description}
      </Typography>

      <Box flex="1" />

      {showDeleteButton && onDelete && (
        <Button color="error" onClick={() => onDelete()} disabled={deleteButtonLoading} fullWidth>
          {deleteButtonLoading ? 'Удаление...' : 'Удалить растение'}
        </Button>
      )}
    </DetailLayout>
  )
}
