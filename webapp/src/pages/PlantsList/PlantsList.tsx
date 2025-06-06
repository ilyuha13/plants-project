import { PlantCard } from '../../components/plantCard/plantCard'
import { trpc } from '../../lib/trpc'
import s from './plantsList.module.scss'

export const PlantsList = () => {
  const { data, error, isError, isFetching, isLoading } = trpc.getPlants.useQuery()
  if (isLoading || isFetching) {
    return <span>loading...</span>
  }

  if (isError) {
    return <span>error: {error.message}</span>
  }

  return (
    <div>
      <div className={s.baner}>
        <h1 className={s.tytle}>plants</h1>
      </div>
      <div className={s.container}>
        {data?.plants.map((plant) => (
          <PlantCard
            key={plant.plantId}
            genus={plant.genus}
            species={plant.species}
            description={plant.description}
            plantId={plant.plantId}
            createdAt={plant.createdAt}
            categoryId={plant.categoryId}
            imageUrl={plant.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}
