import { Grid } from '@mui/material'
import { PlantCard } from '../../components/plantCard/plantCard'
import { trpc } from '../../lib/trpc'

export const PlantsListPage = () => {
  const { data, error, isError, isFetching, isLoading } = trpc.getPlants.useQuery()
  if (isLoading || isFetching) {
    return <span>loading...</span>
  }

  if (isError) {
    return <span>error: {error.message}</span>
  }

  return (
    <Grid container spacing={2}>
      {data?.plants.map((plant) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }} key={plant.plantId}>
          <PlantCard
            onClick={() => {}}
            plantId={plant.plantId}
            variety={plant.variety}
            genus={plant.genus}
            description={plant.description}
            price={plant.price}
            imagesUrl={plant.imagesUrl}
            createdAt={plant.createdAt}
          />
        </Grid>
      ))}
    </Grid>
  )
}
