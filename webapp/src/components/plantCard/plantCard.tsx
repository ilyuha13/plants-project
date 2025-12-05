import { Card, CardContent, CardMedia, Typography, CardActions } from '@mui/material'

import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'
import { useMe } from '../../lib/ctx'
import { Button } from '../Button/Button'

interface BaseCardProps {
  onClick?: () => void
}

type PlantCardProps = BaseCardProps & {
  type: 'plant'
  data: {
    plantId: string
    name: string
    description: string
    imagesUrl: string[]
  }
}

type PlantInstanceCardProps = BaseCardProps & {
  type: 'instance'
  data: {
    Id: string
    inventoryNumber: string
    plantName?: string
    price: string
    description?: string | null
    imagesUrl: string[]
    createdAt: Date
  }
}

type TPlantCardProps = PlantCardProps | PlantInstanceCardProps

export const PlantCard = (props: TPlantCardProps) => {
  const me = useMe()
  const { type, data, onClick } = props
  const imageUrl = getCloudinaryUrl(data.imagesUrl[0], 'thumbnail')

  if (type === 'plant') {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia component="img" image={imageUrl} alt={data.name} sx={{ width: '100%', objectFit: 'cover' }} />
        <CardActions>
          <Button type={'button'} variant="text" onClick={onClick}>
            <Typography variant="h6" gutterBottom>
              {data.name}
            </Typography>
          </Button>
        </CardActions>

        <CardContent sx={{ flexGrow: 1 }}>
          {data.description && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {data.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    )
  }

  if (type === 'instance') {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={`Экземпляр #${data.inventoryNumber}`}
          sx={{ width: '100%', objectFit: 'cover' }}
        />
        <CardActions>
          <Button type="button" variant="text" onClick={onClick}>
            <Typography variant="h5" color="text.secondary">
              {data.plantName}
            </Typography>
          </Button>
        </CardActions>

        <CardContent sx={{ flexGrow: 1 }}>
          {me?.role === 'ADMIN' && (
            <Typography variant="body2" fontWeight="medium" color="primary">
              #{data.inventoryNumber}
            </Typography>
          )}
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
            {data.price} ₽
          </Typography>
          {data.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
              {data.description}
            </Typography>
          )}
          {me?.role === 'ADMIN' && (
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
      </Card>
    )
  }

  return null
}
