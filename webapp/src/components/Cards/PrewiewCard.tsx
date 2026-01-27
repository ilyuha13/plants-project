import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import CreateIcon from '@mui/icons-material/Create'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  CardActions,
  IconButton,
} from '@mui/material'

import { InstanceCard, ReferenceCard } from './interfaces'

interface ReferencePreviewCard extends ReferenceCard {
  onCardClick: () => void
}

interface InstancePreviewCard extends InstanceCard {
  onCardClick: () => void
}

type PreviewCard = ReferencePreviewCard | InstancePreviewCard

export const PreviewCard = (props: PreviewCard) => {
  const { onCardClick, onDeleteClick, onEditClick, imagesUrl, name, description, type } =
    props

  const onAddToCart = type === 'instance' ? props.onAddToCart : undefined
  const quantity = type === 'reference' ? props.quantity : undefined
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onCardClick}>
        <CardMedia
          component="img"
          image={imagesUrl[0]}
          alt={name}
          sx={{ width: '100%', objectFit: 'cover' }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {name + (quantity ? ` (${quantity})` : '')}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {description}
            </Typography>
          )}
          {type === 'instance' && (
            <>
              {props.status && (
                <Typography variant="body2" fontWeight="medium" color="primary">
                  #{props.status}
                </Typography>
              )}
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
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
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
        {onEditClick && (
          <IconButton color="primary" onClick={() => onEditClick()}>
            <CreateIcon color="primary" />
          </IconButton>
        )}
        {type === 'instance' && onAddToCart && (
          <IconButton color="primary" onClick={() => void onAddToCart()}>
            <AddShoppingCartIcon color="primary" />
          </IconButton>
        )}
      </CardActions>
    </Card>
  )
}
