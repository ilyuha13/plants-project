import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { env } from '../../lib/env'
import { RouterOutput } from '../../lib/trpc'

type TPlantCard = RouterOutput['getPlant']['plant'] & { onClick: () => void }

export const PlantCard = ({ onClick, ...plant }: TPlantCard) => {
  const imageUrl = `${env.VITE_BACKEND_URL}/${plant.imagesUrl[0].replace('public/', '')}`
  return (
    <Card sx={{ maxWidth: 345, margin: '0 auto', height: '100%' }}>
      <CardMedia component="img" height="300" image={imageUrl} alt="plant image" />
      <CardActions>
        <Button variant="text" onClick={onClick}>
          {plant.variety}
        </Button>
      </CardActions>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {plant.description}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {plant.genus}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {plant.price}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {plant.createdAt.toLocaleString('en-US', {
            month: '2-digit',
            year: 'numeric',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </CardContent>
    </Card>
  )
}
