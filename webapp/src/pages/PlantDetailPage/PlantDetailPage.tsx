import { Box, Button, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { InstancePreviewCard } from '../../components/Cards/InstancePreviewCard'
import { PlantDetailCard } from '../../components/Cards/PlantDetailCard'
import { DeleteDialog } from '../../components/DeleteDialog'
import { useDialog } from '../../hooks'
import { useMe } from '../../lib/ctx'
import { getCatalogPageRoute, getInstanceDetailRoute, PlantDetailRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const PlantDetailPage = () => {
  const { plantId } = useParams() as PlantDetailRouteParams
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = trpc.getPlant.useQuery({ plantId: plantId }, { enabled: !!plantId })
  const deletePlant = trpc.deletePlant.useMutation()
  const deleteInstance = trpc.deletePlantInstance.useMutation()
  const trpcUtils = trpc.useUtils()
  const [currentDeleteData, setCurrentDeleteData] = useState<{
    type: 'instance' | 'plant'
    id: string
    inventoryNumber: string
  }>({ type: 'plant', id: plantId, inventoryNumber: '' })
  const confirmDeleteDialog = useDialog()

  const me = useMe()
  const isAdmin = me?.role === 'ADMIN'

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

  const onDeleteInstanceClick = (id: string, inventoryNumber: string) => {
    setCurrentDeleteData({ type: 'instance', id, inventoryNumber })
    handleDeleteClick()
  }

  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    try {
      switch (currentDeleteData.type) {
        case 'plant':
          await deletePlant.mutateAsync({ plantId })
          confirmDeleteDialog.close()
          void navigate(getCatalogPageRoute())
          break
        case 'instance':
          await deleteInstance.mutateAsync({ Id: currentDeleteData.id })
          await trpcUtils.getPlant.invalidate()
          confirmDeleteDialog.close()
          setCurrentDeleteData({ type: 'plant', id: plantId, inventoryNumber: '' })
      }
    } catch (error) {
      console.error('Failed to delete plant:', error)
    }
  }

  const { name, description, imagesUrl } = data.plant

  const getDeleteMassage = (): string => {
    switch (currentDeleteData.type) {
      case 'plant':
        return `все растения вида/сорта: ${name}`
      case 'instance':
        return `экземпляр вида/сорта ${name}: №: ${currentDeleteData.inventoryNumber}`
    }
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
      <PlantDetailCard
        name={name}
        description={description}
        imagesUrl={imagesUrl}
        showDeleteButton={isAdmin}
        onDelete={handleDeleteClick}
        deleteButtonLoading={deletePlant.isPending}
      />

      <Button onClick={() => void navigate(-1)} fullWidth sx={{ marginTop: 3 }}>
        ← Назад к каталогу
      </Button>

      <Grid container spacing={{ xs: 2, sm: 2.5, xl: 3 }}>
        {data?.plant.plantInstances.map((instance) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4, xl: 2 }} key={instance.Id} sx={{ marginTop: 3 }}>
            <InstancePreviewCard
              showAdminOptions={isAdmin}
              onDelete={() => onDeleteInstanceClick(instance.Id, instance.inventoryNumber)}
              onClick={() => void navigate(getInstanceDetailRoute({ instanceId: instance.Id }))}
              data={{ ...instance, name }}
            />
          </Grid>
        ))}
      </Grid>

      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить "${getDeleteMassage()}"? Это действие нельзя отменить.`}
      />
    </Box>
  )
}
