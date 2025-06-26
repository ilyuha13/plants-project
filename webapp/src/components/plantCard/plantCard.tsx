import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
//import { format } from 'date-fns/format'
import { Link } from 'react-router-dom'
// import { BACKEND_URL } from '../../constants'
import { env } from '../../lib/env'
import * as routes from '../../lib/routes'
import { RouterOutput } from '../../lib/trpc'
//import s from './plantCard.module.scss'
import { Button } from '../Button/Button'

type TPlantCard = RouterOutput['getPlant']['plant']

export function PlantCard(plant: TPlantCard) {
  const isBase64 = (str: string) => {
    return str.startsWith('data:image/') && str.includes(';base64,')
  }
  let imageUrl: string
  if (isBase64(plant.imageUrl)) {
    imageUrl = plant.imageUrl
  } else {
    imageUrl = `${env.VITE_BACKEND_URL}/${plant.imageUrl.replace('public/', '')}`
  }
  return (
    <Card sx={{ maxWidth: 345, margin: '0 auto', height: '100%' }}>
      <CardActionArea>
        <CardMedia component="img" height="300" image={imageUrl} alt="plant image" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {plant.genus} {plant.species}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {plant.description}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {plant.createdAt.toLocaleString('en-US', {
              month: '2-digit',
              year: 'numeric',
              //month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Link to={routes.getPlantProfileRoute({ plantId: plant.plantId })}>
          <Button type="button">go</Button>
        </Link>
      </CardActions>
    </Card>
  )
}
