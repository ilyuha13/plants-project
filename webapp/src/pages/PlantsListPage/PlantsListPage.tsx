import { Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { PlantCard } from '../../components/plantCard/plantCard'
import { getPlantDetailRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const PlantsListPage = () => {
  const navigate = useNavigate()
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
          <PlantCard type="plant" onClick={() => navigate(getPlantDetailRoute(plant.plantId))} data={plant} />
        </Grid>
      ))}
    </Grid>
  )
}
