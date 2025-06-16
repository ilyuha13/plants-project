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
  return (
    <Card sx={{ maxWidth: 345, margin: '0 auto', height: '100%' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="300"
          image={`${env.VITE_BACKEND_URL}/${plant.imageUrl.replace('public/', '')}`}
          alt="plant image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {plant.genus} {plant.species}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {plant.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Link to={routes.getPlantProfileRoute({ plantId: plant.plantId })}>
          <Button type="button">go</Button>
        </Link>
      </CardActions>
    </Card>
    // <div className={s.card}>
    //   <h1 className={s.genus}>{plant.genus}</h1>
    //   <h1 className={s.spesies}>{plant.species}</h1>
    //   <h1 className={s.description}>{[plant.description]}</h1>
    //   <div className={s.createdAt}>CreatedAt: {format(plant.createdAt, 'yyy-MM-dd-HH-mm')}</div>
    //   <img src={`${env.VITE_BACKEND_URL}/${plant.imageUrl.replace('public/', '')}`} alt="img" />
    //   <Link className={s.link} to={routes.getPlantProfileRoute({ plantId: plant.plantId })}>
    //     <Button className={s.button} variant="outlined" color="secondary">
    //       перейти
    //     </Button>
    //   </Link>
    // </div>
  )
}
