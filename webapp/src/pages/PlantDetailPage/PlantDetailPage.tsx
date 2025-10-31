import { Box, Button, Grid, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { DetailCard } from '../../components/DetailCard/DetailCard'
import { PlantCard } from '../../components/plantCard/plantCard'
import { getInstanceDetailRoute, getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

type PlantDetailParams = {
  plantId: string
}

export const PlantDetailPage = () => {
  const { plantId } = useParams<PlantDetailParams>()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = trpc.getPlant.useQuery({ plantId: plantId! }, { enabled: !!plantId })
  const deletePlant = trpc.deletePlant.useMutation()

  const handleDelete = async () => {
    await deletePlant.mutateAsync({ plantId: plantId! })
    navigate(getPlantsListRoute())
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Загрузка...</Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5" color="error">
          Ошибка: {error?.message || 'Не удалось загрузить растение'}
        </Typography>
      </Box>
    )
  }

  if (!data?.plant) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Растение не найдено</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: { xs: 2, sm: 3, md: 4 },
        minHeight: '80vh',
      }}
    >
      <DetailCard type="plant" data={data.plant} onDelete={handleDelete} isDeleting={deletePlant.isPending} />

      <Button onClick={() => navigate(-1)} fullWidth sx={{ marginTop: 3 }}>
        ← Назад к каталогу
      </Button>
      <Grid container spacing={2}>
        {data?.plant.plantInstances.map((instance) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }} key={instance.Id} sx={{ marginTop: 3 }}>
            <PlantCard
              type="instance"
              onClick={() => navigate(getInstanceDetailRoute(instance.Id))}
              data={{ ...instance, plantName: data.plant.name }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
