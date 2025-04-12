import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import { TplantProfileRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const PlantProfile = () => {
  const { plantId } = useParams() as TplantProfileRouteParams
  const { data, error, isError, isFetching, isLoading } = trpc.getPlant.useQuery({ plantId })

  if (isLoading || isFetching) {
    return <span>loading...</span>
  }

  if (isError) {
    return <span>error: {error.message}</span>
  }

  if (!data?.plant) {
    return <span>plant not found</span>
  }
  return (
    <div>
      <Container maxWidth="sm" sx={{ bgcolor: 'background.default' }}>
        <h1>{data.plant.genus}</h1>
        <h2>{data.plant.species}</h2>
        <p>{data.plant.description}</p>
      </Container>
    </div>
  )
}
