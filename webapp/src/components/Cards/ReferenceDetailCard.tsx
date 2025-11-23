import { Box, Button, Typography } from '@mui/material'

import { DetailLayout } from './shared/DetailLayout'

interface ReferenceDetailCardProps {
  name: string
  description?: string | null
  imagesUrl: string[]
  showDeleteButton?: boolean
  deleteButtonLoading?: boolean
  onDelete?: () => void
}

export const ReferenceDetailCard = ({
  name,
  description,
  imagesUrl,
  showDeleteButton = false,
  deleteButtonLoading = false,
  onDelete,
}: ReferenceDetailCardProps) => {
  return (
    <DetailLayout imagesUrl={imagesUrl} imageAlt={name}>
      <Typography variant="h3">{name}</Typography>
      {description && (
        <Typography variant="body1" paragraph>
          {description}
        </Typography>
      )}
      <Box flex="1" />
      {showDeleteButton && onDelete && (
        <Button color="error" onClick={() => onDelete()} disabled={deleteButtonLoading} fullWidth>
          {deleteButtonLoading ? 'Удаление...' : 'Удалить'}
        </Button>
      )}
    </DetailLayout>
  )
}
