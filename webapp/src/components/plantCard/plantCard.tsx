import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
//import { format } from 'date-fns/format'
import { Link } from 'react-router-dom'
// import { BACKEND_URL } from '../../constants'
import { env } from '../../lib/env'
import * as routes from '../../lib/routes'
import { RouterOutput } from '../../lib/trpc'
import { Button } from '../Button/Button'

type TPlantCard = RouterOutput['getPlant']['plant']

export function PlantCard(plant: TPlantCard) {
  const isBase64 = (str: string) => {
    return str.startsWith('data:image/') && str.includes(';base64,')
  }
  let imageUrl: string
  if (isBase64(plant.imagesUrl[0])) {
    imageUrl = plant.imagesUrl[0]
  } else {
    imageUrl = `${env.VITE_BACKEND_URL}/${plant.imagesUrl[0].replace('public/', '')}`
  }
  return (
    <Card sx={{ maxWidth: 345, margin: '0 auto', height: '100%' }}>
      <CardActionArea>
        <CardMedia component="img" height="300" image={imageUrl} alt="plant image" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {plant.species.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {plant.species.description}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {plant.species.lifeForm}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {plant.species.variability}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {plant.description}
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
      </CardActionArea>
      <CardActions>
        <Link to={routes.getPlantProfileRoute({ plantId: plant.plantInstanceId })}>
          <Button type="button">go</Button>
        </Link>
      </CardActions>
    </Card>
  )
}
