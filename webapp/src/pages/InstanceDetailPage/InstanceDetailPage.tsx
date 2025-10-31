import { Box, Button, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { DetailCard } from '../../components/DetailCard/DetailCard'
import { getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

type InstanceDetailParams = {
  instanceId: string
}

export const InstanceDetailPage = () => {
  const { instanceId } = useParams<InstanceDetailParams>()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = trpc.getPlantInstance.useQuery(
    { Id: instanceId! },
    { enabled: !!instanceId },
  )
  const deleteInstance = trpc.deletePlantInstance.useMutation()

  const handleDelete = async () => {
    await deleteInstance.mutateAsync({ Id: instanceId! })
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
          Ошибка: {error?.message || 'Не удалось загрузить экземпляр'}
        </Typography>
      </Box>
    )
  }

  if (!data?.instance) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Экземпляр не найден</Typography>
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
      <DetailCard type="instance" data={data.instance} onDelete={handleDelete} isDeleting={deleteInstance.isPending} />

      <Button onClick={() => navigate(-1)} fullWidth sx={{ marginTop: 3 }}>
        ← Назад к каталогу
      </Button>
    </Box>
  )
}
