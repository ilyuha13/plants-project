import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { Tplant } from '../../../../types'
import * as routes from '../../lib/routes'
import s from './plantCard.module.scss'

export function PlantCard(plant: Tplant) {
  return (
    <div className={s.card}>
      <h1 className={s.genus}>{plant.genus}</h1>
      <h1 className={s.spesies}>{plant.spesies}</h1>
      <h1 className={s.description}>{[plant.description]}</h1>
      <Link className={s.link} to={routes.getPlantProfileRoute({ plantId: plant.plantId })}>
        <Button className={s.button} variant="outlined" color="secondary">
          перейти
        </Button>
      </Link>
    </div>
  )
}
