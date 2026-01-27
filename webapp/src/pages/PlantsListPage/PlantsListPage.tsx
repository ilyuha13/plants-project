import { Grid, Stack, Typography } from '@mui/material'
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
    <Stack>
      <Typography variant="h2" gutterBottom>
        Каталог растений
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 2.5, xl: 3 }}>
        {data?.plants.map((plant) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4, xl: 2 }} key={plant.id}>
            <PlantCard
              type="plant"
              onClick={() => void navigate(getPlantDetailRoute({ plantId: plant.id }))}
              data={plant}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
