import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Card, CardContent, CardMedia, Typography, CardActionArea, CardActions, IconButton } from '@mui/material'

interface Card {
  name: string
  description: string | null
  imageUrl: string
  onCardClick: () => void
  onDeleteClick: (() => void) | null
}

interface InstanceCard extends Card {
  type: 'instance'
  inventoryNumber: string | null
  price: string | null
  createdAt: Date | null
}

interface ReferenceCard extends Card {
  type: 'reference'
}

type PreviewCard = ReferenceCard | InstanceCard

export const PreviewCard = (props: PreviewCard) => {
  const { onCardClick, onDeleteClick, imageUrl, name, description } = props
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onCardClick}>
        <CardMedia component="img" image={imageUrl} alt={name} sx={{ width: '100%', objectFit: 'cover' }} />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {description}
            </Typography>
          )}
          {props.type === 'instance' && (
            <>
              {props.inventoryNumber && (
                <Typography variant="body2" fontWeight="medium" color="primary">
                  #{props.inventoryNumber}
                </Typography>
              )}
              {props.price && (
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                  {props.price} ₽
                </Typography>
              )}
              {props.createdAt && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Добавлено:{' '}
                  {props.createdAt.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        {onDeleteClick && (
          <IconButton color="error" onClick={() => onDeleteClick()}>
            <DeleteOutlineIcon color="error" />
          </IconButton>
        )}
      </CardActions>
    </Card>
  )
}
