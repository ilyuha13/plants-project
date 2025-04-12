import { Link } from 'react-router-dom'
import { Tplant } from '../../../../types'
import * as routes from '../../lib/routes'
import s from './plantCard.module.scss'

export function PlantCard(plant: Tplant) {
  return (
    <Link className={s.link} to={routes.getPlantProfileRoute({ plantId: plant.plantId })}>
      <div className={s.card}>
        <h1 className={s.genus}>{plant.genus}</h1>
        <h1 className={s.spesies}>{plant.spesies}</h1>
        <h1 className={s.description}>{[plant.description]}</h1>
      </div>
    </Link>
  )
}
