import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { CardContent, IconButton, Typography } from '@mui/material'

import { PreviewCardLayout } from './shared/PrewiewCardLayuot'
import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'

interface InstancePreviewCardProps {
  data: {
    imagesUrl: string[]
    name: string
    description: string | null
    price: string
    inventoryNumber: string
    createdAt: Date
  }

  // Delete button
  showAdminOptions: boolean
  deleteButtonLoading?: boolean
  onDelete?: () => void
  onClick: () => void
}

export const InstancePreviewCard = ({
  data,
  onClick,
  onDelete,
  showAdminOptions,
  deleteButtonLoading,
}: InstancePreviewCardProps) => {
  const { imagesUrl, name, description } = data
  const { thumbnailUrl } = getCloudinaryUrl(imagesUrl[0])
  return (
    <PreviewCardLayout name={name} description={description} imageUrl={thumbnailUrl} onClick={onClick}>
      <CardContent sx={{ flexGrow: 1 }}>
        {showAdminOptions && (
          <Typography variant="body2" fontWeight="medium" color="primary">
            #{data.inventoryNumber}
          </Typography>
        )}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
          {data.price} ₽
        </Typography>
        {showAdminOptions && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Добавлено:{' '}
            {data.createdAt.toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </Typography>
        )}
      </CardContent>
      {showAdminOptions && onDelete && (
        <IconButton color="error" onClick={() => onDelete()} disabled={deleteButtonLoading}>
          <DeleteOutlineIcon color="error" />
        </IconButton>
      )}
    </PreviewCardLayout>
  )
}
