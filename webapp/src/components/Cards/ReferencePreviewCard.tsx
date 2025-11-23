import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { IconButton } from '@mui/material'

import { PreviewCardLayout } from './shared/PrewiewCardLayuot'
import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'

interface ReferencePreviewCardProps {
  data: { imagesUrl: string[]; name: string; description: string | null }

  // Delete button
  showDeleteButton: boolean
  deleteButtonLoading?: boolean
  onDelete?: () => void
  onClick: () => void
}

export const ReferencePreviewCard = ({
  data,
  onClick,
  onDelete,
  showDeleteButton,
  deleteButtonLoading,
}: ReferencePreviewCardProps) => {
  const { imagesUrl, name, description } = data
  const { thumbnailUrl } = getCloudinaryUrl(imagesUrl[0])
  return (
    <PreviewCardLayout name={name} description={description} imageUrl={thumbnailUrl} onClick={onClick}>
      {showDeleteButton && onDelete && (
        <IconButton color="error" onClick={() => onDelete()} disabled={deleteButtonLoading}>
          <DeleteOutlineIcon color="error" />
        </IconButton>
      )}
    </PreviewCardLayout>
  )
}
