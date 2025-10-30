import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material'
import { useMe } from '../../lib/ctx'
import { env } from '../../lib/env'

type BaseCardProps = {
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

  const imageUrl = data.imagesUrl[0]
    ? `${env.VITE_BACKEND_URL}/${data.imagesUrl[0].replace('public/', '')}`
    : '/placeholder.jpg'

  if (type === 'plant') {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardActionArea onClick={onClick}>
          <CardMedia component="img" height="300" image={imageUrl} alt={data.name} sx={{ objectFit: 'cover' }} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {data.name}
            </Typography>
            {data.description && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {data.description}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }

  if (type === 'instance') {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardActionArea onClick={onClick}>
          <CardMedia
            component="img"
            height="250"
            image={imageUrl}
            alt={`Экземпляр #${data.inventoryNumber}`}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            {data.plantName && (
              <Typography variant="caption" color="text.secondary">
                {data.plantName}
              </Typography>
            )}
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
        </CardActionArea>
      </Card>
    )
  }

  return null
}
