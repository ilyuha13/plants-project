import { Box, Button, Grid, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

import { PlantDetailCard } from '../../components/Cards/PlantDetailCard'
import { DeleteDialog } from '../../components/DeleteDialog'
import { PlantCard } from '../../components/plantCard/plantCard'
import { useDialog } from '../../hooks'
import { useMe } from '../../lib/ctx'
import { getInstanceDetailRoute, getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const PlantDetailPage = () => {
  const { plantId } = useParams<string>()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = trpc.getPlant.useQuery({ plantId: plantId! }, { enabled: !!plantId })
  const deletePlant = trpc.deletePlant.useMutation()
  const confirmDeleteDialog = useDialog()

  const me = useMe()

  // Эта функция ТОЛЬКО открывает диалог
  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  // Эта функция выполняет РЕАЛЬНОЕ удаление (вызывается из DeleteDialog)
  const handleConfirmDelete = async () => {
    try {
      await deletePlant.mutateAsync({ plantId: plantId! })
      confirmDeleteDialog.close() //попробовать убрать useDialog
      void navigate(getPlantsListRoute())
    } catch (error) {
      console.error('Failed to delete plant:', error)
    }
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

  const { name, description, imagesUrl } = data.plant

  const showDeleteButton = me?.role === 'ADMIN'

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: { xs: 2, sm: 3, md: 4 },
        minHeight: '80vh',
      }}
    >
      <PlantDetailCard
        name={name}
        description={description}
        imageUrls={imagesUrl}
        showDeleteButton={showDeleteButton}
        onDelete={handleDeleteClick}
        deleteButtonLoading={deletePlant.isPending}
      />

      <Button onClick={() => void navigate(-1)} fullWidth sx={{ marginTop: 3 }}>
        ← Назад к каталогу
      </Button>

      <Grid container spacing={2}>
        {data?.plant.plantInstances.map((instance) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }} key={instance.Id} sx={{ marginTop: 3 }}>
            <PlantCard
              type="instance"
              onClick={() => void navigate(getInstanceDetailRoute(instance.Id))}
              data={{ ...instance, plantName: name }}
            />
          </Grid>
        ))}
      </Grid>

      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить "${name}"? Это действие нельзя отменить.`}
      />
    </Box>
  )
}
