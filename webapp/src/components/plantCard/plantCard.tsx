import { Button } from '@mui/material'
import { format } from 'date-fns/format'
import { Link } from 'react-router-dom'
// import { BACKEND_URL } from '../../constants'
import { env } from '../../lib/env'
import * as routes from '../../lib/routes'
import { RouterOutput } from '../../lib/trpc'
import s from './plantCard.module.scss'

type TPlantCard = RouterOutput['getPlant']['plant']

export function PlantCard(plant: TPlantCard) {
  return (
    <div className={s.card}>
      <h1 className={s.genus}>{plant.genus}</h1>
      <h1 className={s.spesies}>{plant.species}</h1>
      <h1 className={s.description}>{[plant.description]}</h1>
      <div className={s.createdAt}>CreatedAt: {format(plant.createdAt, 'yyy-MM-dd-HH-mm')}</div>
      <img src={`${env.VITE_BACKEND_URL}/${plant.imageUrl.replace('public/', '')}`} alt="img" />
      <Link className={s.link} to={routes.getPlantProfileRoute({ plantId: plant.plantId })}>
        <Button className={s.button} variant="outlined" color="secondary">
          перейти
        </Button>
      </Link>
    </div>
  )
}
